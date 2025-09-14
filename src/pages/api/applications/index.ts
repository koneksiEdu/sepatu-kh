// src/pages/api/applications.ts
import type { APIRoute } from "astro";
import raguBase from "../../../lib/koneksi";
import { applications } from "../../../lib/schema/applications";
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

// GET applications by pkkprId
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
      .from(applications)
      .where(eq(applications.pkkprId, parseInt(pkkprId)));
      
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};

// POST new application
export const POST: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { pkkprId, name, phone, actAs, location, landArea, north, south, east, west } = body;

    if (!pkkprId || !name) {
      return new Response(JSON.stringify({ message: "pkkprId dan nama wajib diisi" }), { status: 400 });
    }

    const newApplication = await raguBase
      .insert(applications)
      .values({
        pkkprId,
        name,
        phone,
        actAs,
        location,
        landArea,
        north,
        south,
        east,
        west
      })
      .returning();
      
    return new Response(JSON.stringify(newApplication[0]), { status: 201 });
  } catch (error: any) {
    console.error("Error creating application:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};

// PUT update application
export const PUT: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id, pkkprId, name, phone, actAs, location, landArea, north, south, east, west } = body;

    if (!id || !name) {
      return new Response(JSON.stringify({ message: "ID dan nama wajib diisi" }), { status: 400 });
    }

    await raguBase
      .update(applications)
      .set({
        name,
        phone,
        actAs,
        location,
        landArea,
        north,
        south,
        east,
        west
      })
      .where(eq(applications.id, id));
      
    return new Response(JSON.stringify({ message: "Application updated" }));
  } catch (error: any) {
    console.error("Error updating application:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};

// DELETE application
export const DELETE: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ message: "ID wajib diisi" }), { status: 400 });
    }

    await raguBase.delete(applications).where(eq(applications.id, id));
    return new Response(JSON.stringify({ message: "Application deleted" }));
  } catch (error: any) {
    console.error("Error deleting application:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};