import { eq, and, sql, count } from "drizzle-orm";
import { systemSettings } from "@/db/schema.js";

export default async function fxRateRoutes(fastify) {
  // GET /admin/fx-rate - Get FX rate configuration
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;

      try {
        const settings = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.category, "fx_rate"))
          .orderBy(systemSettings.key);

        const fxConfig = settings.reduce((acc, setting) => {
          acc[setting.key] = {
            value: setting.value,
            description: setting.description,
            updatedAt: setting.updatedAt
          };
          return acc;
        }, {});

        const defaults = {
          usdToNgnRate: { value: "1550", description: "USD to NGN exchange rate", unit: "NGN" },
          eurToNgnRate: { value: "1680", description: "EUR to NGN exchange rate", unit: "NGN" },
          gbpToNgnRate: { value: "1950", description: "GBP to NGN exchange rate", unit: "NGN" },
          autoUpdate: { value: "true", description: "Auto-update rates from API" },
          updateInterval: { value: "3600", description: "Rate update interval", unit: "seconds" },
          marginPercent: { value: "2", description: "Margin added to rates", unit: "%" },
          lastUpdated: { value: new Date().toISOString(), description: "Last rate update time" },
        };

        const mergedConfig = { ...defaults, ...fxConfig };
        const marginPercent = Number(mergedConfig.marginPercent?.value || 2);

        return fastify.ok(reply, {
          rates: {
            USD: { buy: Number(mergedConfig.usdToNgnRate.value), sell: Number(mergedConfig.usdToNgnRate.value) * (1 + marginPercent / 100) },
            EUR: { buy: Number(mergedConfig.eurToNgnRate.value), sell: Number(mergedConfig.eurToNgnRate.value) * (1 + marginPercent / 100) },
            GBP: { buy: Number(mergedConfig.gbpToNgnRate.value), sell: Number(mergedConfig.gbpToNgnRate.value) * (1 + marginPercent / 100) },
          },
          config: mergedConfig,
          lastUpdate: new Date().toISOString()
        });
      } catch (error) {
        console.error("FX rate fetch error:", error);
        return fastify.error(reply, "Failed to fetch FX rates");
      }
    }
  );

  // PUT /admin/fx-rate - Update FX rate configuration
  fastify.put(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { rates, config } = request.body;

      try {
        const updates = [];

        // Update rates
        if (rates) {
          for (const [currency, rateData] of Object.entries(rates)) {
            const key = `${currency.toLowerCase()}ToNgnRate`;
            const value = rateData.buy || rateData;
            
            const [existing] = await db
              .select()
              .from(systemSettings)
              .where(and(
                eq(systemSettings.key, key),
                eq(systemSettings.category, "fx_rate")
              ));

            if (existing) {
              await db
                .update(systemSettings)
                .set({ value: String(value), updatedAt: new Date() })
                .where(eq(systemSettings.id, existing.id));
            } else {
              await db
                .insert(systemSettings)
                .values({ key, value: String(value), category: "fx_rate", updatedAt: new Date() });
            }
            updates.push(key);
          }
        }

        // Update config
        if (config) {
          for (const [key, data] of Object.entries(config)) {
            const value = typeof data === 'object' ? data.value : data;
            const [existing] = await db
              .select()
              .from(systemSettings)
              .where(and(
                eq(systemSettings.key, key),
                eq(systemSettings.category, "fx_rate")
              ));

            if (existing) {
              await db
                .update(systemSettings)
                .set({ value: String(value), updatedAt: new Date() })
                .where(eq(systemSettings.id, existing.id));
            }
            updates.push(key);
          }
        }

        return fastify.ok(reply, {
          updated: updates,
          message: `Updated ${updates.length} FX rate settings`
        });
      } catch (error) {
        console.error("FX rate update error:", error);
        return fastify.error(reply, "Failed to update FX rates");
      }
    }
  );

  // POST /admin/fx-rate/refresh - Force refresh rates from external API
  fastify.post(
    "/refresh",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      // Simulate rate refresh
      const mockRates = {
        USD: 1550 + Math.floor(Math.random() * 50 - 25),
        EUR: 1680 + Math.floor(Math.random() * 50 - 25),
        GBP: 1950 + Math.floor(Math.random() * 50 - 25),
      };

      return fastify.ok(reply, {
        rates: mockRates,
        updatedAt: new Date().toISOString(),
        source: "mock_api"
      });
    }
  );
}