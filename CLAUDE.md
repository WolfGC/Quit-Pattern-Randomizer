# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page, client-only web app for planning scrap-fabric quilts. The user
describes the scrap patches they have on hand (a count per scrap "type"), the
app recommends a grid size, randomly places the patches into the grid, and lets
them drag-swap cells until the layout looks right. There is no backend — all
state lives in the browser and persists to `localStorage`.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`).

- `pnpm dev` — Vite dev server
- `pnpm build` — type-check (`tsc -b`) then production build to `dist/`
- `pnpm lint` — ESLint over the repo
- `pnpm preview` — serve the built `dist/`

There is no test runner or test suite configured.

## Architecture

React 19 + TypeScript + Vite, styled with Tailwind CSS v4. The React Compiler
is enabled (via `babel-plugin-react-compiler` in `vite.config.ts`), so **do not
hand-add `useMemo`/`useCallback` for performance** — the compiler handles
memoization.

The design separates pure logic (`src/lib/`) from React:

- **`src/types.ts`** — the shared domain model. Read this first. Key ideas: a
  `ScrapType` has a 1-based integer `id` (shown to the user and stamped into
  cells) and a `count` of available patches. A `GridState.cells` is a flat,
  **row-major** array of scrap ids where `null` means an empty cell.
- **`src/lib/randomize.ts`** — pure grid generation. `buildGrid` expands each
  scrap by its count, Fisher-Yates shuffles, truncates to grid capacity
  (overflow patches are dropped), pads with `null`, and shuffles again.
- **`src/lib/recommend.ts`** — `recommendGrid(total)` picks the most
  square-like grid that fits the patch count.
- **`src/lib/palette.ts`** — maps a scrap id to its visual form for each view.
  In color view, colors are either user-chosen (`ScrapType.color`) or
  auto-derived from the id by evenly spreading hue. Greyscale and pattern views
  are always derived from the id.
- **`src/lib/storage.ts`** — best-effort `localStorage` wrapper (every access is
  try/caught so disabled/full storage never crashes). Two keys: the unsaved
  **working state** (`qpr:working:v1`, auto-restored on reload) and the list of
  explicitly **saved designs** (`qpr:designs:v1`).

**State ownership:** `src/App.tsx` is the single source of truth. It holds
`scraps`, `grid`, `view`, and the `designs` list, drives the `setup` ↔ `grid`
screen switch, and mirrors state into `localStorage` via effects. Components
below it are presentational and call back up. When editing the setup for an
existing grid, `BaseSetup` is remounted via a `key={setupNonce}` bump so it
re-seeds from the current scraps.

**View modes:** `number | color | greyscale | pattern` (`ViewMode`). In every
non-number view, `Cell` still stamps the scrap integer in a corner so any layout
stays identifiable/exportable. Cell swapping uses native HTML drag-and-drop (the
dragged cell's index is passed through `dataTransfer`).

## Styling

Tailwind v4 is configured entirely in `src/index.css` via `@theme` — there is no
`tailwind.config.js`. Colors are **semantic tokens** (`bg-surface`, `text-ink`,
`text-muted`, `bg-accent`, `border-line`, etc.), not raw palette values, with a
dark-mode override block keyed on `prefers-color-scheme`. Use these tokens
rather than hard-coded colors. Shared button/card/field class strings live in
`src/ui.ts` — reuse `btnPrimary`, `card`, `field`, etc. instead of re-deriving
them.

## Notable stub

`src/lib/exportPdf.ts` (PDF export of the laid-out grid, README step 7) is
intentionally unimplemented — it currently only `console.warn`s. The intended
output and implementation options are documented in its TODO comment.
