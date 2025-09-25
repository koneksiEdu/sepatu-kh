// lib/auth-utils.ts
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from './auth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Utility functions yang universal (bisa dipakai di client dan server)
export const decodeJwt = (token: string): any => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

export const willExpireSoon = (token: string, bufferSeconds = 60): boolean => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now <= bufferSeconds;
};

// ===== CLIENT-SIDE ONLY FUNCTIONS =====
let tokenRefreshInterval: ReturnType<typeof setInterval> | null = null;

export const startAutoRefresh = () => {
  if (typeof window === 'undefined') return; // Skip di server
  
  if (tokenRefreshInterval) return;

  tokenRefreshInterval = setInterval(async () => {
    const token = getAccessToken();
    if (!token) {
      if (tokenRefreshInterval !== null) {
        clearInterval(tokenRefreshInterval);
        tokenRefreshInterval = null;
      }
      clearTokens();
      window.location.href = '/login';
      return;
    }

    if (willExpireSoon(token)) {
      console.log('[Auth] Access token will expire soon, refreshing...');
      const newToken = await refreshAccessToken();
      if (!newToken) {
        console.warn('[Auth] Failed to refresh token, logging out...');
        clearTokens();
        window.location.href = '/login';
      }
    }
  }, 10000);
};

// Client-side token management
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null; // Return null di server
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

export const setTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// ===== SERVER-SIDE COMPATIBLE FUNCTIONS =====
export const getCurrentUser = async (request?: Request): Promise<User | null> => {
  const token = await getTokenFromRequest(request);
  
  if (!token) {
    return null;
  }
  
  if (isTokenExpired(token)) {
    // Hanya clear tokens di client side
    if (typeof window !== 'undefined') {
      clearTokens();
    }
    return null;
  }

  try {
    const payload = decodeJwt(token);
    if (!payload) return null;

    return {
      id: String(payload.userId || payload.id),
      email: String(payload.email),
      name: String(payload.name || payload.email),
      role: String(payload.role || 'user'),
    };
  } catch (error) {
    console.error('Token processing failed:', error);
    return null;
  }
};

export const isAuthenticated = async (request?: Request): Promise<boolean> => {
  const token = await getTokenFromRequest(request);
  if (!token || isTokenExpired(token)) {
    return false;
  }

  try {
    if (typeof window !== 'undefined') {
      await verifyAccessToken(token);
    }
    return true;
  } catch {
    return false;
  }
};

export const hasRole = async (role: string, request?: Request): Promise<boolean> => {
  const user = await getCurrentUser(request);
  return user?.role === role;
};

export const refreshAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null; // Skip di server
  
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!res.ok) throw new Error('Refresh failed');

    const { accessToken } = await res.json();
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (err) {
    console.error('Refresh error:', err);
    clearTokens();
    return null;
  }
};

// ===== SERVER-SIDE HELPER FUNCTIONS =====
// Helper function untuk mendapatkan token dari request
async function getTokenFromRequest(request?: Request): Promise<string | null> {
  // Jika di client, gunakan localStorage
  if (typeof window !== 'undefined') {
    return getAccessToken();
  }
  
  // Jika di server, ambil dari request headers/cookies
  if (!request) return null;
  
  // 1. Cek Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // 2. Cek cookies
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader) {
    const cookies = parseCookies(cookieHeader);
    return cookies.accessToken || cookies.token || null;
  }
  
  return null;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
    return cookies;
  }, {} as Record<string, string>);
}
