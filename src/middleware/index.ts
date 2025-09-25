// src/middleware/index.ts
import type { MiddlewareHandler } from 'astro';
import { getCurrentUser } from '../lib/auth-utils';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { locals, request } = context;

  // Hanya jalankan auth logic jika di client side atau jika request tersedia
  if (typeof window !== 'undefined' || request) {
    try {
      const user = await getCurrentUser(request);
      if (user) {
        locals.user = user;
      }
    } catch (err) {
      console.error('Failed to get current user:', err);
      // Tidak perlu clearTokens() di server
    }
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const response = await next();
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
};