import { eq, and, sql, count } from "drizzle-orm";
import { systemSettings } from "@/db/schema.js";

export default async function riskEngineRoutes(fastify) {
  // GET /admin/risk-engine - Get risk engine configuration
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;

      try {
        // Get all risk settings
        const settings = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.category, "risk_engine"))
          .orderBy(systemSettings.key);

        const riskConfig = settings.reduce((acc, setting) => {
          acc[setting.key] = {
            value: setting.value,
            description: setting.description,
            updatedAt: setting.updatedAt
          };
          return acc;
        }, {});

        // Default risk engine configuration
        const defaults = {
          maxDrawdownLimit: { value: "10", description: "Maximum drawdown limit", unit: "%" },
          dailyLossLimit: { value: "5", description: "Daily loss limit", unit: "%" },
          profitTarget: { value: "10", description: "Minimum profit target", unit: "%" },
          minTradingDays: { value: "20", description: "Minimum trading days required", unit: "days" },
          maxCorrelation: { value: "0.7", description: "Maximum asset correlation", unit: "ratio" },
          positionSizeLimit: { value: "20", description: "Max position size per trade", unit: "%" },
          leverageLimit: { value: "100", description: "Maximum leverage allowed", unit: "x" },
          autoLiquidate: { value: "true", description: "Auto-liquidate on breach" },
          breachNotification: { value: "true", description: "Notify on risk breach" },
          weekendExposure: { value: "restricted", description: "Weekend position handling" },
          newsGapProtection: { value: "enabled", description: "News gap protection" },
          volatilityThreshold: { value: "15", description: "Volatility alert threshold", unit: "%" },
        };

        const mergedConfig = { ...defaults, ...riskConfig };

        // Get risk metrics
        const [activeTraders] = await db
          .select({ count: sql`COUNT(DISTINCT ${systemSettings.id})` })
          .from(systemSettings)
          .where(eq(systemSettings.category, "risk_engine"));

        return fastify.ok(reply, {
          config: mergedConfig,
          status: {
            engineActive: true,
            lastUpdated: new Date().toISOString(),
            breachAlerts: 0,
            monitoredAccounts: 0
          }
        });
      } catch (error) {
        console.error("Risk engine fetch error:", error);
        return fastify.error(reply, "Failed to fetch risk engine config");
      }
    }
  );

  // PUT /admin/risk-engine - Update risk engine configuration
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
              eq(systemSettings.category, "risk_engine")
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
                category: "risk_engine",
                description: description || `Risk rule: ${key}`,
                updatedAt: new Date()
              });
          }

          updates.push(key);
        }

        return fastify.ok(reply, {
          updated: updates,
          message: `Updated ${updates.length} risk rules successfully`
        });
      } catch (error) {
        console.error("Risk engine update error:", error);
        return fastify.error(reply, "Failed to update risk engine");
      }
    }
  );

  // GET /admin/risk-engine/breaches - Get risk breach history
  fastify.get(
    "/breaches",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 50 } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;

      try {
        // For now, return empty - would need a risk_breaches table
        return fastify.ok(reply, {
          breaches: [],
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: 0,
            pages: 0
          }
        });
      } catch (error) {
        console.error("Breaches fetch error:", error);
        return fastify.error(reply, "Failed to fetch breaches");
      }
    }
  );

  // GET /admin/risk-engine/test - Test risk calculation
  fastify.post(
    "/test",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const { accountBalance, drawdown, dailyPL, tradingDays } = request.body;

      // Simple risk calculation test
      const risks = [];

      if (drawdown > 10) risks.push("Drawdown exceeds 10% limit");
      if (dailyPL < -5) risks.push("Daily loss exceeds 5% limit");
      if (tradingDays < 20) risks.push("Insufficient trading days");

      return fastify.ok(reply, {
        safe: risks.length === 0,
        risks,
        message: risks.length === 0 ? "Account passes risk evaluation" : "Account has risk concerns"
      });
    }
  );
}