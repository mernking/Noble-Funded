import { desc, eq, and, sql, count } from "drizzle-orm";
import { challenges, users, transactions, payouts } from "@/db/schema.js";

export default async function advancedReportsRoutes(fastify) {
  // GET /admin/reports/advanced - Get advanced reports data
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance", "marketing")] },
    async (request, reply) => {
      const db = fastify.db;
      const { type = "overview", period = "30d", startDate, endDate } = request.query;

      try {
        const periodDays = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
        const startDateObj = startDate ? new Date(startDate) : new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
        const endDateObj = endDate ? new Date(endDate) : new Date();

        // Revenue breakdown by period
        const revenueByPeriod = await db
          .select({
            date: sql`DATE(${transactions.createdAt})`,
            amount: sql`SUM(${transactions.amount})`,
          })
          .from(transactions)
          .where(and(
            eq(transactions.status, "completed"),
            sql`${transactions.createdAt} >= ${startDateObj}`,
            sql`${transactions.createdAt} <= ${endDateObj}`
          ))
          .groupBy(sql`DATE(${transactions.createdAt})`)
          .orderBy(sql`DATE(${transactions.createdAt})`);

        // Challenge success rates by plan
        const successByPlan = await db
          .select({
            accountType: challenges.accountType,
            startingBalance: challenges.startingBalance,
            total: count(),
            passed: sql`SUM(CASE WHEN ${challenges.status} = 'passed' THEN 1 ELSE 0 END)`,
            failed: sql`SUM(CASE WHEN ${challenges.status} = 'failed' THEN 1 ELSE 0 END)`,
          })
          .from(challenges)
          .groupBy(challenges.accountType, challenges.startingBalance);

        // Payout analysis
        const payoutAnalysis = await db
          .select({
            status: payouts.status,
            count: count(),
            total: sql`SUM(${payouts.amount})`,
          })
          .from(payouts)
          .groupBy(payouts.status);

        // User acquisition
        const userAcquisition = await db
          .select({
            date: sql`DATE(${users.createdAt})`,
            count: count(),
          })
          .from(users)
          .where(sql`${users.createdAt} >= ${startDateObj}`)
          .groupBy(sql`DATE(${users.createdAt})`)
          .orderBy(sql`DATE(${users.createdAt})`);

        return fastify.ok(reply, {
          reportType: type,
          period: { start: startDateObj, end: endDateObj },
          revenue: {
            total: revenueByPeriod.reduce((sum, r) => sum + Number(r.amount), 0),
            byPeriod: revenueByPeriod.map(r => ({ date: r.date, amount: Number(r.amount) })),
          },
          challenges: {
            byPlan: successByPlan.map(p => ({
              plan: p.accountType === "naira" ? `₦${p.startingBalance}` : `$${p.startingBalance}`,
              total: Number(p.total),
              passed: Number(p.passed),
              failed: Number(p.failed),
              successRate: p.total ? Math.round((Number(p.passed) / Number(p.total)) * 100) : 0,
            })),
          },
          payouts: {
            byStatus: payoutAnalysis.reduce((acc, p) => {
              acc[p.status] = { count: Number(p.count), total: Number(p.total) };
              return acc;
            }, {}),
          },
          users: {
            total: userAcquisition.reduce((sum, u) => sum + Number(u.count), 0),
            byDate: userAcquisition.map(u => ({ date: u.date, count: Number(u.count) })),
          },
          generatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Advanced reports fetch error:", error);
        return fastify.error(reply, "Failed to fetch advanced reports");
      }
    }
  );

  // POST /admin/reports/advanced/export - Export report data
  fastify.post(
    "/export",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const { format = "csv", reportType } = request.body;

      // In production, this would generate and return the file
      return fastify.ok(reply, {
        format,
        reportType,
        downloadUrl: `/api/dev/admin/reports/download/${Date.now()}`,
        message: `Report exported as ${format.toUpperCase()}`
      });
    }
  );
}