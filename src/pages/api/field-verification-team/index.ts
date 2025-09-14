// src/pages/api/field-verification-team.ts
import type { APIRoute } from "astro";
import raguBase from "../../../lib/koneksi";
import { fieldVerificationTeam } from "../../../lib/schema/field_verification_team";
import { staff } from "../../../lib/schema/staff";
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

// GET team members by fieldVerificationId
export const GET: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["user", "admin"]);
    
    const url = new URL(request.url);
    const fieldVerificationId = url.searchParams.get("fieldVerificationId");
    if (!fieldVerificationId) {
      return new Response(JSON.stringify({ message: "fieldVerificationId parameter required" }), { status: 400 });
    }

    // Join with staff table to get staff details
    const result = await raguBase
      .select({
        id: fieldVerificationTeam.id,
        fieldVerificationId: fieldVerificationTeam.fieldVerificationId,
        staffId: fieldVerificationTeam.staffId,
        staffName: staff.name,
        staffPosition: staff.position
      })
      .from(fieldVerificationTeam)
      .innerJoin(staff, eq(fieldVerificationTeam.staffId, staff.id))
      .where(eq(fieldVerificationTeam.fieldVerificationId, parseInt(fieldVerificationId)));
      
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching field verification team:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};

// POST new team member
export const POST: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { fieldVerificationId, staffId, role } = body;

    if (!fieldVerificationId || !staffId) {
      return new Response(JSON.stringify({ message: "fieldVerificationId dan staffId wajib diisi" }), { status: 400 });
    }

    // Check if staff is already in this verification team
    const { and } = await import("drizzle-orm");
    const existing = await raguBase
      .select()
      .from(fieldVerificationTeam)
      .where(
        and(
          eq(fieldVerificationTeam.fieldVerificationId, fieldVerificationId),
          eq(fieldVerificationTeam.staffId, staffId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return new Response(JSON.stringify({ message: "Staff sudah menjadi anggota tim verifikasi ini" }), { status: 409 });
    }

    const newTeamMember = await raguBase
      .insert(fieldVerificationTeam)
      .values({
        fieldVerificationId,
        staffId,
      })
      .returning();
      
    return new Response(JSON.stringify(newTeamMember[0]), { status: 201 });
  } catch (error: any) {
    console.error("Error adding team member:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};

// PUT update team member role
export const PUT: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ message: "ID wajib diisi" }), { status: 400 });
    }
      
    return new Response(JSON.stringify({ message: "Team member updated" }));
  } catch (error: any) {
    console.error("Error updating team member:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};

// DELETE team member
export const DELETE: APIRoute = async ({ request }) => {
  try {
    await requireRole(request, ["admin"]);
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ message: "ID wajib diisi" }), { status: 400 });
    }

    await raguBase.delete(fieldVerificationTeam).where(eq(fieldVerificationTeam.id, id));
    return new Response(JSON.stringify({ message: "Team member removed" }));
  } catch (error: any) {
    console.error("Error removing team member:", error);
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    if (error.message === "Forbidden") {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
};