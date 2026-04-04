import { desc, eq, and, sql, count } from "drizzle-orm";
import {
  users,
  challenges,
  transactions,
  payouts,
  activityLogs,
  teamMembers,
} from "@/db/schema.js";

export default async function adminRoutes(fastify) {
  // GET /api/admin/dashboard/stats
  fastify.get(
    "/stats",
    {
      preHandler: [
        fastify.requireRole("super_admin", "compliance", "marketing"),
      ],
    },
    async (request, reply) => {
      const db = fastify.db;

      const [totalUsers] = await db
        .select({ count: count() })
        .from(users)
        .where(eq(users.role, "trader"));
      const [activeChalls] = await db
        .select({ count: count() })
        .from(challenges)
        .where(eq(challenges.status, "active"));
      const [passedChalls] = await db
        .select({ count: count() })
        .from(challenges)
        .where(eq(challenges.status, "passed"));
      const [failedChalls] = await db
        .select({ count: count() })
        .from(challenges)
        .where(eq(challenges.status, "failed"));
      const [pendingPayoutsResult] = await db
        .select({ count: count() })
        .from(payouts)
        .where(eq(payouts.status, "pending"));
      const [revenue] = await db
        .select({ total: sql`COALESCE(SUM(${transactions.amount}), 0)` })
        .from(transactions)
        .where(eq(transactions.status, "completed"));

      return fastify.ok(reply, {
        totalUsers: totalUsers.count,
        activeChallenges: activeChalls.count,
        passedChallenges: passedChalls.count,
        failedChallenges: failedChalls.count,
        pendingPayouts: pendingPayoutsResult.count,
        totalRevenue: revenue.total,
      });
    },
  );
}
