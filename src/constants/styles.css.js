/* ------------------------------------------------------------------ */
/*  CSS — styles isolés du Grimoire de Morgane                         */
/*  Injecté via <style>{CSS}</style> dans le composant principal.      */
/* ------------------------------------------------------------------ */

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cinzel+Decorative:wght@700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

:root {
  --parchment: #f1e6c8;
  --parchment-deep: #e6d5a8;
  --ink: #2a2013;
  --ink-soft: #5c4a30;
  --gold: #b3872a;
  --gold-light: #d9b45c;
  --wine: #7c3232;
  --plum: #5a3a63;
  --line: rgba(42,32,19,0.18);
}

html, body {
  margin: 0;
  padding: 0;
  background: #fcf8f2;
}

.grimoire-app, .loading-screen {
  font-family: 'EB Garamond', Georgia, serif;
  color: var(--ink);
  background:
    radial-gradient(ellipse at top left, rgba(255,255,255,0.35), transparent 60%),
    var(--parchment);
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  padding-top: env(safe-area-inset-top);
  padding-bottom: 84px;
  box-shadow: 0 0 40px rgba(0,0,0,0.15);
  overflow-x: hidden;
}

.loading-screen {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; min-height: 100vh; color: var(--gold);
}
.loading-screen p { color: var(--ink-soft); font-style: italic; }

* { box-sizing: border-box; }

.app-header {
  text-align: center;
  padding: 28px 20px 16px;
  border-bottom: 2px solid var(--line);
  background: linear-gradient(180deg, rgba(255,255,255,0.25), transparent);
}
.app-header h1 {
  font-family: 'Cinzel Decorative', 'Cinzel', serif;
  font-size: 1.55rem;
  margin: 0;
  color: var(--ink);
  letter-spacing: 0.5px;
}
.subtitle {
  margin: 6px 0 0;
  font-family: 'Cinzel', serif;
  font-size: 0.62rem;
  letter-spacing: 3px;
  color: var(--gold);
  text-transform: uppercase;
}

.search-bar {
  display: flex; align-items: center; gap: 8px;
  margin: 14px 16px 0; padding: 9px 12px;
  background: rgba(255,255,255,0.4); border: 1px solid var(--line); border-radius: 999px;
  color: var(--ink-soft);
}
.search-bar input {
  border: none; background: transparent; outline: none; flex: 1;
  font-family: 'EB Garamond', serif; font-size: 0.95rem; color: var(--ink);
}

.filter-bar {
  display: flex; gap: 8px; padding: 14px 16px 4px; overflow-x: auto;
}
.filter-pill {
  font-family: 'Cinzel', serif;
  font-size: 0.7rem;
  letter-spacing: 1px;
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.35);
  color: var(--ink-soft);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}
.filter-pill.active { background: var(--ink); color: var(--parchment); border-color: var(--ink); }
.heart-pill { display: inline-flex; align-items: center; gap: 5px; }
.heart-pill.active { color: #e8607a; border-color: #e8607a; background: rgba(232,96,122,0.12); }

.app-content { padding: 16px; min-height: 50vh; overflow-x: hidden; }
.view { animation: fadeIn 0.35s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }

.hint { color: var(--ink-soft); font-style: italic; font-size: 0.92rem; margin: 4px 0 14px; }

/* --- Cartes --- */
.card {
  background: rgba(255,255,255,0.4);
  border: 1px solid var(--line);
  border-radius: 10px;
  box-shadow: 0 2px 0 rgba(42,32,19,0.06), 0 6px 14px rgba(42,32,19,0.07);
}

.recipes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-bottom: 110px; }
.card-enter { animation: cardEnter 0.42s cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(14px) scale(0.97); }
  to { opacity: 1; transform: none; }
}
.recipe-card { overflow: hidden; cursor: pointer; transition: transform 0.15s ease; }
.recipe-card:active { transform: scale(0.97); }
.card-body { padding: 10px 12px 14px; }
.card-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.recipe-card h3 { font-family: 'Cinzel', serif; font-size: 0.92rem; margin: 4px 0; line-height: 1.25; }
.card-meta { display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.72rem; color: var(--ink-soft); align-items: center; }
.card-meta span { display: inline-flex; align-items: center; gap: 3px; }
.carbs-badge {
  font-family: 'Cinzel', serif; font-size: 0.62rem; letter-spacing: 0.4px;
  background: rgba(179,135,42,0.15); color: var(--gold); border: 1px solid rgba(179,135,42,0.4);
  padding: 3px 8px; border-radius: 999px;
}

