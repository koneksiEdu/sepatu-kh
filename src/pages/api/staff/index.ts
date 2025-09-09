import type { APIRoute } from "astro";
import raguBase from "../../../lib/koneksi";
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
  console.log(token)
  const payload = (await verifyAccessToken(token)) as unknown as AuthPayload;

  if (roles.length > 0 && !roles.includes(payload.role)) {
    throw new Error("Forbidden");
  }

  return payload; // kalau sukses, bisa dipakai di handler lain
}
// GET all staff
export const GET: APIRoute = async () => {
  const result = await raguBase.select().from(staff);
  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
};

// POST new staff
export const POST: APIRoute = async ({ request }) => {
  const user = await requireRole(request, ["admin"]);
  const body = await request.json();
  const { name, position } = body;

  if (!name) {
    return new Response(JSON.stringify({ message: "Nama wajib diisi" }), { status: 400 });
  }

  const newStaff = await raguBase.insert(staff).values({ name, position }).returning();
  return new Response(JSON.stringify(newStaff[0]), { status: 201 });
};

// PUT update staff
export const PUT: APIRoute = async ({ request }) => {
  const user = await requireRole(request, ["admin"]);
  const body = await request.json();
  const { id, name, position } = body;

  await raguBase.update(staff).set({ name, position }).where(eq(staff.id, id));
  return new Response(JSON.stringify({ message: "Staff updated" }));
};

// DELETE staff
export const DELETE: APIRoute = async ({ request }) => {
  const user = await requireRole(request, ["admin"]);
  const body = await request.json();
  const { id } = body;

  await raguBase.delete(staff).where(eq(staff.id, id));
  return new Response(JSON.stringify({ message: "Staff deleted" }));
};
