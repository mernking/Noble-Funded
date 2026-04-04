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
  // GET /api/admin/challenges
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { status, page = 1, limit = 20 } = request.query;
      const conditions = status ? [eq(challenges.status, status)] : undefined;

      const list = await db
        .select({
          id: challenges.id,
          mt5Login: challenges.mt5Login,
          userName: users.fullName,
          userEmail: users.email,
          accountType: challenges.accountType,
          startingBalance: challenges.startingBalance,
          currentBalance: challenges.currentBalance,
          currentEquity: challenges.currentEquity,
          status: challenges.status,
          createdAt: challenges.createdAt,
          phase: challenges.phase,
          durationDays: challenges.durationDays,
        })
        .from(challenges)
        .leftJoin(users, eq(challenges.userId, users.id))
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

  // POST /api/admin/challenges/:id/disable
  fastify.post(
    "/:id/disable",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      await db.update(challenges).set({ status: "disabled", updatedAt: new Date() }).where(eq(challenges.id, id));
      return fastify.ok(reply, { message: "Challenge disabled." });
    },
  );

  // POST /api/admin/challenges/:id/enable
  fastify.post(
    "/:id/enable",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      await db.update(challenges).set({ status: "active", updatedAt: new Date() }).where(eq(challenges.id, id));
      return fastify.ok(reply, { message: "Challenge enabled." });
    },
  );
}
