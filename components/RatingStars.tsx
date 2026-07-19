"use client";

import { useEffect, useState } from "react";
import type { RecipeRating } from "@/types/recipe";
import StarRow from "@/components/StarRow";

const voteKey = (recipeId: string) => `rating:${recipeId}`;

export default function RatingStars({
  recipeId,
  initial,
}: {
  recipeId: string;
  initial?: RecipeRating;
}) {
  const [aggregate, setAggregate] = useState<RecipeRating | null>(
    initial ?? null
  );
  const [myVote, setMyVote] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

  // Load this browser's prior vote, and the current aggregate if not provided.
  useEffect(() => {
    const stored = Number(localStorage.getItem(voteKey(recipeId)));
    if (Number.isInteger(stored) && stored >= 1 && stored <= 5) {
      // One-time sync from localStorage (an external store) on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMyVote(stored);
    }
    if (!initial) {
      fetch(`/api/rating/${recipeId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setAggregate(data))
        .catch(() => {});
    }
    // recipeId is stable per page; initial is only read on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  async function submit(stars: number) {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/rating/${recipeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars,
          ...(myVote ? { previousStars: myVote } : {}),
        }),
      });
      if (!res.ok) return;
      const data: RecipeRating = await res.json();
      setAggregate(data);
      setMyVote(stars);
      localStorage.setItem(voteKey(recipeId), String(stars));
    } catch {
      // Ignore network errors; UI simply doesn't update.
    } finally {
      setPending(false);
    }
  }

  const active = hover ?? myVote ?? 0;

  return (
    <div className="bg-warm-white border border-border rounded-2xl p-5">
      <h3 className="font-label text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
        {myVote ? "Your rating" : "Rate this recipe"}
      </h3>

      <div className="flex items-center gap-3">
        <div
          className="flex text-2xl leading-none"
          onMouseLeave={() => setHover(null)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={pending}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              onMouseEnter={() => setHover(star)}
              onClick={() => submit(star)}
              className={`px-0.5 transition-colors disabled:opacity-50 ${
                star <= active ? "text-accent" : "text-border"
              } hover:text-accent`}
            >
              ★
            </button>
          ))}
        </div>
        {myVote && (
          <span className="text-xs text-text-secondary">
            You rated {myVote}/5 — tap to change
          </span>
        )}
      </div>

      {aggregate && aggregate.count > 0 && (
        <div className="flex items-center gap-2 mt-3 text-sm text-text-secondary">
          <StarRow value={aggregate.avg} size="text-sm" />
          <span>
            {aggregate.avg.toFixed(1)} · {aggregate.count} rating
            {aggregate.count === 1 ? "" : "s"}
          </span>
        </div>
      )}
    </div>
  );
}