.chip {
  font-family: 'Cinzel', serif;
  font-size: 0.58rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 999px;
  color: #fff;
}
.chip-sale { background: var(--wine); }
.chip-sucre { background: var(--plum); }

.nutri-badge {
  width: 20px; height: 20px; border-radius: 50%;
  color: #fff; font-weight: 700; font-size: 0.68rem;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cinzel', serif;
}

.illus {
  width: 100%; aspect-ratio: 4/3;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.illus-wrap { position: relative; }
.illus-art svg { display: block; }
.fav-btn {
  position: absolute; top: 8px; right: 8px;
  width: 30px; height: 30px; border-radius: 50%; border: none;
  background: rgba(20,14,4,0.4); color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; backdrop-filter: blur(2px);
}
.fav-btn.active { color: #e8607a; background: rgba(20,14,4,0.55); }
.spin-wand { animation: spin 1.4s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* --- Fiche recette --- */
.detail-drag-handle {
  position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
  width: 40px; height: 4px; border-radius: 999px; background: rgba(42,32,19,0.25); z-index: 4;
}
.detail-hero { position: relative; margin: -22px -20px 0; width: calc(100% + 40px); aspect-ratio: 16/10; overflow: hidden; }
.detail-hero .illus { aspect-ratio: auto; height: 100%; }
.detail-hero-fade {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 55%, var(--parchment) 100%);
  pointer-events: none;
}
.detail-scroll { position: relative; }
.detail-scroll-hint { text-align: center; color: var(--line); font-size: 1.2rem; margin-top: 18px; letter-spacing: 4px; }
.portions-adjuster {
  display: flex; align-items: center; justify-content: space-between;
  margin: 6px 0 14px; font-family: 'Cinzel', serif; font-size: 0.75rem; color: var(--ink-soft);
}
.portions-adjuster > span:first-child { display: inline-flex; align-items: center; gap: 6px; }
.portions-stepper { display: flex; align-items: center; gap: 10px; }
.portions-stepper button {
  width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--gold);
  background: rgba(255,255,255,0.4); color: var(--ink); display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.portions-stepper span { min-width: 18px; text-align: center; font-family: 'EB Garamond', serif; font-size: 1rem; color: var(--ink); }
.scaled-note { font-style: italic; font-weight: normal; text-transform: none; letter-spacing: 0; font-size: 0.78rem; color: var(--ink-soft); }
.detail-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.detail-actions .seal { flex: 1; justify-content: center; }

/* --- Sceaux / boutons --- */
.seal {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 20px;
  border-radius: 999px;
  border: 1px solid var(--gold);
  background: linear-gradient(180deg, var(--gold-light), var(--gold));
  color: #2a1c07;
  cursor: pointer;
  box-shadow: 0 3px 0 #8a651c, 0 6px 12px rgba(0,0,0,0.15);
  transition: transform 0.08s ease;
}
.seal:active { transform: translateY(2px); box-shadow: 0 1px 0 #8a651c; }
.seal:disabled { opacity: 0.45; cursor: not-allowed; }

.fab {
  position: fixed;
  right: calc(50% - 240px + 18px);
  bottom: 96px;
  width: 52px; height: 52px; border-radius: 50%;
  background: var(--ink); color: var(--gold-light);
  border: 2px solid var(--gold);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 14px rgba(0,0,0,0.3);
  cursor: pointer;
}
@media (max-width: 520px) { .fab { right: 18px; } }

.generate-popup {
  position: fixed; left: 50%; bottom: 96px; transform: translateX(-50%);
  width: calc(100% - 32px); max-width: 448px; box-sizing: border-box;
  background: var(--ink); color: var(--gold-light);
  border: 2px solid var(--gold); border-radius: 999px;
  padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 10px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.35); z-index: 40; cursor: pointer;
}
.generate-popup span { display: inline-flex; align-items: center; gap: 8px; font-family: 'Cinzel', serif; font-size: 0.8rem; letter-spacing: 0.5px; text-transform: uppercase; }
.generate-popup-close { flex-shrink: 0; background: none; border: none; color: var(--gold-light); opacity: 0.7; font-size: 0.85rem; cursor: pointer; }

/* --- Mon Frigo --- */
.basics-title {
  font-family: 'Cinzel', serif; font-size: 0.85rem; letter-spacing: 0.5px; color: var(--gold);
  margin: 4px 0 8px; display: flex; align-items: baseline; gap: 8px;
}
.hint-inline { font-family: 'EB Garamond', serif; font-style: italic; font-size: 0.75rem; letter-spacing: 0; text-transform: none; color: var(--ink-soft); }
.basics-grid {
  display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;
  padding: 12px; border-radius: 10px;
  background: rgba(179,135,42,0.12); border: 1px solid rgba(179,135,42,0.3);
}
.basic-chip {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'EB Garamond', serif; font-size: 0.86rem; color: var(--ink);
  background: rgba(255,255,255,0.55); border: 1px solid rgba(179,135,42,0.4);
  border-radius: 999px; padding: 6px 6px 6px 13px;
}
.basic-action {
  width: 20px; height: 20px; border-radius: 50%; border: none;
  background: rgba(179,135,42,0.2); color: var(--gold); font-size: 0.7rem;
  display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
}
.basic-action-remove { background: rgba(124,50,50,0.15); color: var(--wine); }
.pantry-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
.pantry-chip {
  font-family: 'EB Garamond', serif; font-size: 0.86rem;
  padding: 7px 13px; border-radius: 999px; border: 1px solid var(--line);
  background: rgba(255,255,255,0.4); color: var(--ink-soft); cursor: pointer;
  display: inline-flex; align-items: center; gap: 5px;
}
.pantry-chip.active { background: var(--ink); color: var(--gold-light); border-color: var(--ink); }
.fridge-results { display: flex; flex-direction: column; gap: 10px; }
.fridge-row { display: flex; align-items: center; gap: 12px; padding: 8px; cursor: pointer; }
.fridge-thumb { width: 60px; height: 46px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
.fridge-row-body h5 { margin: 0 0 4px; font-family: 'Cinzel', serif; font-size: 0.85rem; }
.fridge-ready { color: #3E7A3E; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; }
.fridge-missing { color: var(--wine); font-size: 0.78rem; }

/* --- Courses --- */
.active-list-header { margin-bottom: 12px; }
.active-list-name {
  background: none; border: none; cursor: pointer; padding: 0;
  font-family: 'Cinzel', serif; font-size: 1rem; color: var(--ink);
  display: flex; align-items: baseline; gap: 8px;
}
.active-list-switch { font-family: 'EB Garamond', serif; font-style: italic; font-size: 0.78rem; color: var(--gold); }
.manual-add-row {
  display: flex; gap: 8px; margin-bottom: 16px;
  background: rgba(255,255,255,0.4); border: 1px solid var(--line); border-radius: 999px; padding: 4px 4px 4px 14px;
}
.manual-add-row input {
  flex: 1; border: none; background: transparent; outline: none;
  font-family: 'EB Garamond', serif; font-size: 0.92rem; color: var(--ink);
}
.manual-add-row button {
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: var(--gold); color: #2a1c07; display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.shopping-actions { display: flex; gap: 18px; margin-bottom: 10px; }
.recipe-picker-toggle {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.08); border: 1px solid var(--line);
  color: var(--ink-soft); font-family: 'Cinzel', serif; font-size: 0.72rem; letter-spacing: 1px;
  text-transform: uppercase; padding: 9px 14px; border-radius: 999px; cursor: pointer; margin-bottom: 10px;
}
.recipe-picker-toggle.open { color: var(--gold); border-color: var(--gold); }
.recipe-picker-count {
  background: var(--gold); color: #2a1c07; border-radius: 999px; min-width: 18px; height: 18px;
  padding: 0 5px; font-size: 0.65rem; display: flex; align-items: center; justify-content: center;
}
.recipe-picker-filters { padding: 0 0 8px; }
.recipe-select-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.recipe-select-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; cursor: pointer; }
.recipe-select-row span:nth-child(2) { flex: 1; }
.shopping-result { margin-top: 20px; }
.parchment-recap {
  text-align: center; font-family: 'Cinzel', serif; font-size: 0.72rem; letter-spacing: 1px; text-transform: uppercase;
  color: var(--ink-soft); background: rgba(179,135,42,0.1); border: 1px solid rgba(179,135,42,0.3);
  border-radius: 999px; padding: 8px 14px; margin-bottom: 10px;
}
.apple-bar {
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px;
}
.aisle-block { margin-bottom: 16px; }
.aisle-block h4 { font-family: 'Cinzel', serif; font-size: 0.78rem; letter-spacing: 1px; color: var(--gold); text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px dashed var(--line); padding-bottom: 4px; }
.shopping-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.shopping-list li { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 0.92rem; }
.checkbox-row { display: flex; align-items: center; gap: 10px; cursor: pointer; flex: 1; }
.shopping-list li.checked { opacity: 0.45; text-decoration: line-through; }
.checkbox {
  width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid var(--gold);
  display: flex; align-items: center; justify-content: center; color: var(--gold); flex-shrink: 0;
}
.qty-stepper { display: flex; gap: 4px; opacity: 0.45; flex-shrink: 0; }
.qty-stepper button {
  width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--line);
  background: rgba(255,255,255,0.5); color: var(--ink-soft); display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.bought-block h4 { color: var(--ink-soft); }

/* --- Navigation basse --- */
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 480px;
  display: flex; justify-content: space-around;
  background: var(--ink);
  border-top: 2px solid var(--gold);
  padding: 10px 0 max(10px, env(safe-area-inset-bottom));
}
.nav-btn {
  background: none; border: none; color: #b6a884;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.5px;
  cursor: pointer; padding: 4px 10px;
}
.nav-btn.active { color: var(--gold-light); }

/* --- Modales / page de grimoire --- */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(20,14,4,0.55);
  display: flex; align-items: flex-end; justify-content: center; z-index: 50;
  padding: 0;
}
.modal, .grimoire-page {
  background: var(--parchment);
  width: 100%; max-width: 480px; max-height: 88vh; overflow-y: auto; overflow-x: hidden;
  border-radius: 18px 18px 0 0;
  padding: 22px 20px 30px;
  position: relative;
  border-top: 3px solid var(--gold);
  animation: slideUp 0.28s ease;
}
.form-clean { max-width: 100%; overflow-x: hidden; }
@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-close {
  position: absolute; top: 14px; right: 14px; z-index: 5;
  background: rgba(0,0,0,0.06); border: none; border-radius: 50%;
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  color: var(--ink-soft); cursor: pointer;
}
.dropcap-title { font-family: 'Cinzel', serif; font-size: 1.3rem; margin: 10px 0 4px; }
.flourish { text-align: center; color: var(--gold); font-size: 1.1rem; margin: 12px 0; }
.modal h4 { font-family: 'Cinzel', serif; font-size: 0.85rem; letter-spacing: 0.5px; margin: 16px 0 8px; color: var(--ink-soft); }
.ingredient-list, .steps-list { padding-left: 20px; margin: 0 0 12px; }
.ingredient-list li, .steps-list li { margin-bottom: 5px; font-size: 0.95rem; }
.recipe-notes { font-style: italic; color: var(--ink-soft); font-size: 0.92rem; line-height: 1.5; margin: 0 0 12px; }

.field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; font-size: 0.82rem; color: var(--ink-soft); font-family: 'Cinzel', serif; letter-spacing: 0.3px; max-width: 100%; }
.field input, .field select, .field textarea {
  font-family: 'EB Garamond', serif; font-size: 1rem; color: var(--ink);
  background: rgba(255,255,255,0.5); border: 1px solid var(--line); border-radius: 8px;
  padding: 9px 10px; resize: vertical; width: 100%; max-width: 100%;
}
.field-row { display: flex; gap: 10px; max-width: 100%; }
.field-row .field { flex: 1; min-width: 0; }
.field-discreet { opacity: 0.8; }
.field-discreet span { font-size: 0.72rem; }
.field-discreet input { font-size: 0.9rem; padding: 7px 9px; }

