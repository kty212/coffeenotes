/**
 * Build-time QR + label generation.
 *
 * For every bag, writes into public/bags/<year>/:
 *   <id>.svg / <id>.png             — the bare QR code (used inline on the page)
 *   <id>-label.svg / <id>-label.png — a composed, print-ready label with the QR
 *                                     plus roaster, coffee name, and roast date,
 *                                     sized for a label maker.
 *
 * Run via `npm run generate:qr` (also wired into `prebuild`).
 */
import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import { Resvg } from "@resvg/resvg-js";
import { getAllBags, formatDate, yearOf } from "../lib/bags.ts";
import type { Bag } from "../types/bag.ts";

const ROOT = process.cwd();
const PUBLIC_BAGS = path.join(ROOT, "public", "bags");
const FONT_FILE = path.join(ROOT, "assets", "fonts", "DMSans-Regular.ttf");
const BASE_URL = "https://log.coffeenotes.fyi";

// Print/sticker friendly: chunky modules, generous quiet zone.
const SVG_OPTS = { margin: 2, width: 512, errorCorrectionLevel: "M" as const };

// Theme colors (match the site).
const COLOR = {
  text: "#1a1208",
  muted: "#7a6e65",
  accent: "#8b5e3c",
};

function bagUrl(bag: Bag): string {
  return `${BASE_URL}/${bag.id}`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Greedy word-wrap, truncating with an ellipsis past maxLines. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const word of text.split(/\s+/)) {
    const candidate = cur ? `${cur} ${word}` : word;
    if (candidate.length > maxChars && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = candidate;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s,]*\S*$/, "")}…`;
    return kept;
  }
  return lines;
}

/** QR code as SVG rects (black on a white backing including the quiet zone). */
function qrMarkup(url: string, x: number, y: number, size: number): string {
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const data = qr.modules.data;
  const quiet = 2;
  const px = size / (n + quiet * 2);
  let rects = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (data[r * n + c]) {
        const rx = (x + (c + quiet) * px).toFixed(2);
        const ry = (y + (r + quiet) * px).toFixed(2);
        rects += `<rect x="${rx}" y="${ry}" width="${px.toFixed(2)}" height="${px.toFixed(2)}"/>`;
      }
    }
  }
  return (
    `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#ffffff"/>` +
    `<g fill="#000000">${rects}</g>`
  );
}

function leftText(
  s: string,
  x: number,
  y: number,
  size: number,
  weight: number,
  fill: string,
): string {
  return (
    `<text x="${x}" y="${y}" text-anchor="start" font-family="DM Sans" ` +
    `font-weight="${weight}" font-size="${size}" fill="${fill}">${escapeXml(s)}</text>`
  );
}

// Physical label geometry (landscape, matches a 40mm × 14mm label).
const LABEL_MM = { w: 40, h: 14 };
const U = 10; // user units per mm

/** Compose the landscape label SVG for a bag: QR on the left, text on the right. */
function labelSvg(bag: Bag): string {
  const W = LABEL_MM.w * U; // 400
  const H = LABEL_MM.h * U; // 140
  const pad = 7;

  const qrSize = H - pad * 2;
  const parts: string[] = [qrMarkup(bagUrl(bag), pad, pad, qrSize)];

  const tx = pad + qrSize + 10; // text column left edge
  const tw = W - tx - pad; // text column width
  const maxChars = Math.max(10, Math.floor(tw / 9.5)); // ~char width at 18u

  // Build the stacked text lines, then vertically center the block.
  type Line = { s: string; size: number; weight: number; fill: string; lh: number };
  const lines: Line[] = [
    { s: bag.roaster, size: 15, weight: 700, fill: COLOR.accent, lh: 18 },
  ];
  for (const l of wrap(bag.coffee, maxChars, 2)) {
    lines.push({ s: l, size: 18, weight: 700, fill: COLOR.text, lh: 21 });
  }
  if (bag.roastDate) {
    lines.push({
      s: `Roasted ${formatDate(bag.roastDate)}`,
      size: 13,
      weight: 400,
      fill: COLOR.muted,
      lh: 17,
    });
  }

  const blockH = lines.reduce((sum, l) => sum + l.lh, 0);
  let y = (H - blockH) / 2;
  for (const l of lines) {
    y += l.lh;
    parts.push(leftText(l.s, tx, y - 4, l.size, l.weight, l.fill));
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LABEL_MM.w}mm" height="${LABEL_MM.h}mm" ` +
    `viewBox="0 0 ${W} ${H}">` +
    `<rect width="${W}" height="${H}" fill="#ffffff"/>${parts.join("")}</svg>`
  );
}

async function main() {
  const bags = getAllBags();
  for (const bag of bags) {
    const outDir = path.join(PUBLIC_BAGS, yearOf(bag));
    fs.mkdirSync(outDir, { recursive: true });

    const url = bagUrl(bag);

    // Bare QR SVG — shown inline on the bag page.
    const bareSvg = await QRCode.toString(url, { ...SVG_OPTS, type: "svg" });
    fs.writeFileSync(path.join(outDir, `${bag.id}.svg`), bareSvg);

    // Composed print label (SVG + PNG) for a label maker.
    const svg = labelSvg(bag);
    fs.writeFileSync(path.join(outDir, `${bag.id}-label.svg`), svg);
    const png = new Resvg(svg, {
      font: { fontFiles: [FONT_FILE], defaultFontFamily: "DM Sans", loadSystemFonts: false },
      fitTo: { mode: "width", value: 1200 },
    })
      .render()
      .asPng();
    fs.writeFileSync(path.join(outDir, `${bag.id}-label.png`), png);

    console.log(`label  ${bag.id}  ->  ${url}`);
  }
  console.log(`Generated QR + labels for ${bags.length} bag(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
