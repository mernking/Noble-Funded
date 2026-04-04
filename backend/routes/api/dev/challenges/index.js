import { eq, desc, and } from "drizzle-orm";
import { challenges, users } from "@/db/schema.js";

// Challenge pricing config
const CHALLENGE_CONFIG = {
  naira: [
    { label: "₦200,000", entryFee: 10000, startingBalance: 200000 },
    { label: "₦400,000", entryFee: 19000, startingBalance: 400000 },
    { label: "₦600,000", entryFee: 29000, startingBalance: 600000 },
    { label: "₦800,000", entryFee: 39000, startingBalance: 800000 },
    { label: "₦1,000,000", entryFee: 54000, startingBalance: 1000000 },
    { label: "₦3,000,000", entryFee: 190000, startingBalance: 3000000 },
  ],
  dollar: [
    { label: "$5,000", entryFee: 29.99, startingBalance: 5000 },
    { label: "$10,000", entryFee: 59.99, startingBalance: 10000 },
    { label: "$25,000", entryFee: 134.99, startingBalance: 25000 },
    { label: "$50,000", entryFee: 219.99, startingBalance: 50000 },
    { label: "$100,000", entryFee: 379.99, startingBalance: 100000 },
    { label: "$200,000", entryFee: 749.99, startingBalance: 200000 },
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

      // Map to TradingAccount format expected by frontend
      const formattedList = list.map(c => ({
        id: c.id,
        accountNumber: `NF-${c.accountType.toUpperCase()}-${(Number(c.startingBalance) / 1000).toFixed(0)}K`,
        type: c.accountType,
        currency: c.accountType === 'naira' ? 'NGN' : 'USD',
        status: c.status,
        balance: Number(c.currentBalance),
        startingBalance: Number(c.startingBalance),
        profitTarget: Number(c.profitTarget),
        maxDailyDrawdown: Number(c.maxDailyLossPct),
        maxOverallDrawdown: Number(c.maxDrawdownPct),
        currentProfit: ((Number(c.currentBalance) - Number(c.startingBalance)) / Number(c.startingBalance)) * 100,
        currentDailyDrawdown: 0, // Should be calculated
        currentOverallDrawdown: ((Number(c.startingBalance) - Number(c.currentEquity)) / Number(c.startingBalance)) * 100,
        phase: c.phase,
        leverage: "1:100",
        platform: "MT5",
        server: c.mt5Server || "NobleFunded-Demo",
        login: c.mt5Login,
        password: c.mt5Password ? `${c.mt5Password.substring(0, 2)}****${c.mt5Password.substring(c.mt5Password.length - 2)}` : "********",
        profitSplit: 80,
        createdAt: c.createdAt.toISOString(),
        trades: []
      }));

      return fastify.ok(reply, formattedList);
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
      
      const formatted = {
        id: challenge.id,
        accountNumber: `NF-${challenge.accountType.toUpperCase()}-${(Number(challenge.startingBalance) / 1000).toFixed(0)}K`,
        type: challenge.accountType,
        currency: challenge.accountType === 'naira' ? 'NGN' : 'USD',
        status: challenge.status,
        balance: Number(challenge.currentBalance),
        startingBalance: Number(challenge.startingBalance),
        profitTarget: Number(challenge.profitTarget),
        maxDailyDrawdown: Number(challenge.maxDailyLossPct),
        maxOverallDrawdown: Number(challenge.maxDrawdownPct),
        currentProfit: ((Number(challenge.currentBalance) - Number(challenge.startingBalance)) / Number(challenge.startingBalance)) * 100,
        currentDailyDrawdown: 0,
        currentOverallDrawdown: ((Number(challenge.startingBalance) - Number(challenge.currentEquity)) / Number(challenge.startingBalance)) * 100,
        phase: challenge.phase,
        leverage: "1:100",
        platform: "MT5",
        server: challenge.mt5Server || "NobleFunded-Demo",
        login: challenge.mt5Login,
        password: challenge.mt5Password ? `${challenge.mt5Password.substring(0, 2)}****${challenge.mt5Password.substring(challenge.mt5Password.length - 2)}` : "********",
        profitSplit: 80,
        createdAt: challenge.createdAt.toISOString(),
        trades: []
      };

      return fastify.ok(reply, formatted);
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
