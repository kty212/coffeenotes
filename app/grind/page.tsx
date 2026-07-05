import type { Metadata } from "next";

export const metadata: Metadata = { title: "Grind Guide — Coffee Notes" };

const MIN_MICRONS = 200;
const MAX_MICRONS = 1600;
const WILFA_STEP_MICRONS = 25.5; // used in comparison table only

// Ranges from KRUVE universal grind size reference (kruveinc.com/pages/brew-guide)
const brewMethods = [
  { name: "Espresso",     min: 200, max: 500  },
  { name: "Percolator",   min: 200, max: 700  },
  { name: "AeroPress",    min: 300, max: 700  },
  { name: "SCA Cupping",  min: 400, max: 1200 },
  { name: "Syphon",       min: 300, max: 1100 },
  { name: "Drip",         min: 400, max: 1200 },
  { name: "Pour Over",    min: 500, max: 1200 },
  { name: "French Press", min: 600, max: 1400 },
  { name: "Cold Brew",    min: 900, max: 1600 },
];

const scaleLabels = [200, 400, 600, 800, 1000, 1200, 1400, 1600];

function pct(microns: number) {
  return `${((microns - MIN_MICRONS) / (MAX_MICRONS - MIN_MICRONS)) * 100}%`;
}

function widthPct(range: number) {
  return `${(range / (MAX_MICRONS - MIN_MICRONS)) * 100}%`;
}

// Comparison table rows (µm → settings per grinder)
// Wilfa Uniform: ~25.5 µm/step, scale 1–41 (max ~1020 µm)
// Comandante C40: 30 µm/click
// ZP6: 22 µm/click
// X-Pro S / JX-Pro S: 12.5 µm/click
// K-Ultra: 20 µm/click
const tableRows = [
  { microns: 200  },
  { microns: 400  },
  { microns: 600  },
  { microns: 800  },
  { microns: 1000 },
].map((r) => ({
  microns: r.microns,
  wilfa: Math.min(41, Math.round(r.microns / WILFA_STEP_MICRONS) + 1),
  comandante: Math.round(r.microns / 30),
  zp6: Math.round(r.microns / 22),
  xpros: Math.round(r.microns / 12.5),
  jxpros: Math.round(r.microns / 12.5),
  kultra: Math.round(r.microns / 20),
}));

export default function GrindPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-1">Grind Guide</h1>
        <p className="text-text-secondary text-sm">
          Universal grind size reference ·{" "}
          <a
            href="https://www.kruveinc.com/pages/brew-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-accent transition-colors"
          >
            Source ↗
          </a>
        </p>
      </div>

      {/* Range chart */}
      <div>
        <h2 className="font-label text-xs font-medium text-text-secondary uppercase tracking-wide mb-4">
          Brew Method Ranges
        </h2>

        {/* Bars */}
        <div className="space-y-2">
          {brewMethods.map((method) => (
            <div key={method.name} className="relative h-9 bg-warm-white rounded-lg">
              <div
                className="absolute top-0 h-full bg-accent/80 rounded-lg flex items-center px-2"
                style={{ left: pct(method.min), width: widthPct(method.max - method.min) }}
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
                transform: val === 1600 ? "translateX(-100%)" : val === 200 ? "none" : "translateX(-50%)",
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
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">Wilfa Uniform</th>
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">Comandante C40</th>
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">1Zpresso ZP6</th>
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">1Zpresso X-Pro S</th>
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">1Zpresso JX-Pro S</th>
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">1Zpresso K-Ultra</th>
              </tr>
              <tr className="border-b border-border bg-warm-white">
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">step size</th>
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">~25.5 µm/step</th>
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">30 µm/click</th>
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">22 µm/click</th>
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">12.5 µm/click</th>
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">12.5 µm/click</th>
                <th className="px-4 pb-2 font-label text-[10px] text-text-secondary/60 text-left">20 µm/click</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={row.microns} className={i < tableRows.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-4 py-3 font-medium text-text-primary">{row.microns}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.wilfa}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.comandante}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.zp6}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.xpros}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.jxpros}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.kultra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
