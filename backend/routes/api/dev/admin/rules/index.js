import { eq, and, sql } from "drizzle-orm";
import { systemSettings } from "@/db/schema.js";

export default async function rulesRoutes(fastify) {
  // GET /admin/rules - Get all trading rules
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      try {
        const db = fastify.db;
        
        // Get all rules from system settings
        const rules = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.category, "rules"))
          .orderBy(systemSettings.key);

        const rulesData = rules.reduce((acc, rule) => {
          acc[rule.key] = {
            value: rule.value,
            description: rule.description,
            updatedAt: rule.updatedAt
          };
          return acc;
        }, {});

        // Default trading rules if not in DB
        const defaultRules = {
          profitTarget: { value: "10", description: "Minimum profit target percentage", unit: "%" },
          maxDrawdown: { value: "10", description: "Maximum allowed drawdown", unit: "%" },
          dailyLossLimit: { value: "5", description: "Daily loss limit", unit: "%" },
          tradingDays: { value: "30", description: "Minimum trading days required", unit: "days" },
          minTradingDays: { value: "20", description: "Minimum days to evaluate", unit: "days" },
          leverage: { value: "1:100", description: "Account leverage" },
          lotSizeLimit: { value: "5", description: "Maximum lot size per trade", unit: "lots" },
          newsTrading: { value: "restricted", description: "News trading policy" },
          weekendTrading: { value: "allowed", description: "Weekend trading policy" },
          eaAllowed: { value: "true", description: "Expert advisors allowed" },
          scalpingAllowed: { value: "true", description: "Scalping allowed" },
          hedginAllowed: { value: "true", description: "Hedging allowed" },
        };

        // Merge with defaults
        const mergedRules = { ...defaultRules, ...rulesData };

        return fastify.ok(reply, {
          rules: mergedRules,
          categories: ["trading", "evaluation", "restrictions"]
        });
      } catch (error) {
        console.error("Rules fetch error:", error);
        return fastify.error(reply, "Failed to fetch rules");
      }
    }
  );

  // PUT /admin/rules - Update trading rules
  fastify.put(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { rules } = request.body;

      if (!rules || typeof rules !== "object") {
        return fastify.badRequest(reply, "Rules object required");
      }

      try {
        const updates = [];
        
        for (const [key, data] of Object.entries(rules)) {
          const value = typeof data === 'object' ? data.value : data;
          const description = typeof data === 'object' ? data.description : null;
          
          // Check if exists
          const [existing] = await db
            .select()
            .from(systemSettings)
            .where(and(
              eq(systemSettings.key, key),
              eq(systemSettings.category, "rules")
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
                category: "rules",
                description: description || `Trading rule: ${key}`,
                updatedAt: new Date()
              });
          }
          
          updates.push(key);
        }

        return fastify.ok(reply, {
          updated: updates,
          message: `Updated ${updates.length} rules successfully`
        });
      } catch (error) {
        console.error("Rules update error:", error);
        return fastify.error(reply, "Failed to update rules");
      }
    }
  );

  // GET /admin/rules/versions - Get rule change history
  fastify.get(
    "/versions",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { limit = 20 } = request.query;

      try {
        // Get recent rule changes from activity logs or system settings
        const history = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.category, "rules"))
          .orderBy(systemSettings.updatedAt)
          .limit(parseInt(limit));

        return fastify.ok(reply, {
          history: history.map(r => ({
            rule: r.key,
            value: r.value,
            updatedAt: r.updatedAt,
            updatedBy: r.updatedBy || "system"
          }))
        });
      } catch (error) {
        console.error("Rules history error:", error);
        return fastify.error(reply, "Failed to fetch rule history");
      }
    }
  );

  // POST /admin/rules/reset - Reset rules to defaults
  fastify.post(
    "/reset",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;

      try {
        // Delete custom rules (keep defaults)
        await db
          .delete(systemSettings)
          .where(eq(systemSettings.category, "rules"));

        return fastify.ok(reply, {
          message: "Rules reset to defaults successfully"
        });
      } catch (error) {
        console.error("Rules reset error:", error);
        return fastify.error(reply, "Failed to reset rules");
      }
    }
  );
}