import { eq } from "drizzle-orm";
import { systemSettings } from "@/db/schema.js";

export default async function adminSettingsRoutes(fastify) {
  // GET /api/admin/settings
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const settings = await db.select().from(systemSettings);
      
      // Convert list to key-value object
      const config = settings.reduce((acc, curr) => {
        let value = curr.value;
        if (curr.type === 'number') value = Number(value);
        if (curr.type === 'boolean') value = value === 'true';
        if (curr.type === 'json') value = JSON.parse(value);
        acc[curr.key] = value;
        return acc;
      }, {});

      return fastify.ok(reply, config);
    },
  );

  // PUT /api/admin/settings
  fastify.put(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const updates = request.body || {};

      for (const [key, value] of Object.entries(updates)) {
        const type = typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string';
        const strValue = String(value);

        await db.insert(systemSettings).values({
          key,
          value: strValue,
          type,
          updatedBy: request.user.id,
        }).onConflictDoUpdate({
          target: systemSettings.key,
          set: { value: strValue, type, updatedBy: request.user.id, updatedAt: new Date() }
        });
      }

      return fastify.ok(reply, { message: "Settings updated successfully." });
    },
  );
}
