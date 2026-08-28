import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_READY } from "../constants";

/* ------------------------------------------------------------------ */
/*  SUPABASE (REST / PostgREST — aucun SDK externe requis)             */
/*  Module d'appels API                                                */
/* ------------------------------------------------------------------ */

async function supabaseRequest(path, options = {}) {
  if (!SUPABASE_READY) throw new Error("Supabase non configuré");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status} : ${text}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function fetchTable(table, query = "select=*") {
  return supabaseRequest(`${table}?${query}`, { method: "GET" });
}
export async function insertRow(table, row) {
  const data = await supabaseRequest(table, { method: "POST", body: JSON.stringify([row]) });
  return data && data[0];
}
export async function updateRow(table, id, patch) {
  const data = await supabaseRequest(`${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  return data && data[0];
}
export async function deleteRow(table, id) {
  await supabaseRequest(`${table}?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function loadAppState() {
  const rows = await fetchTable("app_state", "select=*&id=eq.1");
  return rows && rows[0];
}
export async function saveAppState(patch) {
  try {
    await supabaseRequest("app_state?id=eq.1", { method: "PATCH", body: JSON.stringify(patch) });
  } catch {
    try {
      await supabaseRequest("app_state", { method: "POST", body: JSON.stringify({ id: 1, ...patch }) });
    } catch {
      /* silencieux : le grimoire continue de fonctionner en mémoire */
    }
  }
}


/* ------------------------------------------------------------------ */
/*  MAPPING LIGNES SQL <-> OBJETS APPLICATIFS                          */
/* ------------------------------------------------------------------ */

export function mapRowToRecipe(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    time: row.time,
    servings: row.servings,
    carbs: row.carbs,
    notes: row.notes || null,
    illustrationKey: row.illustration_key || null,
    favorite: !!row.is_favorite,
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    steps: Array.isArray(row.steps) ? row.steps : [],
  };
}
export function mapRecipeToRow(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    time: recipe.time,
    servings: recipe.servings,
    carbs: recipe.carbs,
    notes: recipe.notes || null,
    illustration_key: recipe.illustrationKey || null,
    is_favorite: !!recipe.favorite,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  };
}
export function mapRowToShoppingList(row) {
  return {
    id: row.id,
    name: row.name,
    items: Array.isArray(row.items) ? row.items : [],
  };
}
export function mapShoppingListToRow(list) {
  return {
    id: list.id,
    name: list.name,
    items: list.items,
  };
}
