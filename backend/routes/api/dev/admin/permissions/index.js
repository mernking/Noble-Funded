import { desc, eq, and, sql, count } from "drizzle-orm";
import { users, teamMembers } from "@/db/schema.js";

export default async function permissionsRoutes(fastify) {
  // GET /admin/permissions - Get all staff permissions
  fastify.get(
    "/",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { page = 1, limit = 50 } = request.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;

      try {
        // Get team members with their roles
        const staff = await db
          .select({
            id: teamMembers.id,
            firstName: teamMembers.firstName,
            lastName: teamMembers.lastName,
            email: teamMembers.email,
            role: teamMembers.role,
            permissions: teamMembers.permissions,
            status: teamMembers.status,
            createdAt: teamMembers.createdAt,
            lastLogin: teamMembers.lastLogin,
          })
          .from(teamMembers)
          .orderBy(teamMembers.createdAt)
          .limit(limitNum)
          .offset((pageNum - 1) * limitNum);

        const [totalResult] = await db
          .select({ count: count() })
          .from(teamMembers);

        // Get role distribution
        const roleDistribution = await db
          .select({
            role: teamMembers.role,
            count: count(),
          })
          .from(teamMembers)
          .groupBy(teamMembers.role);

        // Define available roles and their permissions
        const rolePermissions = {
          super_admin: {
            label: "Super Admin",
            description: "Full system access",
            permissions: ["*"],
          },
          compliance: {
            label: "Compliance Officer",
            description: "KYC, payouts, risk management",
            permissions: ["kyc.*", "payouts.*", "risk.*", "users.view"],
          },
          marketing: {
            label: "Marketing Manager",
            description: "Marketing and affiliate management",
            permissions: ["affiliates.*", "campaigns.*", "reports.view"],
          },
          support: {
            label: "Support Agent",
            description: "User support and tickets",
            permissions: ["support.*", "users.view", "challenges.view"],
          },
          finance: {
            label: "Finance Manager",
            description: "Financial operations",
            permissions: ["revenue.*", "payouts.*", "transactions.view"],
          },
          trader: {
            label: "Trader",
            description: "Limited trader access",
            permissions: ["challenges.view", "dashboard.view"],
          },
        };

        return fastify.ok(reply, {
          staff: staff.map(s => ({
            id: s.id,
            name: s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : s.email,
            email: s.email,
            role: s.role,
            permissions: s.permissions || rolePermissions[s.role?.toLowerCase()]?.permissions || [],
            status: s.status || "active",
            lastLogin: s.lastLogin,
            joinedAt: s.createdAt,
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalResult.count,
            pages: Math.ceil(totalResult.count / limitNum)
          },
          roles: rolePermissions,
          stats: {
            totalStaff: totalResult.count,
            byRole: roleDistribution.reduce((acc, r) => {
              acc[r.role] = Number(r.count);
              return acc;
            }, {}),
          }
        });
      } catch (error) {
        console.error("Permissions fetch error:", error);
        return fastify.error(reply, "Failed to fetch permissions");
      }
    }
  );

  // GET /admin/permissions/:id - Get specific staff member permissions
  fastify.get(
    "/:id",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      try {
        const [staff] = await db
          .select()
          .from(teamMembers)
          .where(eq(teamMembers.id, id));

        if (!staff) {
          return fastify.notFound(reply, "Staff member not found");
        }

        return fastify.ok(reply, {
          staff: {
            id: staff.id,
            name: staff.firstName && staff.lastName ? `${staff.firstName} ${staff.lastName}` : staff.email,
            email: staff.email,
            role: staff.role,
            permissions: staff.permissions,
            status: staff.status,
            lastLogin: staff.lastLogin,
            joinedAt: staff.createdAt,
          }
        });
      } catch (error) {
        console.error("Staff details fetch error:", error);
        return fastify.error(reply, "Failed to fetch staff details");
      }
    }
  );

  // PUT /admin/permissions/:id - Update staff permissions
  fastify.put(
    "/:id",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;
      const { role, permissions, status } = request.body;

      try {
        await db
          .update(teamMembers)
          .set({
            ...(role && { role }),
            ...(permissions && { permissions }),
            ...(status && { status }),
            updatedAt: new Date()
          })
          .where(eq(teamMembers.id, id));

        return fastify.ok(reply, {
          message: "Staff permissions updated successfully"
        });
      } catch (error) {
        console.error("Permissions update error:", error);
        return fastify.error(reply, "Failed to update permissions");
      }
    }
  );

  // POST /admin/permissions/invite - Invite new staff member
  fastify.post(
    "/invite",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { email, firstName, lastName, role, permissions } = request.body;

      if (!email || !role) {
        return fastify.badRequest(reply, "Email and role are required");
      }

      try {
        // Check if already exists
        const [existing] = await db
          .select()
          .from(teamMembers)
          .where(eq(teamMembers.email, email));

        if (existing) {
          return fastify.badRequest(reply, "Staff member with this email already exists");
        }

        const [newStaff] = await db
          .insert(teamMembers)
          .values({
            email,
            firstName,
            lastName,
            role,
            permissions: permissions || [],
            status: "pending",
            createdAt: new Date()
          })
          .returning();

        return fastify.ok(reply, {
          staff: newStaff,
          message: "Staff invitation sent successfully"
        });
      } catch (error) {
        console.error("Staff invite error:", error);
        return fastify.error(reply, "Failed to invite staff member");
      }
    }
  );

  // DELETE /admin/permissions/:id - Remove staff member
  fastify.delete(
    "/:id",
    { preHandler: [fastify.requireRole("super_admin")] },
    async (request, reply) => {
      const db = fastify.db;
      const { id } = request.params;

      try {
        await db
          .delete(teamMembers)
          .where(eq(teamMembers.id, id));

        return fastify.ok(reply, {
          message: "Staff member removed successfully"
        });
      } catch (error) {
        console.error("Staff removal error:", error);
        return fastify.error(reply, "Failed to remove staff member");
      }
    }
  );
}