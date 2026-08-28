import { Copy, Download, FileText, X } from "lucide-react";
import {
  encodeRecipeCode,
  buildImportLink,
  slugify,
  triggerPrint,
  buildPrintHTML,
} from "../../utils/helpers";
import Flourish from "./Flourish";
import Seal from "./Seal";

export default function ShareRecipeModal({ recipe, servings, ingredients, onClose, shareText, showToast }) {
  const doCopyCode = () => {
    const code = encodeRecipeCode(recipe);
    if (!code) { showToast("Impossible de générer le code."); return; }
    shareText(buildImportLink(code), "Lien de la recette");
  };

  const doDownloadFile = () => {
    try {
      const blob = new Blob([JSON.stringify(recipe, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(recipe.title)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Recette téléchargée !");
    } catch {
      showToast("Téléchargement impossible sur cet appareil.");
    }
  };

  const doExportPDF = () => {
    try {
      triggerPrint(buildPrintHTML(recipe, servings, ingredients));
    } catch {
      showToast("Export PDF impossible sur cet appareil.");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal grimoire-page" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h2 className="dropcap-title">Partager « {recipe.title} »</h2>
        <Flourish />
        <h4>Transférer vers un autre Grimoire</h4>
        <div className="share-option-row">
          <Seal tone="gold" onClick={doCopyCode}><Copy size={16} /> Copier le code</Seal>
          <Seal tone="gold" onClick={doDownloadFile}><Download size={16} /> Télécharger le fichier</Seal>
        </div>
        <h4 style={{ marginTop: 22 }}>Exporter en fiche</h4>
        <Seal tone="gold" onClick={doExportPDF}><FileText size={16} /> Fiche PDF / Parchemin</Seal>
      </div>
    </div>
  );
}
