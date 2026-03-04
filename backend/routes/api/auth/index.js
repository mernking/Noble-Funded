import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { users } from "@/db/schema.js";
import { emailService } from "@/services/email.service.js";

export default async function authRoutes(fastify) {
  // POST /api/auth/register
  fastify.post("/register", async (request, reply) => {
    const { fullName, email, password, phone } = request.body || {};

    if (!fullName || !email || !password) {
      return fastify.fail(
        reply,
        422,
        "VALIDATION_ERROR",
        "Full name, email, and password are required.",
      );
    }
    if (password.length < 8) {
      return fastify.fail(
        reply,
        422,
        "VALIDATION_ERROR",
        "Password must be at least 8 characters long.",
      );
    }

    const db = fastify.db;
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));
    if (existing) {
      return fastify.fail(reply, 409, "DUPLICATE_EMAIL");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(users)
      .values({
        fullName,
        email: email.toLowerCase(),
        passwordHash,
        phone,
        role: "trader",
      })
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
      });

    const token = fastify.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: "15m" },
    );

    // Send welcome email asynchronously
    emailService
      .sendWelcomeEmail(user.email, user.fullName)
      .catch((err) => fastify.log.error(err));

    return fastify.ok(reply, { user, token }, 201);
  });

  // POST /api/auth/login
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body || {};

    if (!email || !password) {
      return fastify.fail(
        reply,
        422,
        "VALIDATION_ERROR",
        "Email and password are required.",
      );
    }

    const db = fastify.db;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (!user) {
      return fastify.fail(reply, 401, "INVALID_CREDENTIALS");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return fastify.fail(reply, 401, "INVALID_CREDENTIALS");
    }

    if (user.status === "banned") {
      return fastify.fail(
        reply,
        403,
        "FORBIDDEN",
        "Your account has been suspended. Please contact support.",
      );
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    const token = fastify.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: "7d" },
    );

    const { passwordHash, resetToken, resetTokenExpiry, ...safeUser } = user;

    return fastify.ok(reply, { user: safeUser, token });
  });

  // POST /api/auth/logout
  fastify.post(
    "/logout",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      reply.clearCookie("refreshToken");
      return fastify.ok(reply, { message: "Logged out successfully." });
    },
  );

  // POST /api/auth/forgot-password
  fastify.post("/forgot-password", async (request, reply) => {
    const { email } = request.body || {};
    if (!email) {
      return fastify.fail(reply, 422, "VALIDATION_ERROR", "Email is required.");
    }

    const db = fastify.db;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    // Always return success to prevent email enumeration
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await db
        .update(users)
        .set({ resetToken, resetTokenExpiry })
        .where(eq(users.id, user.id));

      emailService
        .sendPasswordResetEmail(user.email, user.fullName, resetToken)
        .catch((err) => fastify.log.error(err));
      fastify.log.info(`Password reset token for ${email}: ${resetToken}`);
    }

    return fastify.ok(reply, {
      message:
        "If that email is registered, a password reset link has been sent.",
    });
  });

  // POST /api/auth/reset-password/:token
  fastify.post("/reset-password/:token", async (request, reply) => {
    const { token } = request.params;
    const { password } = request.body || {};

    if (!password || password.length < 8) {
      return fastify.fail(
        reply,
        422,
        "VALIDATION_ERROR",
        "Password must be at least 8 characters long.",
      );
    }

    const db = fastify.db;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetToken, token));

    if (!user || !user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return fastify.fail(
        reply,
        400,
        "VALIDATION_ERROR",
        "Password reset link is invalid or has expired.",
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db
      .update(users)
      .set({ passwordHash, resetToken: null, resetTokenExpiry: null })
      .where(eq(users.id, user.id));

    return fastify.ok(reply, {
      message: "Password has been reset successfully. You can now log in.",
    });
  });
}
