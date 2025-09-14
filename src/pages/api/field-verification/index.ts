// src/pages/api/field-verification.ts
import type { APIRoute } from "astro";
import raguBase from "../../../lib/koneksi";
import { fieldVerifications } from "../../../lib/schema/field_verifications";
import { eq } from "drizzle-orm";
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

// GET field verification by pkkprId
export const GET: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["user", "admin"]);
    
    const url = new URL(request.url);
    const pkkprId = url.searchParams.get("pkkprId");
    if (!pkkprId) {
      return new Response(JSON.stringify({ message: "pkkprId parameter required" }), { status: 400 });
    }

    const result = await raguBase
      .select()
      .from(fieldVerifications)
      .where(eq(fieldVerifications.pkkprId, parseInt(pkkprId)))
      .limit(1);
      
    if (result.length === 0) {
      return new Response(JSON.stringify({ message: "Field verification not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify(result[0]), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching field verification:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};

// POST new field verification
export const POST: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { pkkprId, isVerified, latitude, longitude, verifiedAt } = body;

    if (!pkkprId) {
      return new Response(JSON.stringify({ message: "pkkprId wajib diisi" }), { status: 400 });
    }

    // Check if field verification already exists for this pkkprId
    const existing = await raguBase
      .select()
      .from(fieldVerifications)
      .where(eq(fieldVerifications.pkkprId, pkkprId))
      .limit(1);

    if (existing.length > 0) {
      return new Response(JSON.stringify({ message: "Field verification sudah ada untuk PKKPR ini" }), { status: 409 });
    }

    const newVerification = await raguBase
      .insert(fieldVerifications)
      .values({
        pkkprId,
        isVerified: isVerified || false,
        latitude,
        longitude,
        verifiedAt
      })
      .returning();
      
    return new Response(JSON.stringify(newVerification[0]), { status: 201 });
  } catch (error: any) {
    console.error("Error creating field verification:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};

// PUT update field verification
export const PUT: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id, isVerified, latitude, longitude, verifiedAt } = body;

    if (!id) {
      return new Response(JSON.stringify({ message: "ID wajib diisi" }), { status: 400 });
    }

    await raguBase
      .update(fieldVerifications)
      .set({
        isVerified: isVerified || false,
        latitude,
        longitude,
        verifiedAt
      })
      .where(eq(fieldVerifications.id, id));
      
    return new Response(JSON.stringify({ message: "Field verification updated" }));
  } catch (error: any) {
    console.error("Error updating field verification:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};

// DELETE field verification
export const DELETE: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ message: "ID wajib diisi" }), { status: 400 });
    }

    await raguBase.delete(fieldVerifications).where(eq(fieldVerifications.id, id));
    return new Response(JSON.stringify({ message: "Field verification deleted" }));
  } catch (error: any) {
    console.error("Error deleting field verification:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};