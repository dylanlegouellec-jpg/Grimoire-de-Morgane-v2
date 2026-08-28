import { useRef } from "react";
import { triggerHaptic } from "../../utils/helpers";

export default function NavButton({ tabKey, label, Icon, active, onSelect, onLongPress, pressDuration = 750 }) {
  const timer = useRef(null);
  const fired = useRef(false);
  const start = () => {
    if (!onLongPress) return;
    fired.current = false;
    timer.current = setTimeout(() => { fired.current = true; triggerHaptic(20); onLongPress(); }, pressDuration);
  };
  const cancel = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  const handleClick = () => {
    if (fired.current) { fired.current = false; return; }
    triggerHaptic(10);
    onSelect();
  };
  return (
    <button
      className={`nav-btn ${active ? "active" : ""}`}
      onClick={handleClick}
      onTouchStart={start}
      onTouchEnd={cancel}
      onTouchMove={cancel}
      onMouseDown={start}
      onMouseUp={cancel}
      onMouseLeave={cancel}
      onContextMenu={(e) => { if (onLongPress) e.preventDefault(); }}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}
