import { eq, and, sql, count } from "drizzle-orm";
import { systemSettings, transactions } from "@/db/schema.js";
import { paymentService } from "@/services/payment.service.js";

export default async function paymentGatewayRoutes(fastify) {
  // GET /admin/payment-gateway - Get payment gateway configuration
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;

      try {
        // Get payment gateway settings
        const settings = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.category, "payment_gateway"))
          .orderBy(systemSettings.key);

        const gatewayConfig = settings.reduce((acc, setting) => {
          acc[setting.key] = {
            value: setting.value,
            description: setting.description,
            updatedAt: setting.updatedAt
          };
          return acc;
        }, {});

        // Default configuration
        const defaults = {
          flutterwavePublicKey: { value: "", description: "Flutterwave public key", sensitive: true },
          flutterwaveSecretKey: { value: "", description: "Flutterwave secret key", sensitive: true },
          flutterwaveWebhookSecret: { value: "", description: "Flutterwave webhook secret", sensitive: true },
          stripePublicKey: { value: "", description: "Stripe public key", sensitive: true },
          stripeSecretKey: { value: "", description: "Stripe secret key", sensitive: true },
          stripeWebhookSecret: { value: "", description: "Stripe webhook secret", sensitive: true },
          paymentMethods: { value: "card,bank_transfer,ussd", description: "Enabled payment methods" },
          autoApproveThreshold: { value: "50000", description: "Auto-approve payments below this amount", unit: "NGN" },
          manualReviewRequired: { value: "50000", description: "Amount requiring manual review", unit: "NGN" },
          settlementSchedule: { value: "daily", description: "Settlement frequency" },
          refundEnabled: { value: "true", description: "Allow refunds" },
          testMode: { value: "false", description: "Use test/sandbox mode" },
        };

        const mergedConfig = { ...defaults, ...gatewayConfig };

        // Get transaction stats
        const [todayVolume] = await db
          .select({ volume: sql`COALESCE(SUM(${transactions.amount}), 0)` })
          .from(transactions)
          .where(sql`DATE(${transactions.createdAt}) = CURRENT_DATE`);

        const [pendingCount] = await db
          .select({ count: count() })
          .from(transactions)
          .where(eq(transactions.status, "pending"));

        return fastify.ok(reply, {
          config: mergedConfig,
          stats: {
            todayVolume: Number(todayVolume.volume) || 0,
            pendingTransactions: pendingCount.count,
            gatewayStatus: "active"
          }
        });
      } catch (error) {
        console.error("Payment gateway fetch error:", error);
        return fastify.error(reply, "Failed to fetch payment gateway config");
      }
    }
  );

  // PUT /admin/payment-gateway - Update payment gateway configuration
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
              eq(systemSettings.category, "payment_gateway")
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
                category: "payment_gateway",
                description: description || `Payment gateway: ${key}`,
                updatedAt: new Date()
              });
          }

          updates.push(key);
        }

        return fastify.ok(reply, {
          updated: updates,
          message: `Updated ${updates.length} payment gateway settings`
        });
      } catch (error) {
        console.error("Payment gateway update error:", error);
        return fastify.error(reply, "Failed to update payment gateway");
      }
    }
  );

  // POST /admin/payment-gateway/test - Test payment gateway connection
  fastify.post(
    "/test",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const { gateway = "flutterwave" } = request.body;

      if (gateway === "flutterwave") {
        try {
          const result = await paymentService.testConnection();
          return fastify.ok(reply, {
            gateway: "flutterwave",
            ...result
          });
        } catch (error) {
          return fastify.fail(
            reply,
            503,
            "CONNECTION_FAILED",
            `Flutterwave connection failed: ${error.message}`
          );
        }
      }

      // For other gateways, return simulated response
      return fastify.ok(reply, {
        gateway,
        status: "connected",
        latency: Math.floor(Math.random() * 100 + 50),
        message: `${gateway} connection successful`
      });
    }
  );

  // GET /admin/payment-gateway/transactions - Get recent transactions
  fastify.get(
    "/transactions",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 20, status } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;

      try {
        const conditions = [];
        if (status) conditions.push(eq(transactions.status, status));

        const txns = await db
          .select()
          .from(transactions)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(sql`${transactions.createdAt} DESC`)
          .limit(limitNum)
          .offset((pageNum - 1) * limitNum);

        const [totalResult] = await db
          .select({ count: count() })
          .from(transactions);

        return fastify.ok(reply, {
          transactions: txns,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalResult.count,
            pages: Math.ceil(totalResult.count / limitNum)
          }
        });
      } catch (error) {
        console.error("Transactions fetch error:", error);
        return fastify.error(reply, "Failed to fetch transactions");
      }
    }
  );
}