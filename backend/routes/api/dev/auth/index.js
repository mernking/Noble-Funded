import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { users } from "@/db/schema.js";
import { emailService } from "@/services/email.service.js";

export default async function authRoutes(fastify) {
  // Helper to get user from local DB
  const getUserByEmail = async (email) => {
    const [user] = await fastify.db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));
    return user;
  };

  // Helper to create or update user in local DB from Supabase data
  const syncUserFromSupabase = async (supabaseUser) => {
    const existingUser = await getUserByEmail(supabaseUser.email);
    
    if (existingUser) {
      // Update last login
      await fastify.db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, existingUser.id));
      return existingUser;
    }
    
    // Create new user in local DB
    const [newUser] = await fastify.db
      .insert(users)
      .values({
        fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
        email: supabaseUser.email.toLowerCase(),
        passwordHash: '', // OAuth users don't have password hash
        phone: supabaseUser.user_metadata?.phone || null,
        role: 'trader',
        emailVerified: supabaseUser.email_confirmed_at ? true : false,
      })
      .returning();
    
    return newUser;
  };

  // Helper to generate JWT token
  const generateToken = (user) => {
    return fastify.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: "7d" },
    );
  };

  // POST /api/auth/register - Register with email/password (also creates Supabase user)
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

    // Check if Supabase is available
    if (fastify.supabase) {
      try {
        // Register user in Supabase
        const { data: supabaseUser, error: sbError } = await fastify.supabase.auth.signUp({
          email: email.toLowerCase(),
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone || '',
            },
          },
        });

        if (sbError) {
          fastify.log.error("Supabase signup error:", sbError);
          // Fall back to local auth
        } else if (supabaseUser.user) {
          // Also create in local DB
          const [existing] = await fastify.db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()));

          if (!existing) {
            const passwordHash = await bcrypt.hash(password, 12);
            const [user] = await fastify.db
              .insert(users)
              .values({
                fullName,
                email: email.toLowerCase(),
                passwordHash,
                phone,
                role: "trader",
              })
              .returning();

            // Send welcome email
            emailService.sendWelcomeEmail(user.email, user.fullName).catch(err => fastify.log.error(err));

            const token = generateToken(user);
            return fastify.ok(reply, { user, token, supabaseSession: supabaseUser.session }, 201);
          }
        }
      } catch (err) {
        fastify.log.error("Supabase error, falling back to local auth:", err);
      }
    }

    // Local auth fallback (original logic)
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
      .returning();

    const token = generateToken(user);

    // Send welcome email asynchronously
    emailService.sendWelcomeEmail(user.email, user.fullName).catch(err => fastify.log.error(err));

    return fastify.ok(reply, { user, token }, 201);
  });

  // POST /api/auth/login - Login with email/password
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

    // Try Supabase first if available
    if (fastify.supabase) {
      try {
        const { data: sbData, error: sbError } = await fastify.supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password,
        });

        if (!sbError && sbData.user) {
          // Sync with local DB
          const localUser = await syncUserFromSupabase(sbData.user);
          
          if (localUser.status === "banned") {
            return fastify.fail(
              reply,
              403,
              "FORBIDDEN",
              "Your account has been suspended. Please contact support.",
            );
          }

          const token = generateToken(localUser);
          return fastify.ok(reply, { 
            user: localUser, 
            token,
            supabaseSession: sbData.session,
          });
        }
      } catch (err) {
        fastify.log.error("Supabase login error, falling back to local:", err);
      }
    }

    // Local auth fallback
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (!user) {
      return fastify.fail(reply, 401, "INVALID_CREDENTIALS");
    }

    if (user.passwordHash && user.passwordHash.length > 0) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return fastify.fail(reply, 401, "INVALID_CREDENTIALS");
      }
    } else {
      // User registered via OAuth without local password
      return fastify.fail(
        reply,
        401,
        "INVALID_CREDENTIALS",
        "Please use Google to sign in or reset your password.",
      );
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

    const token = generateToken(user);

    return fastify.ok(reply, { user, token });
  });

  // GET /api/auth/google - Initiate Google OAuth
  fastify.get("/google", async (request, reply) => {
    if (!fastify.supabase) {
      return fastify.fail(
        reply,
        500,
        "OAUTH_NOT_AVAILABLE",
        "Google sign-in is not configured.",
      );
    }

    try {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      
      const { data, error } = await fastify.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/dev/auth/google/callback`,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        fastify.log.error("Google OAuth error:", error);
        return fastify.fail(reply, 500, "OAUTH_ERROR", error.message);
      }

      return fastify.ok(reply, { url: data.url });
    } catch (err) {
      fastify.log.error("Google OAuth error:", err);
      return fastify.fail(reply, 500, "OAUTH_ERROR", "Failed to initiate Google sign-in.");
    }
  });

  // GET /api/auth/google/callback - Google OAuth callback
  fastify.get("/google/callback", async (request, reply) => {
    const { code, error, error_description } = request.query || {};

    if (error) {
      fastify.log.error("Google OAuth callback error:", error, error_description);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return reply.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error_description || error)}`);
    }

    if (!code) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return reply.redirect(`${frontendUrl}/login?error=No authorization code received`);
    }

    try {
      if (!fastify.supabase) {
        throw new Error("Supabase not available");
      }

      const { data, error: sbError } = await fastify.supabase.auth.exchangeCodeForSession(code);

      if (sbError || !data.user) {
        fastify.log.error("Supabase session exchange error:", sbError);
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return reply.redirect(`${frontendUrl}/login?error=${encodeURIComponent(sbError?.message || "Authentication failed")}`);
      }

      // Sync user to local DB
      const localUser = await syncUserFromSupabase(data.user);
      
      if (localUser.status === "banned") {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return reply.redirect(`${frontendUrl}/login?error=Account suspended`);
      }

      // Generate JWT token for our app
      const token = generateToken(localUser);
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return reply.redirect(`${frontendUrl}/auth/callback?token=${token}&userId=${localUser.id}`);
      
    } catch (err) {
      fastify.log.error("Google callback error:", err);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return reply.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message)}`);
    }
  });

  // POST /api/auth/logout
  fastify.post(
    "/logout",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      // Sign out from Supabase if available
      if (fastify.supabase) {
        try {
          await fastify.supabase.auth.signOut();
        } catch (err) {
          fastify.log.error("Supabase signout error:", err);
        }
      }
      
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
      
      // Save token to local DB
      await db
        .update(users)
        .set({ resetToken, resetTokenExpiry })
        .where(eq(users.id, user.id));

      // Send reset email
      emailService
        .sendPasswordResetEmail(user.email, user.fullName, resetToken)
        .catch((err) => fastify.log.error(err));
        
      fastify.log.info(`Password reset token for ${email}: ${resetToken}`);
    }

    return fastify.ok(reply, {
      message: "If that email is registered, a password reset link has been sent.",
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

    // Update in Supabase if user has OAuth linked
    if (fastify.supabase) {
      try {
        await fastify.supabase.auth.updateUser({ password });
      } catch (err) {
        fastify.log.warn("Could not update Supabase password:", err);
      }
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

  // POST /api/auth/refresh-token - Refresh JWT token
  fastify.post("/refresh-token", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      await request.jwtVerify();
      const { id, email, role } = request.user;
      const newToken = generateToken({ id, email, role });
      return fastify.ok(reply, { token: newToken });
    } catch (err) {
      return fastify.fail(reply, 401, "AUTH_REQUIRED", "Invalid or expired token.");
    }
  });

  // GET /api/auth/me - Get current user
  fastify.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, request.user.id));

      if (!user) {
        return fastify.fail(reply, 404, "NOT_FOUND", "User not found.");
      }

      const { passwordHash, resetToken, resetTokenExpiry, ...safeUser } = user;
      return fastify.ok(reply, safeUser);
    },
  );
}
