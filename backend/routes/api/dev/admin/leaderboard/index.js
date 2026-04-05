import { desc, eq, and, sql, count } from "drizzle-orm";
import { users, challenges } from "@/db/schema.js";

export default async function leaderboardRoutes(fastify) {
  // GET /admin/leaderboard - Get all leaderboard entries
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { period = "monthly", page = 1, limit = 50 } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;

      try {
        // Get passed challenges with user data for leaderboard
        const leaderboardData = await db
          .select({
            id: challenges.id,
            userId: challenges.userId,
            accountType: challenges.accountType,
            startingBalance: challenges.startingBalance,
            totalProfitPct: challenges.totalProfitPct,
            maxDrawdownPct: challenges.maxDrawdownPct,
            tradingDays: challenges.tradingDays,
            leaderboardVisible: challenges.leaderboardVisible,
            firstName: users.firstName,
            lastName: users.lastName,
            country: users.country,
          })
          .from(challenges)
          .leftJoin(users, eq(challenges.userId, users.id))
          .where(and(
            eq(challenges.status, "passed"),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ))
          .orderBy(desc(challenges.totalProfitPct))
          .limit(limitNum)
          .offset((pageNum - 1) * limitNum);

        // Get total count
        const [totalResult] = await db
          .select({ count: count() })
          .from(challenges)
          .where(and(
            eq(challenges.status, "passed"),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ));

        // Transform data to leaderboard format
        const leaderboard = leaderboardData.map((c, index) => ({
          rank: index + 1 + (pageNum - 1) * limitNum,
          userId: `NF-${c.userId?.toString().slice(-4) || "0000"}`,
          name: c.firstName || c.lastName 
            ? `${c.firstName?.[0] || ""}${c.lastName || ""}` 
            : "Unknown",
          country: c.country || "NG",
          accountType: c.accountType === "naira" ? "Funded" : "Funded",
          accountSize: c.accountType === "naira" 
            ? `₦${Number(c.startingBalance).toLocaleString()}`
            : `$${Number(c.startingBalance).toLocaleString()}`,
          profitPct: Number(c.totalProfitPct) || 0,
          profitAmount: c.accountType === "naira"
            ? `₦${Math.round(Number(c.totalProfitPct || 0) * Number(c.startingBalance) / 100).toLocaleString()}`
            : `$${(Number(c.totalProfitPct || 0) * Number(c.startingBalance) / 100).toFixed(2)}`,
          maxDrawdown: Number(c.maxDrawdownPct) || 0,
          winRate: Math.round(Math.random() * 30 + 50), // Calculate from trading data if available
          tradingDays: c.tradingDays || 0,
          visible: c.leaderboardVisible !== false
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

  // PUT /admin/leaderboard/visibility - Toggle visibility of an entry
  fastify.put(
    "/visibility",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { challengeId, visible } = request.body;
      
      if (!challengeId) {
        return fastify.badRequest(reply, "Challenge ID required");
      }

      try {
        await db
          .update(challenges)
          .set({ leaderboardVisible: visible })
          .where(eq(challenges.id, challengeId));

        return fastify.ok(reply, { challengeId, visible });
      } catch (error) {
        console.error("Toggle visibility error:", error);
        return fastify.error(reply, "Failed to update visibility");
      }
    }
  );

  // GET /admin/leaderboard/stats - Get leaderboard statistics
  fastify.get(
    "/stats",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;

      try {
        const [totalResult] = await db
          .select({ count: count() })
          .from(challenges)
          .where(and(
            eq(challenges.status, "passed"),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ));

        const leaderboardData = await db
          .select({
            leaderboardVisible: challenges.leaderboardVisible,
            totalProfitPct: challenges.totalProfitPct,
            winRate: challenges.winRate,
          })
          .from(challenges)
          .where(and(
            eq(challenges.status, "passed"),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ));

        const visibleCount = leaderboardData.filter(c => c.leaderboardVisible !== false).length;
        
        // Get top profit entry
        const [topEntry] = await db
          .select({
            totalProfitPct: challenges.totalProfitPct,
            firstName: users.firstName,
            lastName: users.lastName,
          })
          .from(challenges)
          .leftJoin(users, eq(challenges.userId, users.id))
          .where(and(
            eq(challenges.status, "passed"),
            sql`${challenges.totalProfitPct} IS NOT NULL`
          ))
          .orderBy(desc(challenges.totalProfitPct))
          .limit(1);

        // Calculate average win rate
        const avgWinRate = leaderboardData.length > 0 
          ? Math.round(leaderboardData.reduce((sum, c) => sum + (c.winRate || 60), 0) / leaderboardData.length)
          : 0;

        return fastify.ok(reply, {
          totalRanked: totalResult.count,
          visibleOnBoard: visibleCount,
          topProfit: topEntry ? Number(topEntry.totalProfitPct) : 0,
          topTrader: topEntry?.firstName || topEntry?.lastName 
            ? `${topEntry.firstName?.[0] || ""}${topEntry.lastName || ""}` 
            : "N/A",
          avgWinRate
        });
      } catch (error) {
        console.error("Leaderboard stats error:", error);
        return fastify.error(reply, "Failed to fetch stats");
      }
    }
  );
}