import { Plus } from "lucide-react";
import { normalize, triggerHaptic } from "../../utils/helpers";
import RecipeCard from "./RecipeCard";

export default function RecipesView({ recipes, filter, search, favoritesOnly, onToggleFavorite, onAddRequest, onOpen, onRequestDelete, pressDuration }) {
  const q = search.trim().toLowerCase();
  const filtered = recipes
    .filter((r) => {
      if (filter !== "tout" && normalize(r.category) !== filter) return false;
      if (favoritesOnly && !r.favorite) return false;
      if (q) {
        const inTitle = r.title.toLowerCase().includes(q);
        const inIngredients = r.ingredients.some((ing) => !ing.isSection && ing.name.toLowerCase().includes(q));
        if (!inTitle && !inIngredients) return false;
      }
      return true;
    })
    .sort((a, b) => a.title.localeCompare(b.title, "fr"));
  return (
    <div className="view">
      {filtered.length === 0 ? (
        <p className="hint" style={{ textAlign: "center", marginTop: 30 }}>Aucune recette ne correspond à ta recherche.</p>
      ) : (
        <div className="recipes-grid" key={`${filter}-${favoritesOnly}`}>
          {filtered.map((r, i) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onOpen={onOpen}
              onToggleFavorite={onToggleFavorite}
              onRequestDelete={onRequestDelete}
              enterDelay={Math.min(i, 10) * 45}
              pressDuration={pressDuration}
            />
          ))}
        </div>
      )}
      <button className="fab" onClick={() => { triggerHaptic(15); onAddRequest(); }}>
        <Plus size={22} />
      </button>
    </div>
  );
}

