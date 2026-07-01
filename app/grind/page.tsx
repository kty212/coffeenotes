import type { Metadata } from "next";

export const metadata: Metadata = { title: "Grind Guide — Coffee Notes" };

const MAX_MICRONS = 1400;
const WILFA_STEP_MICRONS = 35; // 1–41 scale covering ~0–1400 µm

const brewMethods = [
  { name: "Turkish",        min: 0,   max: 200  },
  { name: "Espresso",       min: 200, max: 400  },
  { name: "Moka Pot",       min: 350, max: 550  },
  { name: "AeroPress",      min: 400, max: 900  },
  { name: "Pour Over",      min: 500, max: 900  },
  { name: "Siphon",         min: 450, max: 750  },
  { name: "Filter Machine", min: 500, max: 900  },
  { name: "French Press",   min: 700, max: 1100 },
  { name: "Cold Drip",      min: 800, max: 1200 },
  { name: "Cold Brew",      min: 900, max: 1400 },
];

const scaleLabels = [0, 200, 400, 600, 800, 1000, 1200, 1400];

// Wilfa Uniform positions 1–41; position n ≈ (n–1) × 35 µm
const wilfaPositions = [1, 10, 20, 30, 40];

function wilfaToMicrons(pos: number) {
  return (pos - 1) * WILFA_STEP_MICRONS;
}

function pct(microns: number) {
  return `${(microns / MAX_MICRONS) * 100}%`;
}

// Comparison table rows (µm → settings per grinder)
// K-Ultra: 20 µm/click, max ~760 µm
// ZP6: 22 µm/click
// Comandante C40: 30 µm/click
const tableRows = [
  { microns: 200  },
  { microns: 400  },
  { microns: 600  },
  { microns: 800  },
  { microns: 1000 },
  { microns: 1200 },
].map((r) => ({
  microns: r.microns,
  comandante: Math.round(r.microns / 30),
  kultra: r.microns <= 760 ? Math.round(r.microns / 20) : null,
  zp6: Math.round(r.microns / 22),
}));

export default function GrindPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-1">Grind Guide</h1>
        <p className="text-text-secondary text-sm">Based on Wilfa Uniform · 1 step ≈ 35 µm</p>
      </div>

      {/* Range chart */}
      <div>
        <h2 className="font-label text-xs font-medium text-text-secondary uppercase tracking-wide mb-4">
          Brew Method Ranges
        </h2>

        {/* Wilfa Uniform scale */}
        <div className="relative h-5 mb-1">
          {wilfaPositions.map((pos) => {
            const microns = wilfaToMicrons(pos);
            const isFirst = pos === wilfaPositions[0];
            const isLast = pos === wilfaPositions[wilfaPositions.length - 1];
            return (
              <span
                key={pos}
                className="absolute text-xs font-label text-accent"
                style={{
                  left: pct(microns),
                  transform: isLast ? "translateX(-100%)" : isFirst ? "none" : "translateX(-50%)",
                }}
              >
                {pos}
              </span>
            );
          })}
        </div>
        <div className="text-xs font-label text-accent mb-2 text-right">Wilfa Uniform</div>

        {/* Bars */}
        <div className="space-y-2">
          {brewMethods.map((method) => (
            <div key={method.name} className="relative h-9 bg-warm-white rounded-lg">
              <div
                className="absolute top-0 h-full bg-accent/80 rounded-lg flex items-center px-2"
                style={{ left: pct(method.min), width: pct(method.max - method.min) }}
              >
                <span className="text-xs font-label font-medium text-white truncate">
                  {method.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* µm scale */}
        <div className="relative h-5 mt-2 border-t border-border">
          {scaleLabels.map((val) => (
            <span
              key={val}
              className="absolute text-xs font-label text-text-secondary pt-1"
              style={{
                left: pct(val),
                transform: val === 1400 ? "translateX(-100%)" : val === 0 ? "none" : "translateX(-50%)",
              }}
            >
              {val}
            </span>
          ))}
        </div>
        <div className="text-xs font-label text-text-secondary mt-4">µm</div>
      </div>

      {/* Grinder comparison table */}
      <div>
        <h2 className="font-label text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
          Grinder Comparison
        </h2>
        <p className="text-xs text-text-secondary mb-3">Approximate clicks to reach each grind size.</p>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-warm-white">
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">µm</th>
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">Comandante C40</th>
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">1Zpresso K-Ultra</th>
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">1Zpresso ZP6</th>
              </tr>
              <tr className="border-b border-border bg-warm-white">
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">step size</th>
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">30 µm/click</th>
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">20 µm/click</th>
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">22 µm/click</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={row.microns} className={i < tableRows.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-4 py-3 font-medium text-text-primary">{row.microns}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.comandante}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {row.kultra !== null ? row.kultra : <span className="text-text-secondary/40">—</span>}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{row.zp6}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
