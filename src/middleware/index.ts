// src/middleware/index.ts
import type { MiddlewareHandler } from 'astro';
import { getCurrentUser, clearTokens } from '../lib/auth-utils';

export const onRequest: MiddlewareHandler = async ({ locals, request, redirect }, next) => {
  const url = new URL(request.url);

  try {
    const user = await getCurrentUser();
    if (user) {
      locals.user = user;
    }
  } catch (err) {
    console.error('Failed to decode user from token:', err);
    clearTokens();
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

  // Lanjut ke handler berikutnya
  const response = await next();

  // Inject CORS headers ke response global
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
};