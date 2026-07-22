// Shared cozy UI class strings, so buttons/fields/cards stay consistent.

export const card =
  "rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(58,51,43,0.05),0_10px_30px_-16px_rgba(58,51,43,0.25)]";

export const field =
  "rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

export const btnPrimary = `${btnBase} bg-accent px-5 py-2.5 text-white shadow-sm hover:bg-accent-strong`;

export const btnGhost = `${btnBase} border border-line bg-surface px-4 py-2 text-ink hover:bg-surface-2`;

export const btnSubtle = `${btnBase} px-3 py-2 text-ink hover:bg-surface-2`;
