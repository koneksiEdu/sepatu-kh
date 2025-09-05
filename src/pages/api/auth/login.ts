// /api/auth/login.ts
import type { APIRoute } from 'astro';
import raguBase from '../../../lib/koneksi';
import { eq } from 'drizzle-orm';
import { users } from '../../../lib/schema/users';
import { verifyPassword, generateAccessToken, generateRefreshToken } from '../../../lib/auth';
import { rateLimit } from '../../../middleware/rateLimiter';

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // Rate limiting - 5 attempts per 15 minutes
  if (!rateLimit(ip, 5, 900)) {
    return new Response(JSON.stringify({ 
      message: "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit." 
    }), {
      status: 429,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({ 
        message: "Email dan password wajib diisi" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return new Response(JSON.stringify({ 
        message: "Format input tidak valid" 
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

    // Find user by email
    const user = await raguBase
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (user.length === 0) {
      return new Response(JSON.stringify({ 
        message: "Email atau password salah" 
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userData = user[0];

    // Check if user is verified
    if (userData.is_verified === 0) {
      return new Response(JSON.stringify({ 
        message: "Akun belum diverifikasi. Silakan cek email Anda untuk link verifikasi.",
        needsVerification: true,
        email: userData.email
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, String(userData.password));
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ 
        message: "Email atau password salah" 
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Generate tokens
    const tokenPayload = {
      userId: String(userData.id),
      email: userData.email,
      role: userData.role,
      name: userData.name
    };
    const accessToken = await generateAccessToken({
      userId: String(userData.id),
      email: userData.email || '',
      role: userData.role || '',
      name: userData.name || ''
    });
    const refreshTokenPayload = {
      ...tokenPayload,
      email: tokenPayload.email || '',
      role: tokenPayload.role || '',
      name: tokenPayload.name || ''
    };
    const refreshToken = await generateRefreshToken(refreshTokenPayload)

    // Prepare response
    const response = {
      message: "Login berhasil",
      accessToken,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      }
    };

    if (refreshToken) {
      (response as any).refreshToken = refreshToken;
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle JWT errors
    if (error instanceof Error && error.message.includes('JWT')) {
      return new Response(JSON.stringify({ 
        message: "Terjadi kesalahan sistem authentication" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ 
      message: "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};