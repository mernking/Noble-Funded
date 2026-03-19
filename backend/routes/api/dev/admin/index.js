import { desc, eq, and, sql, count } from "drizzle-orm";
import {
  users,
  challenges,
  transactions,
  payouts,
  activityLogs,
  teamMembers,
} from "@/db/schema.js";

export default async function adminRoutes(fastify) {
  // GET /api/admin/dashboard/stats
  fastify.get(
    "/dashboard/stats",
    {
      preHandler: [
        fastify.requireRole("super_admin", "compliance", "marketing"),
      ],
    },
    async (request, reply) => {
      const db = fastify.db;

      const [totalUsers] = await db
        .select({ count: count() })
        .from(users)
        .where(eq(users.role, "trader"));
      const [activeChalls] = await db
        .select({ count: count() })
        .from(challenges)
        .where(eq(challenges.status, "active"));
      const [passedChalls] = await db
        .select({ count: count() })
        .from(challenges)
        .where(eq(challenges.status, "passed"));
      const [failedChalls] = await db
        .select({ count: count() })
        .from(challenges)
        .where(eq(challenges.status, "failed"));
      const [pendingPayoutsResult] = await db
        .select({ count: count() })
        .from(payouts)
        .where(eq(payouts.status, "pending"));
      const [revenue] = await db
        .select({ total: sql`COALESCE(SUM(${transactions.amount}), 0)` })
        .from(transactions)
        .where(eq(transactions.status, "completed"));

      return fastify.ok(reply, {
        totalUsers: totalUsers.count,
        activeChallenges: activeChalls.count,
        passedChallenges: passedChalls.count,
        failedChallenges: failedChalls.count,
        pendingPayouts: pendingPayoutsResult.count,
        totalRevenue: revenue.total,
      });
    },
  );

  // GET /api/admin/users - Only show traders
  fastify.get(
    "/users",
    {
      preHandler: [fastify.requireRole("super_admin", "compliance", "support")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 20, search = "", status = "" } = request.query;

      // Build conditions - always filter by role = trader
      let conditions = [eq(users.role, "trader")];

      // Add status filter if provided
      if (status) {
        conditions.push(eq(users.status, status));
      }

      const list = await db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          phone: users.phone,
          role: users.role,
          status: users.status,
          kycStatus: users.kycStatus,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(and(...conditions))
        .orderBy(desc(users.createdAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      return fastify.ok(reply, {
        users: list,
        page: Number(page),
        limit: Number(limit),
      });
    },
  );

  // GET /api/admin/challenges
  fastify.get(
    "/challenges",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const db = fastify.db;
      const { status, page = 1, limit = 20 } = request.query;
      const conditions = status ? [eq(challenges.status, status)] : undefined;

      const list = await db
        .select()
        .from(challenges)
        .where(conditions ? and(...conditions) : undefined)
        .orderBy(desc(challenges.createdAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      return fastify.ok(reply, {
        challenges: list,
        page: Number(page),
        limit: Number(limit),
      });
    },
  );

  // GET /api/admin/revenue
  fastify.get(
    "/revenue",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const revenueSummary = await db
        .select({
          currency: transactions.currency,
          total: sql`COALESCE(SUM(${transactions.amount}), 0)`,
          count: count(),
        })
        .from(transactions)
        .where(eq(transactions.status, "completed"))
        .groupBy(transactions.currency);

      const pendingPayoutsSum = await db
        .select({ total: sql`COALESCE(SUM(${payouts.amount}), 0)` })
        .from(payouts)
        .where(eq(payouts.status, "pending"));

      return fastify.ok(reply, {
        revenue: revenueSummary,
        pendingPayouts: pendingPayoutsSum[0]?.total || 0,
      });
    },
  );

  // GET /api/admin/activity-log
  fastify.get(
    "/activity-log",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 50 } = request.query;
      const logs = await db
        .select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.createdAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      return fastify.ok(reply, logs);
    },
  );

  // POST /api/admin/team/add - Create new admin team member
  fastify.post(
    "/team/add",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const { fullName, email, role, password } = request.body || {};

      if (!fullName || !email || !role || !password) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "Full name, email, role, and password are required.",
        );
      }

      // Validate role
      const validRoles = ["compliance", "support", "marketing", "developer"];
      if (!validRoles.includes(role)) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "Invalid role. Must be compliance, support, marketing, or developer.",
        );
      }

      const db = fastify.db;

      // Check if email already exists
      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()));

      if (existing) {
        return fastify.fail(
          reply,
          409,
          "DUPLICATE_EMAIL",
          "A user with this email already exists.",
        );
      }

      // Hash password
      const bcrypt = await import("bcryptjs");
      const passwordHash = await bcrypt.hash(password, 12);

      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          fullName,
          email: email.toLowerCase(),
          passwordHash,
          role,
          status: "active",
          emailVerified: false,
          provider: "email",
        })
        .returning();

      // Log activity
      await db.insert(activityLogs).values({
        userId: request.user.id,
        action: "team_member_added",
        resourceType: "user",
        resourceId: newUser.id,
        details: { newUserEmail: email, newUserRole: role },
        ipAddress: request.ip,
      });

      // Send welcome email with credentials
      const emailService = await import("@/services/email.service.js");
      emailService
        .sendAdminInviteEmail(email, fullName, password, role)
        .catch((err) => fastify.log.error("Failed to send invite email:", err));

      return fastify.ok(
        reply,
        {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          status: newUser.status,
          createdAt: newUser.createdAt,
          message:
            "Team member added successfully. Login credentials have been sent to their email.",
        },
        201,
      );
    },
  );

  // GET /api/admin/team - Get all admin team members (non-traders)
  fastify.get(
    "/team",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      // Get users with admin roles (not traders)
      const members = await db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          role: users.role,
          status: users.status,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(sql`${users.role} != 'trader'`)
        .orderBy(desc(users.createdAt));
      return fastify.ok(reply, members);
    },
  );

  // DELETE /api/admin/team/:id - Remove team member (change role back to trader)
  fastify.delete(
    "/team/:id",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const userId = request.params.id;

      // Get user to check role
      const [user] = await db.select().from(users).where(eq(users.id, userId));

      if (!user) {
        return fastify.fail(reply, 404, "NOT_FOUND", "Team member not found.");
      }

      if (user.role === "super_admin") {
        return fastify.fail(
          reply,
          403,
          "FORBIDDEN",
          "Cannot remove super admin.",
        );
      }

      // Update user role to trader
      await db
        .update(users)
        .set({ role: "trader", updatedAt: new Date() })
        .where(eq(users.id, userId));

      // Log activity
      await db.insert(activityLogs).values({
        userId: request.user.id,
        action: "team_member_removed",
        resourceType: "user",
        resourceId: userId,
        details: { removedUserEmail: user.email, previousRole: user.role },
        ipAddress: request.ip,
      });

      return fastify.ok(reply, { message: "Team member removed." });
    },
  );
}
