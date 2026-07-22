// Shared domain types for the Quilt Pattern Randomizer.

/** A single kind of scrap fabric the user has on hand. */
export interface ScrapType {
  /** 1-based integer key shown to the user and stamped into grid cells. */
  id: number;
  /** How many patches of this scrap are available to place. */
  count: number;
  /** Optional human label (e.g. "floral", "denim"). Defaults to `Scrap {id}`. */
  label: string;
  /**
   * User-chosen fill (any CSS color) for color/pattern views. Set in base mode;
   * omitted in advanced mode, where colors are auto-derived from the id.
   */
  color?: string;
}

/** How each grid cell is rendered. */
export type ViewMode = "number" | "color" | "greyscale" | "pattern";

/**
 * A generated grid. `cells` is a flat, row-major array of scrap ids; a `null`
 * entry is an empty cell (grid capacity exceeded the number of patches).
 */
export interface GridState {
  rows: number;
  cols: number;
  cells: (number | null)[];
}

/** A named, persisted grid design the user has explicitly saved. */
export interface SavedDesign {
  id: string;
  name: string;
  scraps: ScrapType[];
  grid: GridState;
  /** Epoch milliseconds when the design was saved. */
  savedAt: number;
}
