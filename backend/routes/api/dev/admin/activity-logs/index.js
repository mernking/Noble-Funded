import { desc, eq, and, sql, count } from "drizzle-orm";
import { activityLogs, users } from "@/db/schema.js";

export default async function activityLogsRoutes(fastify) {
  // GET /admin/activity-logs - Get all activity logs
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance", "support")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 50, type, userId, startDate, endDate } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;

      try {
        // Build where conditions
        const conditions = [];
        if (type) conditions.push(eq(activityLogs.actionType, type));
        if (userId) conditions.push(eq(activityLogs.userId, userId));
        if (startDate) conditions.push(sql`${activityLogs.createdAt} >= ${new Date(startDate)}`);
        if (endDate) conditions.push(sql`${activityLogs.createdAt} <= ${new Date(endDate)}`);

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Get paginated logs with user info
        const logs = await db
          .select({
            id: activityLogs.id,
            action: activityLogs.action,
            actionType: activityLogs.actionType,
            description: activityLogs.description,
            metadata: activityLogs.metadata,
            ipAddress: activityLogs.ipAddress,
            userAgent: activityLogs.userAgent,
            createdAt: activityLogs.createdAt,
            userId: activityLogs.userId,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          })
          .from(activityLogs)
          .leftJoin(users, eq(activityLogs.userId, users.id))
          .where(whereClause)
          .orderBy(desc(activityLogs.createdAt))
          .limit(limitNum)
          .offset((pageNum - 1) * limitNum);

        // Get total count
        const [totalResult] = await db
          .select({ count: count() })
          .from(activityLogs)
          .where(whereClause);

        // Get unique action types for filter
        const actionTypes = await db
          .selectDistinct({ actionType: activityLogs.actionType })
          .from(activityLogs);

        return fastify.ok(reply, {
          logs: logs.map(log => ({
            id: log.id,
            action: log.action,
            actionType: log.actionType,
            description: log.description,
            metadata: log.metadata,
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            createdAt: log.createdAt,
            user: log.userId ? {
              id: log.userId,
              name: log.firstName && log.lastName ? `${log.firstName} ${log.lastName}` : log.email,
              email: log.email
            } : null
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalResult.count,
            pages: Math.ceil(totalResult.count / limitNum)
          },
          filters: {
            actionTypes: actionTypes.map(t => t.actionType).filter(Boolean)
          }
        });
      } catch (error) {
        console.error("Activity logs fetch error:", error);
        return fastify.error(reply, "Failed to fetch activity logs");
      }
    }
  );

  // GET /admin/activity-logs/stats - Get activity log statistics
  fastify.get(
    "/stats",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { days = 7 } = request.query;

      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get counts by action type
        const actionTypeCounts = await db
          .select({
            actionType: activityLogs.actionType,
            count: sql`COUNT(*)::int`
          })
          .from(activityLogs)
          .where(sql`${activityLogs.createdAt} >= ${startDate}`)
          .groupBy(activityLogs.actionType);

        // Get total count for the period
        const [totalResult] = await db
          .select({ count: count() })
          .from(activityLogs)
          .where(sql`${activityLogs.createdAt} >= ${startDate}`);

        // Get today's activity
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [todayResult] = await db
          .select({ count: count() })
          .from(activityLogs)
          .where(sql`${activityLogs.createdAt} >= ${today}`);

        return fastify.ok(reply, {
          totalEvents: totalResult.count,
          todayEvents: todayResult.count,
          byType: actionTypeCounts.reduce((acc, item) => {
            acc[item.actionType || 'unknown'] = item.count;
            return acc;
          }, {})
        });
      } catch (error) {
        console.error("Activity logs stats error:", error);
        return fastify.error(reply, "Failed to fetch stats");
      }
    }
  );

  // DELETE /admin/activity-logs - Delete old logs (cleanup)
  fastify.delete(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { olderThanDays = 90 } = request.body;

      try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(olderThanDays));

        const result = await db
          .delete(activityLogs)
          .where(sql`${activityLogs.createdAt} < ${cutoffDate}`);

        return fastify.ok(reply, {
          deleted: result.rowCount || 0,
          message: `Deleted logs older than ${olderThanDays} days`
        });
      } catch (error) {
        console.error("Activity logs delete error:", error);
        return fastify.error(reply, "Failed to delete old logs");
      }
    }
  );
}