"use client";

import { useState } from "react";
import { recipes } from "@/data/recipes";
import BrewerFilter from "@/components/BrewerFilter";
import RecipeCard from "@/components/RecipeCard";

export default function HomeContent() {
  const [selectedBrewer, setSelectedBrewer] = useState("all");

  const filtered =
    selectedBrewer === "all"
      ? recipes
      : recipes.filter((r) => r.brewerId === selectedBrewer);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-1">Your Recipes</h1>
        <p className="text-text-secondary text-sm">
          {recipes.length} recipes · tap a card to brew
        </p>
      </div>

      <BrewerFilter selected={selectedBrewer} onChange={setSelectedBrewer} />

      {filtered.length === 0 ? (
        <p className="text-text-secondary text-sm py-8 text-center">
          No recipes for this brewer yet.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 items-stretch">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
