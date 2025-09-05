// /api/auth/forgot-password.ts
import type { APIRoute } from 'astro';
import raguBase from '../../../lib/koneksi';
import { eq } from 'drizzle-orm';
import { users } from '../../../lib/schema/users';
import { passwordResets } from '../../../lib/schema/password_resets';
import { rateLimit } from '../../../middleware/rateLimiter';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from "nodemailer";

async function sendResetPasswordEmail(toEmail: string, token: string, attempt = 1) {
  const resetUrl = `${import.meta.env.PUBLIC_URL}reset-password?email=${encodeURIComponent(
    toEmail
  )}&token=${token}`;

  // Konfigurasi transporter SMTP
  const transporter = nodemailer.createTransport({
    host: import.meta.env.SMTP_HOST,
    port: 587,
    secure: false, // STARTTLS → false di sini
    auth: {
      user: import.meta.env.SMTP_USER, // "nama.pengguna@[NAMADOMAIN].go.id"
      pass: import.meta.env.SMTP_PASS, // password email
    },
    tls: {
      rejectUnauthorized: false, // kalau self-signed certificate
    },
  });

  const mailOptions = {
    from: `"SEPATU KH" <${import.meta.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Reset Password - SEPATU KH",
    text: `Reset Password - SEPATU KH\n\nHalo! Kami menerima permintaan untuk reset password akun Anda.\n\nKlik link berikut untuk reset password: ${resetUrl}\n\nLink ini akan expired dalam 1 jam.\n\nJika Anda tidak meminta reset password, abaikan email ini.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #007bff; margin-bottom: 10px;">Reset Password</h1>
          <p style="color: #666; font-size: 16px;">SEPATU KH</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-bottom: 15px;">Permintaan Reset Password</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Halo! Kami menerima permintaan untuk reset password akun Anda. 
            Klik tombol di bawah ini untuk membuat password baru:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
              style="background: linear-gradient(45deg, #007bff, #00d4ff); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;">
              Reset Password Sekarang
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
            Atau salin dan tempel link berikut ke browser Anda:
          </p>
          <p style="color: #007bff; word-break: break-all; font-size: 14px;">
            ${resetUrl}
          </p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>⚠️ Penting:</strong> Link reset password ini akan expired dalam 1 jam untuk keamanan akun Anda.
          </p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Jika Anda tidak meminta reset password, abaikan email ini. 
            Password Anda akan tetap aman dan tidak akan berubah.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email reset password berhasil dikirim ke", toEmail);
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    if (attempt < 3) {
      console.warn(`Retrying sendEmail... attempt ${attempt}`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return sendResetPasswordEmail(toEmail, token, attempt + 1);
    }
    throw error;
  }  
}

const createResetPasswordToken = async (email: string) => {
  const token = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (60 * 60 * 1000)).toISOString(); // expire dalam 1 jam

  // Delete existing unused reset tokens for this email
  await raguBase
    .delete(passwordResets)
    .where(eq(passwordResets.email, email));

  // Insert new reset token
  await raguBase.insert(passwordResets).values({
    email,
    token,
    expires_at: expiresAt,
    used: false,
    created_at: now.toISOString()
  });

  return token;
};

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // Rate limiting - 3 requests per 15 minutes untuk forgot password
  if (!rateLimit(ip, 3, 900)) {
    return new Response(JSON.stringify({ 
      message: "Terlalu banyak permintaan reset password. Silakan coba lagi dalam 15 menit." 
    }), {
      status: 429,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return new Response(JSON.stringify({ 
        message: "Email wajib diisi" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (typeof email !== 'string') {
      return new Response(JSON.stringify({ 
        message: "Format email tidak valid" 
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

    const trimmedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await raguBase
      .select()
      .from(users)
      .where(eq(users.email, trimmedEmail))
      .limit(1);

    // For security, always return success message even if user doesn't exist
    // This prevents email enumeration attacks
    if (user.length === 0) {
      return new Response(JSON.stringify({ 
        message: "Jika email terdaftar, link reset password akan dikirim ke email tersebut",
        success: true
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userData = user[0];

    // Check if user is verified (optional - you might want to allow reset for unverified users)
    if (userData.is_verified === 0) {
      return new Response(JSON.stringify({ 
        message: "Akun belum diverifikasi. Silakan verifikasi email terlebih dahulu sebelum reset password.",
        needsVerification: true,
        email: userData.email
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if there's a recent reset request (prevent spam)
    const recentReset = await raguBase
      .select()
      .from(passwordResets)
      .where(eq(passwordResets.email, trimmedEmail))
      .limit(1);

    if (recentReset.length > 0) {
      const now = new Date();
      const lastCreated = new Date(recentReset[0].created_at);
      const timeDiff = now.getTime() - lastCreated.getTime();
      const twoMinutes = 2 * 60 * 1000;

      // Prevent sending email more than once per 2 minutes
      if (timeDiff < twoMinutes) {
        return new Response(JSON.stringify({ 
          message: "Email reset password baru saja dikirim. Mohon tunggu 2 menit sebelum meminta lagi." 
        }), {
          status: 429,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Create new reset token
    const token = await createResetPasswordToken(trimmedEmail);
    
    // Send reset password email
    await sendResetPasswordEmail(trimmedEmail, token);

    return new Response(JSON.stringify({ 
      message: "Link reset password berhasil dikirim ke email Anda. Silakan cek inbox dan folder spam.",
      success: true
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Handle email sending errors
    if (error instanceof Error && error.message.includes('Gagal kirim email')) {
      return new Response(JSON.stringify({ 
        message: "Gagal mengirim email reset password. Silakan coba lagi nanti." 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Handle database errors
    if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
      return new Response(JSON.stringify({ 
        message: "Permintaan reset password sedang diproses. Silakan cek email Anda." 
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