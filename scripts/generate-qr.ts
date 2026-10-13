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

function centeredText(
  s: string,
  cx: number,
  y: number,
  size: number,
  weight: number,
  fill: string,
): string {
  return (
    `<text x="${cx}" y="${y}" text-anchor="middle" font-family="DM Sans" ` +
    `font-weight="${weight}" font-size="${size}" fill="${fill}">${escapeXml(s)}</text>`
  );
}

/** Compose the full label SVG for a bag. */
function labelSvg(bag: Bag): string {
  const W = 720;
  const pad = 50;
  const qrSize = 460;
  const cx = W / 2;

  const parts: string[] = [qrMarkup(bagUrl(bag), (W - qrSize) / 2, pad, qrSize)];

  let y = pad + qrSize + 56;

  parts.push(centeredText(bag.roaster, cx, y, 28, 700, COLOR.accent));
  y += 48;

  for (const line of wrap(bag.coffee, 24, 3)) {
    parts.push(centeredText(line, cx, y, 36, 700, COLOR.text));
    y += 46;
  }

  if (bag.roastDate) {
    y += 6;
    parts.push(
      centeredText(`Roasted ${formatDate(bag.roastDate)}`, cx, y, 24, 400, COLOR.muted),
    );
    y += 30;
  }

  const H = Math.round(y - 20 + pad);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
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
      fitTo: { mode: "width", value: 1440 },
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
