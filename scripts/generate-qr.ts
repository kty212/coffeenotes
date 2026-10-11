/**
 * Build-time QR generation.
 *
 * For every bag, writes an SVG (for print) and a PNG (for Instagram) encoding
 * the bag's permanent URL into public/bags/<year>/<id>.svg|png.
 *
 * Run via `npm run generate:qr` (also wired into `prebuild`).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import QRCode from "qrcode";

const ROOT = process.cwd();
const BAGS_DIR = path.join(ROOT, "bags");
const PUBLIC_BAGS = path.join(ROOT, "public", "bags");
const BASE_URL = "https://log.coffeenotes.fyi";

// Print/sticker friendly: chunky modules, generous quiet zone.
const SVG_OPTS = { margin: 2, width: 512, errorCorrectionLevel: "M" as const };
const PNG_OPTS = { margin: 2, width: 1024, errorCorrectionLevel: "M" as const };

function collectBagIds(): string[] {
  if (!fs.existsSync(BAGS_DIR)) return [];
  const ids: string[] = [];
  for (const year of fs.readdirSync(BAGS_DIR)) {
    const yearDir = path.join(BAGS_DIR, year);
    if (!fs.statSync(yearDir).isDirectory()) continue;
    for (const file of fs.readdirSync(yearDir)) {
      if (!file.endsWith(".md")) continue;
      const { data } = matter(fs.readFileSync(path.join(yearDir, file), "utf8"));
      if (data.id) ids.push(String(data.id));
    }
  }
  return ids;
}

async function main() {
  const ids = collectBagIds();
  for (const id of ids) {
    const year = id.slice(0, 4);
    const outDir = path.join(PUBLIC_BAGS, year);
    fs.mkdirSync(outDir, { recursive: true });

    const url = `${BASE_URL}/${id}`;
    const svg = await QRCode.toString(url, { ...SVG_OPTS, type: "svg" });
    fs.writeFileSync(path.join(outDir, `${id}.svg`), svg);
    await QRCode.toFile(path.join(outDir, `${id}.png`), url, { ...PNG_OPTS, type: "png" });

    console.log(`QR  ${id}  ->  ${url}`);
  }
  console.log(`Generated QR codes for ${ids.length} bag(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
