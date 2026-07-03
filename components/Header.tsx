"use client";

import { useRef, useEffect } from "react";
import { useSearch } from "@/lib/SearchContext";

export default function Header() {
  const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen } =
    useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus();
  }, [isSearchOpen]);

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
          <div className="flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }
                  }}
                  placeholder="Search..."
                  className="w-40 bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none transition-all"
                />
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Close search"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-text-secondary hover:text-accent transition-colors"
                aria-label="Search recipes"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
