"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { recipes } from "@/data/recipes";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the single source of truth for filters.
  const searchQuery = searchParams.get("q") ?? "";
  const selectedBrewer = searchParams.get("brewer") ?? "all";
  const sortBy = (searchParams.get("sort") as SortOption) ?? "default";

  // Merge a param into the URL, dropping it when it's the default value so the
  // URL stays clean. `replace` (not `push`) keeps a single home history entry.
  const setParam = useCallback(
    (name: string, value: string, defaultValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === defaultValue) params.delete(name);
      else params.set(name, value);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  const setSelectedBrewer = useCallback(
    (id: string) => setParam("brewer", id, "all"),
    [setParam]
  );
  const setSortBy = useCallback(
    (sort: SortOption) => setParam("sort", sort, "default"),
    [setParam]
  );

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
