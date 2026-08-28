import { normalize, parseDurationMinutes } from "./helpers";

/* ------------------------------------------------------------------ */
/*  PARSEUR DE FICHE TEXTE ("Recette de : …", "Ingrédients : …", …)    */
/* ------------------------------------------------------------------ */

export const TEMPLATE_SECTIONS = [
  { key: "title", test: /^recette\s*(de|:)?\s*:?\s*/i },
  { key: "servings", test: /^nombre\s*de\s*parts?\s*:?\s*/i },
  { key: "time", test: /^temps\s*de\s*pr[ée]paration\s*:?\s*/i },
  { key: "equipment", test: /^mat[ée]riel\s*(sp[ée]cifique)?\s*:?\s*/i },
  { key: "ingredients", test: /^ingr[ée]dients?\s*:?\s*/i },
  { key: "steps", test: /^pr[ée]paration\s*:?\s*/i },
  { key: "notes", test: /^remarques?\s*:?\s*/i },
];

export function normalizeUnit(raw) {
  const u = normalize(raw);
  if (!u) return "";
  if (/^g(rammes?)?$/.test(u)) return "g";
  if (/^kgs?$/.test(u)) return "kg";
  if (/^mls?$/.test(u)) return "ml";
  if (/^cls?$/.test(u)) return "cl";
  if (/^l(itres?)?$/.test(u)) return "l";
  if (/^pi[e]?ces?$/.test(u)) return "pièce";
  if (/^pincees?$/.test(u)) return "pincée";
  if (/(c\s*a?\s*soupe|cuilleres?\s*a\s*soupe)/.test(u)) return "c. à soupe";
  if (/(c\s*a?\s*cafe|cuilleres?\s*a\s*cafe)/.test(u)) return "c. à café";
  return raw.trim();
}

// Plage et pas de la molette de quantité, adaptés à l'unité de l'ingrédient :
// un pas de 1 est inutilisable pour "380 g" (il faudrait 380 crans de
// molette), donc on élargit la plage et on grossit le pas pour les grosses
// unités (g, ml), plus finement pour kg/l, et on garde un pas de 1 pour les
// unités qui se comptent naturellement (pièce, pincée, cuillères...).
export function getWheelRange(unit) {
  const u = normalize(unit);
  if (/^g$|^grammes?$/.test(u) || /^ml$/.test(u)) return { min: 0, max: 2000, step: 5 };
  if (/^kgs?$/.test(u) || /^l$|^litres?$/.test(u)) return { min: 0, max: 20, step: 0.25 };
  if (/^cls?$/.test(u)) return { min: 0, max: 200, step: 5 };
  return { min: 0, max: 99, step: 1 };
}

export function guessCategoryFromText(text) {
  const t = normalize(text);
  const sweet = /sucre|chocolat|vanille|dessert|gateau|tarte|patisserie|miel|confiture|biscuit|creme patissiere|caramel/.test(t);
  const savory = /poulet|boeuf|porc|poisson|legume|sel|poivre|fromage|viande|sauce|oignon|ail/.test(t);
  if (sweet && !savory) return "Sucré";
  return "Salé";
}

export function parseRecipeTemplate(raw) {
  const lines = (raw || "").split("\n");
  const sections = {};
  let current = null;
  let buffer = [];
  const flush = () => {
    if (current) {
      const text = buffer.join("\n").trim();
      sections[current] = sections[current] ? `${sections[current]}\n${text}` : text;
    }
    buffer = [];
  };
  lines.forEach((lineRaw) => {
    const line = lineRaw.trim();
    if (!line) {
      if (current) buffer.push("");
      return;
    }
    let matchedKey = null;
    let rest = "";
    for (const def of TEMPLATE_SECTIONS) {
      const m = line.match(def.test);
      if (m) {
        matchedKey = def.key;
        rest = line.slice(m[0].length).trim();
        break;
      }
    }
    if (matchedKey) {
      flush();
      current = matchedKey;
      if (rest) buffer.push(rest);
    } else if (current) {
      buffer.push(line);
    }
  });
  flush();

  const title = (sections.title || "").split("\n")[0].trim();
  if (!title) return null;

  const servingsMatch = (sections.servings || "").match(/\d+/);
  const servings = servingsMatch ? parseInt(servingsMatch[0], 10) : 4;

  const timeText = sections.time || "";
  const time = parseDurationMinutes(timeText) || (timeText.match(/\d+/) ? parseInt(timeText.match(/\d+/)[0], 10) : 30);

  const ingredientLines = (sections.ingredients || "")
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
  const ingredients = ingredientLines.map((line) => {
    const m = line.match(/^([\d.,]+)\s*(g|kg|ml|cl|l|litres?|pi[e]?ces?|pincees?|c\.?\s*[aà]\s*soupe|c\.?\s*[aà]\s*caf[ée]|cuill[eè]res?\s*[aà]\s*soupe|cuill[eè]res?\s*[aà]\s*caf[ée])?\s*(?:de\s+|d')?(.+)$/i);
    if (m && m[3]) {
      return { qty: parseFloat(m[1].replace(",", ".")) || 0, unit: normalizeUnit(m[2] || ""), name: m[3].trim() };
    }
    return { qty: 1, unit: "", name: line };
  });

  const stepLines = (sections.steps || "")
    .split("\n")
    .map((l) => l.replace(/^(\d+[.)]|[-•*])\s*/, "").trim())
    .filter(Boolean);

  const equipment = (sections.equipment || "").trim();
  const notesText = (sections.notes || "").trim();
  const notes = equipment ? `Matériel : ${equipment}${notesText ? `\n\n${notesText}` : ""}` : notesText || null;

  return {
    title,
    category: guessCategoryFromText(`${title} ${ingredientLines.join(" ")}`),
    time: time || 30,
    servings: servings || 4,
    carbs: null,
    notes,
    ingredients: ingredients.length ? ingredients : [{ qty: 1, unit: "", name: "Ingrédient à préciser" }],
    steps: stepLines.length ? stepLines : ["Étape à préciser"],
  };
}

/* ------------------------------------------------------------------ */
/*  TEXTE D'EXEMPLE (placeholder du champ d'import texte)              */
/* ------------------------------------------------------------------ */

export const TEMPLATE_PLACEHOLDER = `Recette de : Kouign-amann
Nombre de parts : 8
Temps de préparation : 70 min
Matériel spécifique : moule rond
Ingrédients :
250 g farine
200 g beurre
200 g sucre
Préparation :
Pétrir la farine, l'eau, la levure et le sel.
Laisser lever 1 heure puis incorporer le beurre.
Remarques : encore meilleur tiède.`;

