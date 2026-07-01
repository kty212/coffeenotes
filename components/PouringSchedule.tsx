import type { Recipe } from "@/types/recipe";
import { formatTime } from "@/lib/recipeUtils";

interface Props {
  recipe: Recipe;
}

export default function PouringSchedule({ recipe }: Props) {
  const totalWater = Math.round(recipe.defaultDose * recipe.ratio);

  let running = 0;
  const steps = recipe.pouringSchedule.map((step) => {
    running += step.pourGrams;
    return { ...step, runningTotal: running };
  });

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl text-accent">{totalWater}g</span>
          <span className="text-text-secondary text-sm">water · 1:{recipe.ratio} ratio</span>
        </div>
      </div>

      <div>
        <h3 className="font-label text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
          Pouring Schedule
        </h3>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl px-4 py-3 flex items-center gap-4"
            >
              <div className="text-lg font-label font-medium text-accent w-12 shrink-0">
                {formatTime(step.timeSeconds)}
              </div>
              <div className="flex-1">
                {step.note && (
                  <div className="text-xs text-text-secondary mb-0.5">{step.note}</div>
                )}
                <div className="flex items-baseline gap-2">
                  {step.pourGrams > 0 ? (
                    <>
                      <span className="text-lg font-medium text-text-primary">{step.pourGrams}g</span>
                      <span className="text-xs text-text-secondary">→ {step.runningTotal}g total</span>
                    </>
                  ) : (
                    <span className="text-sm text-text-secondary italic">No pour — see note</span>
                  )}
                </div>
              </div>
              <div className="text-xs font-label text-text-secondary shrink-0">
                Step {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
