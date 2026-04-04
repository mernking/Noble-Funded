import { desc, eq, and, sql } from "drizzle-orm";
import { supportTickets, ticketReplies, users } from "@/db/schema.js";

export default async function adminSupportRoutes(fastify) {
  // GET /api/admin/support/tickets
  fastify.get(
    "/tickets",
    { preHandler: [fastify.requireRole("super_admin", "compliance", "support")] },
    async (request, reply) => {
      const db = fastify.db;
      const { status, priority, page = 1, limit = 20 } = request.query;
      
      const conditions = [];
      if (status && status !== 'All') conditions.push(eq(supportTickets.status, status.toLowerCase()));
      if (priority && priority !== 'All') conditions.push(eq(supportTickets.priority, priority.toLowerCase()));

      const list = await db
        .select({
          id: supportTickets.id,
          subject: supportTickets.subject,
          status: supportTickets.status,
          priority: supportTickets.priority,
          createdAt: supportTickets.createdAt,
          userName: users.fullName,
          userEmail: users.email,
        })
        .from(supportTickets)
        .leftJoin(users, eq(supportTickets.userId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(supportTickets.createdAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      return fastify.ok(reply, {
        tickets: list,
        page: Number(page),
        limit: Number(limit),
      });
    },
  );

  // GET /api/admin/support/tickets/:id
  fastify.get(
    "/tickets/:id",
    { preHandler: [fastify.requireRole("super_admin", "compliance", "support")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      const [ticket] = await db
        .select({
          id: supportTickets.id,
          subject: supportTickets.subject,
          status: supportTickets.status,
          priority: supportTickets.priority,
          createdAt: supportTickets.createdAt,
          userName: users.fullName,
          userEmail: users.email,
        })
        .from(supportTickets)
        .leftJoin(users, eq(supportTickets.userId, users.id))
        .where(eq(supportTickets.id, id));

      if (!ticket) return fastify.fail(reply, 404, "NOT_FOUND", "Ticket not found.");

      const replies = await db
        .select({
          id: ticketReplies.id,
          message: ticketReplies.message,
          isInternal: ticketReplies.isInternal,
          createdAt: ticketReplies.createdAt,
          userName: users.fullName,
          userRole: users.role,
        })
        .from(ticketReplies)
        .leftJoin(users, eq(ticketReplies.userId, users.id))
        .where(eq(ticketReplies.ticketId, id))
        .orderBy(ticketReplies.createdAt);

      return fastify.ok(reply, { ...ticket, replies });
    },
  );

  // POST /api/admin/support/tickets/:id/reply
  fastify.post(
    "/tickets/:id/reply",
    { preHandler: [fastify.requireRole("super_admin", "compliance", "support")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      const { message, isInternal = false, status } = request.body || {};

      if (!message) return fastify.fail(reply, 422, "VALIDATION_ERROR", "Message is required.");

      const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id));
      if (!ticket) return fastify.fail(reply, 404, "NOT_FOUND", "Ticket not found.");

      await db.insert(ticketReplies).values({
        ticketId: id,
        userId: request.user.id,
        message,
        isInternal,
      });

      if (status) {
        await db.update(supportTickets).set({ status, updatedAt: new Date() }).where(eq(supportTickets.id, id));
      }

      return fastify.ok(reply, { message: "Reply added." });
    },
  );
}
