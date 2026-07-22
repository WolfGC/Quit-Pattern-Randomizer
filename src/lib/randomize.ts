// Grid generation and shuffling. Pure functions — no React, no shared state.

import type { GridState, ScrapType } from "../types";

/** Fisher-Yates shuffle. Returns a new array; does not mutate the input. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Total number of patches across all scrap types. */
export function totalPatches(scraps: readonly ScrapType[]): number {
  return scraps.reduce((sum, s) => sum + Math.max(0, s.count), 0);
}

/**
 * Expand each scrap id by its count, randomly place the patches into a
 * `rows * cols` grid, and pad any leftover cells with `null`. If there are more
 * patches than cells, the overflow is dropped (the UI should warn the user).
 */
export function buildGrid(
  scraps: readonly ScrapType[],
  rows: number,
  cols: number,
): GridState {
  const capacity = rows * cols;

  const patches: number[] = [];
  for (const scrap of scraps) {
    for (let i = 0; i < Math.max(0, scrap.count); i++) {
      patches.push(scrap.id);
    }
  }

  const placed = shuffle(patches).slice(0, capacity);
  const cells: (number | null)[] = new Array(capacity).fill(null);
  for (let i = 0; i < placed.length; i++) {
    cells[i] = placed[i];
  }

  return { rows, cols, cells: shuffle(cells) };
}

/** Swap the scrap ids at two cell indices, returning a new cells array. */
export function swapCells(
  cells: readonly (number | null)[],
  a: number,
  b: number,
): (number | null)[] {
  const out = cells.slice();
  [out[a], out[b]] = [out[b], out[a]];
  return out;
}
