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
  // GET /api/admin/revenue
  fastify.get(
    "/health",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      return fastify.ok(reply, {
        health: "ok health still in check",
        status: "201",
      });
    },
  );
}