/* --- Ingrédients structurés (formulaire) --- */
.ingredient-rows { display: flex; flex-direction: column; gap: 8px; margin-bottom: 6px; }
.row-drag-handle {
  flex-shrink: 0; width: 26px; height: 30px; border: none; border-radius: 6px;
  background: rgba(179,135,42,0.15); color: var(--gold); font-size: 15px; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  cursor: grab; touch-action: none; user-select: none;
}
.row-drag-handle:active { cursor: grabbing; background: rgba(179,135,42,0.3); }
.ingredient-row { display: flex; gap: 6px; align-items: center; max-width: 100%; }
.ing-qty {
  width: 56px; flex-shrink: 0; font-family: 'EB Garamond', serif; font-size: 0.92rem; color: var(--ink);
  background: rgba(255,255,255,0.5); border: 1px solid var(--line); border-radius: 8px; padding: 8px 6px;
}
.ing-unit {
  width: 92px; flex-shrink: 0; font-family: 'EB Garamond', serif; font-size: 0.82rem; color: var(--ink);
  background: rgba(255,255,255,0.5); border: 1px solid var(--line); border-radius: 8px; padding: 8px 4px;
}
.ing-name {
  flex: 1; min-width: 0; font-family: 'EB Garamond', serif; font-size: 0.92rem; color: var(--ink);
  background: rgba(255,255,255,0.5); border: 1px solid var(--line); border-radius: 8px; padding: 8px 9px;
}
.ing-remove {
  flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--line);
  background: rgba(255,255,255,0.4); color: var(--wine); display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.ingredient-section-row { display: flex; gap: 8px; align-items: center; max-width: 100%; }
