import bcrypt from "bcryptjs";
import { eq, desc, sql, and, or, ilike } from "drizzle-orm";
import { users, challenges, transactions } from "@/db/schema.js";

export default async function usersRoutes(fastify) {
  // GET /api/users/me
  fastify.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          phone: users.phone,
          country: users.country,
          role: users.role,
          status: users.status,
          emailVerified: users.emailVerified,
          kycStatus: users.kycStatus,
          createdAt: users.createdAt,
          lastLogin: users.lastLogin,
        })
        .from(users)
        .where(eq(users.id, request.user.id));

      if (!user)
        return fastify.fail(reply, 404, "NOT_FOUND", "User not found.");
      return fastify.ok(reply, user);
    },
  );

  // PUT /api/users/me
  fastify.put(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { fullName, phone, country } = request.body || {};
      const db = fastify.db;
      const [updated] = await db
        .update(users)
        .set({ fullName, phone, country, updatedAt: new Date() })
        .where(eq(users.id, request.user.id))
        .returning({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          phone: users.phone,
        });

      return fastify.ok(reply, updated);
    },
  );

  // PUT /api/users/me/password
  fastify.put(
    "/me/password",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { currentPassword, newPassword } = request.body || {};
      if (!currentPassword || !newPassword) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "Current password and new password are required.",
        );
      }
      if (newPassword.length < 8) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "New password must be at least 8 characters long.",
        );
      }

      const db = fastify.db;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, request.user.id));
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return fastify.fail(
          reply,
          401,
          "INVALID_CREDENTIALS",
          "Current password is incorrect.",
        );
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await db
        .update(users)
        .set({ passwordHash, updatedAt: new Date() })
        .where(eq(users.id, user.id));

      return fastify.ok(reply, { message: "Password changed successfully." });
    },
  );

  // GET /api/users — Admin: list all users
  fastify.get(
    "/",
    {
      preHandler: [fastify.requireRole("super_admin", "compliance", "support")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const { search, status, page = 1, limit = 20 } = request.query;

      const conditions = [];
      if (status) conditions.push(eq(users.status, status));
      if (search) {
        conditions.push(
          or(
            ilike(users.email, `%${search}%`),
            ilike(users.fullName, `%${search}%`),
          ),
        );
      }

      const list = await db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          phone: users.phone,
          role: users.role,
          status: users.status,
          emailVerified: users.emailVerified,
          kycStatus: users.kycStatus,
          createdAt: users.createdAt,
          lastLogin: users.lastLogin,
        })
        .from(users)
        .where(conditions.length ? and(...conditions) : undefined)
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

  // GET /api/users/:id — Admin
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.requireRole("super_admin", "compliance", "support")],
    },
    async (request, reply) => {
      const db = fastify.db;
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          phone: users.phone,
          role: users.role,
          status: users.status,
          emailVerified: users.emailVerified,
          kycStatus: users.kycStatus,
          createdAt: users.createdAt,
          lastLogin: users.lastLogin,
        })
        .from(users)
        .where(eq(users.id, request.params.id));

      if (!user)
        return fastify.fail(reply, 404, "NOT_FOUND", "User not found.");
      return fastify.ok(reply, user);
    },
  );

  // PUT /api/users/:id/ban — Admin: ban or unban
  fastify.put(
    "/:id/ban",
    { preHandler: [fastify.requireRole("super_admin", "compliance")] },
    async (request, reply) => {
      const { action } = request.body || {}; // 'ban' | 'unban'
      const db = fastify.db;
      const newStatus = action === "unban" ? "active" : "banned";
      const [updated] = await db
        .update(users)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(users.id, request.params.id))
        .returning({ id: users.id, email: users.email, status: users.status });

      if (!updated)
        return fastify.fail(reply, 404, "NOT_FOUND", "User not found.");
      const msg =
        newStatus === "banned"
          ? "User has been banned."
          : "User has been reinstated.";
      return fastify.ok(reply, { ...updated, message: msg });
    },
  );
}
