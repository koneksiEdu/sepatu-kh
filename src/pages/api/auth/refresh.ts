// src/pages/api/auth/refresh.ts
import type { APIRoute } from 'astro';
import { verifyRefreshToken, generateAccessToken } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { refreshToken } = await request.json();
    const payload = await verifyRefreshToken(refreshToken);

    const accessToken = await generateAccessToken({
      userId: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
    });

    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }
};