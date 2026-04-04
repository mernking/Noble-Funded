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
  // POST /api/admin/team/add - Create new admin team member
  fastify.post(
    "/add",
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
      const emailService = await import("../../../services/email.service.js");
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
    "",
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
    "/:id",
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
