import { useState, useEffect, useRef } from "react";
import { Heart, Search, Wand2 } from "lucide-react";

import { DEFAULT_BASICS, SUPABASE_READY, demoRecipes, FILTERS, TABS } from "./constants";
import { CSS } from "./constants/styles.css";

import {
  copyText,
  nextId,
  triggerHaptic,
  ingredientKey,
  guessAisle,
  decodeRecipeCode,
} from "./utils/helpers";
import {
  fetchTable,
  loadAppState,
  saveAppState,
  mapRowToRecipe,
  mapRowToShoppingList,
  insertRow,
  updateRow,
  deleteRow,
  mapRecipeToRow,
  mapShoppingListToRow,
} from "./utils/supabase";
import { resolveIllustrationKey } from "./components/art";

import useSecretTrigger from "./hooks/useSecretTrigger";

import { NavButton, TextShareModal, ImportConfirmModal, DeleteConfirmModal, TextTemplateImportModal, SecretSettingsModal, ListsManagerModal } from "./components/common";
import { RecipesView, RecipeForm, RecipeDetail, CookMode } from "./components/recipe";
import { FridgeView } from "./components/fridge";
import { ShoppingView } from "./components/shopping";

/* ------------------------------------------------------------------ */
/*  APPLICATION PRINCIPALE                                             */
/* ------------------------------------------------------------------ */

