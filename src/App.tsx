import { useEffect, useState } from "react";
import type { GridState, SavedDesign, ScrapType, ViewMode } from "./types";
import { buildGrid, swapCells } from "./lib/randomize";
import { exportPdf } from "./lib/exportPdf";
import * as storage from "./lib/storage";
import BaseSetup from "./components/BaseSetup";
import SavedDesigns from "./components/SavedDesigns";
import Toolbar from "./components/Toolbar";
import ViewToggle from "./components/ViewToggle";
import Grid from "./components/Grid";
import SaveDesignModal from "./components/SaveDesignModal";

type Screen = "setup" | "grid";

function App() {
  // Restore the last working state so a reload / navigate-back keeps the setup.
  const [boot] = useState(() => storage.loadWorking());
  const [scraps, setScraps] = useState<ScrapType[]>(boot?.scraps ?? []);
  const [grid, setGrid] = useState<GridState | null>(boot?.grid ?? null);
  // Always open in color view; the last-used view is intentionally not restored.
  const [view, setView] = useState<ViewMode>("color");
  const [screen, setScreen] = useState<Screen>(boot?.grid ? "grid" : "setup");
  const [designs, setDesigns] = useState<SavedDesign[]>(() =>
    storage.loadDesigns(),
  );
  // Bumped whenever we (re)enter the setup screen, to remount BaseSetup with
  // fresh initial values.
  const [setupNonce, setSetupNonce] = useState(0);
  // Whether the "Save design" confirmation modal is open.
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    storage.saveWorking({ scraps, grid });
  }, [scraps, grid]);

  useEffect(() => {
    storage.saveDesigns(designs);
  }, [designs]);

  function handleGenerate(next: ScrapType[], rows: number, cols: number) {
    setScraps(next);
    setGrid(buildGrid(next, rows, cols));
    setScreen("grid");
  }

  function handleRandomize() {
    if (grid) setGrid(buildGrid(scraps, grid.rows, grid.cols));
  }

  function handleSwap(from: number, to: number) {
    setGrid((g) => (g ? { ...g, cells: swapCells(g.cells, from, to) } : g));
  }

  // Edit: keep the current scraps/grid so BaseSetup re-seeds from them.
  function handleEditSetup() {
    setSetupNonce((n) => n + 1);
    setScreen("setup");
  }

  // New: clear the working state and start from a blank setup.
  function handleNew() {
    setScraps([]);
    setGrid(null);
    setView("color");
    setSetupNonce((n) => n + 1);
    setScreen("setup");
  }

  function handleSaveDesign(name: string) {
    if (!grid) return;
    const design: SavedDesign = {
      id: storage.newId(),
      name: name.trim() || `Design ${designs.length + 1}`,
      scraps,
      grid,
      savedAt: Date.now(),
    };
    setDesigns((d) => [design, ...d]);
    setSaving(false);
  }

  function handleLoadDesign(id: string) {
    const d = designs.find((x) => x.id === id);
    if (!d) return;
    setScraps(d.scraps);
    setGrid(d.grid);
    setView("color");
    setScreen("grid");
  }

  function handleRenameDesign(id: string, name: string) {
    setDesigns((d) => d.map((x) => (x.id === id ? { ...x, name } : x)));
  }

  function handleDeleteDesign(id: string) {
    setDesigns((d) => d.filter((x) => x.id !== id));
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-8 px-5 py-10 sm:px-8">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium tracking-wide text-accent-strong uppercase">
          Patchwork planner
        </span>
        <h1 className="mt-4 text-5xl font-normal tracking-normal text-ink">
          Quilt Pattern Randomizer
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Gather your scraps, shuffle them across a grid, then nudge the blocks
          until the layout feels just right.
        </p>
      </header>

      {screen === "setup" || grid === null ? (
        <div className="flex flex-col gap-8">
          <BaseSetup
            key={setupNonce}
            initialScraps={scraps.length > 0 ? scraps : undefined}
            initialRows={grid?.rows}
            initialCols={grid?.cols}
            onGenerate={handleGenerate}
          />
          <SavedDesigns
            designs={designs}
            onLoad={handleLoadDesign}
            onRename={handleRenameDesign}
            onDelete={handleDeleteDesign}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ViewToggle view={view} onChange={setView} />
            <Toolbar
              onRandomize={handleRandomize}
              onSave={() => setSaving(true)}
              onEditSetup={handleEditSetup}
              onNew={handleNew}
              onExport={() => exportPdf(grid, scraps)}
            />
          </div>
          <Grid grid={grid} scraps={scraps} view={view} onSwap={handleSwap} />
        </div>
      )}

      {saving && (
        <SaveDesignModal
          defaultName={`Design ${designs.length + 1}`}
          onConfirm={handleSaveDesign}
          onCancel={() => setSaving(false)}
        />
      )}
    </main>
  );
}

export default App;
