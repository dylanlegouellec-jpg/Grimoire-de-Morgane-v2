import { useRef, useState, useEffect } from "react";
import { Camera, ImageOff, Sparkles, Trash2, X } from "lucide-react";
import { triggerHaptic } from "../../utils/helpers";
import { generateAIIllustration } from "../../utils/aiIllustration";
import Flourish from "./Flourish";

/* ------------------------------------------------------------------ */
/*  MENU D'ACTIONS SUR UNE RECETTE (déclenché par l'appui long)        */
/* ------------------------------------------------------------------ */
export default function RecipeOptionsModal({ recipe, onClose, onUpdateRecipe, onRequestDelete }) {
  const fileInputRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Bloque le scroll du fond de page tant que ce menu est ouvert (même
  // logique que RecipeDetail.jsx), restauré proprement à la fermeture.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, []);

  const handlePhotoClick = () => {
    triggerHaptic(15);
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // permet de reprendre la même photo une prochaine fois
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Ce fichier n'est pas une image.");
      return;
    }
    // Base64 en local (localStorage / Supabase text column) — voir le
    // commentaire en tête de utils/supabase.js pour la variante "bucket".
    const reader = new FileReader();
    reader.onload = () => {
      onUpdateRecipe({ ...recipe, imageUrl: reader.result, imageSource: "photo" });
      triggerHaptic(15);
      onClose();
    };
    reader.onerror = () => setError("Impossible de lire cette image.");
    reader.readAsDataURL(file);
  };

  const handleGenerateAI = async () => {
    setError(null);
    setGenerating(true);
    triggerHaptic(15);
    try {
      const imageUrl = await generateAIIllustration(recipe);
      onUpdateRecipe({ ...recipe, imageUrl, imageSource: "ia" });
      onClose();
    } catch (err) {
      console.error(err);
      setError("Génération IA indisponible pour le moment.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = () => {
    triggerHaptic(30);
    onClose();
    onRequestDelete(recipe);
  };

  const handleRemoveImage = () => {
    triggerHaptic(15);
    onUpdateRecipe({ ...recipe, imageUrl: null, imageSource: null });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal grimoire-page recipe-options-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h2 className="dropcap-title">{recipe.title}</h2>
        <Flourish />

        <div className="recipe-options-list">
          <button type="button" className="recipe-option-row" onClick={handlePhotoClick}>
            <Camera size={18} />
            <span>Ajouter ma propre photo</span>
          </button>

          <button type="button" className="recipe-option-row" onClick={handleGenerateAI} disabled={generating}>
            <Sparkles size={18} className={generating ? "spin-wand" : ""} />
            <span>{generating ? "Génération en cours…" : "Générer une illustration par IA"}</span>
          </button>

          {recipe.imageUrl && (
            <button type="button" className="recipe-option-row" onClick={handleRemoveImage}>
              <ImageOff size={18} />
              <span>Supprimer l'image personnalisée</span>
            </button>
          )}

          <button type="button" className="recipe-option-row danger" onClick={handleDelete}>
            <Trash2 size={18} />
            <span>Supprimer la recette</span>
          </button>
        </div>

        {error && <p className="hint recipe-options-error">{error}</p>}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
