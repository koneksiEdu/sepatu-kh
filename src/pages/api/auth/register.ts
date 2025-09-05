// /api/auth/register.ts
import type { APIRoute } from 'astro';
import raguBase from '../../../lib/koneksi';
import { eq } from 'drizzle-orm';
import { users } from '../../../lib/schema/users';
import { hashPassword } from '../../../lib/auth';
import { rateLimit } from '../../../middleware/rateLimiter';
import { v4 as uuidv4 } from 'uuid';
import { emailVerifications } from '../../../lib/schema/email_verifications';
import nodemailer from "nodemailer";

async function sendVerificationEmail(toEmail: string, token: string, attempt = 1) {
  const verificationUrl = `${import.meta.env.PUBLIC_URL}email-verification?email=${encodeURIComponent(
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
    subject: "Verifikasi Email Akun - SEPATU KH",
    text: `Verifikasi Email Akun - SEPATU KH\n\nHalo! Terima kasih sudah daftar. Klik link berikut untuk verifikasi email kamu: ${verificationUrl}\n\nLink ini akan expired dalam 1 jam.\n\nAbaikan jika bukan kamu.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #007bff; margin-bottom: 10px;">Verifikasi Email</h1>
          <p style="color: #666; font-size: 16px;">SEPATU KH</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-bottom: 15px;">Verifikasi Email Anda</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Halo! Terima kasih sudah daftar. Klik link di bawah ini buat verifikasi email kamu:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
              style="background: linear-gradient(45deg, #007bff, #00d4ff); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;">
              Verifikasi Email
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
            Abaikan email ini kalau kamu gak merasa daftar.
          </p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>⚠️ Penting:</strong> Link ini akan expire dalam 1 jam.
          </p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Jika Anda tidak mendaftar, abaikan email ini. Akun Anda akan aman.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email verifikasi berhasil dikirim ke", toEmail);
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    if (attempt < 3) {
      console.warn(`Retrying sendEmail... attempt ${attempt}`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return sendVerificationEmail(toEmail, token, attempt + 1);
    }
    throw error;
  }
}

const createVerificationToken = async (userId: string) => {
  const token = uuidv4(); // atau generateTokenLain();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (60 * 60 * 1000)).toISOString(); // expire dalam 1 jam

  await raguBase.insert(emailVerifications).values({
    user_id: userId,
    token,
    expires_at: expiresAt,
  });

  return token;
};

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
    const { email, password, name, description } = body;

    // Validate input
    if (!name || !email || !password || !description) {
      return new Response(JSON.stringify({ 
        message: "Nama, email, deskripsi dan password wajib diisi" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate name
    const trimmedName = name.trim().replace(/\s+/g, ' '); // Normalize whitespace
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return new Response(JSON.stringify({ 
        message: "Nama lengkap harus antara 2-100 karakter" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    //validate email

    if (typeof email !== 'string' || typeof password !== 'string') {
      return new Response(JSON.stringify({ 
        message: "Invalid input format" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        message: "Masukan email yang valid" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return new Response(JSON.stringify({ 
        message: "Password minimal punya 6 karakter" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if user already exists
    const existingUser = await raguBase
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ 
        message: "Akun dengan email ini sudah terdaftar" 
      }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const now = new Date().toISOString();
    const userId = await raguBase.insert(users).values({
      email: email.toLocaleLowerCase().trim(),
      password: hashedPassword,
      role: 'guest',
      description,
      is_verified: 0,
      name: trimmedName,
      created_at: now,
    })
    .returning({ id: users.id })
    .then((result) => result[0].id);

    const token = await createVerificationToken(String(userId));
    await sendVerificationEmail(email.toLowerCase().trim(), token);

    return new Response(JSON.stringify({ 
      message: "Registration berhasil! Cek email Anda untuk verikasi.",
      userId: userId
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific database errors
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ 
        message: "Email sudah terdaftar" 
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