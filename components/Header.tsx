import { Suspense } from "react";
import HeaderSearch, { HeaderSearchFallback } from "@/components/HeaderSearch";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="font-display text-xl text-text-primary">
          Coffee Notes
        </a>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm font-label text-text-secondary hover:text-accent transition-colors"
            >
              Recipes
            </a>
            <a
              href="/grind"
              className="text-sm font-label text-text-secondary hover:text-accent transition-colors"
            >
              Grind
            </a>
            <a
              href="/filters"
              className="text-sm font-label text-text-secondary hover:text-accent transition-colors"
            >
              Filters
            </a>
          </nav>
          <Suspense fallback={<HeaderSearchFallback />}>
            <HeaderSearch />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
