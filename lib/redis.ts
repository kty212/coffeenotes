import { Redis } from "@upstash/redis";

// Lazily create a single shared client from env. Supports both the Vercel
// Upstash integration names (KV_REST_API_URL / KV_REST_API_TOKEN) and the
// plain Upstash names (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
// Lazy so `next build` doesn't throw when env vars aren't present at build time
// (the route handlers are dynamic and only touch Redis at request time).
let client: Redis | null = null;
export function getRedis(): Redis {
  if (!client) {
    const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
    const token =
      process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error(
        "Missing Redis credentials: set KV_REST_API_URL/KV_REST_API_TOKEN (Vercel Upstash integration) or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN."
      );
    }
    client = new Redis({ url, token });
  }
  return client;
}

// Redis key for a recipe's rating aggregate (hash with `sum` and `count` fields).
export const ratingKey = (recipeId: string) => `rating:${recipeId}`;

export interface RatingAggregate {
  sum: number;
  count: number;
  avg: number;
}

export function toAggregate(
  sum: number | null | undefined,
  count: number | null | undefined
): RatingAggregate {
  const s = Number(sum) || 0;
  const c = Number(count) || 0;
  return { sum: s, count: c, avg: c > 0 ? Math.round((s / c) * 10) / 10 : 0 };
}
