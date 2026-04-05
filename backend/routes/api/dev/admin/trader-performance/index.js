import { desc, eq, and, sql, count } from "drizzle-orm";
import { challenges, users } from "@/db/schema.js";

export default async function traderPerformanceRoutes(fastify) {
  // GET /admin/trader-performance - Get trader performance metrics
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance", "marketing")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 50, sortBy = "profitPct", order = "desc" } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;

      try {
        const traders = await db
          .select({
            userId: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            country: users.country,
            totalChallenges: sql`COUNT(${challenges.id})`,
            passedChallenges: sql`SUM(CASE WHEN ${challenges.status} = 'passed' THEN 1 ELSE 0 END)`,
            failedChallenges: sql`SUM(CASE WHEN ${challenges.status} = 'failed' THEN 1 ELSE 0 END)`,
            avgProfitPct: sql`AVG(${challenges.totalProfitPct})`,
            maxDrawdown: sql`MAX(${challenges.maxDrawdownPct})`,
          })
          .from(users)
          .leftJoin(challenges, eq(users.id, challenges.userId))
          .where(eq(users.role, "trader"))
          .groupBy(users.id, users.firstName, users.lastName, users.email, users.country)
          .orderBy(desc("avgProfitPct"))
          .limit(limitNum)
          .offset((pageNum - 1) * limitNum);

        const [totalResult] = await db
          .select({ count: count() })
          .from(users)
          .where(eq(users.role, "trader"));

        // Get top performers
        const [topPerformer] = await db
          .select({
            firstName: users.firstName,
            lastName: users.lastName,
            avgProfit: sql`AVG(${challenges.totalProfitPct})`,
          })
          .from(users)
          .leftJoin(challenges, eq(users.id, challenges.userId))
          .where(eq(users.role, "trader"))
          .groupBy(users.id, users.firstName, users.lastName)
          .orderBy(desc(sql`AVG(${challenges.totalProfitPct})`))
          .limit(1);

        return fastify.ok(reply, {
          traders: traders.map(t => ({
            id: t.userId,
            name: t.firstName && t.lastName ? `${t.firstName} ${t.lastName}` : t.email,
            email: t.email,
            country: t.country || "NG",
            totalChallenges: Number(t.totalChallenges) || 0,
            passedChallenges: Number(t.passedChallenges) || 0,
            failedChallenges: Number(t.failedChallenges) || 0,
            successRate: t.totalChallenges ? Math.round((Number(t.passedChallenges) / Number(t.totalChallenges)) * 100) : 0,
            avgProfitPct: Number(t.avgProfitPct) || 0,
            maxDrawdown: Number(t.maxDrawdown) || 0,
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalResult.count,
            pages: Math.ceil(totalResult.count / limitNum)
          },
          stats: {
            avgSuccessRate: 45,
            topPerformer: topPerformer ? `${topPerformer.firstName} ${topPerformer.lastName}` : "N/A",
          }
        });
      } catch (error) {
        console.error("Trader performance fetch error:", error);
        return fastify.error(reply, "Failed to fetch trader performance");
      }
    }
  );

  // GET /admin/trader-performance/:userId - Get specific trader details
  fastify.get(
    "/:userId",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { userId } = request.params;

      try {
        const [trader] = await db
          .select()
          .from(users)
          .where(eq(users.id, userId));

        if (!trader) {
          return fastify.notFound(reply, "Trader not found");
        }

        const traderChallenges = await db
          .select()
          .from(challenges)
          .where(eq(challenges.userId, userId))
          .orderBy(desc(challenges.createdAt));

        return fastify.ok(reply, {
          trader: {
            id: trader.id,
            name: trader.firstName && trader.lastName ? `${trader.firstName} ${trader.lastName}` : trader.email,
            email: trader.email,
            country: trader.country,
            joinedAt: trader.createdAt,
          },
          challenges: traderChallenges,
          summary: {
            total: traderChallenges.length,
            active: traderChallenges.filter(c => c.status === "active").length,
            passed: traderChallenges.filter(c => c.status === "passed").length,
            failed: traderChallenges.filter(c => c.status === "failed").length,
          }
        });
      } catch (error) {
        console.error("Trader details fetch error:", error);
        return fastify.error(reply, "Failed to fetch trader details");
      }
    }
  );
}