import type { CSSProperties, DragEvent } from "react";
import type { ViewMode } from "../types";
import { greyForScrap, patternForScrap } from "../lib/palette";

interface CellProps {
  index: number;
  scrapId: number | null;
  /** Resolved base fill color for this scrap (color/pattern views). */
  color: string;
  /** Number of distinct scrap types, for spreading greys in greyscale view. */
  totalScraps: number;
  view: ViewMode;
  onDropCell: (from: number, to: number) => void;
}

function fillStyle(
  scrapId: number,
  color: string,
  totalScraps: number,
  view: ViewMode,
): CSSProperties {
  switch (view) {
    case "color":
      return { background: color };
    case "greyscale":
      return { background: greyForScrap(scrapId, totalScraps) };
    case "pattern":
      return { background: patternForScrap(scrapId, color) };
    case "number":
    default:
      return {};
  }
}

export default function Cell({
  index,
  scrapId,
  color,
  totalScraps,
  view,
  onDropCell,
}: CellProps) {
  const empty = scrapId === null;

  function handleDragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(from) && from !== index) onDropCell(from, index);
  }

  const style = empty ? undefined : fillStyle(scrapId, color, totalScraps, view);
  const showBigNumber = view === "number" && !empty;

  return (
    <div
      draggable={!empty}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={style}
      aria-label={empty ? "empty cell" : `scrap ${scrapId}`}
      className={[
        "relative aspect-square border select-none transition",
        empty
          ? "border-line/60 bg-canvas/60"
          : "cursor-grab border-black/5 hover:z-10 hover:shadow-md active:cursor-grabbing",
        showBigNumber && "bg-surface",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showBigNumber && (
        <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-ink">
          {scrapId}
        </span>
      )}
      {!empty && !showBigNumber && (
        // Corner integer key — always present in non-number views so the layout
        // stays exportable/identifiable (README step 7).
        <span className="absolute bottom-0.5 right-1 text-[11px] font-semibold leading-none text-white mix-blend-difference">
          {scrapId}
        </span>
      )}
    </div>
  );
}
