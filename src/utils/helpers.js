/* ------------------------------------------------------------------ */
/*  RAYONS DE COURSES                                                  */
/* ------------------------------------------------------------------ */

export const AISLES = [
  { key: "fruits-legumes", label: "Fruits & Légumes", test: /oignon|ail|carotte|tomate|pomme|citron|herbe|persil|basilic|thym|laurier|échalote|poireau|courgette|champignon|salade|pêche|fraise|orange|banane|aubergine|poivron/i },
  { key: "boucherie", label: "Boucherie & Poissonnerie", test: /poulet|boeuf|bœuf|porc|veau|agneau|lardon|jambon|poisson|saumon|crevette|canard/i },
  { key: "cremerie", label: "Crémerie", test: /beurre|crème|lait|oeuf|œuf|fromage|yaourt|parmesan|gruyère|mascarpone/i },
  { key: "epicerie-salee", label: "Épicerie salée", test: /sel|poivre|huile|vinaigre|bouillon|farine|pâte(?! sucrée)|riz|moutarde|câpre/i },
  { key: "epicerie-sucree", label: "Épicerie sucrée", test: /sucre|chocolat|vanille|miel|levure|cannelle|amande|noisette|confiture/i },
  { key: "boulangerie", label: "Boulangerie", test: /pain|baguette|brioche|pâte feuilletée|pâte brisée/i },
];

export function guessAisle(name) {
  const found = AISLES.find((a) => a.test.test(name));
  return found ? found.label : "Autre";
}

/* ------------------------------------------------------------------ */
/*  SECTIONS STRUCTURANTES (ingrédients / étapes groupés par titre)    */
/* ------------------------------------------------------------------ */

export function groupIngredients(ingredients = []) {
  const groups = [];
  let current = { title: null, items: [] };
  ingredients.forEach((ing) => {
    if (ing && ing.isSection) {
      if (current.items.length || current.title) groups.push(current);
      current = { title: ing.title, items: [] };
    } else if (ing) {
      current.items.push(ing);
    }
  });
  groups.push(current);
  return groups.filter((g) => g.items.length || g.title);
}

export function groupSteps(steps = []) {
  const groups = [];
  let current = { title: null, steps: [] };
  steps.forEach((s) => {
    if (s && typeof s === "object" && s.isSection) {
      if (current.steps.length || current.title) groups.push(current);
      current = { title: s.title, steps: [] };
    } else if (typeof s === "string" && s.trim()) {
      current.steps.push(s);
    }
  });
  groups.push(current);
  return groups.filter((g) => g.steps.length || g.title);
}

export function parseDurationMinutes(text = "") {
  try {
    const hMatch = text.match(/(\d+)\s*h\s*(\d{1,2})?/i);
    if (hMatch) {
      const h = parseInt(hMatch[1], 10);
      const m = hMatch[2] ? parseInt(hMatch[2], 10) : 0;
      return h * 60 + m;
    }
    const mMatch = text.match(/(\d+)\s*(minutes?|min)\b/i);
    if (mMatch) return parseInt(mMatch[1], 10);
    return null;
  } catch {
    return null;
  }
}


/* ------------------------------------------------------------------ */
/*  GÉNÉRATEUR D'IDENTIFIANTS                                          */
/* ------------------------------------------------------------------ */

