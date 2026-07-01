import type { Metadata } from "next";

export const metadata: Metadata = { title: "Filter Guide — Coffee Notes" };

const filters = [
  {
    name: "Hario V60 Paper (01)",
    material: "Paper",
    compatible: ["Hario V60 (size 01)"],
    flow: "Medium",
    cup: "Clean, bright, high clarity. Absorbs oils for a lighter body.",
    notes: "01 fits 1–2 cup brews. Rinse before use to remove paper taste.",
  },
  {
    name: "Hario V60 Paper (02)",
    material: "Paper",
    compatible: ["Hario V60 (size 02)", "Hario Neo"],
    flow: "Medium",
    cup: "Clean, bright, high clarity. Absorbs oils for a lighter body.",
    notes: "02 fits 1–4 cup brews. Most common size for home brewing.",
  },
  {
    name: "Orea Wave",
    material: "Paper",
    compatible: ["Orea V4", "Orea O1"],
    flow: "Medium",
    cup: "Balanced clarity and sweetness. Wave shape promotes even extraction.",
    notes: "Good all-round choice for the Orea. Start here if unsure.",
  },
  {
    name: "Orea Flat Paper + Negotiator",
    material: "Paper",
    compatible: ["Orea V4"],
    flow: "Slow–Medium",
    cup: "More body and sweetness than Wave. Slower flow = more contact time.",
    notes: "The Negotiator is a flow restrictor. Use a slightly coarser grind vs Wave.",
  },
  {
    name: "SIBARIST FAST",
    material: "Paper",
    compatible: ["Orea V4", "Orea O1", "Various"],
    flow: "Fast",
    cup: "Very clean and delicate. Fast flow highlights subtle floral and tea-like notes.",
    notes: "Grind finer than Wave to compensate for faster flow.",
  },
  {
    name: "April Paper Filter",
    material: "Paper",
    compatible: ["April Brewer"],
    flow: "Medium",
    cup: "Clean, sweet, balanced. Designed specifically for the April Brewer geometry.",
    notes: "Use only with the April Brewer — geometry won't fit other drippers.",
  },
];

export default function FiltersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-1">Filter Guide</h1>
        <p className="text-text-secondary text-sm">
          How different filters affect flow rate, clarity, and cup character.
        </p>
      </div>

      <div className="space-y-3">
        {filters.map((f) => (
          <div key={f.name} className="bg-surface border border-border rounded-2xl p-5 space-y-3">
            <div>
              <span className="text-xs font-label font-medium text-accent uppercase tracking-wide">
                {f.material}
              </span>
              <h2 className="font-display text-xl text-text-primary mt-1">{f.name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-warm-white rounded-lg px-3 py-2">
                <div className="text-xs text-text-secondary font-label">Flow</div>
                <div className="text-sm font-medium text-text-primary mt-0.5">{f.flow}</div>
              </div>
              <div className="bg-warm-white rounded-lg px-3 py-2">
                <div className="text-xs text-text-secondary font-label">Compatible</div>
                <div className="text-sm font-medium text-text-primary mt-0.5">{f.compatible.join(", ")}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-text-secondary font-label mb-1">Cup character</div>
              <p className="text-sm text-text-primary">{f.cup}</p>
            </div>

            {f.notes && (
              <p className="text-xs text-text-secondary border-t border-border pt-3">{f.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
