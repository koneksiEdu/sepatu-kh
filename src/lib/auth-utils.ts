// lib/auth-utils.ts
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from './auth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

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

  const now = Math.floor(Date.now() / 1000); // in seconds
  return payload.exp < now;
};

export const willExpireSoon = (token: string, bufferSeconds = 60): boolean => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now <= bufferSeconds;
};

let tokenRefreshInterval: ReturnType<typeof setInterval> | null = null;

export const startAutoRefresh = () => {
  if (tokenRefreshInterval) return; // Jangan jalankan lebih dari 1x

  tokenRefreshInterval = setInterval(async () => {
    const token = getAccessToken();

    // Jika token tidak ada, clear interval & redirect
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
      if (newToken) {
        console.log('[Auth] Access token refreshed.');
      } else {
        console.warn('[Auth] Failed to refresh token, logging out...');
        clearTokens();
        window.location.href = '/login';
      }
    }
  }, 10000); // Cek setiap 10 detik
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const setTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// In auth-utils.ts
export const getCurrentUser = async (): Promise<User | null> => {
  const token = getAccessToken();
  
  if (!token) {
    return null;
  }
  
  if (isTokenExpired(token)) {
    clearTokens();
    return null;
  }

  try {
    await verifyAccessToken(token); // Verify the token if needed
    const payload = decodeJwt(token);
    
    if (!payload) {
      console.log('Invalid payload');
      return null;
    }

    return {
      id: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = getAccessToken();
  if (!token || isTokenExpired(token)) {
    clearTokens();
    return false;
  }

  try {
    await verifyAccessToken(token);
    return true;
  } catch {
    return false;
  }
};

export const hasRole = async (role: string): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === role;
};

export const refreshAccessToken = async (): Promise<string | null> => {
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
