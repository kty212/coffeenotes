import { getBagsByYear, getYears } from "@/lib/bags";
import BagCard from "@/components/BagCard";

export default function LogHome() {
  const years = getYears();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-text-primary">Coffee Log</h1>
        <p className="text-text-secondary mt-2 text-sm leading-relaxed">
          Every bag I drink.
        </p>
      </div>

      {years.length > 0 ? (
        years.map((year) => {
          const bags = getBagsByYear(year);
          return (
            <section key={year} className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-border pb-2">
                <a
                  href={`/${year}`}
                  className="font-display text-2xl text-text-primary hover:text-accent transition-colors"
                >
                  {year}
                </a>
                <span className="text-xs font-label text-text-secondary">
                  {bags.length} {bags.length === 1 ? "bag" : "bags"}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {bags.map((bag) => (
                  <BagCard key={bag.id} bag={bag} />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <p className="text-text-secondary text-sm">No bags logged yet.</p>
      )}
    </div>
  );
}
