import { useState, useEffect } from "react";
import { CheckSquare, Plus, ShoppingBasket, Square } from "lucide-react";
import { FILTERS } from "../../constants";
import { normalize, categoryClass, categoryLabel, triggerHaptic, copyText } from "../../utils/helpers";
import QuantityWheelModal from "../common/QuantityWheelModal";
import SwipeFlourish from "./SwipeFlourish";
import ShoppingItemRow from "./ShoppingItemRow";

export default function ShoppingView({
  recipes,
  activeList,
  onAddManualItem,
  onToggleItem,
  onAdjustQty,
  onSetItemQty,
  onGenerateFromRecipes,
  onResetActiveList,
  onCreateList,
  onOpenManager,
  showToast,
  pressDuration,
}) {
  const [manualInput, setManualInput] = useState("");
  const [selected, setSelected] = useState([]);
  const [wheelItem, setWheelItem] = useState(null);
  const [recipeFilter, setRecipeFilter] = useState("tout");
  const [recipePickerOpen, setRecipePickerOpen] = useState(false);

  useEffect(() => {
    setSelected([]);
  }, [activeList && activeList.id]);

  const items = activeList ? activeList.items : [];

  const toggleRecipe = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const selectAll = () => setSelected(recipes.map((r) => r.id));
  const selectNone = () => setSelected([]);

  const addManual = () => {
    const name = manualInput.trim();
    if (!name) return;
    onAddManualItem(name);
    setManualInput("");
  };

  const unchecked = items.filter((i) => !i.checked);
  const bought = [...items.filter((i) => i.checked)].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const grouped = unchecked.reduce((acc, item) => {
    acc[item.aisle] = acc[item.aisle] || [];
    acc[item.aisle].push(item);
    return acc;
  }, {});
  Object.values(grouped).forEach((list) => list.sort((a, b) => a.name.localeCompare(b.name, "fr")));
  const aisleCount = new Set(items.map((i) => i.aisle)).size;

  const buildListText = () => {
    const lines = [`🛒 ${activeList ? activeList.name : "Liste de courses"} — Le Grimoire de Morgane`, ""];
    Object.entries(grouped).forEach(([aisle, list]) => {
      lines.push(`${aisle} :`);
      list.forEach((it) => lines.push(`- ${Math.round(it.qty * 100) / 100}${it.unit ? ` ${it.unit}` : ""} ${it.name}`));
      lines.push("");
    });
    if (bought.length) {
      lines.push("Déjà achetés :");
      bought.forEach((it) => lines.push(`- ${it.name}`));
    }
    return lines.join("\n").trim();
  };

  const handleAppleCopy = async () => {
    await copyText(buildListText());
    showToast("Liste copiée !");
    triggerHaptic(40);
  };
  const handleAppleReset = () => {
    onResetActiveList();
    setSelected([]);
  };

  return (
    <div className="view">
      {activeList && (
        <div className="active-list-header">
          <button type="button" className="active-list-name" onClick={onOpenManager}>
            {activeList.name} <span className="active-list-switch">changer ▾</span>
          </button>
        </div>
      )}

      <div className="manual-add-row">
        <input
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addManual(); } }}
          placeholder="+ Ajouter un article (ex: Lait, Sopalin…)"
        />
        <button type="button" onClick={addManual}><Plus size={16} /></button>
      </div>

      <p className="hint">Ou sélectionne des recettes pour convoquer leurs ingrédients.</p>
      <button
        type="button"
        className={`recipe-picker-toggle ${recipePickerOpen ? "open" : ""}`}
        onClick={() => { triggerHaptic(10); setRecipePickerOpen((v) => !v); }}
      >
        Choisir des recettes {recipePickerOpen ? "▲" : "▼"}
        {selected.length > 0 && <span className="recipe-picker-count">{selected.length}</span>}
      </button>
      {recipePickerOpen && (
        <>
          <div className="filter-bar recipe-picker-filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter-pill ${recipeFilter === f.key ? "active" : ""}`}
                onClick={() => { triggerHaptic(10); setRecipeFilter(f.key); }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="shopping-actions">
            <button type="button" className="link-btn" onClick={selectAll}><CheckSquare size={14} /> Tout cocher</button>
            <button type="button" className="link-btn" onClick={selectNone}><Square size={14} /> Tout décocher</button>
          </div>
          <div className="recipe-select-list">
            {[...recipes]
              .filter((r) => recipeFilter === "tout" || normalize(r.category) === recipeFilter)
              .sort((a, b) => a.title.localeCompare(b.title, "fr"))
              .map((r) => (
                <label className="recipe-select-row card" key={r.id}>
                  <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleRecipe(r.id)} />
                  <span>{r.title}</span>
                  <span className={`chip ${categoryClass(r)}`}>{categoryLabel(r)}</span>
                </label>
              ))}
          </div>
        </>
      )}

      {items.length > 0 && (
        <div className="shopping-result">
          <div className="parchment-recap">
            {bought.length}/{items.length} article{items.length > 1 ? "s" : ""} · {aisleCount} rayon{aisleCount > 1 ? "s" : ""}
          </div>
          <div className="apple-bar">
            <SwipeFlourish onSwipeRight={handleAppleCopy} onSwipeLeft={handleAppleReset} onTap={handleAppleReset} />
          </div>
          {Object.entries(grouped).map(([aisle, list]) => (
            <div key={aisle} className="aisle-block">
              <h4>{aisle}</h4>
              <ul className="shopping-list">
                {list.map((it) => (
                  <ShoppingItemRow
                    key={it.id}
                    item={it}
                    checked={false}
                    onToggle={onToggleItem}
                    onAdjust={onAdjustQty}
                    onOpenWheel={setWheelItem}
                    pressDuration={pressDuration}
                  />
                ))}
              </ul>
            </div>
          ))}
          {bought.length > 0 && (
            <div className="aisle-block bought-block">
              <h4>Articles achetés</h4>
              <ul className="shopping-list bought-list">
                {bought.map((it) => (
                  <ShoppingItemRow
                    key={it.id}
                    item={it}
                    checked
                    onToggle={onToggleItem}
                    onOpenWheel={setWheelItem}
                    pressDuration={pressDuration}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {selected.length > 0 ? (
        <div
          className="generate-popup"
          onClick={() => { onGenerateFromRecipes(selected); setSelected([]); }}
        >
          <span><ShoppingBasket size={16} /> Générer la liste de courses ({selected.length})</span>
          <button
            type="button"
            className="generate-popup-close"
            onClick={(e) => { e.stopPropagation(); setSelected([]); }}
            aria-label="Annuler la sélection"
          >
            ✕
          </button>
        </div>
      ) : (
        <button className="fab" onClick={() => { triggerHaptic(15); onCreateList(); }} aria-label="Nouvelle liste">
          <Plus size={22} />
        </button>
      )}

      {wheelItem && (
        <QuantityWheelModal
          item={wheelItem}
          onChange={(value) => onSetItemQty(wheelItem.id, value)}
          onClose={() => setWheelItem(null)}
        />
      )}
    </div>
  );
}

