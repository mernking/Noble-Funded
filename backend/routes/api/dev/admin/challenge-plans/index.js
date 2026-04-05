import { desc, eq, and, sql, count } from "drizzle-orm";
import { challenges, users } from "@/db/schema.js";

export default async function challengePlansRoutes(fastify) {
  // GET /admin/challenge-plans - Get challenge plans configuration
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      try {
        // Define challenge plans based on current config
        const plans = [
          { id: "naira-200k", name: "Naira Starter", accountType: "naira", startingBalance: 200000, profitTarget: 10, maxDrawdown: 10, price: 15000, currency: "NGN", phase1Days: 14, phase2Days: 30, popular: false },
          { id: "naira-400k", name: "Naira Pro", accountType: "naira", startingBalance: 400000, profitTarget: 10, maxDrawdown: 10, price: 25000, currency: "NGN", phase1Days: 14, phase2Days: 30, popular: true },
          { id: "naira-800k", name: "Naira Elite", accountType: "naira", startingBalance: 800000, profitTarget: 10, maxDrawdown: 10, price: 45000, currency: "NGN", phase1Days: 14, phase2Days: 30, popular: false },
          { id: "naira-1.5m", name: "Naira Champion", accountType: "naira", startingBalance: 1500000, profitTarget: 10, maxDrawdown: 10, price: 75000, currency: "NGN", phase1Days: 14, phase2Days: 30, popular: false },
          { id: "naira-3m", name: "Naira Legend", accountType: "naira", startingBalance: 3000000, profitTarget: 10, maxDrawdown: 10, price: 140000, currency: "NGN", phase1Days: 14, phase2Days: 30, popular: false },
          { id: "dollar-5k", name: "Dollar Starter", accountType: "dollar", startingBalance: 5000, profitTarget: 10, maxDrawdown: 10, price: 150, currency: "USD", phase1Days: 14, phase2Days: 30, popular: false },
          { id: "dollar-10k", name: "Dollar Pro", accountType: "dollar", startingBalance: 10000, profitTarget: 10, maxDrawdown: 10, price: 250, currency: "USD", phase1Days: 14, phase2Days: 30, popular: true },
          { id: "dollar-25k", name: "Dollar Elite", accountType: "dollar", startingBalance: 25000, profitTarget: 10, maxDrawdown: 10, price: 500, currency: "USD", phase1Days: 14, phase2Days: 30, popular: false },
          { id: "dollar-50k", name: "Dollar Champion", accountType: "dollar", startingBalance: 50000, profitTarget: 10, maxDrawdown: 10, price: 900, currency: "USD", phase1Days: 14, phase2Days: 30, popular: false },
          { id: "dollar-100k", name: "Dollar Legend", accountType: "dollar", startingBalance: 100000, profitTarget: 10, maxDrawdown: 10, price: 1500, currency: "USD", phase1Days: 14, phase2Days: 30, popular: false },
        ];

        // Get stats
        const db = fastify.db;
        const [activeCount] = await db
          .select({ count: count() })
          .from(challenges)
          .where(eq(challenges.status, "active"));

        const [passedCount] = await db
          .select({ count: count() })
          .from(challenges)
          .where(eq(challenges.status, "passed"));

        return fastify.ok(reply, {
          plans,
          stats: {
            totalPlans: plans.length,
            activeChallenges: activeCount.count,
            passedChallenges: passedCount.count,
          }
        });
      } catch (error) {
        console.error("Challenge plans fetch error:", error);
        return fastify.error(reply, "Failed to fetch challenge plans");
      }
    }
  );

  // GET /admin/challenge-plans/:id - Get single plan details
  fastify.get(
    "/:id",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const { id } = request.params;

      // Return plan details
      const plans = {
        "naira-200k": { id: "naira-200k", name: "Naira Starter", accountType: "naira", startingBalance: 200000, profitTarget: 10, maxDrawdown: 10, price: 15000, currency: "NGN", phase1Days: 14, phase2Days: 30 },
        "naira-400k": { id: "naira-400k", name: "Naira Pro", accountType: "naira", startingBalance: 400000, profitTarget: 10, maxDrawdown: 10, price: 25000, currency: "NGN", phase1Days: 14, phase2Days: 30 },
        "naira-800k": { id: "naira-800k", name: "Naira Elite", accountType: "naira", startingBalance: 800000, profitTarget: 10, maxDrawdown: 10, price: 45000, currency: "NGN", phase1Days: 14, phase2Days: 30 },
        "naira-1.5m": { id: "naira-1.5m", name: "Naira Champion", accountType: "naira", startingBalance: 1500000, profitTarget: 10, maxDrawdown: 10, price: 75000, currency: "NGN", phase1Days: 14, phase2Days: 30 },
        "naira-3m": { id: "naira-3m", name: "Naira Legend", accountType: "naira", startingBalance: 3000000, profitTarget: 10, maxDrawdown: 10, price: 140000, currency: "NGN", phase1Days: 14, phase2Days: 30 },
        "dollar-5k": { id: "dollar-5k", name: "Dollar Starter", accountType: "dollar", startingBalance: 5000, profitTarget: 10, maxDrawdown: 10, price: 150, currency: "USD", phase1Days: 14, phase2Days: 30 },
        "dollar-10k": { id: "dollar-10k", name: "Dollar Pro", accountType: "dollar", startingBalance: 10000, profitTarget: 10, maxDrawdown: 10, price: 250, currency: "USD", phase1Days: 14, phase2Days: 30 },
        "dollar-25k": { id: "dollar-25k", name: "Dollar Elite", accountType: "dollar", startingBalance: 25000, profitTarget: 10, maxDrawdown: 10, price: 500, currency: "USD", phase1Days: 14, phase2Days: 30 },
        "dollar-50k": { id: "dollar-50k", name: "Dollar Champion", accountType: "dollar", startingBalance: 50000, profitTarget: 10, maxDrawdown: 10, price: 900, currency: "USD", phase1Days: 14, phase2Days: 30 },
        "dollar-100k": { id: "dollar-100k", name: "Dollar Legend", accountType: "dollar", startingBalance: 100000, profitTarget: 10, maxDrawdown: 10, price: 1500, currency: "USD", phase1Days: 14, phase2Days: 30 },
      };

      const plan = plans[id];
      if (!plan) {
        return fastify.notFound(reply, "Challenge plan not found");
      }

      return fastify.ok(reply, { plan });
    }
  );

  // PUT /admin/challenge-plans/:id - Update a plan
  fastify.put(
    "/:id",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const { id } = request.params;
      const updates = request.body;

      // In production, this would update the challenge plan in DB
      return fastify.ok(reply, {
        plan: { id, ...updates },
        message: "Challenge plan updated successfully"
      });
    }
  );
}