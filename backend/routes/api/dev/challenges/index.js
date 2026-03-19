import { eq, desc, and } from "drizzle-orm";
import { challenges, users } from "@/db/schema.js";

// Challenge pricing config
const CHALLENGE_CONFIG = {
  naira: [
    {
      label: "₦200,000",
      entryFee: 10000,
      startingBalance: 200000,
      profitTarget: 400000,
      maxDrawdown: 10,
      maxDailyLoss: 3,
      duration: 60,
    },
    {
      label: "₦500,000",
      entryFee: 25000,
      startingBalance: 500000,
      profitTarget: 1000000,
      maxDrawdown: 10,
      maxDailyLoss: 3,
      duration: 60,
    },
    {
      label: "₦1,000,000",
      entryFee: 50000,
      startingBalance: 1000000,
      profitTarget: 2000000,
      maxDrawdown: 10,
      maxDailyLoss: 3,
      duration: 60,
    },
  ],
  dollar: [
    {
      label: "$15,000",
      entryFee: 100000,
      startingBalance: 15000,
      profitTarget: 30000,
      maxDrawdown: 5,
      maxDailyLoss: 3,
      duration: 90,
    },
    {
      label: "$50,000",
      entryFee: 250000,
      startingBalance: 50000,
      profitTarget: 100000,
      maxDrawdown: 5,
      maxDailyLoss: 3,
      duration: 90,
    },
    {
      label: "$100,000",
      entryFee: 450000,
      startingBalance: 100000,
      profitTarget: 200000,
      maxDrawdown: 5,
      maxDailyLoss: 3,
      duration: 90,
    },
  ],
};

export default async function challengesRoutes(fastify) {
  // GET /api/challenges — Trader's own challenges
  fastify.get(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const { status } = request.query;
      const conditions = [eq(challenges.userId, request.user.id)];
      if (status) conditions.push(eq(challenges.status, status));

      const list = await db
        .select()
        .from(challenges)
        .where(and(...conditions))
        .orderBy(desc(challenges.createdAt));

      return fastify.ok(reply, list);
    },
  );

  // GET /api/challenges/config — Get available challenge types
  fastify.get("/config", async (request, reply) => {
    return fastify.ok(reply, CHALLENGE_CONFIG);
  });

  // GET /api/challenges/:id
  fastify.get(
    "/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const [challenge] = await db
        .select()
        .from(challenges)
        .where(
          and(
            eq(challenges.id, request.params.id),
            eq(challenges.userId, request.user.id),
          ),
        );

      if (!challenge)
        return fastify.fail(reply, 404, "NOT_FOUND", "Challenge not found.");
      return fastify.ok(reply, challenge);
    },
  );

  // POST /api/challenges/buy — Initiates a challenge purchase (payment first)
  fastify.post(
    "/buy",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { accountType, tier } = request.body || {};

      if (!accountType || !["naira", "dollar"].includes(accountType)) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "Account type must be either naira or dollar.",
        );
      }

      const configs = CHALLENGE_CONFIG[accountType];
      const config = configs[tier ?? 0];
      if (!config) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "Invalid challenge tier selected.",
        );
      }

      // Challenge creation is finalized after payment — return config for payment intent
      return fastify.ok(reply, {
        accountType,
        config,
        message: "Proceed to payment to activate your challenge.",
      });
    },
  );

  // GET /api/challenges/:id/stats — Mock stats (replace with MT5 API)
  fastify.get(
    "/:id/stats",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const [challenge] = await db
        .select()
        .from(challenges)
        .where(
          and(
            eq(challenges.id, request.params.id),
            eq(challenges.userId, request.user.id),
          ),
        );

      if (!challenge)
        return fastify.fail(reply, 404, "NOT_FOUND", "Challenge not found.");

      // TODO: Fetch live data from MT5 broker API
      return fastify.ok(reply, {
        challengeId: challenge.id,
        balance: challenge.currentBalance,
        equity: challenge.currentEquity,
        profit:
          Number(challenge.currentBalance) - Number(challenge.startingBalance),
        profitPct: (
          ((Number(challenge.currentBalance) -
            Number(challenge.startingBalance)) /
            Number(challenge.startingBalance)) *
          100
        ).toFixed(2),
        drawdown: 0,
        trades: [],
        lastUpdated: new Date().toISOString(),
      });
    },
  );
}
