import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Bag } from "@/types/bag";

const BAGS_DIR = path.join(process.cwd(), "bags");
const ID_PATTERN = /^\d{4}-\d{3}$/;

const REQUIRED_FIELDS = ["id", "date", "roaster", "coffee", "photo"] as const;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Normalize a frontmatter date to a plain "YYYY-MM-DD" string.
 * YAML parses an unquoted `2026-10-11` into a Date (at UTC midnight), so we
 * read it back in UTC to avoid a timezone-induced off-by-one day.
 */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

/** "2026-10-11" -> "Oct 11, 2026". Parsed as plain parts, no timezone math. */
export function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function parseBagFile(filePath: string): Bag {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw new Error(`Bag "${filePath}" is missing required field "${field}".`);
    }
  }

  const id = String(data.id);
  if (!ID_PATTERN.test(id)) {
    throw new Error(`Bag "${filePath}" has invalid id "${id}" (expected YYYY-###).`);
  }

  const notes = content.trim();

  const extraPhotos = Array.isArray(data.photos)
    ? data.photos.map(String)
    : data.photos
      ? [String(data.photos)]
      : undefined;

  return {
    id,
    date: normalizeDate(data.date),
    roaster: String(data.roaster),
    coffee: String(data.coffee),
    photo: String(data.photo),
    photos: extraPhotos,
    origin: data.origin ? String(data.origin) : undefined,
    process: data.process ? String(data.process) : undefined,
    varietal: data.varietal ? String(data.varietal) : undefined,
    roastLevel: data.roastLevel ? String(data.roastLevel) : undefined,
    roastDate: data.roastDate ? normalizeDate(data.roastDate) : undefined,
    brewMethod: data.brewMethod ? String(data.brewMethod) : undefined,
    grindSetting: data.grindSetting ? String(data.grindSetting) : undefined,
    tastingNotes: data.tastingNotes ? String(data.tastingNotes) : undefined,
    rating: data.rating != null ? Number(data.rating) : undefined,
    notes: notes || undefined,
  };
}

/** Year directory name, derived from the bag id (first four digits). */
export function yearOf(bag: Bag): string {
  return bag.id.slice(0, 4);
}

/** Public path to a bag's cover photo, e.g. "/bags/2026/2026-001.jpg". */
export function photoUrl(bag: Bag): string {
  return `/bags/${yearOf(bag)}/${bag.photo}`;
}

/** All of a bag's photo paths, cover first. */
export function photoUrls(bag: Bag): string[] {
  const year = yearOf(bag);
  return [bag.photo, ...(bag.photos ?? [])].map((f) => `/bags/${year}/${f}`);
}

/** Notes body split into paragraphs on blank lines. */
export function notesParagraphs(bag: Bag): string[] {
  if (!bag.notes) return [];
  return bag.notes
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** All bags, newest first (by id, which sorts chronologically). */
export function getAllBags(): Bag[] {
  if (!fs.existsSync(BAGS_DIR)) return [];

  const bags: Bag[] = [];
  for (const year of fs.readdirSync(BAGS_DIR)) {
    const yearDir = path.join(BAGS_DIR, year);
    if (!fs.statSync(yearDir).isDirectory()) continue;
    for (const file of fs.readdirSync(yearDir)) {
      if (!file.endsWith(".md")) continue;
      bags.push(parseBagFile(path.join(yearDir, file)));
    }
  }

  return bags.sort((a, b) => b.id.localeCompare(a.id));
}

export function getBagsByYear(year: string): Bag[] {
  return getAllBags().filter((bag) => yearOf(bag) === year);
}

export function getBagById(id: string): Bag | undefined {
  return getAllBags().find((bag) => bag.id === id);
}

/** Distinct years that have at least one bag, newest first. */
export function getYears(): string[] {
  const years = new Set(getAllBags().map(yearOf));
  return [...years].sort((a, b) => b.localeCompare(a));
}
