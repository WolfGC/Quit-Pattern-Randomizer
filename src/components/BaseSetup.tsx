import { useState } from "react";
import type { ScrapType } from "../types";
import { defaultSwatch } from "../lib/palette";
import { recommendGrid } from "../lib/recommend";
import { btnPrimary, card, field } from "../ui";

interface BaseSetupProps {
  /** Pre-populate the scrap list (e.g. when editing an existing grid). */
  initialScraps?: ScrapType[];
  /** Pre-populate the grid size. Omit to follow the recommendation. */
  initialRows?: number;
  initialCols?: number;
  onGenerate: (scraps: ScrapType[], rows: number, cols: number) => void;
}

/**
 * A scrap while it's being edited. `count` is kept as raw text so the field can
 * be cleared completely; it's converted to a number only when generating.
 */
interface DraftScrap {
  id: number;
  label: string;
  color: string;
  count: string;
}

function newScrap(index: number): DraftScrap {
  const id = index + 1;
  return { id, label: `Scrap ${id}`, count: "1", color: defaultSwatch(index) };
}

function toDrafts(scraps: ScrapType[]): DraftScrap[] {
  return scraps.map((s) => ({
    id: s.id,
    label: s.label,
    color: s.color ?? defaultSwatch(s.id - 1),
    count: String(s.count),
  }));
}

/** Reassign sequential 1-based ids after add/remove so keys stay contiguous. */
function renumber(scraps: DraftScrap[]): DraftScrap[] {
  return scraps.map((s, i) => ({ ...s, id: i + 1 }));
}

/** Keep digits only, so the field accepts numbers and can be emptied. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

const NUM_INPUT = `${field} w-16 text-center`;

export default function BaseSetup({
  initialScraps,
  initialRows,
  initialCols,
  onGenerate,
}: BaseSetupProps) {
  const [scraps, setScraps] = useState<DraftScrap[]>(() =>
    initialScraps && initialScraps.length > 0
      ? toDrafts(initialScraps)
      : [newScrap(0)],
  );
  // Empty string = "follow the recommendation" (the field shows it, but the
  // user can clear it and type their own value).
  const [rowsInput, setRowsInput] = useState<string>(
    initialRows != null ? String(initialRows) : "",
  );
  const [colsInput, setColsInput] = useState<string>(
    initialCols != null ? String(initialCols) : "",
  );

  const total = scraps.reduce((sum, s) => sum + Number(s.count || 0), 0);
  const recommended = recommendGrid(total);

  // What's displayed: the user's entry, or the recommendation when left blank.
  const rowsStr = rowsInput === "" ? String(recommended.rows) : rowsInput;
  const colsStr = colsInput === "" ? String(recommended.cols) : colsInput;
  const rows = Number(rowsStr) || 0;
  const cols = Number(colsStr) || 0;
  const capacity = rows * cols;

  function updateScrap(id: number, patch: Partial<DraftScrap>) {
    setScraps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }

  function addScrap() {
    setScraps((prev) => [...prev, newScrap(prev.length)]);
  }

  function removeScrap(id: number) {
    setScraps((prev) => renumber(prev.filter((s) => s.id !== id)));
  }

  function generate() {
    if (total === 0) return;
    const next: ScrapType[] = scraps.map((s) => ({
      id: s.id,
      label: s.label,
      color: s.color,
      count: Number(s.count || 0),
    }));
    // Fall back to the recommendation if a dimension was left blank.
    onGenerate(
      next,
      rows > 0 ? rows : recommended.rows,
      cols > 0 ? cols : recommended.cols,
    );
  }

  return (
    <div className={`mx-auto flex w-full max-w-xl flex-col gap-6 ${card} p-6 text-left`}>
      <div>
        <h2 className="text-xl font-semibold text-ink">Your scraps</h2>
        <p className="mt-1 text-sm text-muted">
          Add each scrap fabric, pick its color, and set how many blocks you
          have.
        </p>
      </div>

      <ol className="flex flex-col gap-2.5">
        {scraps.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/60 p-2.5"
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-strong">
              {s.id}
            </span>

            <label
              className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-line shadow-sm"
              title="Scrap color"
              style={{ background: s.color }}
            >
              <input
                type="color"
                value={s.color}
                onChange={(e) => updateScrap(s.id, { color: e.target.value })}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label={`color for scrap ${s.id}`}
              />
            </label>

            <input
              type="text"
              value={s.label}
              onChange={(e) => updateScrap(s.id, { label: e.target.value })}
              placeholder={`Scrap ${s.id}`}
              aria-label={`label for scrap ${s.id}`}
              className={`${field} min-w-0 flex-1`}
            />

            <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
              <span>blocks</span>
              <input
                type="text"
                inputMode="numeric"
                value={s.count}
                onChange={(e) =>
                  updateScrap(s.id, { count: digitsOnly(e.target.value) })
                }
                placeholder="0"
                aria-label={`block count for scrap ${s.id}`}
                className={NUM_INPUT}
              />
            </label>

            <button
              type="button"
              onClick={() => removeScrap(s.id)}
              disabled={scraps.length === 1}
              aria-label={`remove scrap ${s.id}`}
              className="shrink-0 rounded-full px-2 py-1 text-lg leading-none text-muted transition hover:bg-surface-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
            >
              &times;
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={addScrap}
        className="flex items-center gap-2 self-start rounded-full border border-dashed border-accent/50 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent-soft"
      >
        <span className="text-lg leading-none">+</span>
        Add scrap type
      </button>

      <section className="border-t border-line pt-5">
        <h2 className="text-base font-semibold text-ink">Grid size</h2>
        <p className="mt-1 mb-3 text-xs text-muted">
          Recommended {recommended.rows} &times; {recommended.cols} for {total}{" "}
          block{total === 1 ? "" : "s"}.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            aria-label="rows"
            value={rowsInput}
            placeholder={String(recommended.rows)}
            onChange={(e) => setRowsInput(digitsOnly(e.target.value))}
            className={NUM_INPUT}
          />
          <span className="text-muted" aria-hidden>
            &times;
          </span>
          <input
            type="text"
            inputMode="numeric"
            aria-label="columns"
            value={colsInput}
            placeholder={String(recommended.cols)}
            onChange={(e) => setColsInput(digitsOnly(e.target.value))}
            className={NUM_INPUT}
          />
          <button
            type="button"
            onClick={() => {
              setRowsInput("");
              setColsInput("");
            }}
            className="ml-1 text-xs font-medium text-accent hover:underline"
          >
            Reset to recommended
          </button>
        </div>
        {rows > 0 && cols > 0 && total > capacity && (
          <p className="mt-2 text-xs text-accent-strong">
            {total - capacity} block{total - capacity === 1 ? "" : "s"} won&apos;t
            fit in a {rows}&times;{cols} grid and will be left out.
          </p>
        )}
        {rows > 0 && cols > 0 && total < capacity && (
          <p className="mt-2 text-xs text-muted">
            {capacity - total} cell{capacity - total === 1 ? "" : "s"} will be left
            empty.
          </p>
        )}
      </section>

      <button
        type="button"
        onClick={generate}
        disabled={total === 0}
        className={`${btnPrimary} self-start`}
      >
        Generate grid
      </button>
    </div>
  );
}
