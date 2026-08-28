import { Check } from "lucide-react";
import { ingredientKey, triggerHaptic } from "../../utils/helpers";
import { collectPantryOptions, missingIngredients } from "./pantryUtils";
import DishArt from "../art/DishArt";
import SwipeFlourish from "../shopping/SwipeFlourish";

export default function FridgeView({ recipes, pantry, setPantry, basics, search, onMoveBasicToVariable, onRemoveBasic, onResetPantry, onOpen }) {
  const q = search.trim().toLowerCase();

  const basicKeys = basics.map(ingredientKey);
  const baseOptions = collectPantryOptions(recipes).filter((opt) => !basicKeys.includes(opt.key));
  const extraFromPantry = pantry
    .filter((key) => !baseOptions.some((o) => o.key === key) && !basicKeys.includes(key))
    .map((key) => ({ key, label: key }));
  const options = [...baseOptions, ...extraFromPantry].sort((a, b) => a.label.localeCompare(b.label));
  const filteredOptions = q ? options.filter((opt) => opt.label.toLowerCase().includes(q)) : options;

  const pantrySet = new Set(pantry);
  const ownedSet = new Set([...pantry, ...basicKeys]);

  const toggle = (key) => {
    triggerHaptic(12);
    setPantry((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  };

  const ranked = recipes
    .map((r) => ({ recipe: r, missing: missingIngredients(r, ownedSet) }))
    .sort((a, b) => a.missing.length - b.missing.length || a.recipe.title.localeCompare(b.recipe.title, "fr"));

  const sortedBasics = [...basics].sort((a, b) => a.localeCompare(b, "fr"));
  const filteredBasics = q ? sortedBasics.filter((name) => name.toLowerCase().includes(q)) : sortedBasics;

  return (
    <div className="view">
      <h4 className="basics-title">Basiques <span className="hint-inline">(toujours sous la main)</span></h4>
      <div className="basics-grid">
        {filteredBasics.map((name) => (
          <div className="basic-chip" key={name}>
            <span>{name}</span>
            <button
              type="button"
              className="basic-action"
              onClick={() => onMoveBasicToVariable(name)}
              aria-label={`Basculer ${name} vers les ingrédients variables`}
              title="Basculer vers les ingrédients variables"
            >
              ⇄
            </button>
            <button
              type="button"
              className="basic-action basic-action-remove"
              onClick={() => onRemoveBasic(name)}
              aria-label={`Retirer ${name} des basiques`}
              title="Retirer des basiques (ajouté à la liste de courses)"
            >
              ✕
            </button>
          </div>
        ))}
        {filteredBasics.length === 0 && (
          <p className="hint" style={{ margin: 0 }}>
            {q ? "Aucun basique ne correspond." : "Aucun basique pour l'instant."}
          </p>
        )}
      </div>

      <p className="hint">Coche ce que tu as sous la main…</p>
      {filteredOptions.length === 0 ? (
        <p className="hint">{q ? "Aucun ingrédient ne correspond." : "Ajoute des recettes pour remplir ton frigo virtuel."}</p>
      ) : (
        <div className="pantry-grid">
          {filteredOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`pantry-chip ${pantrySet.has(opt.key) ? "active" : ""}`}
              onClick={() => toggle(opt.key)}
            >
              {pantrySet.has(opt.key) && <Check size={12} />} {opt.label}
            </button>
          ))}
        </div>
      )}

      <SwipeFlourish onSwipeLeft={onResetPantry} onSwipeRight={() => {}} />
      <h4>Réalisable avec ton frigo</h4>
      <div className="fridge-results">
        {ranked.map(({ recipe, missing }, i) => (
          <div
            className="card fridge-row card-enter"
            style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
            key={recipe.id}
            onClick={() => onOpen(recipe)}
          >
            <div className="fridge-thumb"><DishArt recipe={recipe} /></div>
            <div className="fridge-row-body">
              <h5>{recipe.title}</h5>
              {missing.length === 0 ? (
                <span className="fridge-ready"><Check size={13} /> Prêt à cuisiner !</span>
              ) : (
                <span className="fridge-missing">Ingrédients manquants : {missing.length}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

