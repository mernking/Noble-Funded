import { desc, eq, and, sql, count } from "drizzle-orm";
import { promoCodes, users } from "@/db/schema.js";

export default async function promoCodesRoutes(fastify) {
  // GET /admin/promo-codes - Get all promo codes
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "marketing")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 50, status, type } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;

      try {
        const conditions = [];
        if (status) conditions.push(eq(promoCodes.isActive, status === "active"));
        if (type) conditions.push(eq(promoCodes.discountType, type));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const codes = await db
          .select()
          .from(promoCodes)
          .where(whereClause)
          .orderBy(desc(promoCodes.createdAt))
          .limit(limitNum)
          .offset((pageNum - 1) * limitNum);

        const [totalResult] = await db
          .select({ count: count() })
          .from(promoCodes)
          .where(whereClause);

        // Get stats
        const [activeCodes] = await db
          .select({ count: count() })
          .from(promoCodes)
          .where(eq(promoCodes.isActive, true));

        const [totalUses] = await db
          .select({ uses: sql`COALESCE(SUM(${promoCodes.usageCount}), 0)` })
          .from(promoCodes);

        return fastify.ok(reply, {
          promoCodes: codes.map(code => ({
            id: code.id,
            code: code.code,
            description: code.description,
            discountType: code.discountType,
            discountValue: code.discountValue,
            minPurchase: code.minPurchase,
            maxUses: code.maxUses,
            usageCount: code.usageCount,
            validFrom: code.validFrom,
            validUntil: code.validUntil,
            isActive: code.isActive,
            createdAt: code.createdAt
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalResult.count,
            pages: Math.ceil(totalResult.count / limitNum)
          },
          stats: {
            activeCodes: activeCodes.count,
            totalUses: Number(totalUses.uses) || 0
          }
        });
      } catch (error) {
        console.error("Promo codes fetch error:", error);
        return fastify.error(reply, "Failed to fetch promo codes");
      }
    }
  );

  // GET /admin/promo-codes/:id - Get single promo code
  fastify.get(
    "/:id",
    { preHandler: [fastify.requireRole("super_admin", "marketing")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      try {
        const [code] = await db
          .select()
          .from(promoCodes)
          .where(eq(promoCodes.id, id));

        if (!code) {
          return fastify.notFound(reply, "Promo code not found");
        }

        return fastify.ok(reply, { promoCode: code });
      } catch (error) {
        console.error("Promo code fetch error:", error);
        return fastify.error(reply, "Failed to fetch promo code");
      }
    }
  );

  // POST /admin/promo-codes - Create promo code
  fastify.post(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { code, description, discountType, discountValue, minPurchase, maxUses, validFrom, validUntil } = request.body;

      if (!code || !discountType || !discountValue) {
        return fastify.badRequest(reply, "Code, discount type and value are required");
      }

      try {
        // Check if code already exists
        const [existing] = await db
          .select()
          .from(promoCodes)
          .where(eq(promoCodes.code, code.toUpperCase()));

        if (existing) {
          return fastify.badRequest(reply, "Promo code already exists");
        }

        const [newCode] = await db
          .insert(promoCodes)
          .values({
            code: code.toUpperCase(),
            description,
            discountType,
            discountValue: Number(discountValue),
            minPurchase: minPurchase ? Number(minPurchase) : null,
            maxUses: maxUses ? Number(maxUses) : null,
            validFrom: validFrom ? new Date(validFrom) : null,
            validUntil: validUntil ? new Date(validUntil) : null,
            isActive: true,
            usageCount: 0
          })
          .returning();

        return fastify.ok(reply, {
          promoCode: newCode,
          message: "Promo code created successfully"
        });
      } catch (error) {
        console.error("Promo code create error:", error);
        return fastify.error(reply, "Failed to create promo code");
      }
    }
  );

  // PUT /admin/promo-codes/:id - Update promo code
  fastify.put(
    "/:id",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      const { description, discountType, discountValue, minPurchase, maxUses, validFrom, validUntil, isActive } = request.body;

      try {
        await db
          .update(promoCodes)
          .set({
            ...(description && { description }),
            ...(discountType && { discountType }),
            ...(discountValue && { discountValue: Number(discountValue) }),
            ...(minPurchase !== undefined && { minPurchase: minPurchase ? Number(minPurchase) : null }),
            ...(maxUses !== undefined && { maxUses: maxUses ? Number(maxUses) : null }),
            ...(validFrom && { validFrom: new Date(validFrom) }),
            ...(validUntil && { validUntil: new Date(validUntil) }),
            ...(isActive !== undefined && { isActive })
          })
          .where(eq(promoCodes.id, id));

        return fastify.ok(reply, { message: "Promo code updated successfully" });
      } catch (error) {
        console.error("Promo code update error:", error);
        return fastify.error(reply, "Failed to update promo code");
      }
    }
  );

  // DELETE /admin/promo-codes/:id - Delete promo code
  fastify.delete(
    "/:id",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      try {
        await db
          .delete(promoCodes)
          .where(eq(promoCodes.id, id));

        return fastify.ok(reply, { message: "Promo code deleted successfully" });
      } catch (error) {
        console.error("Promo code delete error:", error);
        return fastify.error(reply, "Failed to delete promo code");
      }
    }
  );
}