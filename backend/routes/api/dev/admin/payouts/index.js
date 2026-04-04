import { desc, eq, and, sql } from "drizzle-orm";
import { payouts, users, challenges } from "@/db/schema.js";

export default async function adminPayoutsRoutes(fastify) {
  // GET /api/admin/payouts
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { status, page = 1, limit = 20 } = request.query;
      const conditions = status ? [eq(payouts.status, status.toLowerCase())] : undefined;

      const list = await db
        .select({
          id: payouts.id,
          amount: payouts.amount,
          currency: payouts.currency,
          status: payouts.status,
          method: payouts.payoutMethod,
          bankName: payouts.bankName,
          accountNumber: payouts.accountNumber,
          accountName: payouts.accountName,
          usdtAddress: payouts.usdtAddress,
          createdAt: payouts.createdAt,
          traderName: users.fullName,
          traderEmail: users.email,
          challengeId: challenges.id,
        })
        .from(payouts)
        .leftJoin(users, eq(payouts.userId, users.id))
        .leftJoin(challenges, eq(payouts.challengeId, challenges.id))
        .where(conditions ? and(...conditions) : undefined)
        .orderBy(desc(payouts.createdAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      return fastify.ok(reply, {
        payouts: list,
        page: Number(page),
        limit: Number(limit),
      });
    },
  );

  // POST /api/admin/payouts/:id/approve
  fastify.post(
    "/:id/approve",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      const [payout] = await db
        .select()
        .from(payouts)
        .where(eq(payouts.id, id));

      if (!payout) return fastify.fail(reply, 404, "NOT_FOUND", "Payout not found.");
      if (payout.status !== "pending") return fastify.fail(reply, 400, "INVALID_STATUS", "Only pending payouts can be approved.");

      await db
        .update(payouts)
        .set({
          status: "approved",
          approvedBy: request.user.id,
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(payouts.id, id));

      // TODO: Integrate with payment processor or manual marking as paid
      
      return fastify.ok(reply, { message: "Payout approved successfully." });
    },
  );

  // POST /api/admin/payouts/:id/reject
  fastify.post(
    "/:id/reject",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      const { reason } = request.body || {};

      const [payout] = await db
        .select()
        .from(payouts)
        .where(eq(payouts.id, id));

      if (!payout) return fastify.fail(reply, 404, "NOT_FOUND", "Payout not found.");
      if (payout.status !== "pending") return fastify.fail(reply, 400, "INVALID_STATUS", "Only pending payouts can be rejected.");

      await db
        .update(payouts)
        .set({
          status: "rejected",
          rejectedReason: reason || "Rejected by admin",
          updatedAt: new Date(),
        })
        .where(eq(payouts.id, id));

      return fastify.ok(reply, { message: "Payout rejected." });
    },
  );
}
