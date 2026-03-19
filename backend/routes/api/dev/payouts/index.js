import { eq, desc, and } from "drizzle-orm";
import { payouts, challenges, users } from "@/db/schema.js";
import { emailService } from "@/services/email.service.js";

export default async function payoutsRoutes(fastify) {
  // POST /api/payouts/request
  fastify.post(
    "/request",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const {
        challengeId,
        amount,
        currency = "NGN",
        payoutMethod,
        bankName,
        accountNumber,
        accountName,
        usdtAddress,
      } = request.body || {};

      if (!challengeId || !amount || !payoutMethod) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "Challenge ID, amount, and payout method are required.",
        );
      }

      const db = fastify.db;
      const [challenge] = await db
        .select()
        .from(challenges)
        .where(
          and(
            eq(challenges.id, challengeId),
            eq(challenges.userId, request.user.id),
          ),
        );

      if (!challenge)
        return fastify.fail(reply, 404, "NOT_FOUND", "Challenge not found.");
      if (challenge.status !== "passed") {
        return fastify.fail(
          reply,
          400,
          "VALIDATION_ERROR",
          "You can only request a payout for a passed challenge.",
        );
      }

      // Check for existing pending payout
      const [existingPayout] = await db
        .select()
        .from(payouts)
        .where(
          and(
            eq(payouts.challengeId, challengeId),
            eq(payouts.status, "pending"),
          ),
        );

      if (existingPayout) {
        return fastify.fail(
          reply,
          409,
          "VALIDATION_ERROR",
          "A payout request for this challenge is already pending review.",
        );
      }

      const [payout] = await db
        .insert(payouts)
        .values({
          userId: request.user.id,
          challengeId,
          amount: String(amount),
          currency,
          payoutMethod,
          bankName,
          accountNumber,
          accountName,
          usdtAddress,
        })
        .returning();

      return fastify.ok(
        reply,
        {
          ...payout,
          message:
            "Payout request submitted. We will review it within 2–3 business days.",
        },
        201,
      );
    },
  );

  // GET /api/payouts
  fastify.get(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const list = await db
        .select()
        .from(payouts)
        .where(eq(payouts.userId, request.user.id))
        .orderBy(desc(payouts.createdAt));

      return fastify.ok(reply, list);
    },
  );

  // GET /api/payouts/:id
  fastify.get(
    "/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const [payout] = await db
        .select()
        .from(payouts)
        .where(eq(payouts.id, request.params.id));
      if (!payout)
        return fastify.fail(reply, 404, "NOT_FOUND", "Payout not found.");
      if (
        payout.userId !== request.user.id &&
        !["super_admin", "compliance"].includes(request.user.role)
      ) {
        return fastify.fail(reply, 403, "FORBIDDEN");
      }
      return fastify.ok(reply, payout);
    },
  );

  // PUT /api/payouts/:id/approve — Compliance only
  fastify.put(
    "/:id/approve",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const { notes } = request.body || {};
      const db = fastify.db;
      const [updated] = await db
        .update(payouts)
        .set({
          status: "approved",
          approvedBy: request.user.id,
          approvedAt: new Date(),
          notes,
          updatedAt: new Date(),
        })
        .where(
          and(eq(payouts.id, request.params.id), eq(payouts.status, "pending")),
        )
        .returning();

      if (!updated) {
        return fastify.fail(
          reply,
          404,
          "NOT_FOUND",
          "Payout not found or already processed.",
        );
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, updated.userId));
      if (user) {
        emailService
          .sendPayoutStatusEmail(
            user.email,
            user.fullName,
            updated.amount,
            "approved",
          )
          .catch((err) => fastify.log.error(err));
      }

      return fastify.ok(reply, {
        ...updated,
        message: "Payout approved successfully.",
      });
    },
  );

  // PUT /api/payouts/:id/reject — Compliance only
  fastify.put(
    "/:id/reject",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const { reason } = request.body || {};
      if (!reason) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "A reason for rejection is required.",
        );
      }

      const db = fastify.db;
      const [updated] = await db
        .update(payouts)
        .set({
          status: "rejected",
          rejectedReason: reason,
          updatedAt: new Date(),
        })
        .where(
          and(eq(payouts.id, request.params.id), eq(payouts.status, "pending")),
        )
        .returning();

      if (!updated) {
        return fastify.fail(
          reply,
          404,
          "NOT_FOUND",
          "Payout not found or already processed.",
        );
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, updated.userId));
      if (user) {
        emailService
          .sendPayoutStatusEmail(
            user.email,
            user.fullName,
            updated.amount,
            "rejected",
            reason,
          )
          .catch((err) => fastify.log.error(err));
      }

      return fastify.ok(reply, { ...updated, message: "Payout rejected." });
    },
  );
}
