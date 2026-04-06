import { desc, eq, and, sql, count } from "drizzle-orm";
import { challenges, users, payouts } from "@/db/schema.js";

export default async function certificatesRoutes(fastify) {
  // GET /api/certificates - Get current user's certificates
  fastify.get(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const userId = request.user.id;
      const { type } = request.query; // 'naira' | 'dollar' | 'payout'

      try {
        // Get passed challenges as certificates
        const challengeConditions = [
          eq(challenges.userId, userId),
          eq(challenges.status, "passed"),
        ];

        if (type === "naira") {
          challengeConditions.push(eq(challenges.accountType, "naira"));
        } else if (type === "dollar") {
          challengeConditions.push(eq(challenges.accountType, "dollar"));
        }

        const passedChallenges = await db
          .select({
            id: challenges.id,
            accountType: challenges.accountType,
            startingBalance: challenges.startingBalance,
            profitTarget: challenges.profitTarget,
            totalProfitPct: challenges.totalProfitPct,
            passedAt: challenges.passedAt,
            createdAt: challenges.createdAt,
            phase: challenges.phase,
          })
          .from(challenges)
          .where(and(...challengeConditions))
          .orderBy(desc(challenges.passedAt));

        // Get paid payouts as certificates
        const paidPayouts = await db
          .select({
            id: payouts.id,
            amount: payouts.amount,
            currency: payouts.currency,
            payoutMethod: payouts.payoutMethod,
            paidAt: payouts.paidAt,
            accountNumber: payouts.accountNumber,
          })
          .from(payouts)
          .where(and(
            eq(payouts.userId, userId),
            eq(payouts.status, "paid")
          ))
          .orderBy(desc(payouts.paidAt));

        // Build certificates array
        const certificates = [];

        // Add challenge pass certificates
        for (const challenge of passedChallenges) {
          certificates.push({
            id: challenge.id,
            type: "pass",
            title: challenge.phase === 1 
              ? `Challenge Phase 1 Certificate - ₦${Number(challenge.startingBalance).toLocaleString()}`
              : challenge.phase === 2
              ? `Challenge Phase 2 Certificate - ₦${Number(challenge.startingBalance).toLocaleString()}`
              : `Challenge Certificate - ₦${Number(challenge.startingBalance).toLocaleString()}`,
            accountNumber: `NF-${challenge.accountType.toUpperCase()}-${(Number(challenge.startingBalance) / 1000).toFixed(0)}K`,
            accountType: challenge.accountType,
            currency: challenge.accountType === "naira" ? "NGN" : "USD",
            date: challenge.passedAt || challenge.createdAt,
            details: `Successfully passed Phase ${challenge.phase || 1} evaluation with ${challenge.totalProfitPct}% profit`,
            phase: `Phase ${challenge.phase || 1}`,
          });
        }

        // Add payout certificates
        for (const payout of paidPayouts) {
          certificates.push({
            id: `payout-${payout.id}`,
            type: "payout",
            title: "Payout Certificate",
            accountNumber: payout.accountNumber || "N/A",
            accountType: payout.currency === "NGN" ? "naira" : "dollar",
            currency: payout.currency,
            date: payout.paidAt,
            details: `Successfully received ${payout.currency === "NGN" ? "₦" : "$"}${Number(payout.amount).toLocaleString()} via ${payout.payoutMethod}`,
            amount: Number(payout.amount),
          });
        }

        // Filter by type if specified
        let filtered = certificates;
        if (type === "payout") {
          filtered = certificates.filter(c => c.type === "payout");
        } else if (type === "naira" || type === "dollar") {
          filtered = certificates.filter(c => c.type === "pass" && c.accountType === type);
        }

        // Calculate stats
        const nairaCerts = certificates.filter(c => c.accountType === "naira");
        const dollarCerts = certificates.filter(c => c.accountType === "dollar");
        const payoutCerts = certificates.filter(c => c.type === "payout");

        return fastify.ok(reply, {
          certificates: filtered,
          stats: {
            total: certificates.length,
            naira: nairaCerts.length,
            dollar: dollarCerts.length,
            payouts: payoutCerts.length,
          }
        });
      } catch (error) {
        console.error("Certificates fetch error:", error);
        return fastify.error(reply, "Failed to fetch certificates");
      }
    }
  );

  // GET /api/certificates/:id - Get single certificate
  fastify.get(
    "/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const userId = request.user.id;
      const { id } = request.params;

      try {
        // Check if it's a payout certificate
        if (id.startsWith("payout-")) {
          const payoutId = id.replace("payout-", "");
          const [payout] = await db
            .select()
            .from(payouts)
            .where(and(
              eq(payouts.id, payoutId),
              eq(payouts.userId, userId)
            ))
            .limit(1);

          if (!payout) {
            return fastify.notFound(reply, "Certificate not found");
          }

          return fastify.ok(reply, {
            id: `payout-${payout.id}`,
            type: "payout",
            title: "Payout Certificate",
            accountNumber: payout.accountNumber || "N/A",
            accountType: payout.currency === "NGN" ? "naira" : "dollar",
            currency: payout.currency,
            date: payout.paidAt,
            amount: Number(payout.amount),
            details: `Successfully received ${payout.currency === "NGN" ? "₦" : "$"}${Number(payout.amount).toLocaleString()} via ${payout.payoutMethod}`,
            status: "verified",
          });
        }

        // Otherwise it's a challenge certificate
        const [challenge] = await db
          .select({
            id: challenges.id,
            accountType: challenges.accountType,
            startingBalance: challenges.startingBalance,
            profitTarget: challenges.profitTarget,
            totalProfitPct: challenges.totalProfitPct,
            maxDrawdownPct: challenges.maxDrawdownPct,
            passedAt: challenges.passedAt,
            createdAt: challenges.createdAt,
            phase: challenges.phase,
            certificateNumber: challenges.certificateNumber,
          })
          .from(challenges)
          .where(and(
            eq(challenges.id, id),
            eq(challenges.userId, userId)
          ))
          .limit(1);

        if (!challenge) {
          return fastify.notFound(reply, "Certificate not found");
        }

        return fastify.ok(reply, {
          id: challenge.id,
          type: "pass",
          certificateNumber: challenge.certificateNumber || `CERT-${challenge.id.toString().padStart(6, '0')}`,
          title: `Challenge Phase ${challenge.phase || 1} Certificate`,
          accountNumber: `NF-${challenge.accountType.toUpperCase()}-${(Number(challenge.startingBalance) / 1000).toFixed(0)}K`,
          accountType: challenge.accountType,
          currency: challenge.accountType === "naira" ? "NGN" : "USD",
          date: challenge.passedAt || challenge.createdAt,
          details: `Successfully passed Phase ${challenge.phase || 1} evaluation with ${challenge.totalProfitPct}% profit target achieved`,
          phase: `Phase ${challenge.phase || 1}`,
          profitTarget: `${challenge.profitTarget}%`,
          maxDrawdown: `${challenge.maxDrawdownPct}%`,
          achievedProfit: `${challenge.totalProfitPct}%`,
          status: "verified",
        });
      } catch (error) {
        console.error("Certificate fetch error:", error);
        return fastify.error(reply, "Failed to fetch certificate");
      }
    }
  );
}