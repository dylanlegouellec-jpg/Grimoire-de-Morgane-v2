import { ingredientKey } from "../../utils/helpers";

/* ------------------------------------------------------------------ */
/*  VUE MON FRIGO — utilitaires de gestion des basiques & du pantry    */
/* ------------------------------------------------------------------ */

export function collectPantryOptions(recipes) {
  const seen = new Map();
  recipes.forEach((r) => {
    r.ingredients.forEach((ing) => {
      if (ing.isSection) return;
      const key = ingredientKey(ing.name);
      if (key && !seen.has(key)) seen.set(key, ing.name.trim());
    });
  });
  return Array.from(seen.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function missingIngredients(recipe, ownedSet) {
  return recipe.ingredients.filter((ing) => !ing.isSection && !ownedSet.has(ingredientKey(ing.name)));
}

