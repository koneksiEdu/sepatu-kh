// src/env.d.ts atau src/astro.d.ts
import type { MiddlewareHandler } from 'astro';

declare global {
  namespace App {
    interface Locals {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
      newAccessToken?: string;
    }
  }
}