// /api/users.ts
import type { APIRoute } from "astro";
import raguBase from "../../../lib/koneksi";
import { users } from "../../../lib/schema/users";
import { eq, like, or, count } from "drizzle-orm";
import { verifyAccessToken, hashPassword } from "../../../lib/auth";

export interface AuthPayload {
  id: string;
  role: string;
  email: string;
}

async function requireRole(request: Request, roles: string[] = []): Promise<AuthPayload> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const payload = (await verifyAccessToken(token)) as unknown as AuthPayload;

  if (roles.length > 0 && !roles.includes(payload.role)) {
    throw new Error("Forbidden");
  }

  return payload;
}

// GET all users with pagination and search
export const GET: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role") || "";
    const verified = url.searchParams.get("verified") || "";

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions: any[] = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.description, `%${search}%`)
        )
      );
    }
    
    if (role) {
      whereConditions.push(eq(users.role, role));
    }
    
    if (verified !== "") {
      whereConditions.push(eq(users.is_verified, parseInt(verified)));
    }

    // Get total count
    const totalQuery = raguBase.select({ count: count() }).from(users);
    if (whereConditions.length > 0) {
      whereConditions.forEach(condition => {
        totalQuery.where(condition);
      });
    }
    const totalResult = await totalQuery;
    const total = totalResult[0].count;

    // Get paginated users
    let query = raguBase
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        description: users.description,
        is_verified: users.is_verified,
        created_at: users.created_at
      })
      .from(users);

    if (whereConditions.length > 0) {
      whereConditions.forEach(condition => {
        query.where(condition);
      });
    }

    const result = await query
      .limit(limit)
      .offset(offset)
      .orderBy(users.created_at);

    const totalPages = Math.ceil(total / limit);

    return new Response(JSON.stringify({
      users: result,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ 
      message: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 
             error instanceof Error && error.message === "Forbidden" ? 403 : 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// PUT update user
export const PUT: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id, name, email, role, description, is_verified, password } = body;

    if (!id || !name || !email) {
      return new Response(JSON.stringify({ 
        message: "ID, nama, dan email wajib diisi" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        message: "Format email tidak valid" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if email is already used by another user
    const existingUser = await raguBase
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].id !== id) {
      return new Response(JSON.stringify({ 
        message: "Email sudah digunakan oleh user lain" 
      }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Prepare update data
    const updateData: any = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role || 'guest',
      description: description || null,
      is_verified: is_verified !== undefined ? is_verified : 0
    };

    // Hash new password if provided
    if (password && password.trim()) {
      if (password.length < 6) {
        return new Response(JSON.stringify({ 
          message: "Password minimal 6 karakter" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      updateData.password = await hashPassword(password);
    }

    await raguBase
      .update(users)
      .set(updateData)
      .where(eq(users.id, id));

    return new Response(JSON.stringify({ 
      message: "User berhasil diupdate" 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ 
      message: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 
             error instanceof Error && error.message === "Forbidden" ? 403 : 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// DELETE user
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const currentUser = await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ 
        message: "ID user wajib diisi" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Prevent admin from deleting themselves
    if (parseInt(currentUser.id) === parseInt(id)) {
      return new Response(JSON.stringify({ 
        message: "Tidak dapat menghapus akun sendiri" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if user exists
    const userToDelete = await raguBase
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (userToDelete.length === 0) {
      return new Response(JSON.stringify({ 
        message: "User tidak ditemukan" 
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    await raguBase.delete(users).where(eq(users.id, id));

    return new Response(JSON.stringify({ 
      message: "User berhasil dihapus" 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response(JSON.stringify({ 
      message: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 
             error instanceof Error && error.message === "Forbidden" ? 403 : 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// PATCH verify user (quick verification)
export const PATCH: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id, is_verified } = body;

    if (!id || is_verified === undefined) {
      return new Response(JSON.stringify({ 
        message: "ID dan status verifikasi wajib diisi" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    await raguBase
      .update(users)
      .set({ is_verified: is_verified ? 1 : 0 })
      .where(eq(users.id, id));

    return new Response(JSON.stringify({ 
      message: `User berhasil ${is_verified ? 'diverifikasi' : 'dibatalkan verifikasinya'}` 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error verifying user:", error);
    return new Response(JSON.stringify({ 
      message: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 
             error instanceof Error && error.message === "Forbidden" ? 403 : 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};