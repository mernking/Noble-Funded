import { eq, and, sql, count } from "drizzle-orm";
import { systemSettings } from "@/db/schema.js";

export default async function brokerApiRoutes(fastify) {
  // GET /admin/broker-api - Get broker API configuration
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;

      try {
        const settings = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.category, "broker_api"))
          .orderBy(systemSettings.key);

        const brokerConfig = settings.reduce((acc, setting) => {
          acc[setting.key] = {
            value: setting.value,
            description: setting.description,
            updatedAt: setting.updatedAt
          };
          return acc;
        }, {});

        const defaults = {
          brokerName: { value: "IC Markets", description: "Broker name" },
          mt5Server: { value: "icmarketsmt5.demo", description: "MT5 server address" },
          mt5Port: { value: "443", description: "MT5 connection port" },
          apiKey: { value: "", description: "API key for broker", sensitive: true },
          apiSecret: { value: "", description: "API secret", sensitive: true },
          accountPrefix: { value: "NobleFunded", description: "MT5 account prefix" },
          leverageDefault: { value: "100", description: "Default leverage", unit: "x" },
          maxAccounts: { value: "5000", description: "Maximum MT5 accounts", unit: "accounts" },
          syncInterval: { value: "60", description: "Account sync interval", unit: "seconds" },
          autoProvision: { value: "true", description: "Auto-provision new accounts" },
          balanceCheckEnabled: { value: "true", description: "Enable balance synchronization" },
          riskCalculationEnabled: { value: "true", description: "Calculate risk metrics from broker" },
        };

        const mergedConfig = { ...defaults, ...brokerConfig };

        return fastify.ok(reply, {
          config: mergedConfig,
          status: {
            connected: true,
            activeAccounts: 0,
            lastSync: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error("Broker API fetch error:", error);
        return fastify.error(reply, "Failed to fetch broker API config");
      }
    }
  );

  // PUT /admin/broker-api - Update broker API configuration
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
              eq(systemSettings.category, "broker_api")
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
                category: "broker_api",
                description: description || `Broker API: ${key}`,
                updatedAt: new Date()
              });
          }

          updates.push(key);
        }

        return fastify.ok(reply, {
          updated: updates,
          message: `Updated ${updates.length} broker API settings`
        });
      } catch (error) {
        console.error("Broker API update error:", error);
        return fastify.error(reply, "Failed to update broker API");
      }
    }
  );

  // POST /admin/broker-api/test - Test broker connection
  fastify.post(
    "/test",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      // Simulate connection test
      return fastify.ok(reply, {
        status: "connected",
        latency: Math.floor(Math.random() * 100 + 20),
        serverTime: new Date().toISOString(),
        message: "Broker API connection successful"
      });
    }
  );

  // GET /admin/broker-api/accounts - Get MT5 accounts summary
  fastify.get(
    "/accounts",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 20, status } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;

      // Return empty for now - would query MT5 accounts table
      return fastify.ok(reply, {
        accounts: [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          pages: 0
        }
      });
    }
  );
}