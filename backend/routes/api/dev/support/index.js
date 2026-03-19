import { eq, desc } from "drizzle-orm";
import { supportTickets, ticketReplies, users } from "@/db/schema.js";
import { emailService } from "@/services/email.service.js";

export default async function supportRoutes(fastify) {
  // POST /api/support/tickets
  fastify.post(
    "/tickets",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { subject, message } = request.body || {};
      if (!subject || !message) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "Subject and message are required.",
        );
      }

      const db = fastify.db;
      const [ticket] = await db
        .insert(supportTickets)
        .values({
          userId: request.user.id,
          subject,
          status: "open",
          priority: "medium",
        })
        .returning();

      await db
        .insert(ticketReplies)
        .values({ ticketId: ticket.id, userId: request.user.id, message });

      return fastify.ok(
        reply,
        {
          ...ticket,
          message:
            "Your support ticket has been submitted. We will respond within 24 hours.",
        },
        201,
      );
    },
  );

  // GET /api/support/tickets
  fastify.get(
    "/tickets",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const isAdmin = ["super_admin", "compliance", "support"].includes(
        request.user.role,
      );
      const tickets = isAdmin
        ? await db
            .select()
            .from(supportTickets)
            .orderBy(desc(supportTickets.createdAt))
        : await db
            .select()
            .from(supportTickets)
            .where(eq(supportTickets.userId, request.user.id))
            .orderBy(desc(supportTickets.createdAt));

      return fastify.ok(reply, tickets);
    },
  );

  // GET /api/support/tickets/:id
  fastify.get(
    "/tickets/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const db = fastify.db;
      const [ticket] = await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.id, request.params.id));
      if (!ticket)
        return fastify.fail(reply, 404, "NOT_FOUND", "Ticket not found.");

      const isAdmin = ["super_admin", "compliance", "support"].includes(
        request.user.role,
      );
      if (!isAdmin && ticket.userId !== request.user.id) {
        return fastify.fail(reply, 403, "FORBIDDEN");
      }

      const replies = await db
        .select()
        .from(ticketReplies)
        .where(eq(ticketReplies.ticketId, ticket.id))
        .orderBy(ticketReplies.createdAt);

      return fastify.ok(reply, { ...ticket, replies });
    },
  );

  // POST /api/support/tickets/:id/reply
  fastify.post(
    "/tickets/:id/reply",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { message, isInternal = false } = request.body || {};
      if (!message) {
        return fastify.fail(
          reply,
          422,
          "VALIDATION_ERROR",
          "Message is required.",
        );
      }

      const db = fastify.db;
      const [ticket] = await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.id, request.params.id));
      if (!ticket)
        return fastify.fail(reply, 404, "NOT_FOUND", "Ticket not found.");

      const isAdmin = ["super_admin", "compliance", "support"].includes(
        request.user.role,
      );
      if (!isAdmin && ticket.userId !== request.user.id) {
        return fastify.fail(reply, 403, "FORBIDDEN");
      }

      const [reply_] = await db
        .insert(ticketReplies)
        .values({
          ticketId: ticket.id,
          userId: request.user.id,
          message,
          isInternal: isAdmin && isInternal,
        })
        .returning();

      // Auto-set to in_progress if admin replies
      if (isAdmin && ticket.status === "open") {
        await db
          .update(supportTickets)
          .set({ status: "in_progress", updatedAt: new Date() })
          .where(eq(supportTickets.id, ticket.id));
      }

      // Send email if admin replies
      if (isAdmin && !isInternal) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, ticket.userId));
        if (user) {
          emailService
            .sendTicketReplyEmail(
              user.email,
              user.fullName,
              ticket.subject,
              message,
            )
            .catch((err) => fastify.log.error(err));
        }
      }

      return fastify.ok(reply, reply_, 201);
    },
  );

  // PUT /api/support/tickets/:id — Update status (admin)
  fastify.put(
    "/tickets/:id",
    {
      preHandler: [fastify.requireRole("super_admin", "support", "compliance")],
    },
    async (request, reply) => {
      const { status, priority, assignedTo } = request.body || {};
      const db = fastify.db;
      const [updated] = await db
        .update(supportTickets)
        .set({ status, priority, assignedTo, updatedAt: new Date() })
        .where(eq(supportTickets.id, request.params.id))
        .returning();

      if (!updated)
        return fastify.fail(reply, 404, "NOT_FOUND", "Ticket not found.");
      return fastify.ok(reply, updated);
    },
  );
}
