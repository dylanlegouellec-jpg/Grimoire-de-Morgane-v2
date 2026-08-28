import { useRef } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { triggerHaptic } from "../../utils/helpers";

export default function ShoppingItemRow({ item, checked, onToggle, onAdjust, onOpenWheel, pressDuration }) {
  const timer = useRef(null);
  const fired = useRef(false);
  const start = () => {
    fired.current = false;
    timer.current = setTimeout(() => { fired.current = true; triggerHaptic(25); onOpenWheel(item); }, pressDuration);
  };
  const cancel = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  const handleClick = () => {
    if (fired.current) { fired.current = false; return; }
    onToggle(item.id);
  };
  return (
    <li className={checked ? "checked" : ""}>
      <span
        className="checkbox-row"
        onClick={handleClick}
        onTouchStart={start}
        onTouchEnd={cancel}
        onTouchMove={cancel}
        onMouseDown={start}
        onMouseUp={cancel}
        onMouseLeave={cancel}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className="checkbox">{checked && <Check size={11} />}</span>
        <span>{item.qty > 0 ? `${Math.round(item.qty * 100) / 100}${item.unit ? ` ${item.unit}` : ""} — ` : ""}{item.name}</span>
      </span>
      {!checked && onAdjust && (
        <span className="qty-stepper">
          <button type="button" onClick={(e) => { e.stopPropagation(); onAdjust(item.id, -1); }}><Minus size={11} /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onAdjust(item.id, 1); }}><Plus size={11} /></button>
        </span>
      )}
    </li>
  );
}

