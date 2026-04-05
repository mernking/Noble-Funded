import { desc, eq, and, sql, count } from "drizzle-orm";
import {
  affiliates,
  affiliateReferrals,
  users,
} from "@/db/schema.js";

export default async function affiliatesRoutes(fastify) {
  // GET /api/admin/affiliates - List all affiliates
  fastify.get(
    "/",
    {
      preHandler: [fastify.requireRole("super_admin", "marketing", "support")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 20, search = "", status = "" } = request.query;

      let conditions = [];

      // Add search filter
      if (search) {
        conditions.push(
          sql`(LOWER(${affiliates.referralCode}) LIKE ${`%${search.toLowerCase()}%`}) OR LOWER(${users.fullName}) LIKE ${`%${search.toLowerCase()}%`} OR LOWER(${users.email}) LIKE ${`%${search.toLowerCase()}%`}`
        );
      }

      // Add status filter
      if (status) {
        conditions.push(eq(affiliates.status, status));
      }

      // Get affiliates with user info
      const list = await db
        .select({
          id: affiliates.id,
          userId: affiliates.userId,
          referralCode: affiliates.referralCode,
          totalReferrals: affiliates.totalReferrals,
          activeReferrals: affiliates.activeReferrals,
          totalEarned: affiliates.totalEarned,
          pendingPayout: affiliates.pendingPayout,
          conversionRate: affiliates.conversionRate,
          status: affiliates.status,
          createdAt: affiliates.createdAt,
          fullName: users.fullName,
          email: users.email,
        })
        .from(affiliates)
        .leftJoin(users, eq(affiliates.userId, users.id))
        .where(and(...conditions))
        .orderBy(desc(affiliates.createdAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      // Get totals
      const totals = await db
        .select({
          total: count(),
          active: sql`CAST(COUNT(CASE WHEN ${affiliates.status} = 'active' THEN 1 END) AS INTEGER)`,
          pending: sql`CAST(COUNT(CASE WHEN ${affiliates.status} = 'pending' THEN 1 END) AS INTEGER)`,
          suspended: sql`CAST(COUNT(CASE WHEN ${affiliates.status} = 'suspended' THEN 1 END) AS INTEGER)`,
        })
        .from(affiliates);

      return fastify.ok(reply, {
        affiliates: list,
        totals: {
          total: totals[0]?.total || 0,
          active: totals[0]?.active || 0,
          pending: totals[0]?.pending || 0,
          suspended: totals[0]?.suspended || 0,
        },
        page: Number(page),
        limit: Number(limit),
      });
    },
  );

  // GET /api/admin/affiliates/:id - Get single affiliate
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.requireRole("super_admin", "marketing", "support")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      const affiliate = await db
        .select({
          id: affiliates.id,
          userId: affiliates.userId,
          referralCode: affiliates.referralCode,
          totalReferrals: affiliates.totalReferrals,
          activeReferrals: affiliates.activeReferrals,
          totalEarned: affiliates.totalEarned,
          pendingPayout: affiliates.pendingPayout,
          conversionRate: affiliates.conversionRate,
          status: affiliates.status,
          createdAt: affiliates.createdAt,
          fullName: users.fullName,
          email: users.email,
        })
        .from(affiliates)
        .leftJoin(users, eq(affiliates.userId, users.id))
        .where(eq(affiliates.id, id))
        .limit(1);

      if (!affiliate.length) {
        return fastify.notFound(reply, { message: "Affiliate not found" });
      }

      // Get referrals
      const referrals = await db
        .select({
          id: affiliateReferrals.id,
          referredUserId: affiliateReferrals.referredUserId,
          referralDate: affiliateReferrals.referralDate,
          commissionAmount: affiliateReferrals.commissionAmount,
          commissionStatus: affiliateReferrals.commissionStatus,
          fullName: users.fullName,
          email: users.email,
        })
        .from(affiliateReferrals)
        .leftJoin(users, eq(affiliateReferrals.referredUserId, users.id))
        .where(eq(affiliateReferrals.affiliateId, id))
        .orderBy(desc(affiliateReferrals.referralDate));

      return fastify.ok(reply, {
        affiliate: affiliate[0],
        referrals,
      });
    },
  );

  // POST /api/admin/affiliates - Create affiliate (or upgrade user to affiliate)
  fastify.post(
    "/",
    {
      preHandler: [fastify.requireRole("super_admin", "marketing")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { userId, referralCode } = request.body;

      if (!userId || !referralCode) {
        return fastify.badRequest(reply, { message: "userId and referralCode are required" });
      }

      // Check if user exists
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user.length) {
        return fastify.notFound(reply, { message: "User not found" });
      }

      // Check if referral code already exists
      const existingCode = await db
        .select()
        .from(affiliates)
        .where(eq(affiliates.referralCode, referralCode))
        .limit(1);

      if (existingCode.length) {
        return fastify.badRequest(reply, { message: "Referral code already exists" });
      }

      // Create affiliate
      const [newAffiliate] = await db
        .insert(affiliates)
        .values({
          userId,
          referralCode,
          status: "active",
          totalReferrals: 0,
          activeReferrals: 0,
          totalEarned: "0",
          pendingPayout: "0",
          conversionRate: 0,
        })
        .returning();

      return fastify.ok(reply, {
        message: "Affiliate created successfully",
        affiliate: newAffiliate,
      });
    },
  );

  // PUT /api/admin/affiliates/:id - Update affiliate
  fastify.put(
    "/:id",
    {
      preHandler: [fastify.requireRole("super_admin", "marketing")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      const { status, referralCode } = request.body;

      const updateData = {
        updatedAt: new Date(),
      };

      if (status) updateData.status = status;
      if (referralCode) updateData.referralCode = referralCode;

      await db
        .update(affiliates)
        .set(updateData)
        .where(eq(affiliates.id, id));

      return fastify.ok(reply, { message: "Affiliate updated successfully" });
    },
  );

  // POST /api/admin/affiliates/:id/approve - Approve pending affiliate
  fastify.post(
    "/:id/approve",
    {
      preHandler: [fastify.requireRole("super_admin", "marketing")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      await db
        .update(affiliates)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(affiliates.id, id));

      return fastify.ok(reply, { message: "Affiliate approved successfully" });
    },
  );

  // POST /api/admin/affiliates/:id/suspend - Suspend affiliate
  fastify.post(
    "/:id/suspend",
    {
      preHandler: [fastify.requireRole("super_admin", "marketing")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      await db
        .update(affiliates)
        .set({ status: "suspended", updatedAt: new Date() })
        .where(eq(affiliates.id, id));

      return fastify.ok(reply, { message: "Affiliate suspended successfully" });
    },
  );

  // POST /api/admin/affiliates/:id/activate - Reactivate suspended affiliate
  fastify.post(
    "/:id/activate",
    {
      preHandler: [fastify.requireRole("super_admin", "marketing")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      await db
        .update(affiliates)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(affiliates.id, id));

      return fastify.ok(reply, { message: "Affiliate activated successfully" });
    },
  );

  // DELETE /api/admin/affiliates/:id - Delete affiliate
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.requireRole("super_admin")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      await db
        .delete(affiliates)
        .where(eq(affiliates.id, id));

      return fastify.ok(reply, { message: "Affiliate deleted successfully" });
    },
  );
}