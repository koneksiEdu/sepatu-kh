// /api/auth/resend-verification.ts
import type { APIRoute } from 'astro';
import raguBase from '../../../lib/koneksi';
import { eq } from 'drizzle-orm';
import { users } from '../../../lib/schema/users';
import { emailVerifications } from '../../../lib/schema/email_verifications';
import { rateLimit } from '../../../middleware/rateLimiter';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

async function sendVerificationEmail(toEmail: string, token: string, attempt = 1) {
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

  const verificationUrl = `${import.meta.env.PUBLIC_URL}email-verification?email=${encodeURIComponent(
    toEmail
  )}&token=${token}`;

  const mailOptions = {
    from: `"SEPATU KH" <${import.meta.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Verifikasi Email Akun - Kirim Ulang",
    text: `Halo,\n\nSalin link berikut buat verifikasi akun kamu:\n${verificationUrl}\n\nLink ini akan expire dalam 1 jam.\nAbaikan jika bukan kamu.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #007bff; margin-bottom: 10px;">Verifikasi Email</h1>
          <p style="color: #666; font-size: 16px;">SEPATU KH</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-bottom: 15px;">Kiriman Ulang Email Verifikasi</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Halo! Anda meminta untuk mengirim ulang link verifikasi email. Klik link di bawah ini untuk verifikasi email kamu:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(45deg, #007bff, #00d4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Verifikasi Email Sekarang
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
            Atau salin dan tempel link berikut ke browser Anda:
          </p>
          <p style="color: #007bff; word-break: break-all; font-size: 14px;">
            ${verificationUrl}
          </p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>⚠️ Penting:</strong> Link verifikasi email ini akan expired dalam 1 jam untuk keamanan akun Anda.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    if (attempt < 3) {
      console.warn(`Retrying sendEmail... attempt ${attempt}`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return sendVerificationEmail(toEmail, token, attempt + 1);
    }
    throw error;
  }
}

const createVerificationToken = async (userId: string) => {
  const token = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (60 * 60 * 1000)).toISOString(); // expire dalam 1 jam

  // Delete existing verification tokens for this user
  await raguBase
    .delete(emailVerifications)
    .where(eq(emailVerifications.user_id, userId));

  // Insert new verification token
  await raguBase.insert(emailVerifications).values({
    user_id: userId,
    token,
    expires_at: expiresAt,
  });

  return token;
};

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // Rate limiting - lebih ketat untuk resend
  if (!rateLimit(ip, 3, 300)) { // 3 requests per 5 minutes
    return new Response(JSON.stringify({ 
      message: "Terlalu banyak permintaan. Silakan coba lagi dalam 5 menit." 
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
      // Don't reveal if user exists or not for security
      return new Response(JSON.stringify({ 
        message: "Jika email terdaftar, link verifikasi akan dikirim ke email tersebut" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userData = user[0];

    // Check if user is already verified
    if (userData.is_verified === 1) {

      return new Response(JSON.stringify({ 
        message: "Email sudah terverifikasi" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if there's a recent verification request (prevent spam)
    const recentVerification = await raguBase
      .select()
      .from(emailVerifications)
      .where(eq(emailVerifications.user_id, String(userData.id)))
      .limit(1);

    if (recentVerification.length > 0) {
      const now = new Date();
      const lastCreated = new Date(recentVerification[0]?.expires_at || now);
      const timeDiff = now.getTime() - lastCreated.getTime();
      const oneMinute = 60 * 1000;

      // Prevent sending email more than once per minute
      if (timeDiff < oneMinute) {
        return new Response(JSON.stringify({ 
          message: "Mohon tunggu sebentar sebelum meminta kirim ulang email verifikasi" 
        }), {
          status: 429,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Create new verification token
    const token = await createVerificationToken(String(userData.id));
    
    // Send verification email
    await sendVerificationEmail(email.toLowerCase().trim(), token);

    return new Response(JSON.stringify({ 
      message: "Email verifikasi berhasil dikirim ulang. Silakan cek inbox dan folder spam Anda.",
      success: true
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    
    // Handle email sending errors
    if (error instanceof Error && error.message.includes('Gagal kirim email')) {
      return new Response(JSON.stringify({ 
        message: "Gagal mengirim email verifikasi. Silakan coba lagi nanti." 
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