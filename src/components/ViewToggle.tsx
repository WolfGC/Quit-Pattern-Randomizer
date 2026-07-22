import type { ViewMode } from "../types";

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

const VIEWS: { value: ViewMode; label: string }[] = [
  { value: "number", label: "Number" },
  { value: "color", label: "Color" },
  { value: "greyscale", label: "Greyscale" },
  { value: "pattern", label: "Pattern" },
];

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="View mode"
      className="inline-flex rounded-full border border-line bg-surface-2 p-1"
    >
      {VIEWS.map(({ value, label }) => {
        const active = value === view;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={[
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
