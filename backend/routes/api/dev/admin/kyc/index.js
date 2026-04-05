import { desc, eq, and, sql, count } from "drizzle-orm";
import { users } from "@/db/schema.js";

export default async function kycRoutes(fastify) {
  // GET /api/admin/kyc - List all KYC records (users with kycStatus)
  fastify.get(
    "/",
    {
      preHandler: [fastify.requireRole("super_admin", "compliance", "support")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 20, search = "", status = "" } = request.query;

      let conditions = [];

      // Filter users with KYC submissions (not pending initial state)
      conditions.push(sql`${users.kycStatus} IS NOT NULL`);

      // Add search filter
      if (search) {
        conditions.push(
          sql`(LOWER(${users.fullName}) LIKE ${`%${search.toLowerCase()}%`} OR LOWER(${users.email}) LIKE ${`%${search.toLowerCase()}%`})`
        );
      }

      // Add status filter
      if (status && status !== "all") {
        conditions.push(eq(users.kycStatus, status));
      }

      // Get users with KYC data
      const list = await db
        .select({
          id: users.id,
          name: users.fullName,
          email: users.email,
          country: users.country,
          kycStatus: users.kycStatus,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(and(...conditions))
        .orderBy(desc(users.updatedAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      // Get totals
      const totals = await db
        .select({
          total: count(),
          pending: sql`CAST(COUNT(CASE WHEN ${users.kycStatus} = 'pending' THEN 1 END) AS INTEGER)`,
          approved: sql`CAST(COUNT(CASE WHEN ${users.kycStatus} = 'verified' THEN 1 END) AS INTEGER)`,
          rejected: sql`CAST(COUNT(CASE WHEN ${users.kycStatus} = 'rejected' THEN 1 END) AS INTEGER)`,
        })
        .from(users)
        .where(sql`${users.kycStatus} IS NOT NULL`);

      // Map to KYC format
      const mapped = list.map(u => ({
        id: `KYC-${u.id.slice(0, 8)}`,
        userId: u.id,
        name: u.name,
        email: u.email,
        country: u.country || "Unknown",
        doc: "Identity Document", // Default - would need additional KYC table for specifics
        submitted: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: mapKycStatus(u.kycStatus),
        risk: "low", // Default - would need risk calculation
        docNote: null,
      }));

      return fastify.ok(reply, {
        records: mapped,
        totals: {
          pending: totals[0]?.pending || 0,
          approved: totals[0]?.approved || 0,
          rejected: totals[0]?.rejected || 0,
        },
        page: Number(page),
        limit: Number(limit),
      });
    },
  );

  // POST /api/admin/kyc/:id/approve - Approve KYC
  fastify.post(
    "/:id/approve",
    {
      preHandler: [fastify.requireRole("super_admin", "compliance")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      
      // Extract user ID from KYC- prefix
      const userId = id.startsWith("KYC-") ? id.replace("KYC-", "") : id;

      await db
        .update(users)
        .set({ kycStatus: "verified", updatedAt: new Date() })
        .where(eq(users.id, userId));

      return fastify.ok(reply, { message: "KYC approved successfully" });
    },
  );

  // POST /api/admin/kyc/:id/reject - Reject KYC
  fastify.post(
    "/:id/reject",
    {
      preHandler: [fastify.requireRole("super_admin", "compliance")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      const { reason } = request.body;
      
      // Extract user ID from KYC- prefix
      const userId = id.startsWith("KYC-") ? id.replace("KYC-", "") : id;

      await db
        .update(users)
        .set({ 
          kycStatus: "rejected", 
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId));

      return fastify.ok(reply, { message: reason ? `KYC rejected: ${reason}` : "KYC rejected successfully" });
    },
  );
}

// Helper to map database kycStatus to view format
function mapKycStatus(dbStatus) {
  switch (dbStatus) {
    case "verified":
      return "approved";
    case "rejected":
      return "rejected";
    case "pending":
    default:
      return "pending";
  }
}