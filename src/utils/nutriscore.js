import { normalize } from "./helpers";

/* ------------------------------------------------------------------ */
/*  NUTRI-SCORE HYBRIDE (Open Food Facts en ligne, estimation pondérée */
/*  locale en secours — jamais de blocage de l'interface, jamais       */
/*  d'erreur réseau qui remonte jusqu'à l'appelant)                    */
/* ------------------------------------------------------------------ */

// Poids moyen (g) d'une unité "pièce" selon l'ingrédient, pour convertir
// les quantités sans unité de masse en grammes approximatifs.
const PIECE_WEIGHTS = [
  { test: /poulet(?!.*(cuisse|blanc|escalope|filet))/i, grams: 1200 },
  { test: /p[aâ]te (bris[ée]e|feuillet[ée]e|sabl[ée]e)/i, grams: 230 },
  { test: /oeuf|œuf/i, grams: 50 },
  { test: /oignon/i, grams: 100 },
  { test: /échalote|echalote/i, grams: 25 },
  { test: /tomate/i, grams: 120 },
  { test: /citron vert|lime/i, grams: 60 },
  { test: /citron/i, grams: 100 },
  { test: /pomme de terre|patate/i, grams: 150 },
  { test: /pomme(?!\s*de\s*terre)/i, grams: 150 },
  { test: /carotte/i, grams: 80 },
  { test: /courgette/i, grams: 200 },
  { test: /poivron/i, grams: 150 },
  { test: /banane/i, grams: 120 },
  { test: /poireau/i, grams: 150 },
  { test: /avocat/i, grams: 170 },
];
const DEFAULT_PIECE_GRAMS = 60;

function estimatePieceWeight(name) {
  const found = PIECE_WEIGHTS.find((p) => p.test.test(name));
  return found ? found.grams : DEFAULT_PIECE_GRAMS;
}

// Convertit une quantité + unité (souvent imprécises ou absentes, comme
// dans une fiche saisie à la main) en grammes approximatifs, pour pouvoir
// pondérer chaque ingrédient par son poids réel dans la recette plutôt
// que de le compter comme une simple occurrence.
function estimateGrams(ing) {
  const qty = Number(ing.qty) || 0;
  if (qty <= 0) return 0;
  const u = normalize(ing.unit || "");
  if (!u) return qty * estimatePieceWeight(ing.name);
  if (/^kgs?$/.test(u)) return qty * 1000;
  if (/^g$|^grammes?$/.test(u)) return qty;
  if (/^l$|^litres?$/.test(u)) return qty * 1000;
  if (/^cls?$/.test(u)) return qty * 10;
  if (/^mls?$/.test(u)) return qty;
  if (/pince/.test(u)) return qty * 1;
  if (/soupe/.test(u)) return qty * 15;
  if (/cafe/.test(u)) return qty * 5;
  if (/botte/.test(u)) return qty * 30;
  if (/gousse/.test(u)) return qty * 5;
  // Toute autre unité (pièce, tranche, ...) : on se rabat sur le poids
  // moyen estimé de l'ingrédient lui-même.
  return qty * estimatePieceWeight(ing.name);
}

