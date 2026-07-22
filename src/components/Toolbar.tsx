import { btnGhost, btnPrimary } from "../ui";

interface ToolbarProps {
  onRandomize: () => void;
  onSave: () => void;
  onEditSetup: () => void;
  onNew: () => void;
  onExport: () => void;
}

export default function Toolbar({
  onRandomize,
  onSave,
  onEditSetup,
  onNew,
  onExport,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onRandomize} className={btnPrimary}>
        Re-randomize
      </button>
      <button type="button" onClick={onSave} className={btnGhost}>
        Save design
      </button>
      <button type="button" onClick={onEditSetup} className={btnGhost}>
        Edit setup
      </button>
      <button type="button" onClick={onNew} className={btnGhost}>
        New design
      </button>
      <button type="button" onClick={onExport} className={btnGhost}>
        Export PDF
      </button>
    </div>
  );
}
