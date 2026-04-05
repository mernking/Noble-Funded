import { desc, eq, and, sql, count } from "drizzle-orm";
import { challenges, users } from "@/db/schema.js";

export default async function certificatesRoutes(fastify) {
  // GET /admin/certificates - Get all certificates (passed challenges)
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin", "compliance", "marketing")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 50, status, search } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;

      try {
        // Get passed challenges as certificates
        const conditions = [eq(challenges.status, "passed")];
        
        if (search) {
          conditions.push(sql`(LOWER(${users.firstName}) LIKE LOWER('%${search}%') OR LOWER(${users.lastName}) LIKE LOWER('%${search}%') OR LOWER(${users.email}) LIKE LOWER('%${search}%'))`);
        }

        const certificates = await db
          .select({
            id: challenges.id,
            certificateNumber: challenges.certificateNumber,
            accountSize: challenges.startingBalance,
            accountType: challenges.accountType,
            profitTarget: challenges.profitTarget,
            maxDrawdown: challenges.maxDrawdownPct,
            passedDate: challenges.passedAt,
            createdAt: challenges.createdAt,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          })
          .from(challenges)
          .leftJoin(users, eq(challenges.userId, users.id))
          .where(and(...conditions))
          .orderBy(desc(challenges.passedAt))
          .limit(limitNum)
          .offset((pageNum - 1) * limitNum);

        // Get total count
        const [totalResult] = await db
          .select({ count: count() })
          .from(challenges)
          .where(and(...conditions));

        // Get stats
        const [totalCertificates] = await db
          .select({ count: count() })
          .from(challenges)
          .where(eq(challenges.status, "passed"));

        const [thisMonth] = await db
          .select({ count: count() })
          .from(challenges)
          .where(and(
            eq(challenges.status, "passed"),
            sql`DATE_TRUNC('month', ${challenges.passedAt}) = DATE_TRUNC('month', NOW())`
          ));

        return fastify.ok(reply, {
          certificates: certificates.map(cert => ({
            id: cert.id,
            certificateNumber: cert.certificateNumber || `CERT-${cert.id.toString().padStart(6, '0')}`,
            trader: {
              name: cert.firstName && cert.lastName ? `${cert.firstName} ${cert.lastName}` : cert.email,
              email: cert.email
            },
            accountSize: cert.accountType === "naira" 
              ? `₦${Number(cert.accountSize).toLocaleString()}`
              : `$${Number(cert.accountSize).toLocaleString()}`,
            profitTarget: `${cert.profitTarget}%`,
            maxDrawdown: `${cert.maxDrawdown}%`,
            issuedDate: cert.passedDate || cert.createdAt,
            status: "issued"
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalResult.count,
            pages: Math.ceil(totalResult.count / limitNum)
          },
          stats: {
            totalCertificates: totalCertificates.count,
            thisMonth: thisMonth.count
          }
        });
      } catch (error) {
        console.error("Certificates fetch error:", error);
        return fastify.error(reply, "Failed to fetch certificates");
      }
    }
  );

  // GET /admin/certificates/:id - Get certificate details
  fastify.get(
    "/:id",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      try {
        const [certificate] = await db
          .select({
            id: challenges.id,
            certificateNumber: challenges.certificateNumber,
            accountSize: challenges.startingBalance,
            accountType: challenges.accountType,
            profitTarget: challenges.profitTarget,
            maxDrawdown: challenges.maxDrawdownPct,
            totalProfitPct: challenges.totalProfitPct,
            tradingDays: challenges.tradingDays,
            passedDate: challenges.passedAt,
            createdAt: challenges.createdAt,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            phone: users.phone,
          })
          .from(challenges)
          .leftJoin(users, eq(challenges.userId, users.id))
          .where(eq(challenges.id, id));

        if (!certificate) {
          return fastify.notFound(reply, "Certificate not found");
        }

        return fastify.ok(reply, {
          certificate: {
            id: certificate.id,
            certificateNumber: certificate.certificateNumber || `CERT-${certificate.id.toString().padStart(6, '0')}`,
            trader: {
              name: certificate.firstName && certificate.lastName ? `${certificate.firstName} ${certificate.lastName}` : certificate.email,
              email: certificate.email,
              phone: certificate.phone
            },
            challenge: {
              accountSize: certificate.accountType === "naira" 
                ? `₦${Number(certificate.accountSize).toLocaleString()}`
                : `$${Number(certificate.accountSize).toLocaleString()}`,
              profitTarget: `${certificate.profitTarget}%`,
              maxDrawdown: `${certificate.maxDrawdown}%`,
              achievedProfit: `${certificate.totalProfitPct}%`,
              tradingDays: certificate.tradingDays
            },
            issuedDate: certificate.passedDate || certificate.createdAt,
            status: "issued"
          }
        });
      } catch (error) {
        console.error("Certificate fetch error:", error);
        return fastify.error(reply, "Failed to fetch certificate");
      }
    }
  );

  // POST /admin/certificates/:id/regenerate - Regenerate certificate number
  fastify.post(
    "/:id/regenerate",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      try {
        const newCertNumber = `CERT-${Date.now().toString(36).toUpperCase()}`;
        
        await db
          .update(challenges)
          .set({ certificateNumber: newCertNumber })
          .where(eq(challenges.id, id));

        return fastify.ok(reply, {
          certificateNumber: newCertNumber,
          message: "Certificate regenerated successfully"
        });
      } catch (error) {
        console.error("Certificate regenerate error:", error);
        return fastify.error(reply, "Failed to regenerate certificate");
      }
    }
  );
}