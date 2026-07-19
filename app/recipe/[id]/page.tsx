import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getRecipeById, getBrewerById, recipes } from "@/data/recipes";
import { formatTime } from "@/lib/recipeUtils";
import PouringSchedule from "@/components/PouringSchedule";
import RatingStars from "@/components/RatingStars";

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = getRecipeById(id);
  if (!recipe) return { title: "Recipe not found" };

  const brewer = getBrewerById(recipe.brewerId);
  const description =
    recipe.description ||
    `${recipe.name} pour-over recipe for ${brewer?.name ?? "coffee"}. ${recipe.defaultDose}g dose, ${recipe.waterTempC}°C, ${formatTime(recipe.totalBrewTimeSec)} brew time.`;

  return {
    title: `${recipe.name}`,
    description,
    openGraph: {
      title: `${recipe.name} — Coffee Notes`,
      description,
    },
  };
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = getRecipeById(id);
  if (!recipe) notFound();

  const brewer = getBrewerById(recipe.brewerId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    description:
      recipe.description ||
      `${recipe.name} pour-over recipe for ${brewer?.name ?? "coffee"}.`,
    recipeCategory: "Beverage",
    recipeCuisine: "Coffee",
    totalTime: `PT${Math.ceil(recipe.totalBrewTimeSec / 60)}M`,
    recipeIngredient: [
      `${recipe.defaultDose}g coffee`,
      `${Math.round(recipe.defaultDose * recipe.ratio)}g water at ${recipe.waterTempC}°C`,
    ],
    recipeInstructions: recipe.pouringSchedule.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: `At ${formatTime(step.timeSeconds)}: pour ${step.pourGrams}g${step.note ? ` — ${step.note}` : ""}`,
    })),
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back */}
      <Link href="/" className="inline-flex items-center text-sm text-text-secondary hover:text-accent transition-colors gap-1">
        ← All recipes
      </Link>

      {/* Header */}
      <div>
        <span className="text-xs font-label font-medium text-accent uppercase tracking-wide">
          {brewer?.name}
        </span>
        <h1 className="font-display text-3xl text-text-primary mt-1">{recipe.name}</h1>
        {recipe.description && (
          <p className="text-text-secondary mt-2 text-sm leading-relaxed">{recipe.description}</p>
        )}
      </div>

      {/* Rating */}
      <RatingStars recipeId={recipe.id} />

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBox label="Dose" value={`${recipe.defaultDose}g`} />
        <StatBox label="Temp" value={`${recipe.waterTempC}°C`} />
        <StatBox label="Grind" value={recipe.grindSize} />
        <StatBox label="Time" value={formatTime(recipe.totalBrewTimeSec)} />
      </div>


      {/* Filter */}
      {recipe.filter && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-label text-text-secondary uppercase tracking-wide">Filter</span>
          <span className="text-sm font-medium text-text-primary">{recipe.filter}</span>
        </div>
      )}

      {/* Pouring schedule */}
      <PouringSchedule recipe={recipe} />

      {/* TDS */}
      {recipe.targetTds && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-label text-text-secondary uppercase tracking-wide">Target TDS</span>
          <span className="text-sm font-medium text-text-primary">{recipe.targetTds}</span>
        </div>
      )}

      {/* Notes */}
      {recipe.notes && (
        <div className="bg-warm-white border border-border rounded-2xl p-5">
          <h3 className="font-label text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
            Notes
          </h3>
          <p className="text-sm text-text-primary leading-relaxed">{recipe.notes}</p>
        </div>
      )}

      {/* Source */}
      {recipe.sourceUrl && (
        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-accent transition-colors"
        >
          Source ↗
        </a>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl px-3 py-3 text-center">
      <div className="text-xs text-text-secondary font-label">{label}</div>
      <div className="text-sm font-medium text-text-primary mt-0.5 leading-tight">{value}</div>
    </div>
  );
}
