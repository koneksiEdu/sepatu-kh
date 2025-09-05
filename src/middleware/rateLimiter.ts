// lib/rateLimiter.ts
const rateLimitMap = new Map<string, number[]>();

export function rateLimit(ip: string, limit = 5, windowMs = 1000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Filter hanya yang masih dalam jendela waktu
  const recent = timestamps.filter(ts => now - ts < windowMs);

  if (recent.length >= limit) {
    return false; // limit tercapai
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}