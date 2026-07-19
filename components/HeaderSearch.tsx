"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SearchIcon = () => (
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
);

// Static placeholder rendered as the Suspense fallback so the header keeps its
// layout during prerender; the interactive search hydrates in its place.
export function HeaderSearchFallback() {
  return (
    <div className="flex items-center">
      <span className="text-text-secondary" aria-hidden="true">
        <SearchIcon />
      </span>
    </div>
  );
}

export default function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";

  // Open the search box automatically when arriving on a URL that has a query.
  const [isSearchOpen, setIsSearchOpen] = useState(searchQuery !== "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus();
  }, [isSearchOpen]);

  // Write `q` to the URL. On the home page update in place; elsewhere navigate
  // to the filtered home list so search works from any page.
  const setSearchQuery = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    const query = params.toString();
    if (pathname === "/") {
      router.replace(query ? `/?${query}` : "/", { scroll: false });
    } else {
      router.push(query ? `/?${query}` : "/");
    }
  };

  // Close the search box; only touch the URL if there's an active query to clear
  // (so closing on a recipe page doesn't navigate home).
  const closeSearch = () => {
    if (searchQuery) setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <div className="flex items-center">
      {isSearchOpen ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeSearch();
            }}
            placeholder="Search..."
            className="w-40 bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none transition-all"
          />
          <button
            onClick={closeSearch}
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
          <SearchIcon />
        </button>
      )}
    </div>
  );
}
