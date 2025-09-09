import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs'

const encoder = new TextEncoder();
const accessSecret = encoder.encode(import.meta.env.PUBLIC_AUTH_PHRASE);
const refreshSecret = encoder.encode(import.meta.env.PUBLIC_REFRESH_PHRASE);

// 🔑 Token generation
export const generateAccessToken = async (payload: { [key: string]: string }) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(accessSecret);
}

export const generateRefreshToken = async (payload: { [key: string]: string }) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(refreshSecret);
}

export const verifyAccessToken = async (token: string) => {
  if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
    throw new Error('Token tidak valid');
  }
  const { payload } = await jwtVerify(token, accessSecret);
  return payload;
}

export const verifyRefreshToken = async (token: string) => {
  if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
    throw new Error('Token tidak valid');
  }
  const { payload } = await jwtVerify(token, refreshSecret);
  return payload;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10) // cost 10 cukup aman & cepat di edge
  return await bcrypt.hash(password, salt)
}

// Compare password waktu login
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}