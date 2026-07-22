// Suggest a grid size given how many patches the user has to place.

export interface GridSize {
  rows: number;
  cols: number;
}

/**
 * Recommend the most square-like grid whose capacity is at least `total`.
 * Prefers the factor pair of `total` closest to a square; if `total` has no
 * near-square factorization, grows to the next size that fits.
 */
export function recommendGrid(total: number): GridSize {
  if (total <= 0) return { rows: 1, cols: 1 };

  const root = Math.floor(Math.sqrt(total));

  // Exact square-ish factor pair (no empty cells) if one exists near the root.
  for (let rows = root; rows >= 1; rows--) {
    if (total % rows === 0) {
      const cols = total / rows;
      return { rows, cols };
    }
  }

  // Fallback: smallest near-square grid whose area covers `total`.
  const rows = root;
  const cols = Math.ceil(total / rows);
  return { rows, cols };
}
