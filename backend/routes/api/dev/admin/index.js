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
    "/dashboard/stats",
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

  // GET /api/admin/users
  fastify.get(
    "/users",
    {
      preHandler: [fastify.requireRole("super_admin", "compliance", "support")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 20 } = request.query;
      const list = await db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          role: users.role,
          status: users.status,
          kycStatus: users.kycStatus,
          createdAt: users.createdAt,
        })
        .from(users)
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

  // GET /api/admin/challenges
  fastify.get(
    "/challenges",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { status, page = 1, limit = 20 } = request.query;
      const conditions = status ? [eq(challenges.status, status)] : undefined;

      const list = await db
        .select()
        .from(challenges)
        .where(conditions ? and(...conditions) : undefined)
        .orderBy(desc(challenges.createdAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      return fastify.ok(reply, {
        challenges: list,
        page: Number(page),
        limit: Number(limit),
      });
    },
  );

  // GET /api/admin/revenue
  fastify.get(
    "/revenue",
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

  // GET /api/admin/activity-log
  fastify.get(
    "/activity-log",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 50 } = request.query;
      const logs = await db
        .select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.createdAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      return fastify.ok(reply, logs);
    },
  );

  // POST /api/admin/team/add
  fastify.post(
    "/team/add",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const { userId, role, permissions } = request.body || {};
      if (!userId || !role) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "User ID and role are required.",
        );
      }

      const db = fastify.db;
      const [member] = await db
        .insert(teamMembers)
        .values({
          userId,
          role,
          permissions: permissions || {},
          addedBy: request.user.id,
        })
        .returning();

      // Update user role
      await db
        .update(users)
        .set({ role, updatedAt: new Date() })
        .where(eq(users.id, userId));

      return fastify.ok(
        reply,
        { ...member, message: "Team member added successfully." },
        201,
      );
    },
  );

  // GET /api/admin/team
  fastify.get(
    "/team",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const members = await db
        .select()
        .from(teamMembers)
        .orderBy(desc(teamMembers.createdAt));
      return fastify.ok(reply, members);
    },
  );

  // DELETE /api/admin/team/:id
  fastify.delete(
    "/team/:id",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const [deleted] = await db
        .delete(teamMembers)
        .where(eq(teamMembers.id, request.params.id))
        .returning();
      if (!deleted)
        return fastify.fail(reply, 404, "NOT_FOUND", "Team member not found.");

      // Reset user role to trader
      await db
        .update(users)
        .set({ role: "trader", updatedAt: new Date() })
        .where(eq(users.id, deleted.userId));
      return fastify.ok(reply, { message: "Team member removed." });
    },
  );
}
