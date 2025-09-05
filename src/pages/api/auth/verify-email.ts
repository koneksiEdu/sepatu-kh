// /api/auth/verify-email.ts
import type { APIRoute } from 'astro';
import raguBase from '../../../lib/koneksi';
import { eq, gt, and } from 'drizzle-orm';
import { users } from '../../../lib/schema/users';
import { emailVerifications } from '../../../lib/schema/email_verifications';
import { rateLimit } from '../../../middleware/rateLimiter';

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // Rate limiting
  if (!rateLimit(ip)) {
    return new Response(JSON.stringify({ 
      message: "Too many requests. Please try again later." 
    }), {
      status: 429,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const { email, token } = body;

    // Validate input
    if (!email || !token) {
      return new Response(JSON.stringify({ 
        message: "Email dan token wajib diisi" 
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
        message: "User tidak ditemukan" 
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userId = user[0].id;

    // Check if user is already verified
    if (user[0].is_verified === 1) {
      return new Response(JSON.stringify({ 
        message: "Email sudah terverifikasi" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Find verification token
    const verification = await raguBase
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.token, token),
          eq(emailVerifications.user_id, String(userId)),
          gt(emailVerifications.expires_at, new Date().toISOString())
        )
      )
      .limit(1);
    console.log(verification[0]);

    if (verification.length === 0) {
      return new Response(JSON.stringify({ 
        message: "Token verifikasi tidak valid atau sudah kedaluwarsa" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const verificationData = verification[0];

    // Update user verification status
    await raguBase
      .update(users)
      .set({ 
        is_verified: 1,
      })
      .where(eq(users.id, userId));

    // Delete the verification token after successful verification
    await raguBase
      .delete(emailVerifications)
      .where(eq(emailVerifications.id, verificationData.id));

    return new Response(JSON.stringify({ 
      message: "Email berhasil diverifikasi",
      success: true
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
    return new Response(JSON.stringify({ 
      message: "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};