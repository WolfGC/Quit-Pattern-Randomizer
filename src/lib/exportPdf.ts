// PDF export — intentionally stubbed for now (see README step 7).

import type { GridState, ScrapType } from "../types";

/**
 * TODO: Generate a downloadable PDF of the laid-out grid. The intended output:
 *   - The grid drawn to scale, one box per cell.
 *   - Each cell stamped with its scrap integer in a bottom corner.
 *   - A key/legend listing every scrap id, its label, and its total count.
 *
 * Implementation options considered: jsPDF (+ optional html2canvas) for a direct
 * download, or window.print() with print-specific CSS. Decision deferred.
 */
export function exportPdf(grid: GridState, scraps: readonly ScrapType[]): void {
  console.warn(
    "[exportPdf] Not implemented yet.",
    `grid=${grid.rows}x${grid.cols}`,
    `scraps=${scraps.length}`,
  );
}
