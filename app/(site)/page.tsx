import { Suspense } from "react";
import HomeContent from "./HomeContent";

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}

// Static shell rendered while the URL-driven filter UI hydrates.
function HomeFallback() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-1">Your Recipes</h1>
        <p className="text-text-secondary text-sm">Loading recipes…</p>
      </div>
    </div>
  );
}
