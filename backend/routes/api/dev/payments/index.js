import { eq, desc } from "drizzle-orm";
import { transactions, challenges, users } from "@/db/schema.js";
import { paymentService } from "@/services/payment.service.js";
import { emailService } from "@/services/email.service.js";

export default async function paymentsRoutes(fastify) {
  // POST /api/payments/initiate
  fastify.post(
    "/initiate",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const {
        challengeType,
        amount,
        currency = "NGN",
        tier = 0,
        metadata = {},
      } = request.body || {};

      if (!challengeType || !amount) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "Challenge type and amount are required.",
        );
      }

      const db = fastify.db;
      const ref = `NF_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const [transaction] = await db
        .insert(transactions)
        .values({
          userId: request.user.id,
          type: "challenge_purchase",
          amount: String(amount),
          currency,
          status: "pending",
          paymentProvider: "flutterwave",
          providerRef: ref,
          metadata: { ...metadata, challengeType, tier },
        })
        .returning();

      // Call Flutterwave API to generate payment link
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      let paymentLink = "";

      try {
        paymentLink = await paymentService.generatePaymentLink({
          tx_ref: ref,
          amount,
          currency,
          redirect_url: `${frontendUrl}/dashboard/accounts`, // Redirect to accounts page
          customer: {
            email: request.user.email,
            name: request.user.fullName || "Trader",
          },
          customizations: {
            title: "Noble Funded Challenge",
            description: `Payment for ${challengeType} ${tier} challenge`,
          },
        });
      } catch (err) {
        fastify.log.error("Payment Link Gen Error:", err);
        return fastify.fail(
          reply,
          500,
          "PAYMENT_SERVER_ERROR",
          "Failed to generate payment link.",
        );
      }

      fastify.log.info(`Payment initiated: ${ref} for user ${request.user.id}`);

      return fastify.ok(
        reply,
        {
          transactionId: transaction.id,
          paymentLink,
          reference: ref,
        },
        201,
      );
    },
  );

  // POST /api/payments/webhook — Flutterwave webhook
  fastify.post("/webhook", async (request, reply) => {
    const hash = request.headers["verif-hash"];

    if (!paymentService.verifyWebhookSignature(hash)) {
      return fastify.fail(
        reply,
        401,
        "AUTH_REQUIRED",
        "Invalid webhook signature.",
      );
    }

    const { event, data } = request.body || {};
    if (event !== "charge.completed" || data?.status !== "successful") {
      return reply.code(200).send({ received: true });
    }

    const db = fastify.db;
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.providerRef, data.tx_ref));

    if (!transaction) {
      fastify.log.warn(`Webhook: transaction not found for ref ${data.tx_ref}`);
      return reply.code(200).send({ received: true });
    }

    if (transaction.status === "completed") {
      // Already processed — idempotent
      return reply.code(200).send({ received: true });
    }

    await db
      .update(transactions)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(transactions.id, transaction.id));

    // Get user to send email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, transaction.userId));

    // Parse metadata for challenge info
    const meta = transaction.metadata || {};
    const challengeType = meta.challengeType || "naira";
    const accountSizeStr = meta.accountSize || meta.tier || "0";
    
    // Extract numeric balance from string like "₦200,000" or "$5,000" or just use the tier
    let startingBalance = 0;
    if (typeof accountSizeStr === "string") {
      startingBalance = parseInt(accountSizeStr.replace(/[^0-9]/g, ""));
    } else {
      startingBalance = Number(accountSizeStr);
    }

    if (isNaN(startingBalance) || startingBalance === 0) {
      // Fallback to old tier logic if parsing fails
      startingBalance =
        challengeType === "naira"
          ? meta.tier === 0 ? 200000 : meta.tier === 1 ? 500000 : 1000000
          : meta.tier === 0 ? 15000 : meta.tier === 1 ? 50000 : 100000;
    }

    const profitTargetPct = challengeType === "naira" ? 0.10 : 0.10; // Phase 1 target
    const profitTarget = startingBalance * profitTargetPct;

    await db.insert(challenges).values({
      userId: transaction.userId,
      accountType: challengeType,
      startingBalance: String(startingBalance),
      currentBalance: String(startingBalance),
      currentEquity: String(startingBalance),
      profitTarget: String(profitTarget),
      maxDrawdownPct: challengeType === "naira" ? "20.00" : "10.00",
      maxDailyLossPct: challengeType === "naira" ? "0.00" : "3.00",
      durationDays: challengeType === "naira" ? 60 : 90,
      status: "active",
      mt5Login,
      phase: 1,
    });

    if (user) {
      emailService
        .sendPurchaseConfirmationEmail(
          user.email,
          user.fullName,
          challengeType,
          challengeType === "naira"
            ? `₦${startingBalance.toLocaleString()}`
            : `$${startingBalance.toLocaleString()}`,
        )
        .catch((err) => fastify.log.error(err));
    }

    fastify.log.info(
      `Payment completed: ${data.tx_ref} — challenge provisioned`,
    );

    return reply.code(200).send({ received: true });
  });

  // GET /api/payments/history
  fastify.get(
    "/history",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const history = await db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, request.user.id))
        .orderBy(desc(transactions.createdAt));

      return fastify.ok(reply, history);
    },
  );

  // GET /api/payments/:id
  fastify.get(
    "/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const [transaction] = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, request.params.id));

      if (!transaction)
        return fastify.fail(reply, 404, "NOT_FOUND", "Transaction not found.");
      if (
        transaction.userId !== request.user.id &&
        !["super_admin", "compliance"].includes(request.user.role)
      ) {
        return fastify.fail(reply, 403, "FORBIDDEN");
      }

      return fastify.ok(reply, transaction);
    },
  );
}
