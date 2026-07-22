import { useMemo, type CSSProperties } from "react";
import type { GridState, ScrapType, ViewMode } from "../types";
import { colorForScrap } from "../lib/palette";
import Cell from "./Cell";

interface GridProps {
  grid: GridState;
  scraps: readonly ScrapType[];
  view: ViewMode;
  onSwap: (from: number, to: number) => void;
}

export default function Grid({ grid, scraps, view, onSwap }: GridProps) {
  // Resolve a base color per scrap id: user-chosen (base mode) or auto-derived.
  const colorById = useMemo(() => {
    const map = new Map<number, string>();
    for (const s of scraps) {
      map.set(s.id, s.color ?? colorForScrap(s.id, scraps.length));
    }
    return map;
  }, [scraps]);

  const style: CSSProperties = {
    gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
  };

  return (
    <div
      role="grid"
      style={style}
      className="grid gap-2 rounded-2xl border border-line bg-surface-2 p-4 shadow-inner"
    >
      {grid.cells.map((scrapId, index) => (
        <Cell
          key={index}
          index={index}
          scrapId={scrapId}
          color={scrapId === null ? "" : colorById.get(scrapId) ?? ""}
          totalScraps={scraps.length}
          view={view}
          onDropCell={onSwap}
        />
      ))}
    </div>
  );
}