.ing-section-title {
  flex: 1; min-width: 0; font-family: 'Cinzel', serif; font-size: 0.82rem; letter-spacing: 0.3px; color: var(--gold);
  background: rgba(179,135,42,0.1); border: 1px solid rgba(179,135,42,0.4); border-radius: 8px; padding: 8px 10px;
}
.add-ingredient-btn { display: block; margin: 2px 0 18px; }
.long-press-hint { font-family: 'EB Garamond', serif; text-transform: none; letter-spacing: 0; font-style: italic; opacity: 0.65; font-size: 0.7rem; }

/* --- Étapes structurées (formulaire) --- */
.step-rows { display: flex; flex-direction: column; gap: 8px; margin-bottom: 6px; }
.step-row { display: flex; gap: 8px; align-items: center; max-width: 100%; }
.step-row-num {
  flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%;
  background: var(--gold); color: #2a1c07; font-family: 'Cinzel', serif; font-size: 0.7rem;
  display: flex; align-items: center; justify-content: center;
}
.step-text {
  flex: 1; min-width: 0; font-family: 'EB Garamond', serif; font-size: 0.92rem; color: var(--ink);
  background: rgba(255,255,255,0.5); border: 1px solid var(--line); border-radius: 8px; padding: 8px 9px;
}
.step-remove {
  flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--line);
  background: rgba(255,255,255,0.4); color: var(--wine); display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 0.8rem; line-height: 1;
}
.step-section-row { display: flex; gap: 8px; align-items: center; max-width: 100%; }
.step-section-title {
  flex: 1; min-width: 0; font-family: 'Cinzel', serif; font-size: 0.82rem; letter-spacing: 0.3px; color: var(--gold);
  background: rgba(179,135,42,0.1); border: 1px solid rgba(179,135,42,0.4); border-radius: 8px; padding: 8px 10px;
}
.add-step-btn { display: block; margin: 2px 0 18px; }
.delete-recipe-btn { display: block; margin: 6px auto 0; color: var(--wine); text-align: center; }
.form-footer { margin-top: 22px; padding-top: 4px; display: flex; flex-direction: column; gap: 4px; }
.form-footer .seal { width: 100%; justify-content: center; }

