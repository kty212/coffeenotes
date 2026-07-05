import type { MetadataRoute } from "next";
import { recipes } from "@/data/recipes";

const BASE_URL = "https://coffeenotes.fyi";

export default function sitemap(): MetadataRoute.Sitemap {
  const recipeUrls = recipes.map((recipe) => ({
    url: `${BASE_URL}/recipe/${recipe.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/grind`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/filters`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...recipeUrls,
  ];
}
