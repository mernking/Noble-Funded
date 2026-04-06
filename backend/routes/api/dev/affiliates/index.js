import { eq, desc, and, sql, count } from "drizzle-orm";
import { affiliates, affiliateReferrals, users, challenges, transactions } from "@/db/schema.js";

export default async function affiliatesRoutes(fastify) {
  // GET /api/affiliates/me - Get current user's affiliate data
  fastify.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const userId = request.user.id;

      try {
        // Get user's affiliate profile
        const [affiliate] = await db
          .select()
          .from(affiliates)
          .where(eq(affiliates.userId, userId))
          .limit(1);

        if (!affiliate) {
          // Return null - user hasn't enrolled in affiliate program
          return fastify.ok(reply, null);
        }

        // Get referral counts
        const [totalResult] = await db
          .select({ count: count() })
          .from(affiliateReferrals)
          .where(eq(affiliateReferrals.affiliateId, affiliate.id));

        const [activeResult] = await db
          .select({ count: count() })
          .from(affiliateReferrals)
          .where(and(
            eq(affiliateReferrals.affiliateId, affiliate.id),
            eq(affiliateReferrals.commissionStatus, "paid")
          ));

        // Get earned amounts
        const earnings = await db
          .select({ total: sql`SUM(${affiliateReferrals.commissionAmount})` })
          .from(affiliateReferrals)
          .where(eq(affiliateReferrals.affiliateId, affiliate.id));

        return fastify.ok(reply, {
          id: affiliate.id,
          referralCode: affiliate.referralCode,
          referralLink: `https://noblefunded.com/register?ref=${affiliate.referralCode}`,
          totalReferrals: totalResult.count,
          activeReferrals: activeResult.count,
          totalEarned: Number(earnings[0]?.total || 0),
          pendingPayout: Number(affiliate.pendingPayout),
          conversionRate: affiliate.conversionRate,
          status: affiliate.status,
          createdAt: affiliate.createdAt,
        });
      } catch (error) {
        console.error("Affiliate fetch error:", error);
        return fastify.error(reply, "Failed to fetch affiliate data");
      }
    }
  );

  // GET /api/affiliates/me/referrals - Get user's referrals
  fastify.get(
    "/me/referrals",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const userId = request.user.id;

      try {
        // Get user's affiliate profile
        const [affiliate] = await db
          .select()
          .from(affiliates)
          .where(eq(affiliates.userId, userId))
          .limit(1);

        if (!affiliate) {
          return fastify.ok(reply, []);
        }

        // Get referrals with user details
        const referralList = await db
          .select({
            id: affiliateReferrals.id,
            referredUserId: affiliateReferrals.referredUserId,
            referralDate: affiliateReferrals.referralDate,
            commissionAmount: affiliateReferrals.commissionAmount,
            commissionStatus: affiliateReferrals.commissionStatus,
            // User details
            fullName: users.fullName,
            email: users.email,
            // Check if they bought a challenge
            hasChallenge: sql`CASE WHEN ${challenges.id} IS NOT NULL THEN true ELSE false END`,
          })
          .from(affiliateReferrals)
          .leftJoin(users, eq(affiliateReferrals.referredUserId, users.id))
          .leftJoin(challenges, eq(challenges.userId, affiliateReferrals.referredUserId))
          .where(eq(affiliateReferrals.affiliateId, affiliate.id))
          .orderBy(desc(affiliateReferrals.referralDate));

        const formatted = referralList.map(r => ({
          id: r.id,
          name: r.fullName || r.email?.split('@')[0] || "Unknown",
          email: r.email,
          joinedAt: r.referralDate,
          status: r.commissionStatus === "paid" ? "converted" : 
                  r.commissionStatus === "pending" ? "pending" : "cancelled",
          commission: Number(r.commissionAmount),
          currency: "NGN", // Default
        }));

        return fastify.ok(reply, formatted);
      } catch (error) {
        console.error("Referrals fetch error:", error);
        return fastify.error(reply, "Failed to fetch referrals");
      }
    }
  );

  // GET /api/affiliates/me/stats - Get affiliate stats
  fastify.get(
    "/me/stats",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const userId = request.user.id;

      try {
        const [affiliate] = await db
          .select()
          .from(affiliates)
          .where(eq(affiliates.userId, userId))
          .limit(1);

        if (!affiliate) {
          return fastify.ok(reply, {
            totalReferrals: 0,
            activeReferrals: 0,
            totalEarned: 0,
            pendingPayout: 0,
            conversionRate: 0,
          });
        }

        // Get various stats
        const [totalResult] = await db
          .select({ count: count() })
          .from(affiliateReferrals)
          .where(eq(affiliateReferrals.affiliateId, affiliate.id));

        const [paidResult] = await db
          .select({ total: sql`SUM(${affiliateReferrals.commissionAmount})` })
          .from(affiliateReferrals)
          .where(and(
            eq(affiliateReferrals.affiliateId, affiliate.id),
            eq(affiliateReferrals.commissionStatus, "paid")
          ));

        const conversionRate = totalResult.count > 0 
          ? Math.round((affiliate.activeReferrals / totalResult.count) * 100)
          : 0;

        return fastify.ok(reply, {
          totalReferrals: totalResult.count,
          activeReferrals: affiliate.activeReferrals,
          totalEarned: Number(paidResult?.total || 0),
          pendingPayout: Number(affiliate.pendingPayout),
          conversionRate,
        });
      } catch (error) {
        console.error("Affiliate stats error:", error);
        return fastify.error(reply, "Failed to fetch stats");
      }
    }
  );

  // POST /api/affiliates/me/code - Generate/regenerate referral code
  fastify.post(
    "/me/code",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const userId = request.user.id;

      try {
        // Check if user already has affiliate profile
        let [affiliate] = await db
          .select()
          .from(affiliates)
          .where(eq(affiliates.userId, userId))
          .limit(1);

        if (!affiliate) {
          // Create new affiliate profile
          const referralCode = `NF${Date.now().toString(36).toUpperCase()}`;
          const [newAffiliate] = await db
            .insert(affiliates)
            .values({
              userId,
              referralCode,
              status: "active",
            })
            .returning();
          
          return fastify.ok(reply, {
            referralCode: newAffiliate.referralCode,
            referralLink: `https://noblefunded.com/register?ref=${newAffiliate.referralCode}`,
          });
        }

        // Generate new code
        const newCode = `NF${Date.now().toString(36).toUpperCase()}`;
        await db
          .update(affiliates)
          .set({ referralCode: newCode, updatedAt: new Date() })
          .where(eq(affiliates.id, affiliate.id));

        return fastify.ok(reply, {
          referralCode: newCode,
          referralLink: `https://noblefunded.com/register?ref=${newCode}`,
        });
      } catch (error) {
        console.error("Generate code error:", error);
        return fastify.error(reply, "Failed to generate code");
      }
    }
  );

  // POST /api/affiliates/me/enroll - Enroll in affiliate program
  fastify.post(
    "/me/enroll",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const userId = request.user.id;

      try {
        // Check if already enrolled
        const [existing] = await db
          .select()
          .from(affiliates)
          .where(eq(affiliates.userId, userId))
          .limit(1);

        if (existing) {
          return fastify.ok(reply, { 
            message: "Already enrolled",
            affiliateId: existing.id,
          });
        }

        // Create affiliate profile
        const referralCode = `NF${Date.now().toString(36).toUpperCase()}`;
        const [newAffiliate] = await db
          .insert(affiliates)
          .values({
            userId,
            referralCode,
            status: "active",
          })
          .returning();

        return fastify.ok(reply, {
          message: "Successfully enrolled in affiliate program",
          affiliateId: newAffiliate.id,
          referralCode: newAffiliate.referralCode,
        });
      } catch (error) {
        console.error("Enroll error:", error);
        return fastify.error(reply, "Failed to enroll in affiliate program");
      }
    }
  );
}