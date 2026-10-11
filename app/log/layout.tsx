import type { Metadata } from "next";
import { getYears } from "@/lib/bags";

export const metadata: Metadata = {
  metadataBase: new URL("https://log.coffeenotes.fyi"),
  title: {
    default: "Coffee Log",
    template: "%s — Coffee Log",
  },
  description:
    "A year-by-year log of every coffee bag I drink — one permanent page per bag.",
};

export default function LogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const years = getYears();

  return (
    <>
      <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* On the log subdomain this resolves to the log home via the proxy. */}
          <a href="/" className="font-display text-xl text-text-primary">
            Coffee Log
          </a>
          <nav className="flex items-center gap-4">
            {years.map((year) => (
              <a
                key={year}
                href={`/${year}`}
                className="text-sm font-label text-text-secondary hover:text-accent transition-colors"
              >
                {year}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
    </>
  );
}
