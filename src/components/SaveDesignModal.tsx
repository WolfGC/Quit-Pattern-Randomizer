import { useEffect, useRef, useState } from "react";
import { btnGhost, btnPrimary, card, field } from "../ui";

interface SaveDesignModalProps {
  /** Suggested name, pre-filled and selected so the user can just hit Save. */
  defaultName: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export default function SaveDesignModal({
  defaultName,
  onConfirm,
  onCancel,
}: SaveDesignModalProps) {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus + select the suggested name on open, and close on Escape.
  useEffect(() => {
    inputRef.current?.select();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const trimmed = name.trim();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (trimmed) onConfirm(trimmed);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-design-title"
      onMouseDown={onCancel}
    >
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-full max-w-sm ${card} flex flex-col gap-4 p-6`}
      >
        <div>
          <h2 id="save-design-title" className="text-lg font-semibold text-ink">
            Save design
          </h2>
          <p className="mt-1 text-sm text-muted">
            Give this layout a name so you can find it later.
          </p>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Design name"
          aria-label="Design name"
          className={`${field} w-full`}
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className={btnGhost}>
            Cancel
          </button>
          <button type="submit" disabled={!trimmed} className={btnPrimary}>
            Save design
          </button>
        </div>
      </form>
    </div>
  );
}
