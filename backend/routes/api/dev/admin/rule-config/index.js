import { eq, and, sql, count } from "drizzle-orm";
import { systemSettings } from "@/db/schema.js";

export default async function ruleConfigRoutes(fastify) {
  // GET /admin/rule-config - Get rule configuration matrix
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;

      try {
        const settings = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.category, "rule_config"))
          .orderBy(systemSettings.key);

        const configMatrix = settings.reduce((acc, setting) => {
          acc[setting.key] = {
            value: setting.value,
            description: setting.description,
            updatedAt: setting.updatedAt
          };
          return acc;
        }, {});

        // Default rule configuration matrix
        const defaults = {
          phase1ProfitTarget: { value: "8", description: "Phase 1 profit target", unit: "%" },
          phase1MaxDrawdown: { value: "6", description: "Phase 1 max drawdown", unit: "%" },
          phase1Duration: { value: "14", description: "Phase 1 duration", unit: "days" },
          phase2ProfitTarget: { value: "5", description: "Phase 2 profit target", unit: "%" },
          phase2MaxDrawdown: { value: "5", description: "Phase 2 max drawdown", unit: "%" },
          phase2Duration: { value: "30", description: "Phase 2 duration", unit: "days" },
          evaluationMinDays: { value: "10", description: "Minimum evaluation days", unit: "days" },
          consistencyRule: { value: "true", description: "Enable consistency rule" },
          maxDailyLoss: { value: "5", description: "Maximum daily loss", unit: "%" },
          weekendHoldAllowed: { value: "true", description: "Allow weekend position hold" },
          newsTradingAllowed: { value: "false", description: "Allow news trading" },
          eaRestriction: { value: "none", description: "EA/restriction level" },
        };

        const mergedConfig = { ...defaults, ...configMatrix };

        // Define rule matrix for display
        const ruleMatrix = [
          { tier: "₦200K", phase1Target: "8%", phase1Drawdown: "6%", phase2Target: "5%", phase2Drawdown: "5%", minDays: "10" },
          { tier: "₦400K", phase1Target: "8%", phase1Drawdown: "6%", phase2Target: "5%", phase2Drawdown: "5%", minDays: "10" },
          { tier: "₦800K", phase1Target: "8%", phase1Drawdown: "6%", phase2Target: "5%", phase2Drawdown: "5%", minDays: "10" },
          { tier: "₦1.5M", phase1Target: "8%", phase1Drawdown: "6%", phase2Target: "5%", phase2Drawdown: "5%", minDays: "10" },
          { tier: "₦3M", phase1Target: "8%", phase1Drawdown: "6%", phase2Target: "5%", phase2Drawdown: "5%", minDays: "10" },
          { tier: "$5K", phase1Target: "8%", phase1Drawdown: "6%", phase2Target: "5%", phase2Drawdown: "5%", minDays: "10" },
          { tier: "$10K", phase1Target: "8%", phase1Drawdown: "6%", phase2Target: "5%", phase2Drawdown: "5%", minDays: "10" },
          { tier: "$25K", phase1Target: "8%", phase1Drawdown: "6%", phase2Target: "5%", phase2Drawdown: "5%", minDays: "10" },
          { tier: "$50K", phase1Target: "8%", phase1Drawdown: "6%", phase2Target: "5%", phase2Drawdown: "5%", minDays: "10" },
          { tier: "$100K+", phase1Target: "8%", phase1Drawdown: "6%", phase2Target: "5%", phase2Drawdown: "5%", minDays: "10" },
        ];

        return fastify.ok(reply, {
          config: mergedConfig,
          ruleMatrix,
          lastUpdated: new Date().toISOString()
        });
      } catch (error) {
        console.error("Rule config fetch error:", error);
        return fastify.error(reply, "Failed to fetch rule configuration");
      }
    }
  );

  // PUT /admin/rule-config - Update rule configuration
  fastify.put(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { config } = request.body;

      if (!config || typeof config !== "object") {
        return fastify.badRequest(reply, "Config object required");
      }

      try {
        const updates = [];

        for (const [key, data] of Object.entries(config)) {
          const value = typeof data === 'object' ? data.value : data;
          const description = typeof data === 'object' ? data.description : null;

          const [existing] = await db
            .select()
            .from(systemSettings)
            .where(and(
              eq(systemSettings.key, key),
              eq(systemSettings.category, "rule_config")
            ));

          if (existing) {
            await db
              .update(systemSettings)
              .set({
                value: String(value),
                description: description || existing.description,
                updatedAt: new Date()
              })
              .where(eq(systemSettings.id, existing.id));
          } else {
            await db
              .insert(systemSettings)
              .values({
                key,
                value: String(value),
                category: "rule_config",
                description: description || `Rule config: ${key}`,
                updatedAt: new Date()
              });
          }

          updates.push(key);
        }

        return fastify.ok(reply, {
          updated: updates,
          message: `Updated ${updates.length} rule configurations`
        });
      } catch (error) {
        console.error("Rule config update error:", error);
        return fastify.error(reply, "Failed to update rule configuration");
      }
    }
  );

  // POST /admin/rule-config/reset - Reset to defaults
  fastify.post(
    "/reset",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;

      try {
        await db
          .delete(systemSettings)
          .where(eq(systemSettings.category, "rule_config"));

        return fastify.ok(reply, {
          message: "Rule configuration reset to defaults"
        });
      } catch (error) {
        console.error("Rule config reset error:", error);
        return fastify.error(reply, "Failed to reset rule configuration");
      }
    }
  );
}