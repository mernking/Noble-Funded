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
  // GET /api/admin/revenue
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const revenueSummary = await db
        .select({
          currency: transactions.currency,
          total: sql`COALESCE(SUM(${transactions.amount}), 0)`,
          count: count(),
        })
        .from(transactions)
        .where(eq(transactions.status, "completed"))
        .groupBy(transactions.currency);

      const pendingPayoutsSum = await db
        .select({ total: sql`COALESCE(SUM(${payouts.amount}), 0)` })
        .from(payouts)
        .where(eq(payouts.status, "pending"));

      return fastify.ok(reply, {
        revenue: revenueSummary,
        pendingPayouts: pendingPayoutsSum[0]?.total || 0,
      });
    },
  );
}