// Chaque catégorie porte un impact (positif = favorable, négatif =
// défavorable) par tranche de 10% du poids total de la recette qu'elle
// représente. Testées dans l'ordre : la première correspondance gagne,
// des motifs les plus spécifiques vers les plus génériques, pour éviter
// qu'un même ingrédient ne soit compté deux fois. C'est le filet de
// secours utilisé quand aucune donnée en ligne n'est disponible pour
// l'ingrédient (hors-ligne, échec réseau, produit introuvable...).
const NUTRI_CATEGORIES = [
  { test: /lardon|bacon|chorizo|saucisse|jambon|charcuterie|merguez|andouille/i, impact: -8, label: "charcuterie" },
  { test: /chocolat noir/i, impact: -1, label: "sucre modéré" },
  { test: /sucre|miel|confiture|sirop|caramel|chocolat|pâte à tartiner|nutella/i, impact: -4, label: "sucre ajouté" },
  { test: /huile d'olive|huile de colza|huile de noix/i, impact: -0.5, label: "graisse insaturée" },
  { test: /beurre|crème|creme|mayonnaise|friture|saindoux|huile de palme/i, impact: -5, label: "graisse saturée" },
  { test: /huile/i, impact: -2, label: "graisse" },
  { test: /fromage(?!\s*blanc)|comté|comte|gruyère|gruyere|parmesan|emmental/i, impact: -2.5, label: "fromage" },
  { test: /porc|boeuf|bœuf|agneau|veau/i, impact: -1.5, label: "viande grasse" },
  { test: /lentille|haricot|pois chiche|pois cass[ée]|l[ée]gumineuse|quinoa|avoine|son de/i, impact: 5, label: "fibre/légumineuse" },
  { test: /complet|int[ée]grale?/i, impact: 3, label: "céréale complète" },
  { test: /l[ée]gume|carotte|courgette|tomate|[ée]pinard|poireau|brocoli|salade|aubergine|poivron|champignon|oignon|échalote|echalote|ail\b|navet|betterave|c[ée]leri|endive|chou|radis|artichaut/i, impact: 4, label: "légume" },
  { test: /fruit|pomme|banane|orange|citron|fraise|framboise|poire|pêche|peche|abricot|myrtille|mangue|avocat/i, impact: 3.5, label: "fruit" },
  { test: /poulet|dinde|poisson|saumon|cabillaud|thon|tofu|oeuf|œuf/i, impact: 1, label: "protéine maigre" },
  { test: /lait(?!\s*de\s*coco)|yaourt/i, impact: 1, label: "laitage" },
  { test: /farine|p[aâ]te(?!.*complète)|pain(?!.*complet)|riz(?!.*complet)/i, impact: -0.5, label: "féculent raffiné" },
  { test: /\bsel\b/i, impact: -0.5, label: "sel" },
];

// Équivalent d'impact pour un Nutri-Score officiel récupéré en ligne,
// calibré sur la même échelle que NUTRI_CATEGORIES ci-dessus, pour que
// les deux sources puissent se mélanger dans un même score pondéré.
const GRADE_IMPACT = { A: 6, B: 2, C: 0, D: -3, E: -7 };

/* ------------------------------------------------------------------ */
/*  CACHE (mémoire + localStorage)                                     */
/*  Une seule recherche HTTP par ingrédient distinct : les changements */
/*  de portion, de recette affichée ou de re-rendu ne redéclenchent    */
/*  jamais un nouvel appel pour un ingrédient déjà résolu.             */
/* ------------------------------------------------------------------ */
const CACHE_KEY = "grimoire-nutriscore-cache-v1";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours
const memoryCache = new Map(); // nom normalisé -> { grade, ts } | { grade: null, ts }

function loadPersistentCache() {
  try {
    if (typeof localStorage === "undefined") return;
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.entries(parsed).forEach(([key, entry]) => {
      if (entry && typeof entry.ts === "number") memoryCache.set(key, entry);
    });
  } catch {
    /* localStorage indisponible ou corrompu : on repart d'un cache vide */
  }
}
loadPersistentCache();

function persistCache() {
  try {
    if (typeof localStorage === "undefined") return;
    const obj = Object.fromEntries(memoryCache.entries());
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch {
    /* quota dépassé ou stockage désactivé : le cache reste en mémoire */
  }
}

function getCached(key) {
  const entry = memoryCache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return undefined;
  }
  return entry;
}

/* ------------------------------------------------------------------ */
/*  OPEN FOOD FACTS — recherche d'un ingrédient                        */
/* ------------------------------------------------------------------ */
const OFF_SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const FETCH_TIMEOUT_MS = 2500;

async function fetchWithTimeout(url, ms) {
  if (typeof fetch !== "function") throw new Error("fetch indisponible");
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), ms) : null;
  try {
    return await fetch(url, controller ? { signal: controller.signal } : {});
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// Recherche en ligne le Nutri-Score officiel d'un ingrédient auprès
// d'Open Food Facts. Ne lève jamais d'exception : toute défaillance
// (hors-ligne, timeout, produit introuvable, réponse invalide) se
// traduit par un simple `null`, qui déclenche le repli local.
async function lookupIngredientOnline(name) {
  const key = normalize(name);
  if (!key) return null;

  const cached = getCached(key);
  if (cached !== undefined) return cached.grade ? cached : null;

  try {
    const params = new URLSearchParams({
      search_terms: name,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: "5",
      fields: "product_name,nutriscore_grade,nutrition_grade_fr",
    });
    const res = await fetchWithTimeout(`${OFF_SEARCH_URL}?${params.toString()}`, FETCH_TIMEOUT_MS);
    if (!res || !res.ok) throw new Error("réponse HTTP invalide");
    const data = await res.json();
    const products = Array.isArray(data && data.products) ? data.products : [];
    const withGrade = products.find((p) => {
      const g = (p.nutriscore_grade || p.nutrition_grade_fr || "").toUpperCase();
      return "ABCDE".includes(g);
    });
    const grade = withGrade
      ? (withGrade.nutriscore_grade || withGrade.nutrition_grade_fr || "").toUpperCase()
      : null;

    const entry = { grade, ts: Date.now() };
    memoryCache.set(key, entry);
    persistCache();
    return grade ? entry : null;
  } catch {
    // Réseau indisponible, timeout, JSON invalide... on ne met PAS ce
    // résultat en cache : un ingrédient temporairement injoignable doit
    // pouvoir être retenté à la prochaine occasion (retour du réseau).
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  CALCUL PONDÉRÉ COMMUN (source en ligne si dispo, sinon locale)     */
/* ------------------------------------------------------------------ */

function localImpactFor(ing) {
  const match = NUTRI_CATEGORIES.find((c) => c.test.test(ing.name));
  return match ? { impact: match.impact, label: match.label } : null;
}

function scoreToGrade(score) {
  if (score >= 10) return "A";
  if (score >= 3) return "B";
  if (score >= -4) return "C";
  if (score >= -12) return "D";
  return "E";
}

// Combine les impacts (en ligne quand disponible, locaux sinon) en un
// score pondéré par le poids réel de chaque ingrédient dans la recette,
// exactement comme l'algorithme local d'origine.
function computeGrade(items, grams, impacts) {
  const totalGrams = grams.reduce((a, b) => a + b, 0);
  let score = 0;
  const positiveKinds = new Set();

  items.forEach((ing, i) => {
    const info = impacts[i];
    if (!info) return;

    let fraction;
    if (totalGrams > 0 && grams[i] > 0) {
      fraction = grams[i] / totalGrams;
    } else {
      // Ni quantité ni unité exploitables : on estime l'importance de
      // l'ingrédient par son rang dans la liste (les premiers cités
      // sont en général les plus significatifs dans une recette).
      fraction = 1 / (i + 2);
    }
    // On plafonne la contribution d'un seul ingrédient pour qu'une
    // grosse quantité d'un élément neutre ne fasse pas basculer le
    // score à elle seule.
    const capped = Math.min(fraction, 0.3);
    score += info.impact * capped * 10;
    if (info.impact > 0) positiveKinds.add(info.label);
  });

  // Petit bonus pour la diversité d'éléments bénéfiques (légumes,
  // fibres, protéines maigres, produits bien notés en ligne...).
  score += positiveKinds.size * 1.5;

  return scoreToGrade(score);
}

/* ------------------------------------------------------------------ */
/*  API PUBLIQUE                                                       */
/* ------------------------------------------------------------------ */

// Estimation 100% locale, synchrone, immédiate — c'est le filet de
// sécurité utilisé par estimateNutriscore() en cas de souci réseau, et
// c'est aussi ce qu'on peut afficher tout de suite le temps qu'une
// estimation en ligne, plus fidèle, arrive (cf. hooks/useNutriscore.js).
export function estimateNutriscoreLocal(ingredients = []) {
  try {
    const items = (ingredients || []).filter((ing) => ing && !ing.isSection && ing.name);
    if (!items.length) return "C";
    const grams = items.map(estimateGrams);
    const impacts = items.map(localImpactFor);
    return computeGrade(items, grams, impacts);
  } catch {
    return "C";
  }
}

// Estimation hybride : cherche le Nutri-Score officiel de chaque
// ingrédient sur Open Food Facts (avec cache et délai maximal), et
// complète les ingrédients introuvables ou hors-ligne par l'heuristique
// locale pondérée. Ne rejette jamais — en toute circonstance, une
// lettre A-E est renvoyée, au pire via estimateNutriscoreLocal().
export async function estimateNutriscore(ingredients = []) {
  try {
    const items = (ingredients || []).filter((ing) => ing && !ing.isSection && ing.name);
    if (!items.length) return "C";

    // Appareil hors-ligne : inutile de tenter le réseau, on part direct
    // sur l'heuristique locale (jamais de latence artificielle).
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return estimateNutriscoreLocal(ingredients);
    }

    const grams = items.map(estimateGrams);
    const onlineEntries = await Promise.all(items.map((ing) => lookupIngredientOnline(ing.name)));
    const impacts = items.map((ing, i) => {
      const online = onlineEntries[i];
      if (online && online.grade) return { impact: GRADE_IMPACT[online.grade], label: `off-${online.grade}` };
      return localImpactFor(ing);
    });

    return computeGrade(items, grams, impacts);
  } catch {
    // Filet de sécurité ultime : jamais d'erreur qui remonte jusqu'à
    // l'interface, on retombe toujours sur l'estimation locale.
    return estimateNutriscoreLocal(ingredients);
  }
}

/* ------------------------------------------------------------------ */
/*  COULEURS NUTRI-SCORE                                               */
/* ------------------------------------------------------------------ */

export const NUTRI_COLORS = { A: "#2E7D32", B: "#8BA33F", C: "#C9A227", D: "#D4771C", E: "#B33A2E" };
