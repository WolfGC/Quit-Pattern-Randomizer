import { useEffect, useRef, useState, type ReactNode } from "react";
import { btnGhost, btnPrimary, card } from "../ui";

interface ToolbarProps {
  onRandomize: () => void;
  onSave: () => void;
  onEditSetup: () => void;
  onNew: () => void;
  onExport: () => void;
}

// Small stroke icons (currentColor) for the actions menu.
const icons: Record<string, ReactNode> = {
  save: (
    <path d="M5 3h11l3 3v15H5V3Zm3 0v6h7V3M8 21v-6h8v6" />
  ),
  edit: (
    <path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.83-2.83L5 17.2V20Zm10.5-12.5 3 3" />
  ),
  new: <path d="M12 5v14M5 12h14" />,
  export: (
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" />
  ),
};

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
      aria-hidden
    >
      {icons[name]}
    </svg>
  );
}

export default function Toolbar({
  onRandomize,
  onSave,
  onEditSetup,
  onNew,
  onExport,
}: ToolbarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = [
    { label: "Save design", icon: "save" as const, onClick: onSave },
    { label: "Edit setup", icon: "edit" as const, onClick: onEditSetup },
    { label: "New design", icon: "new" as const, onClick: onNew },
    { label: "Export PDF", icon: "export" as const, onClick: onExport },
  ];

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onRandomize} className={btnPrimary}>
        Re-randomize
      </button>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={btnGhost}
        >
          Actions
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div
            role="menu"
            className={`absolute right-0 z-40 mt-2 flex w-48 flex-col p-1.5 ${card}`}
          >
            {items.map(({ label, icon, onClick }) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onClick();
                }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-ink transition-colors hover:bg-surface-2"
              >
                <Icon name={icon} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
