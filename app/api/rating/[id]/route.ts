import { getRedis, ratingKey, toAggregate } from "@/lib/redis";
import { getRecipeById } from "@/data/recipes";

// Ratings are live counters — never statically cache these handlers.
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const hash = await getRedis().hgetall<{ sum: number; count: number }>(
    ratingKey(id)
  );
  return Response.json(toAggregate(hash?.sum, hash?.count));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!getRecipeById(id)) {
    return Response.json({ error: "Unknown recipe" }, { status: 404 });
  }

  let body: { stars?: unknown; previousStars?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const stars = Number(body.stars);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return Response.json(
      { error: "`stars` must be an integer between 1 and 5" },
      { status: 400 }
    );
  }

  const redis = getRedis();
  const key = ratingKey(id);
  const prev = Number(body.previousStars);
  const hasPrev = Number.isInteger(prev) && prev >= 1 && prev <= 5;

  let sum: number;
  let count: number;
  if (hasPrev) {
    // Changing an existing vote: adjust the sum by the delta, count unchanged.
    sum = (await redis.hincrby(key, "sum", stars - prev)) as number;
    count = (await redis.hget<number>(key, "count")) ?? 0;
  } else {
    // First vote from this browser for this recipe.
    [sum, count] = (await Promise.all([
      redis.hincrby(key, "sum", stars),
      redis.hincrby(key, "count", 1),
    ])) as [number, number];
  }

  return Response.json(toAggregate(sum, count));
}