export default function GrimoireDeMorgane() {
  const [ready, setReady] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [pantry, setPantry] = useState([]);
  const [basics, setBasics] = useState(DEFAULT_BASICS);
  const [pressDuration, setPressDuration] = useState(750);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [showListsManager, setShowListsManager] = useState(false);

  const [tab, setTab] = useState("recettes");
  const [filter, setFilter] = useState("tout");
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [fridgeSearch, setFridgeSearch] = useState("");
  const [formTarget, setFormTarget] = useState(null); // null | 'new' | recipe object
  const [openRecipe, setOpenRecipe] = useState(null);
  const [cookingRecipe, setCookingRecipe] = useState(null);
  const [textModal, setTextModal] = useState(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showTemplateImport, setShowTemplateImport] = useState(false);
  const [showSecretSettings, setShowSecretSettings] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const touchStart = useRef(null);
  const axisLock = useRef(null);
  const secretHeader = useSecretTrigger(() => setShowSecretSettings(true));

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const shareText = async (text, label) => {
    const ok = await copyText(text);
    if (ok) showToast(`${label} copié(e) !`);
    else setTextModal({ title: label, text });
  };

  useEffect(() => {
    (async () => {
      if (!SUPABASE_READY) {
        setRecipes(demoRecipes());
        setPantry([]);
        setBasics(DEFAULT_BASICS);
        setPressDuration(750);
        setShoppingLists([]);
        setActiveListId(null);
        setReady(true);
        showToast("Supabase non configuré — mode démo en mémoire.");
        return;
      }
      try {
        const [rows, state, listRows] = await Promise.all([
          fetchTable("recipes", "select=*&order=created_at.desc"),
          loadAppState(),
          fetchTable("shopping_lists", "select=*&order=created_at.asc"),
        ]);
        const mapped = (rows || []).map(mapRowToRecipe);
        setRecipes(mapped);
        setPantry((state && state.pantry) || []);
        setBasics((state && state.basics) || DEFAULT_BASICS);
        setPressDuration((state && state.press_duration) || 750);
        const mappedLists = (listRows || []).map(mapRowToShoppingList);
        setShoppingLists(mappedLists);
        setActiveListId(mappedLists.length ? mappedLists[mappedLists.length - 1].id : null);
      } catch (err) {
        console.error(err);
        showToast("Connexion Supabase impossible — mode démo en mémoire.");
        setRecipes(demoRecipes());
      } finally {
        setReady(true);
      }

      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("import");
        if (code) {
          const parsed = decodeRecipeCode(code);
          if (parsed) setPendingImport(parsed);
          window.history.replaceState({}, "", window.location.pathname);
        }
      } catch {
        /* pas d'URL exploitable, tant pis */
      }
    })();
  }, []);

  useEffect(() => { if (ready && SUPABASE_READY) saveAppState({ pantry }); }, [pantry, ready]);
  useEffect(() => { if (ready && SUPABASE_READY) saveAppState({ basics }); }, [basics, ready]);
  useEffect(() => { if (ready && SUPABASE_READY) saveAppState({ press_duration: pressDuration }); }, [pressDuration, ready]);

  const nextListName = () => {
    const nums = shoppingLists.map((l) => {
      const m = l.name.match(/^Liste (\d+)$/);
      return m ? parseInt(m[1], 10) : 0;
    });
    const max = nums.length ? Math.max(...nums) : 0;
    return `Liste ${max + 1}`;
  };

  const createShoppingList = async () => {
    const id = nextId();
    const name = nextListName();
    const newList = { id, name, items: [] };
    setShoppingLists((prev) => [...prev, newList]);
    setActiveListId(id);
    triggerHaptic(15);
    if (SUPABASE_READY) {
      try {
        await insertRow("shopping_lists", mapShoppingListToRow(newList));
      } catch (err) {
        console.error(err);
        showToast("Échec de la création de la liste.");
      }
    }
    return id;
  };

  const renameShoppingList = async (id, name) => {
    setShoppingLists((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
    if (SUPABASE_READY) {
      try {
        await updateRow("shopping_lists", id, { name });
      } catch (err) {
        console.error(err);
        showToast("Échec du renommage.");
      }
    }
  };

  const deleteShoppingList = async (id) => {
    setShoppingLists((prev) => prev.filter((l) => l.id !== id));
    setActiveListId((cur) => (cur === id ? null : cur));
    triggerHaptic(30);
    if (SUPABASE_READY) {
      try {
        await deleteRow("shopping_lists", id);
      } catch (err) {
        console.error(err);
        showToast("Échec de la suppression.");
      }
    }
  };

  const withActiveList = async (mutateFn) => {
    let listId = activeListId;
    if (!listId) listId = await createShoppingList();
    setShoppingLists((prev) => {
      const next = prev.map((l) => (l.id === listId ? { ...l, items: mutateFn(l.items) } : l));
      const target = next.find((l) => l.id === listId);
      if (target && SUPABASE_READY) {
        updateRow("shopping_lists", listId, { items: target.items }).catch((err) => console.error(err));
      }
      return next;
    });
  };

  const addManualItem = (name) => {
    withActiveList((items) => [{ id: nextId(), name, qty: 1, unit: "", checked: false, aisle: guessAisle(name) }, ...items]);
  };
  const toggleShoppingItem = (id) => {
    triggerHaptic(12);
    withActiveList((items) => items.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  };
  const adjustShoppingQty = (id, delta) => {
    triggerHaptic(10);
    withActiveList((items) => items.map((it) => (it.id === id ? { ...it, qty: Math.max(0, Math.round((it.qty + delta) * 100) / 100) } : it)));
  };
  const setShoppingItemQty = (id, value) => {
    withActiveList((items) => items.map((it) => (it.id === id ? { ...it, qty: Math.max(0, value) } : it)));
  };
  const generateShoppingList = (recipeIds) => {
    const selectedRecipes = recipes.filter((r) => recipeIds.includes(r.id));
    withActiveList((items) => {
      const map = new Map(items.map((it) => [`${it.name.toLowerCase()}__${it.unit}`, { ...it }]));
      selectedRecipes.forEach((r) => {
        r.ingredients.forEach((ing) => {
          if (ing.isSection) return;
          const key = `${ing.name.toLowerCase()}__${ing.unit}`;
          if (map.has(key)) {
            map.get(key).qty += Number(ing.qty) || 0;
          } else {
            map.set(key, { id: nextId(), name: ing.name, unit: ing.unit, qty: Number(ing.qty) || 0, checked: false, aisle: guessAisle(ing.name) });
          }
        });
      });
      return Array.from(map.values());
    });
    showToast("Liste de courses générée !");
    triggerHaptic(15);
  };
  const resetActiveList = () => {
    if (!activeListId) return;
    withActiveList(() => []);
    showToast("Liste réinitialisée !");
    triggerHaptic([60, 30, 60]);
  };

  const moveBasicToVariable = (name) => {
    const key = ingredientKey(name);
    setBasics((prev) => prev.filter((b) => b !== name));
    setPantry((prev) => (prev.includes(key) ? prev : [...prev, key]));
    showToast(`${name} déplacé vers les ingrédients variables.`);
    triggerHaptic(15);
  };

  const removeBasic = async (name) => {
    setBasics((prev) => prev.filter((b) => b !== name));
    await withActiveList((items) => [{ id: nextId(), name, qty: 1, unit: "", checked: false, aisle: guessAisle(name) }, ...items]);
    showToast(`${name} retiré des basiques et ajouté à la liste de courses.`);
    triggerHaptic(20);
  };

  const resetPantry = () => {
    setPantry([]);
    showToast("Frigo réinitialisé !");
    triggerHaptic([60, 30, 60]);
  };

  const saveRecipe = async (recipe) => {
    const exists = recipes.some((r) => r.id === recipe.id);
    // Mise à jour optimiste de l'état local
    setRecipes((prev) => (exists ? prev.map((r) => (r.id === recipe.id ? recipe : r)) : [recipe, ...prev]));
    if (!SUPABASE_READY) return;
    try {
      const row = mapRecipeToRow(recipe);
      if (exists) {
        await updateRow("recipes", recipe.id, row);
      } else {
        await insertRow("recipes", row);
      }
    } catch (err) {
      console.error(err);
      showToast("Échec de la sauvegarde en base Supabase.");
    }
  };

  const importRecipe = (parsed, successMessage) => {
    const category = parsed.category === "Sucré" ? "Sucré" : "Salé";
    const title = parsed.title;
    saveRecipe({
      id: nextId(),
      title,
      category,
      time: Number(parsed.time) || 30,
      servings: Number(parsed.servings) || 4,
      carbs: parsed.carbs != null && !Number.isNaN(Number(parsed.carbs)) ? Number(parsed.carbs) : null,
      notes: parsed.notes || null,
      illustrationKey: resolveIllustrationKey({ title, category, illustrationKey: parsed.illustrationKey }),
      favorite: false,
      ingredients: Array.isArray(parsed.ingredients) && parsed.ingredients.length
        ? parsed.ingredients.map((i) =>
            i && i.isSection
              ? { isSection: true, title: String(i.title || "").trim() }
              : { qty: Number(i.qty) || 0, unit: i.unit || "", name: String(i.name || "").trim() }
          )
        : [{ qty: 1, unit: "", name: "Ingrédient à préciser" }],
      steps: Array.isArray(parsed.steps) && parsed.steps.length
        ? parsed.steps
            .map((s) => (s && typeof s === "object" && s.isSection) ? { isSection: true, title: String(s.title || "").trim() } : String(s).trim())
            .filter((s) => (typeof s === "object" ? true : s))
        : ["Étape à préciser"],
    });
    showToast(successMessage);
  };

  const deleteRecipe = async (id) => {
    const previous = recipes;
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    if (!SUPABASE_READY) return;
    try {
      await deleteRow("recipes", id);
    } catch (err) {
      console.error(err);
      setRecipes(previous);
      showToast("Suppression impossible en base Supabase.");
    }
  };

  const toggleFavorite = async (id) => {
    const target = recipes.find((r) => r.id === id);
    if (!target) return;
    const nextFav = !target.favorite;
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: nextFav } : r)));
    if (!SUPABASE_READY) return;
    try {
      await updateRow("recipes", id, { is_favorite: nextFav });
    } catch (err) {
      console.error(err);
      setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !nextFav } : r)));
      showToast("Échec de la mise à jour du favori.");
    }
  };

  const exportGrimoire = () => {
    try {
      const blob = new Blob([JSON.stringify(recipes, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "grimoire-de-morgane.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Grimoire exporté !");
    } catch {
      showToast("Export impossible sur cet appareil.");
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result);
        const list = Array.isArray(data) ? data : Array.isArray(data.recipes) ? data.recipes : [data];
        const imported = list.filter((r) => r && r.title).map((r) => ({ ...r, id: nextId(), favorite: false }));
        setRecipes((prev) => [...imported, ...prev]);
        if (SUPABASE_READY) {
          for (const r of imported) {
            try { await insertRow("recipes", mapRecipeToRow(r)); } catch { /* on continue les autres */ }
          }
        }
        showToast(`${imported.length} recette(s) importée(s) !`);
      } catch {
        showToast("Fichier de grimoire illisible.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const confirmPendingImport = () => {
    if (!pendingImport) return;
    saveRecipe({ ...pendingImport, id: nextId(), favorite: false });
    setPendingImport(null);
    showToast("Recette ajoutée !");
  };

  const filterIndex = FILTERS.findIndex((f) => f.key === filter);

  // Le swipe ne fait basculer que les filtres Recettes ("Tout" / "Salé" / "Sucré").
  // La navigation principale du bas (Recettes / Mon Frigo / Courses) reste fixe.
  // Verrouillage d'axe : dès que la direction dominante du geste est détectée
  // (verticale ou horizontale), elle est figée pour tout le reste du geste —
  // un léger décalage horizontal pendant un scroll vertical ne peut donc plus
  // déclencher un changement de catégorie par erreur, et inversement.
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    axisLock.current = null;
  };
  const onTouchMove = (e) => {
    if (touchStart.current == null || axisLock.current != null) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    axisLock.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
  };
  const onTouchEnd = (e) => {
    if (touchStart.current == null || tab !== "recettes" || axisLock.current !== "x") {
      touchStart.current = null;
      axisLock.current = null;
      return;
    }
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    touchStart.current = null;
    axisLock.current = null;
    if (Math.abs(dx) < 55) return;
    const next = dx < 0 ? Math.min(filterIndex + 1, FILTERS.length - 1) : Math.max(filterIndex - 1, 0);
    setFilter(FILTERS[next].key);
  };

  if (!ready) {
    return (
      <div className="loading-screen">
        <style>{CSS}</style>
        <Wand2 className="spin-wand" size={28} />
        <p>Ouverture du grimoire…</p>
      </div>
    );
  }

  return (
    <div className="grimoire-app">
      <style>{CSS}</style>

      <header className="app-header">
        <h1 {...secretHeader}>Le Grimoire de Morgane</h1>
        <p className="subtitle">LIVRE DE MORGANE · SALÉ &amp; SUCRÉ</p>
      </header>

      {tab === "recettes" && (
        <>
          <div className="search-bar">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Chercher une recette ou un ingrédient…"
            />
          </div>
          <div className="filter-bar">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter-pill ${filter === f.key ? "active" : ""}`}
                onClick={() => { triggerHaptic(10); setFilter(f.key); }}
              >
                {f.label}
              </button>
            ))}
            <button
              className={`filter-pill heart-pill ${favoritesOnly ? "active" : ""}`}
              onClick={() => { triggerHaptic(10); setFavoritesOnly((v) => !v); }}
              title="Afficher uniquement les favoris"
            >
              <Heart size={13} fill={favoritesOnly ? "currentColor" : "none"} /> Favoris
            </button>
          </div>
        </>
      )}
      {tab === "frigo" && (
        <div className="search-bar">
          <Search size={15} />
          <input
            value={fridgeSearch}
            onChange={(e) => setFridgeSearch(e.target.value)}
            placeholder="Chercher un ingrédient…"
          />
        </div>
      )}

      <main className="app-content" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {tab === "recettes" && (
          <RecipesView
            recipes={recipes}
            filter={filter}
            search={search}
            favoritesOnly={favoritesOnly}
            onToggleFavorite={toggleFavorite}
            onAddRequest={() => setFormTarget("new")}
            onOpen={setOpenRecipe}
            onRequestDelete={(r) => setDeleteTarget(r)}
            pressDuration={pressDuration}
          />
        )}
        {tab === "frigo" && (
          <FridgeView
            recipes={recipes}
            pantry={pantry}
            setPantry={setPantry}
            basics={basics}
            search={fridgeSearch}
            onMoveBasicToVariable={moveBasicToVariable}
            onRemoveBasic={removeBasic}
            onResetPantry={resetPantry}
            onOpen={setOpenRecipe}
          />
        )}
        {tab === "courses" && (
          <ShoppingView
            recipes={recipes}
            activeList={shoppingLists.find((l) => l.id === activeListId) || null}
            onAddManualItem={addManualItem}
            onToggleItem={toggleShoppingItem}
            onAdjustQty={adjustShoppingQty}
            onSetItemQty={setShoppingItemQty}
            onGenerateFromRecipes={generateShoppingList}
            onResetActiveList={resetActiveList}
            onCreateList={createShoppingList}
            onOpenManager={() => setShowListsManager(true)}
            showToast={showToast}
            pressDuration={pressDuration}
          />
        )}
      </main>

      <nav className="bottom-nav">
        {TABS.map(({ key, label, icon: Icon }) => (
          <NavButton
            key={key}
            tabKey={key}
            label={label}
            Icon={Icon}
            active={tab === key}
            onSelect={() => setTab(key)}
            onLongPress={key === "courses" && shoppingLists.length > 0 ? () => setShowListsManager(true) : null}
            pressDuration={pressDuration}
          />
        ))}
      </nav>

      {formTarget && (
        <RecipeForm
          onClose={() => setFormTarget(null)}
          onSave={saveRecipe}
          onDelete={deleteRecipe}
          initialRecipe={formTarget === "new" ? null : formTarget}
          pressDuration={pressDuration}
        />
      )}
      {openRecipe && (
        <RecipeDetail
          key={openRecipe.id}
          recipe={recipes.find((r) => r.id === openRecipe.id) || openRecipe}
          onClose={() => setOpenRecipe(null)}
          onCook={(r) => setCookingRecipe(r)}
          onEdit={(r) => { setOpenRecipe(null); setFormTarget(r); }}
          shareText={shareText}
          showToast={showToast}
        />
      )}
      {cookingRecipe && (
        <CookMode recipe={cookingRecipe} onClose={() => setCookingRecipe(null)} pressDuration={pressDuration} />
      )}
      {textModal && (
        <TextShareModal title={textModal.title} text={textModal.text} onClose={() => setTextModal(null)} />
      )}
      {pendingImport && (
        <ImportConfirmModal
          recipe={pendingImport}
          onConfirm={confirmPendingImport}
          onCancel={() => setPendingImport(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          recipe={deleteTarget}
          onConfirm={() => {
            deleteRecipe(deleteTarget.id);
            showToast("Recette supprimée !");
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showTemplateImport && (
        <TextTemplateImportModal
          onClose={() => setShowTemplateImport(false)}
          onImport={(parsed) => importRecipe(parsed, "Fiche importée !")}
        />
      )}
      {showSecretSettings && (
        <SecretSettingsModal
          onClose={() => setShowSecretSettings(false)}
          onExport={exportGrimoire}
          onImportFile={handleImportFile}
          onImportTextRecipe={() => setShowTemplateImport(true)}
          pressDuration={pressDuration}
          onSetPressDuration={setPressDuration}
        />
      )}
      {showListsManager && (
        <ListsManagerModal
          lists={shoppingLists}
          activeListId={activeListId}
          onOpen={(id) => setActiveListId(id)}
          onCreate={createShoppingList}
          onRename={renameShoppingList}
          onDelete={deleteShoppingList}
          onClose={() => setShowListsManager(false)}
        />
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
