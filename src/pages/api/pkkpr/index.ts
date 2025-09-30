// /api/pkkpr.ts
import type { APIRoute } from "astro";
import raguBase from "../../../lib/koneksi";
import { pkkpr } from "../../../lib/schema/pkkpr";
import { applications } from "../../../lib/schema/applications";
import { eq, like, or, count } from "drizzle-orm";
import { verifyAccessToken } from "../../../lib/auth";

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

// GET all PKKPR with pagination and search
export const GET: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin", "user", "guest"]);
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const type = url.searchParams.get("type") || "";
    const status = url.searchParams.get("status") || "";

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions: any[] = [];
    
    if (search) {
      whereConditions.push(
        like(pkkpr.title, `%${search}%`)
      );
    }
    
    if (type) {
      whereConditions.push(eq(pkkpr.type, type));
    }
    
    if (status) {
      whereConditions.push(eq(pkkpr.status, status));
    }

    // Get total count
    const totalQuery = raguBase.select({ count: count() }).from(pkkpr);
    if (whereConditions.length > 0) {
      whereConditions.forEach(condition => {
        totalQuery.where(condition);
      });
    }
    const totalResult = await totalQuery;
    const total = totalResult[0].count;

    // Get paginated PKKPR
    let query = raguBase
      .select({
        id: pkkpr.id,
        title: pkkpr.title,
        type: pkkpr.type,
        status: pkkpr.status,
        createdAt: pkkpr.createdAt
      })
      .from(pkkpr);

    if (whereConditions.length > 0) {
      whereConditions.forEach(condition => {
        query.where(condition);
      });
    }

    const result = await query
      .limit(limit)
      .offset(offset)
      .orderBy(pkkpr.createdAt);

    // Get application counts for each PKKPR
    const pkkprWithCounts = await Promise.all(
      result.map(async (item) => {
        const applicationCount = await raguBase
          .select({ count: count() })
          .from(applications)
          .where(eq(applications.pkkprId, item.id));
        
        return {
          ...item,
          applicationCount: applicationCount[0].count
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return new Response(JSON.stringify({
      pkkpr: pkkprWithCounts,
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
    console.error("Error fetching PKKPR:", error);
    return new Response(JSON.stringify({ 
      message: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 
             error instanceof Error && error.message === "Forbidden" ? 403 : 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// POST create new PKKPR
export const POST: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { title, type, status, applicantName, applicantPhone, representativeName, location, landArea, landBoundaryNorth, landBoundaryEast, landBoundarySouth, landBoundaryWest } = body;

    if (!title || !type || !status) {
      return new Response(JSON.stringify({ 
        message: "Title, type, dan status wajib diisi" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const phoneRegex = /^(?:\+628|08)[0-9]{7,13}$/;

    if (applicantPhone && !phoneRegex.test(applicantPhone)) {
      return new Response(JSON.stringify({ 
        message: "Nomor HP tidak valid. Gunakan format 08... atau +628..., hanya angka, min 9 digit max 15 digit." 
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

       // ✅ Validasi luas tanah (tidak boleh negatif)
    if (landArea < 0) {
      return new Response(JSON.stringify({ 
        message: "Luas tanah tidak boleh bernilai negatif" 
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const pkkprGeneral = await raguBase
      .insert(pkkpr)
      .values({
        title: title.trim(),
        type: type,
        status: status,
        createdAt: new Date().toISOString()
      })
      .returning({ id: pkkpr.id });

    const pkkprId = pkkprGeneral[0].id

    const pkkprApplication = await raguBase
      .insert(applications)
      .values({
        pkkprId: pkkprId,
        name: applicantName.trim() === '' ? title.trim() : applicantName.trim(),
        phone: applicantPhone,
        actAs: representativeName.trim(),
        location: location.trim(),
        landArea: landArea,
        north: landBoundaryNorth.trim(),
        south: landBoundarySouth.trim(),
        east: landBoundaryEast.trim(),
        west: landBoundaryWest.trim(),
      })

    return new Response(JSON.stringify({ 
      message: "PKKPR berhasil dibuat",
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error creating PKKPR:", error);
    return new Response(JSON.stringify({ 
      message: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 
             error instanceof Error && error.message === "Forbidden" ? 403 : 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// PUT update PKKPR
export const PUT: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id, title, type, status } = body;

    if (!id || !title || !type || !status) {
      return new Response(JSON.stringify({ 
        message: "ID, title, type, dan status wajib diisi" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if PKKPR exists
    const existingPkkpr = await raguBase
      .select()
      .from(pkkpr)
      .where(eq(pkkpr.id, id))
      .limit(1);

    if (existingPkkpr.length === 0) {
      return new Response(JSON.stringify({ 
        message: "PKKPR tidak ditemukan" 
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    await raguBase
      .update(pkkpr)
      .set({
        title: title.trim(),
        type: type,
        status: status
      })
      .where(eq(pkkpr.id, id));

    return new Response(JSON.stringify({ 
      message: "PKKPR berhasil diupdate" 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error updating PKKPR:", error);
    return new Response(JSON.stringify({ 
      message: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 
             error instanceof Error && error.message === "Forbidden" ? 403 : 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// DELETE PKKPR
export const DELETE: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ 
        message: "ID PKKPR wajib diisi" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if PKKPR exists
    const pkkprToDelete = await raguBase
      .select()
      .from(pkkpr)
      .where(eq(pkkpr.id, id))
      .limit(1);

    if (pkkprToDelete.length === 0) {
      return new Response(JSON.stringify({ 
        message: "PKKPR tidak ditemukan" 
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    await raguBase.delete(pkkpr).where(eq(pkkpr.id, id));

    return new Response(JSON.stringify({ 
      message: "PKKPR berhasil dihapus" 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error deleting PKKPR:", error);
    return new Response(JSON.stringify({ 
      message: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 
             error instanceof Error && error.message === "Forbidden" ? 403 : 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
