// /api/auth/reset-password.ts
import type { APIRoute } from 'astro';
import raguBase from '../../../lib/koneksi';
import { eq, and, gt } from 'drizzle-orm';
import { users } from '../../../lib/schema/users';
import { passwordResets } from '../../../lib/schema/password_resets';
import { hashPassword } from '../../../lib/auth';
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
    const { email, token, newPassword } = body;

    // Validate input
    if (!email || !token || !newPassword) {
      return new Response(JSON.stringify({ 
        message: "Email, token, dan password baru wajib diisi" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (typeof email !== 'string' || typeof token !== 'string' || typeof newPassword !== 'string') {
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

    // Validate password strength
    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ 
        message: "Password baru minimal 6 karakter" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await raguBase
      .select()
      .from(users)
      .where(eq(users.email, trimmedEmail))
      .limit(1);

    if (user.length === 0) {
      return new Response(JSON.stringify({ 
        message: "User tidak ditemukan" 
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userData = user[0];

    // Find valid reset token
    const resetToken = await raguBase
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.email, trimmedEmail),
          eq(passwordResets.token, token),
          eq(passwordResets.used, false),
          gt(passwordResets.expires_at, new Date().toISOString())
        )
      )
      .limit(1);

    if (resetToken.length === 0) {
      return new Response(JSON.stringify({ 
        message: "Token reset password tidak valid atau sudah kedaluwarsa" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const tokenData = resetToken[0];

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await raguBase
      .update(users)
      .set({
        password: hashedPassword
      })
      .where(eq(users.id, userData.id));

    // Mark token as used
    await raguBase
      .update(passwordResets)
      .set({
        used: true
      })
      .where(eq(passwordResets.id, tokenData.id));

    // Delete all other unused reset tokens for this email for security
    await raguBase
      .delete(passwordResets)
      .where(
        and(
          eq(passwordResets.email, trimmedEmail),
        )
      );

    return new Response(JSON.stringify({ 
      message: "Password berhasil direset",
      success: true
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Reset password error:', error);
    
    // Handle specific database errors
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ 
        message: "Terjadi kesalahan saat mengupdate password" 
      }), {
        status: 409,
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