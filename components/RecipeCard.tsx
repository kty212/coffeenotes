import Link from "next/link";
import type { Recipe } from "@/types/recipe";
import { getBrewerById } from "@/data/recipes";
import { formatTime } from "@/lib/recipeUtils";

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const brewer = getBrewerById(recipe.brewerId);

  return (
    <Link href={`/recipe/${recipe.id}`} className="flex flex-col">
      <div className="bg-surface border border-border rounded-2xl p-5 hover:border-accent transition-colors flex flex-col flex-1">
        <div className="mb-3 flex-1">
          <span className="text-xs font-label font-medium text-accent uppercase tracking-wide">
            {brewer?.name}
          </span>
          <h2 className="font-display text-xl text-text-primary mt-1">{recipe.name}</h2>
          {recipe.description && (
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">{recipe.description}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Stat label="Dose" value={`${recipe.defaultDose}g`} />
          <Stat label="Temp" value={`${recipe.waterTempC}°C`} />
          <Stat label="Grind" value={recipe.grindSize} />
          <Stat label="Time" value={formatTime(recipe.totalBrewTimeSec)} />
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-warm-white rounded-lg px-3 py-2">
      <div className="text-xs text-text-secondary font-label">{label}</div>
      <div className="text-sm font-medium text-text-primary mt-0.5 truncate">{value}</div>
    </div>
  );
}
