import fp from "fastify-plugin";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";

export default fp(
  async function (fastify) {
    // CORS
    fastify.register(cors, {
      origin: [
        process.env.FRONTEND_URL || "http://localhost:5173",
        process.env.ADMIN_URL || "http://localhost:5174",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    });

    // Cookies
    fastify.register(cookie, {
      secret: process.env.JWT_SECRET,
    });

    // JWT
    fastify.register(jwt, {
      secret: process.env.JWT_SECRET || "noble_funded_secret",
      cookie: {
        cookieName: "refreshToken",
        signed: false,
      },
    });

    // Auth decorator — verifies Bearer token
    fastify.decorate("authenticate", async function (request, reply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({
          success: false,
          error: {
            code: "AUTH_REQUIRED",
            message: "Please log in to continue.",
          },
        });
      }
    });

    // Role guard decorator
    fastify.decorate("requireRole", function (...roles) {
      return async (request, reply) => {
        try {
          await request.jwtVerify();
          if (!roles.includes(request.user.role)) {
            return reply.code(403).send({
              success: false,
              error: {
                code: "FORBIDDEN",
                message: "You do not have permission to perform this action.",
              },
            });
          }
        } catch (err) {
          return reply.code(401).send({
            success: false,
            error: {
              code: "AUTH_REQUIRED",
              message: "Please log in to continue.",
            },
          });
        }
      };
    });

    // ─── Response helpers ─────────────────────────────────────────────────────
    // fastify.ok(reply, data, status?) → { success: true, data }
    fastify.decorate("ok", function (reply, data, status = 200) {
      return reply.code(status).send({ success: true, data });
    });

    // fastify.fail(reply, status, code, message) → { success: false, error }
    fastify.decorate("fail", function (reply, status, code, message) {
      const MESSAGES = {
        FORBIDDEN: "You do not have permission to perform this action.",
        AUTH_REQUIRED: "Please log in to continue.",
        NOT_FOUND: "The requested resource was not found.",
        VALIDATION_ERROR: message || "Please check your input and try again.",
      };
      return reply.code(status).send({
        success: false,
        error: {
          code: code || "ERROR",
          message: message || MESSAGES[code] || "Something went wrong.",
        },
      });
    });
  },
  { name: "auth" },
);
