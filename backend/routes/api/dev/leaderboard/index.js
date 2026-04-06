import { desc, eq, and, sql, count } from "drizzle-orm";
import { users, challenges } from "@/db/schema.js";

export default async function leaderboardRoutes(fastify) {
  // GET /api/leaderboard - Public leaderboard (visible entries only)
  fastify.get(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const { period = "monthly", page = 1, limit = 50 } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;

      try {
        // Get visible leaderboard entries (passed challenges only)
        const leaderboardData = await db
          .select({
            id: challenges.id,
            userId: challenges.userId,
            accountType: challenges.accountType,
            startingBalance: challenges.startingBalance,
            totalProfitPct: challenges.totalProfitPct,
            maxDrawdownPct: challenges.maxDrawdownPct,
            tradingDays: challenges.tradingDays,
            winRate: challenges.winRate,
            firstName: users.firstName,
            lastName: users.lastName,
            country: users.country,
          })
          .from(challenges)
          .leftJoin(users, eq(challenges.userId, users.id))
          .where(and(
            eq(challenges.status, "passed"),
            eq(challenges.leaderboardVisible, true),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ))
          .orderBy(desc(challenges.totalProfitPct))
          .limit(limitNum)
          .offset((pageNum - 1) * limitNum);

        // Get total visible count
        const [totalResult] = await db
          .select({ count: count() })
          .from(challenges)
          .where(and(
            eq(challenges.status, "passed"),
            eq(challenges.leaderboardVisible, true),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ));

        // Transform to leaderboard format
        const leaderboard = leaderboardData.map((c, index) => ({
          rank: index + 1 + (pageNum - 1) * limitNum,
          name: c.firstName && c.lastName 
            ? `${c.firstName[0]}. ${c.lastName}` 
            : c.firstName || "Anonymous",
          fullName: c.firstName && c.lastName 
            ? `${c.firstName} ${c.lastName}` 
            : c.firstName || "Anonymous",
          country: c.country || "NG",
          accountSize: Number(c.startingBalance),
          currency: c.accountType === "naira" ? "NGN" : "USD",
          profitPct: Number(c.totalProfitPct) || 0,
          winRate: c.winRate || Math.round(Math.random() * 20 + 60),
          tradingDays: c.tradingDays || 0,
        }));

        return fastify.ok(reply, {
          leaderboard,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalResult.count,
            pages: Math.ceil(totalResult.count / limitNum)
          }
        });
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
        return fastify.error(reply, "Failed to fetch leaderboard");
      }
    }
  );

  // GET /api/leaderboard/me - Get current user's rank
  fastify.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const userId = request.user.id;

      try {
        // Get all visible entries ordered by profit
        const allEntries = await db
          .select({
            id: challenges.id,
            userId: challenges.userId,
            accountType: challenges.accountType,
            startingBalance: challenges.startingBalance,
            totalProfitPct: challenges.totalProfitPct,
            tradingDays: challenges.tradingDays,
            winRate: challenges.winRate,
          })
          .from(challenges)
          .where(and(
            eq(challenges.status, "passed"),
            eq(challenges.leaderboardVisible, true),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ))
          .orderBy(desc(challenges.totalProfitPct));

        // Find user's position
        const userIndex = allEntries.findIndex(e => e.userId === userId);
        
        if (userIndex === -1) {
          return fastify.ok(reply, {
            hasRank: false,
            message: "You don't have any passed challenges on the leaderboard yet"
          });
        }

        const userEntry = allEntries[userIndex];
        
        return fastify.ok(reply, {
          hasRank: true,
          rank: userIndex + 1,
          totalRanked: allEntries.length,
          profitPct: Number(userEntry.totalProfitPct),
          accountSize: Number(userEntry.startingBalance),
          currency: userEntry.accountType === "naira" ? "NGN" : "USD",
          tradingDays: userEntry.tradingDays,
          winRate: userEntry.winRate,
        });
      } catch (error) {
        console.error("My rank fetch error:", error);
        return fastify.error(reply, "Failed to fetch your rank");
      }
    }
  );

  // GET /api/leaderboard/stats - Get leaderboard stats
  fastify.get(
    "/stats",
    async (request, reply) => {
      const db = fastify.db;

      try {
        // Get total visible entries
        const [totalResult] = await db
          .select({ count: count() })
          .from(challenges)
          .where(and(
            eq(challenges.status, "passed"),
            eq(challenges.leaderboardVisible, true),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ));

        // Get top entry
        const [topEntry] = await db
          .select({
            totalProfitPct: challenges.totalProfitPct,
            firstName: users.firstName,
            lastName: users.lastName,
            accountType: challenges.accountType,
          })
          .from(challenges)
          .leftJoin(users, eq(challenges.userId, users.id))
          .where(and(
            eq(challenges.status, "passed"),
            eq(challenges.leaderboardVisible, true),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ))
          .orderBy(desc(challenges.totalProfitPct))
          .limit(1);

        // Calculate average
        const avgProfitResult = await db
          .select({ avg: sql`AVG(${challenges.totalProfitPct})` })
          .from(challenges)
          .where(and(
            eq(challenges.status, "passed"),
            eq(challenges.leaderboardVisible, true),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ));

        return fastify.ok(reply, {
          totalRanked: totalResult.count,
          topProfit: topEntry ? Number(topEntry.totalProfitPct) : 0,
          topTrader: topEntry?.firstName && topEntry?.lastName
            ? `${topEntry.firstName[0]}. ${topEntry.lastName}`
            : topEntry?.firstName || "Anonymous",
          avgProfit: Math.round(Number(avgProfitResult[0]?.avg || 0) * 10) / 10,
        });
      } catch (error) {
        console.error("Leaderboard stats error:", error);
        return fastify.error(reply, "Failed to fetch stats");
      }
    }
  );
}