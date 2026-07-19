import { getRedis, ratingKey, toAggregate, type RatingAggregate } from "@/lib/redis";
import { recipes } from "@/data/recipes";

// Aggregate ratings for all recipes — used by the home list. Always live.
export const dynamic = "force-dynamic";

export async function GET() {
  const pipeline = getRedis().pipeline();
  for (const recipe of recipes) {
    pipeline.hgetall(ratingKey(recipe.id));
  }
  const results =
    (await pipeline.exec<Array<{ sum?: number; count?: number } | null>>()) ?? [];

  const map: Record<string, Pick<RatingAggregate, "avg" | "count">> = {};
  recipes.forEach((recipe, i) => {
    const { avg, count } = toAggregate(results[i]?.sum, results[i]?.count);
    map[recipe.id] = { avg, count };
  });

  return Response.json(map);
}
