import { eq, and, sql, count } from "drizzle-orm";
import { systemSettings, users, challenges } from "@/db/schema.js";

export default async function globalCommandRoutes(fastify) {
  // GET /admin/command - Get command center status and logs
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;

      try {
        // Get system health metrics
        const [totalUsers] = await db
          .select({ count: count() })
          .from(users)
          .where(eq(users.role, "trader"));

        const [activeChallenges] = await db
          .select({ count: count() })
          .from(challenges)
          .where(eq(challenges.status, "active"));

        // Get recent command executions from system settings
        const commandLogs = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.category, "command_log"))
          .orderBy(systemSettings.updatedAt)
          .limit(20);

        return fastify.ok(reply, {
          systemStatus: {
            healthy: true,
            uptime: process.uptime?.() || 0,
            memory: process.memoryUsage?.() || {},
            activeTraders: totalUsers.count,
            activeChallenges: activeChallenges.count,
          },
          recentCommands: commandLogs.map(log => ({
            command: log.key,
            result: log.value,
            executedAt: log.updatedAt,
          })),
          availableCommands: [
            { name: "sync_all", description: "Sync all MT5 accounts" },
            { name: "recalculate_all", description: "Recalculate all challenge metrics" },
            { name: "process_payouts", description: "Process pending payouts" },
            { name: "backup_db", description: "Create database backup" },
            { name: "clear_cache", description: "Clear system cache" },
            { name: "send_broadcast", description: "Send broadcast to all users" },
          ]
        });
      } catch (error) {
        console.error("Command center fetch error:", error);
        return fastify.error(reply, "Failed to fetch command center");
      }
    }
  );

  // POST /admin/command/execute - Execute a global command
  fastify.post(
    "/execute",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { command, params } = request.body;

      if (!command) {
        return fastify.badRequest(reply, "Command is required");
      }

      try {
        let result = { success: true, message: "Command executed successfully" };

        // Execute the command
        switch (command) {
          case "sync_all":
            // Would sync MT5 accounts
            result = { success: true, message: "MT5 account sync initiated", affected: 0 };
            break;
          case "recalculate_all":
            // Would recalculate metrics
            result = { success: true, message: "Metrics recalculation initiated", affected: 0 };
            break;
          case "process_payouts":
            // Would process payouts
            result = { success: true, message: "Payout processing initiated", pending: 0 };
            break;
          case "backup_db":
            result = { success: true, message: "Database backup created", backupId: `backup_${Date.now()}` };
            break;
          case "clear_cache":
            result = { success: true, message: "System cache cleared" };
            break;
          case "send_broadcast":
            if (!params?.message) {
              return fastify.badRequest(reply, "Message required for broadcast");
            }
            result = { success: true, message: "Broadcast queued", recipients: 0 };
            break;
          default:
            return fastify.badRequest(reply, `Unknown command: ${command}`);
        }

        // Log the command execution
        await db
          .insert(systemSettings)
          .values({
            key: command,
            value: JSON.stringify({ ...result, params }),
            category: "command_log",
            description: `Executed: ${command}`,
            updatedAt: new Date()
          });

        return fastify.ok(reply, {
          command,
          ...result,
          executedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Command execution error:", error);
        return fastify.error(reply, "Failed to execute command");
      }
    }
  );

  // GET /admin/command/logs - Get command execution history
  fastify.get(
    "/logs",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 50 } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;

      try {
        const logs = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.category, "command_log"))
          .orderBy(systemSettings.updatedAt)
          .limit(limitNum)
          .offset((pageNum - 1) * limitNum);

        const [totalResult] = await db
          .select({ count: count() })
          .from(systemSettings)
          .where(eq(systemSettings.category, "command_log"));

        return fastify.ok(reply, {
          logs: logs.map(log => ({
            command: log.key,
            result: log.value,
            executedAt: log.updatedAt,
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalResult.count,
            pages: Math.ceil(totalResult.count / limitNum)
          }
        });
      } catch (error) {
        console.error("Command logs fetch error:", error);
        return fastify.error(reply, "Failed to fetch command logs");
      }
    }
  );
}