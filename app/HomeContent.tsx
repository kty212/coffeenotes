"use client";

import { useEffect, useState } from "react";
import { recipes } from "@/data/recipes";
import { useRecipeFilters } from "@/lib/useRecipeFilters";
import type { SortOption } from "@/lib/useRecipeFilters";
import type { RecipeRating } from "@/types/recipe";
import BrewerFilter from "@/components/BrewerFilter";
import RecipeCard from "@/components/RecipeCard";

export default function HomeContent() {
  const [ratings, setRatings] = useState<Record<string, RecipeRating>>({});

  useEffect(() => {
    fetch("/api/ratings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setRatings(data))
      .catch(() => {});
  }, []);

  const {
    filteredRecipes,
    searchQuery,
    selectedBrewer,
    setSelectedBrewer,
    sortBy,
    setSortBy,
  } = useRecipeFilters();

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedBrewer !== "all" || sortBy !== "default";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-1">Your Recipes</h1>
        <p className="text-text-secondary text-sm">
          {hasActiveFilters
            ? `${filteredRecipes.length} of ${recipes.length} recipes`
            : `${recipes.length} recipes · tap a card to brew`}
        </p>
      </div>

      <div className="flex items-end justify-between gap-3">
        <BrewerFilter selected={selectedBrewer} onChange={setSelectedBrewer} />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-transparent text-xs font-label text-text-secondary hover:text-accent focus:outline-none cursor-pointer transition-colors shrink-0"
        >
          <option value="default">Sort</option>
          <option value="name">Name</option>
          <option value="brewTime">Brew Time</option>
          <option value="ratio">Ratio</option>
          <option value="temp">Temp</option>
        </select>
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="text-text-secondary text-sm py-8 text-center">
          No recipes match your search. Try different keywords or clear your filters.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 items-stretch">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} rating={ratings[recipe.id]} />
          ))}
        </div>
      )}
    </div>
  );
}