/* --- Flourish glissant (onglet Courses) --- */
.flourish-swipe {
  cursor: grab; touch-action: pan-y; user-select: none;
}
.flourish-swipe.hint-right { color: #3E7A3E; }
.flourish-swipe.hint-left { color: var(--wine); }

/* --- Petits liens texte --- */
.link-btn {
  background: none; border: none; color: var(--gold);
  font-family: 'Cinzel', serif; font-size: 0.66rem; letter-spacing: 0.5px;
  display: inline-flex; align-items: center; gap: 5px;
  cursor: pointer; padding: 4px 0; text-transform: uppercase;
}

/* --- Import / partage --- */
.import-panel { margin: 10px 0 6px; display: flex; flex-direction: column; gap: 8px; }
.import-panel textarea {
  font-family: 'EB Garamond', serif; font-size: 0.9rem; color: var(--ink);
  background: rgba(255,255,255,0.5); border: 1px solid var(--line); border-radius: 8px; padding: 9px 10px;
  width: 100%; max-width: 100%;
}
.import-panel-actions { display: flex; justify-content: space-between; align-items: center; }
.import-error { color: var(--wine); font-size: 0.8rem; margin: 0; }
.share-textarea {
  width: 100%; font-family: monospace; font-size: 0.78rem; color: var(--ink-soft);
  background: rgba(255,255,255,0.5); border: 1px solid var(--line); border-radius: 8px;
  padding: 10px; margin-bottom: 14px; resize: vertical;
}
.share-option-row { display: flex; gap: 10px; flex-wrap: wrap; }
.share-option-row .seal { flex: 1; justify-content: center; }

/* --- Choix d'ajout / import de recette --- */
.add-choice-list { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.add-choice-list .seal { justify-content: center; }
.template-textarea {
  width: 100%; font-family: 'EB Garamond', serif; font-size: 0.88rem; color: var(--ink);
  background: rgba(255,255,255,0.5); border: 1px solid var(--line); border-radius: 8px;
  padding: 10px; margin: 4px 0 12px; resize: vertical; line-height: 1.5;
}

/* --- Temps d'appui long (réglages) --- */
.press-duration-options { display: flex; gap: 8px; }
.press-duration-pill {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 10px 6px; border-radius: 10px; border: 1px solid var(--line);
  background: rgba(255,255,255,0.4); cursor: pointer;
}
.press-duration-pill.active { background: var(--ink); border-color: var(--ink); }
.press-duration-label { font-family: 'Cinzel', serif; font-size: 0.72rem; letter-spacing: 0.5px; color: var(--ink); text-transform: uppercase; }
.press-duration-pill.active .press-duration-label { color: var(--gold-light); }
.press-duration-sub { font-family: 'EB Garamond', serif; font-style: italic; font-size: 0.72rem; color: var(--ink-soft); }
.press-duration-pill.active .press-duration-sub { color: var(--parchment); opacity: 0.8; }

/* --- Toast --- */
.toast {
  position: fixed; bottom: 78px; left: 50%; transform: translateX(-50%);
  background: var(--ink); color: var(--gold-light);
  font-family: 'Cinzel', serif; font-size: 0.72rem; letter-spacing: 0.5px;
  padding: 10px 18px; border-radius: 999px; border: 1px solid var(--gold);
  box-shadow: 0 6px 16px rgba(0,0,0,0.3); z-index: 70; text-align: center;
  animation: fadeIn 0.25s ease;
}

/* --- Mode cuisine --- */
.cookmode-backdrop {
  position: fixed; inset: 0; z-index: 60; background: #2c221e;
  display: flex; align-items: center; justify-content: center;
}
.cookmode {
  width: 100%; max-width: 480px; height: 100%;
  padding: calc(30px + env(safe-area-inset-top)) 20px 30px;
  color: var(--parchment); position: relative;
  display: flex; flex-direction: column; gap: 16px; overflow-y: auto;
}
.cookmode .modal-close { top: calc(14px + env(safe-area-inset-top)); background: rgba(255,255,255,0.12); color: var(--parchment); }
.cookmode-progress { flex-shrink: 0; font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 2px; color: var(--gold-light); text-transform: uppercase; }
.cookmode .dropcap-title { flex-shrink: 0; color: var(--parchment); margin: 0; }
.cookmode-steps { display: flex; flex-direction: column; gap: 12px; flex: 1; }
.cookmode-step-card {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(217,180,92,0.3); border-radius: 12px;
  padding: 14px; display: flex; gap: 12px; cursor: pointer;
}
.cookmode-step-card.done { opacity: 0.5; }
.cookmode-step-card.done .cookmode-step-text { text-decoration: line-through; }
.step-check {
  width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--gold-light);
  display: flex; align-items: center; justify-content: center; color: var(--gold-light); flex-shrink: 0; margin-top: 2px;
}
.step-body { flex: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.cookmode-step-text { font-size: 1.12rem; line-height: 1.5; margin: 0; }
.step-timer-btn {
  align-self: flex-start;
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Cinzel', serif; font-size: 0.68rem; letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 6px 12px; border-radius: 999px;
  border: 1px solid rgba(217,180,92,0.5);
  background: rgba(217,180,92,0.12);
  color: var(--gold-light);
  cursor: pointer;
}
.step-timer-btn.running { background: rgba(255,255,255,0.16); color: #fff; border-color: rgba(255,255,255,0.35); }
.step-timer-btn.done { background: rgba(95,154,74,0.25); color: #8fbf7a; border-color: #5f9a4a; }

/* --- Indicateur de portions compact (mode cuisine) --- */
.cookmode-ingredients-header {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  flex-shrink: 0; position: relative;
}
.portion-badge-wrap { position: relative; flex-shrink: 0; }
.portion-badge {
  width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid rgba(217,180,92,0.5);
  background: rgba(217,180,92,0.15); color: var(--gold-light);
  font-family: 'Cinzel', serif; font-size: 0.92rem; font-weight: 600;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}
.portion-badge.charging { animation: portionShake 0.4s ease forwards; background: rgba(217,180,92,0.3); }
.portion-badge.open { transform: scale(1.15); background: rgba(217,180,92,0.35); }
@keyframes portionShake {
  0% { transform: scale(1) rotate(0deg); }
  20% { transform: scale(1.05) rotate(-6deg); }
  40% { transform: scale(1.08) rotate(5deg); }
  60% { transform: scale(1.12) rotate(-3deg); }
  80% { transform: scale(1.14) rotate(2deg); }
  100% { transform: scale(1.15) rotate(0deg); }
}
.portion-badge-popover {
  position: absolute; top: 42px; right: 0; z-index: 20;
  background: #241a14; border: 1px solid rgba(217,180,92,0.4); border-radius: 14px;
  padding: 8px 10px 4px; box-shadow: 0 10px 24px rgba(0,0,0,0.4);
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  animation: wheelPopIn 0.22s ease;
}
@keyframes wheelPopIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.92); }
  to { opacity: 1; transform: none; }
}
.portion-wheel-wrap {
  position: relative;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  height: 120px;
}
.portion-wheel {
  height: 120px; width: 66px; overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.portion-wheel::-webkit-scrollbar { display: none; }
.portion-wheel-item {
  height: 40px; display: flex; align-items: center; justify-content: center;
  scroll-snap-align: center;
  font-family: 'Cinzel', serif; font-size: 1.05rem; color: rgba(252,248,242,0.32);
  transition: color 0.15s ease, font-size 0.15s ease;
}
.portion-wheel-item.active { color: var(--gold-light); font-size: 1.55rem; font-weight: 600; }
.portion-wheel-highlight {
  position: absolute; top: 50%; left: 0; right: 0; height: 40px; transform: translateY(-50%);
  border-top: 1px solid rgba(217,180,92,0.4); border-bottom: 1px solid rgba(217,180,92,0.4);
  pointer-events: none;
}
.portion-wheel-suffix {
  font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 1px; text-transform: uppercase;
  color: var(--parchment); opacity: 0.6;
}
.portion-wheel-wrap.light .portion-wheel-item { color: rgba(42,32,19,0.32); }
.portion-wheel-wrap.light .portion-wheel-item.active { color: var(--gold); }
.portion-wheel-wrap.light .portion-wheel-highlight { border-color: rgba(179,135,42,0.5); }
.portion-wheel-wrap.light .portion-wheel-suffix { color: var(--ink-soft); }

/* --- Molette de quantité (courses) --- */
.qty-wheel-modal { text-align: center; }
.qty-wheel-wrap { display: flex; justify-content: center; margin: 10px 0 18px; }

/* --- Gestion des listes de courses --- */
.lists-manager { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }
.lists-manager-row {
  display: flex; align-items: center; gap: 6px; padding: 8px 10px;
  border-radius: 10px; border: 1px solid var(--line); background: rgba(255,255,255,0.35);
}
.lists-manager-row.active { border-color: var(--gold); background: rgba(179,135,42,0.12); }
.lists-manager-name {
  flex: 1; min-width: 0; text-align: left; background: none; border: none; cursor: pointer;
  display: flex; flex-direction: column; gap: 2px; font-family: 'EB Garamond', serif; font-size: 1rem; color: var(--ink);
}
.lists-manager-count { font-family: 'Cinzel', serif; font-size: 0.65rem; letter-spacing: 0.5px; color: var(--ink-soft); text-transform: uppercase; }
.lists-manager-rename-input {
  flex: 1; min-width: 0; font-family: 'EB Garamond', serif; font-size: 1rem; color: var(--ink);
  background: rgba(255,255,255,0.6); border: 1px solid var(--gold); border-radius: 6px; padding: 6px 8px;
}
.lists-manager-icon-btn {
  flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--line);
  background: rgba(255,255,255,0.5); color: var(--ink-soft); font-size: 0.75rem;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.lists-manager-delete { color: var(--wine); }

/* --- Rappel ingrédients (mode cuisine) --- */
.ingredients-toggle {
  flex-shrink: 0;
  align-self: flex-start;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(217,180,92,0.4);
  color: var(--gold-light); font-family: 'Cinzel', serif; font-size: 0.68rem; letter-spacing: 1px;
  text-transform: uppercase; padding: 8px 14px; border-radius: 999px; cursor: pointer;
}
.cookmode-ingredients {
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(217,180,92,0.25); border-radius: 10px;
  padding: 12px 16px; max-height: 160px; overflow-y: auto;
}
.cookmode-ingredients ul { margin: 0; padding-left: 18px; list-style: disc; }
.cookmode-ingredients li { font-size: 0.9rem; margin-bottom: 5px; color: var(--parchment); }
.cookmode-ingredients li.ingredient-section-title,
.ingredient-list li.ingredient-section-title {
  list-style: none; margin-left: -18px; margin-top: 8px;
  font-family: 'Cinzel', serif; font-size: 0.72rem; letter-spacing: 1px; text-transform: uppercase;
  color: var(--gold);
}
.cookmode-ingredients li.ingredient-section-title { color: var(--gold-light); }
.steps-group-title {
  font-family: 'Cinzel', serif; font-size: 0.82rem; letter-spacing: 0.5px; color: var(--gold);
  margin: 14px 0 6px;
}
.group-nav {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 8px 4px; flex-shrink: 0;
}
.group-nav-btn {
  width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(217,180,92,0.4);
  background: rgba(255,255,255,0.08); color: var(--gold-light); cursor: pointer;
}
.group-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.group-nav-label { font-family: 'Cinzel', serif; font-size: 0.78rem; letter-spacing: 0.5px; color: var(--parchment); text-align: center; flex: 1; }
.group-nav-label em { font-style: normal; color: var(--gold-light); font-size: 0.7rem; }
.group-solo-title { font-family: 'Cinzel', serif; font-size: 0.85rem; color: var(--gold-light); margin: 4px 0 0; flex-shrink: 0; }
.steps-group { margin-bottom: 6px; }
.steps-group-title:first-child { margin-top: 0; }
.cookmode-nav { display: flex; gap: 12px; justify-content: space-between; margin-top: auto; }
.cookmode-nav .seal { flex: 1; justify-content: center; }
`;
