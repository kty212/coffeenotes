"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { recipes } from "@/data/recipes";
import { useSearch } from "@/lib/SearchContext";
import type { Recipe } from "@/types/recipe";

export type SortOption = "default" | "name" | "brewTime" | "ratio" | "temp";

const fuseOptions = {
  threshold: 0.4,
  keys: [
    { name: "name", weight: 2 },
    { name: "tags", weight: 1.5 },
    { name: "description", weight: 1 },
    { name: "grindSize", weight: 0.5 },
    { name: "notes", weight: 0.5 },
    { name: "filter", weight: 0.5 },
  ],
};

export function useRecipeFilters() {
  const { searchQuery } = useSearch();
  const [selectedBrewer, setSelectedBrewer] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const fuse = useMemo(() => new Fuse(recipes, fuseOptions), []);

  const filteredRecipes = useMemo(() => {
    let result: Recipe[];

    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map((r) => r.item);
    } else {
      result = [...recipes];
    }

    if (selectedBrewer !== "all") {
      result = result.filter((r) => r.brewerId === selectedBrewer);
    }

    if (sortBy !== "default") {
      result.sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "brewTime":
            return a.totalBrewTimeSec - b.totalBrewTimeSec;
          case "ratio":
            return a.ratio - b.ratio;
          case "temp":
            return a.waterTempC - b.waterTempC;
        }
      });
    }

    return result;
  }, [searchQuery, selectedBrewer, sortBy, fuse]);

  return {
    filteredRecipes,
    searchQuery,
    selectedBrewer,
    setSelectedBrewer,
    sortBy,
    setSortBy,
  };
}
