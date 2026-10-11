export interface Bag {
  // Required
  id: string; // e.g. "2026-014" — permanent, never changes (printed on QR)
  date: string; // ISO date opened, e.g. "2026-10-11"
  roaster: string;
  coffee: string; // coffee name
  photo: string; // cover filename, e.g. "2026-014.jpg" (lives in public/bags/<year>/); used in grids
  photos?: string[]; // additional photos (e.g. back of bag), shown on the bag page after the cover

  // Optional
  origin?: string; // origin / farm / producer
  process?: string;
  varietal?: string;
  roastLevel?: string;
  roastDate?: string;
  brewMethod?: string;
  grindSetting?: string;
  tastingNotes?: string;
  rating?: number; // 1–5

  // Free-text "My notes" — the markdown body of the file.
  notes?: string;
}
