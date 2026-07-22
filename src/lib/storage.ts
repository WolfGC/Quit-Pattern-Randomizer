// localStorage persistence for the in-progress working state and saved designs.
// All access is wrapped so a disabled/full storage never crashes the app.

import type { GridState, SavedDesign, ScrapType } from "../types";

const WORKING_KEY = "qpr:working:v1";
const DESIGNS_KEY = "qpr:designs:v1";

/** The current, unsaved editing state — restored on reload / navigate-back. */
export interface WorkingState {
  scraps: ScrapType[];
  grid: GridState | null;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable or over quota — persistence is best-effort.
  }
}

export function loadWorking(): WorkingState | null {
  return read<WorkingState | null>(WORKING_KEY, null);
}

export function saveWorking(state: WorkingState): void {
  write(WORKING_KEY, state);
}

export function loadDesigns(): SavedDesign[] {
  const designs = read<SavedDesign[]>(DESIGNS_KEY, []);
  return Array.isArray(designs) ? designs : [];
}

export function saveDesigns(designs: SavedDesign[]): void {
  write(DESIGNS_KEY, designs);
}

/** Best-effort unique id for a saved design. */
export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
