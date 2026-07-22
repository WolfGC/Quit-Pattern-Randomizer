import type { SavedDesign } from "../types";
import { totalPatches } from "../lib/randomize";
import { card } from "../ui";

interface SavedDesignsProps {
  designs: SavedDesign[];
  onLoad: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function SavedDesigns({
  designs,
  onLoad,
  onRename,
  onDelete,
}: SavedDesignsProps) {
  if (designs.length === 0) return null;

  return (
    <section className={`mx-auto w-full max-w-xl ${card} p-6`}>
      <h2 className="mb-3 text-xl font-semibold text-ink">Saved designs</h2>
      <ul className="flex flex-col gap-2.5">
        {designs.map((d) => (
          <li
            key={d.id}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface-2/60 p-2.5"
          >
            <input
              type="text"
              value={d.name}
              onChange={(e) => onRename(d.id, e.target.value)}
              aria-label={`name for ${d.name}`}
              className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm font-medium text-ink transition hover:border-line focus:border-accent focus:ring-2 focus:ring-accent/25 focus:outline-none"
            />
            <span className="shrink-0 text-xs text-muted">
              {d.grid.rows}&times;{d.grid.cols} &middot; {totalPatches(d.scraps)}{" "}
              block{totalPatches(d.scraps) === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={() => onLoad(d.id)}
              className="shrink-0 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink transition hover:bg-surface-2"
            >
              Load
            </button>
            <button
              type="button"
              onClick={() => onDelete(d.id)}
              aria-label={`delete ${d.name}`}
              className="shrink-0 rounded-full px-2 py-1 text-lg leading-none text-muted transition hover:bg-surface-2 hover:text-ink"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