// Générateur d'identifiants uniques et robuste : ne dépend d'aucun compteur
// remis à zéro à chaque rechargement de page (c'était la cause du bug
// d'écrasement — un compteur en mémoire qui repartait de 100 à chaque
// session finissait par régénérer des ids déjà utilisés dans Supabase).
let idFallbackCounter = 0;
export function nextId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `r-${crypto.randomUUID()}`;
    }
  } catch {
    /* ignore et repli ci-dessous */
  }
  idFallbackCounter += 1;
  return `r-${Date.now().toString(36)}-${idFallbackCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ------------------------------------------------------------------ */
/*  PARTAGE, IMPORT / EXPORT (codes recette)                           */
/* ------------------------------------------------------------------ */

export function encodeRecipeCode(recipe) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(recipe))));
  } catch {
    return "";
  }
}
export function decodeRecipeCode(code) {
  try {
    const obj = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (obj && typeof obj === "object" && obj.title) return obj;
    return null;
  } catch {
    return null;
  }
}
export function buildImportLink(code) {
  try {
    return `${window.location.origin}${window.location.pathname}?import=${code}`;
  } catch {
    return code;
  }
}
export function extractCodeFromInput(raw) {
  const trimmed = (raw || "").trim();
  try {
    const url = new URL(trimmed);
    const fromUrl = url.searchParams.get("import");
    if (fromUrl) return fromUrl;
  } catch {
    /* pas une URL, on considère que c'est le code brut */
  }
  return trimmed;
}

/* ------------------------------------------------------------------ */
/*  NORMALISATION, SLUGIFY, HAPTIQUE, IMPRIMERIE                       */
/* ------------------------------------------------------------------ */

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function triggerHaptic(pattern = 15) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}
export function normalize(str) {
  return (str || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
export function singularizeFr(word) {
  const w = (word || "").trim();
  if (/eaux$/i.test(w)) return w.replace(/eaux$/i, "eau");
  if (/aux$/i.test(w)) return w.replace(/aux$/i, "al");
  if (/s$/i.test(w) && w.length > 3) return w.replace(/s$/i, "");
  return w;
}
export function ingredientKey(name) {
  return normalize(singularizeFr(name));
}
export function isSucre(recipe) {
  return normalize(recipe && recipe.category) === "sucre";
}
export function categoryLabel(recipe) {
  return isSucre(recipe) ? "Sucré" : "Salé";
}
export function categoryClass(recipe) {
  return isSucre(recipe) ? "chip-sucre" : "chip-sale";
}
export function slugify(s) {
  return (
    (s || "recette")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "recette"
  );
}
export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
export function buildPrintHTML(recipe, servings, ingredients) {
  const ingredientsHtml = groupIngredients(ingredients)
    .map(
      (g) => `
    ${g.title ? `<h3 class="sub">${escapeHtml(g.title)}</h3>` : ""}
    <ul>${g.items.map((i) => `<li>${escapeHtml(i.qty)} ${escapeHtml(i.unit)} — ${escapeHtml(i.name)}</li>`).join("")}</ul>`
    )
    .join("");
  const stepsHtml = groupSteps(recipe.steps)
    .map(
      (g) => `
    ${g.title ? `<h3 class="sub">${escapeHtml(g.title)}</h3>` : ""}
    <ol>${g.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>`
    )
    .join("");
  const carbsLine = recipe.carbs ? `<span>${Math.round(recipe.carbs * servings)} g glucides (total)</span>` : "";
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>${escapeHtml(recipe.title)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Cinzel+Decorative:wght@700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
  body { font-family:'EB Garamond', Georgia, serif; background:#f1e6c8; color:#2a2013; margin:0; padding:40px; }
  .sheet { max-width:640px; margin:0 auto; border:2px solid #b3872a; border-radius:6px; padding:36px 40px; background:#f6ecd2; box-shadow:0 0 0 6px #f1e6c8 inset; }
  h1 { font-family:'Cinzel Decorative','Cinzel',serif; text-align:center; font-size:1.8rem; margin:0 0 6px; }
  .type { text-align:center; font-family:'Cinzel',serif; letter-spacing:2px; font-size:0.7rem; text-transform:uppercase; color:#b3872a; margin-bottom:18px; }
  .meta { display:flex; justify-content:center; gap:22px; font-size:0.9rem; color:#5c4a30; margin-bottom:20px; }
  .flourish { text-align:center; color:#b3872a; font-size:1.3rem; margin:14px 0; }
  h2 { font-family:'Cinzel',serif; font-size:1rem; letter-spacing:1px; color:#5c4a30; border-bottom:1px dashed rgba(179,135,42,0.35); padding-bottom:6px; }
  h3.sub { font-family:'Cinzel',serif; font-size:0.85rem; letter-spacing:0.5px; color:#b3872a; margin:14px 0 4px; }
  .notes { font-style: italic; color: #5c4a30; }
  ul, ol { padding-left:22px; }
  li { margin-bottom:6px; font-size:1.02rem; }
  @media print { body { padding:0; background:#f6ecd2; } .sheet { border:none; box-shadow:none; } }
</style></head>
<body>
  <div class="sheet">
    <h1>${escapeHtml(recipe.title)}</h1>
    <p class="type">${normalize(recipe.category) === "sucre" ? "Sucré" : "Salé"} · Le Grimoire de Morgane</p>
    <div class="meta"><span>⏱ ${recipe.time} min</span><span>👥 ${servings} pers.</span>${carbsLine}</div>
    <div class="flourish">❦</div>
    <h2>Ingrédients</h2>
    ${ingredientsHtml}
    <h2>Préparation</h2>
    ${stepsHtml}
    ${recipe.notes ? `<h2>Remarques &amp; astuces</h2><p class="notes">${escapeHtml(recipe.notes)}</p>` : ""}
  </div>
</body></html>`;
}

export function openPrintFallback(html) {
  try {
    const win = window.open("", "_blank");
    if (!win) return false;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => {
      try { win.print(); } catch { /* ignore */ }
    }, 400);
    return true;
  } catch {
    return false;
  }
}

export function triggerPrint(html) {
  try {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // On n'attend pas un éventuel événement "load" (peu fiable après document.write
    // selon les navigateurs) : un court délai fixe suffit à laisser le contenu se
    // mettre en page avant de déclencher l'impression.
    setTimeout(() => {
      let printed = false;
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        printed = true;
      } catch (err) {
        console.error("Impression iframe impossible :", err);
      }
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 1000);
      if (!printed) openPrintFallback(html);
    }, 300);
  } catch (err) {
    console.error("triggerPrint a échoué, repli sur un nouvel onglet :", err);
    openPrintFallback(html);
  }
}
