// PDF export of the laid-out grid + a matching key.
//
// Zero-dependency approach: build a self-contained, print-styled HTML document
// in a new window and invoke the browser's print dialog, where the user can
// "Save as PDF". (The alternative, jsPDF, was declined to avoid a new dep.)
//
// The exported layout mirrors the on-screen *color* view: each cell is filled
// with its scrap color and stamped with the scrap integer in the bottom-right
// corner (README step 7). A key lists every scrap — swatch, id, label, and the
// count of patches available vs. actually placed — so the printout is a
// standalone cutting/placement reference.

import type { GridState, ScrapType } from "../types";
import { colorForScrap } from "./palette";

/** Escape text for safe interpolation into the generated HTML. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Resolve the fill color for a scrap id: user-chosen or auto-derived (same
 *  rule as the on-screen color view). */
function colorMap(scraps: readonly ScrapType[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const s of scraps) {
    map.set(s.id, s.color ?? colorForScrap(s.id, scraps.length));
  }
  return map;
}

/** Count how many patches of each scrap id actually landed in the grid. */
function placedCounts(grid: GridState): Map<number, number> {
  const counts = new Map<number, number>();
  for (const id of grid.cells) {
    if (id !== null) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

function gridHtml(grid: GridState, colors: Map<number, string>): string {
  const cells = grid.cells
    .map((id) => {
      if (id === null) {
        return `<div class="cell empty"></div>`;
      }
      const bg = colors.get(id) ?? "#ccc";
      return `<div class="cell" style="background:${esc(bg)}"><span>${id}</span></div>`;
    })
    .join("");
  return `<div class="grid" style="grid-template-columns:repeat(${grid.cols},1fr)">${cells}</div>`;
}

function keyHtml(
  scraps: readonly ScrapType[],
  colors: Map<number, string>,
  placed: Map<number, number>,
): string {
  const rows = [...scraps]
    .sort((a, b) => a.id - b.id)
    .map((s) => {
      const bg = colors.get(s.id) ?? "#ccc";
      const label = s.label?.trim() ? esc(s.label) : `Scrap ${s.id}`;
      const got = placed.get(s.id) ?? 0;
      const note =
        got === s.count
          ? `${s.count} patches`
          : `${got} of ${s.count} placed`;
      return `<div class="key-row">
        <span class="swatch" style="background:${esc(bg)}"><b>${s.id}</b></span>
        <span class="key-label">${label}</span>
        <span class="key-count">${note}</span>
      </div>`;
    })
    .join("");
  return `<div class="key">${rows}</div>`;
}

function documentHtml(grid: GridState, scraps: readonly ScrapType[]): string {
  const colors = colorMap(scraps);
  const placed = placedCounts(grid);
  const totalPlaced = [...placed.values()].reduce((a, b) => a + b, 0);
  const empties = grid.cells.length - totalPlaced;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Quilt Pattern — ${grid.rows}×${grid.cols}</title>
<style>
  * { box-sizing: border-box; }
  :root {
    --ink: #3a332b;
    --muted: #8c8172;
    --line: #e7dcc9;
    --canvas: #f7f1e7;
  }
  html, body { margin: 0; }
  body {
    font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--ink);
    padding: 28px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  header { margin-bottom: 20px; }
  h1 { font-size: 22px; font-weight: 600; margin: 0 0 4px; }
  .sub { color: var(--muted); font-size: 13px; }

  .grid {
    display: grid;
    gap: 0;
    width: 100%;
    max-width: 640px;
    margin: 0 auto 28px;
    border: 1px solid var(--line);
  }
  .cell {
    position: relative;
    aspect-ratio: 1 / 1;
    border: 0.5px solid rgba(0,0,0,0.08);
  }
  .cell.empty { background: var(--canvas); }
  .cell span {
    position: absolute;
    right: 2px;
    bottom: 1px;
    font-size: 9px;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-shadow: 0 0 2px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,0.85);
  }

  h2 { font-size: 15px; font-weight: 600; margin: 0 0 10px; }
  .key {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 8px 20px;
    max-width: 640px;
    margin: 0 auto;
  }
  .key-row { display: flex; align-items: center; gap: 10px; }
  .swatch {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    flex: none;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 5px;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    text-shadow: 0 0 2px rgba(0,0,0,0.85);
  }
  .key-label { font-weight: 500; }
  .key-count { color: var(--muted); font-size: 12px; margin-left: auto; white-space: nowrap; }

  @page { margin: 14mm; }
  @media print {
    body { padding: 0; }
    .grid, .key { break-inside: avoid; }
  }
</style>
</head>
<body>
  <header>
    <h1>Quilt Pattern Randomizer</h1>
    <div class="sub">${grid.rows} × ${grid.cols} grid — ${totalPlaced} patches${
      empties > 0 ? `, ${empties} empty` : ""
    }. Numbers in the bottom corner of each block match the key below.</div>
  </header>

  ${gridHtml(grid, colors)}

  <h2>Key</h2>
  ${keyHtml(scraps, colors, placed)}

  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 150);
    });
  </script>
</body>
</html>`;
}

/**
 * Open a print-ready document (color grid + matching key) in a new window and
 * trigger the print dialog, where the user can save it as a PDF. No-op with a
 * warning if the popup is blocked or there is nothing to export.
 */
export function exportPdf(grid: GridState, scraps: readonly ScrapType[]): void {
  if (grid.cells.length === 0 || scraps.length === 0) {
    console.warn("[exportPdf] Nothing to export.");
    return;
  }

  // Note: no `noopener` here — that makes window.open return null, so we'd
  // never get a handle to write the document into (leaving a blank tab).
  const win = window.open("", "_blank");
  if (!win) {
    console.warn("[exportPdf] Popup blocked — could not open print window.");
    return;
  }

  win.document.open();
  win.document.write(documentHtml(grid, scraps));
  win.document.close();
}
