import type { Metadata } from "next";

export const metadata: Metadata = { title: "Grind Guide — Coffee Notes" };

const MAX_MICRONS = 1400;

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
const descriptors = [
  { label: "Extra Fine", min: 0,    max: 200  },
  { label: "Fine",       min: 200,  max: 400  },
  { label: "Med Fine",   min: 400,  max: 600  },
  { label: "Medium",     min: 600,  max: 800  },
  { label: "Med Coarse", min: 800,  max: 1000 },
  { label: "Coarse",     min: 1000, max: 1200 },
  { label: "X Coarse",   min: 1200, max: 1400 },
];

const comandanteClicks = [0, 7, 13, 20, 27, 33, 40, 47];

const conversionRows = [
  { clicks: 5,  microns: 150,  descriptor: "Extra Fine"   },
  { clicks: 10, microns: 300,  descriptor: "Fine"         },
  { clicks: 15, microns: 450,  descriptor: "Fine"         },
  { clicks: 17, microns: 510,  descriptor: "Fine (pour over)" },
  { clicks: 20, microns: 600,  descriptor: "Medium"       },
  { clicks: 22, microns: 660,  descriptor: "Medium/Coarse" },
  { clicks: 24, microns: 720,  descriptor: "Medium"       },
  { clicks: 28, microns: 840,  descriptor: "Medium Coarse" },
  { clicks: 30, microns: 900,  descriptor: "Medium Coarse" },
  { clicks: 35, microns: 1050, descriptor: "Coarse"       },
  { clicks: 40, microns: 1200, descriptor: "Coarse"       },
  { clicks: 45, microns: 1350, descriptor: "Super Coarse" },
];

function pct(microns: number) {
  return `${(microns / MAX_MICRONS) * 100}%`;
}

export default function GrindPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-1">Grind Guide</h1>
        <p className="text-text-secondary text-sm">Comandante C40 · 1 click ≈ 30 µm</p>
      </div>

      {/* Chart */}
      <div>
        <h2 className="font-label text-xs font-medium text-text-secondary uppercase tracking-wide mb-4">
          Brew Method Ranges
        </h2>
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">

            {/* Click scale */}
            <div className="relative h-5 mb-1">
              {comandanteClicks.map((clicks, i) => (
                <span
                  key={i}
                  className="absolute text-xs font-label text-accent -translate-x-1/2"
                  style={{ left: pct(clicks * 30) }}
                >
                  {clicks}
                </span>
              ))}
            </div>
            <div className="text-xs font-label text-accent mb-2 text-right pr-1">clicks</div>

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
              {scaleLabels.map((val, i) => (
                <span
                  key={i}
                  className="absolute text-xs font-label text-text-secondary -translate-x-1/2 pt-1"
                  style={{ left: pct(val) }}
                >
                  {val}
                </span>
              ))}
            </div>
            <div className="text-xs font-label text-text-secondary mt-4">µm</div>

            {/* Descriptor band */}
            <div className="relative h-6 mt-1">
              {descriptors.map((d) => (
                <span
                  key={d.label}
                  className="absolute text-xs font-label text-text-secondary -translate-x-1/2"
                  style={{ left: pct((d.min + d.max) / 2) }}
                >
                  {d.label}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Conversion table */}
      <div>
        <h2 className="font-label text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
          Click Conversion Table
        </h2>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-warm-white">
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">Clicks</th>
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">Microns</th>
                <th className="text-left px-4 py-3 font-label font-medium text-text-secondary text-xs">Description</th>
              </tr>
            </thead>
            <tbody>
              {conversionRows.map((row, i) => (
                <tr key={row.clicks} className={i < conversionRows.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-4 py-3 font-medium text-accent">{row.clicks}</td>
                  <td className="px-4 py-3 text-text-primary">{row.microns} µm</td>
                  <td className="px-4 py-3 text-text-secondary">{row.descriptor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
