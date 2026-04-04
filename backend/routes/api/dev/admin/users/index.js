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
  // GET /api/admin/users - Only show traders
  fastify.get(
    "/",
    {
      preHandler: [fastify.requireRole("super_admin", "compliance", "support")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 20, search = "", status = "" } = request.query;

      // Build conditions - always filter by role = trader
      let conditions = [eq(users.role, "trader")];

      // Add status filter if provided
      if (status) {
        conditions.push(eq(users.status, status));
      }

      const list = await db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          phone: users.phone,
          role: users.role,
          status: users.status,
          kycStatus: users.kycStatus,
          country: users.country,
          createdAt: users.createdAt,
          totalChallenges: sql`CAST(COUNT(DISTINCT ${challenges.id}) AS INTEGER)`,
          passedChallenges: sql`CAST(COUNT(DISTINCT CASE WHEN ${challenges.status} = 'passed' THEN ${challenges.id} END) AS INTEGER)`,
          failedChallenges: sql`CAST(COUNT(DISTINCT CASE WHEN ${challenges.status} = 'failed' THEN ${challenges.id} END) AS INTEGER)`,
          totalSpent: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'challenge_purchase' AND ${transactions.status} = 'completed' THEN ${transactions.amount} ELSE 0 END), 0)`,
          totalEarned: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'payout' AND ${transactions.status} = 'completed' THEN ${transactions.amount} ELSE 0 END), 0)`,
          currentBalance: sql`COALESCE((SELECT ${challenges.currentBalance} FROM ${challenges} WHERE ${challenges.userId} = ${users.id} AND ${challenges.status} = 'active' ORDER BY ${challenges.createdAt} DESC LIMIT 1), '0')`,
          accountType: sql`COALESCE((SELECT ${challenges.accountType} FROM ${challenges} WHERE ${challenges.userId} = ${users.id} AND ${challenges.status} = 'active' ORDER BY ${challenges.createdAt} DESC LIMIT 1), 'N/A')`,
        })
        .from(users)
        .leftJoin(challenges, eq(challenges.userId, users.id))
        .leftJoin(transactions, eq(transactions.userId, users.id))
        .where(and(...conditions))
        .groupBy(users.id)
        .orderBy(desc(users.createdAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      return fastify.ok(reply, {
        users: list,
        page: Number(page),
        limit: Number(limit),
      });
    },
  );

  // POST /api/admin/users/:id/ban
  fastify.post(
    "/:id/ban",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      await db.update(users).set({ status: "banned", updatedAt: new Date() }).where(eq(users.id, id));
      return fastify.ok(reply, { message: "User banned." });
    },
  );

  // POST /api/admin/users/:id/unban
  fastify.post(
    "/:id/unban",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      await db.update(users).set({ status: "active", updatedAt: new Date() }).where(eq(users.id, id));
      return fastify.ok(reply, { message: "User unbanned." });
    },
  );

  // POST /api/admin/users/:id/flag
  fastify.post(
    "/:id/flag",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      await db.update(users).set({ status: "flagged", updatedAt: new Date() }).where(eq(users.id, id));
      return fastify.ok(reply, { message: "User flagged." });
    },
  );

  // POST /api/admin/users/:id/unflag
  fastify.post(
    "/:id/unflag",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      await db.update(users).set({ status: "active", updatedAt: new Date() }).where(eq(users.id, id));
      return fastify.ok(reply, { message: "User unflagged." });
    },
  );
}
