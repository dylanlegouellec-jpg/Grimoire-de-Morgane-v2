import { useState, useRef } from "react";
import { Download, FileText, Upload, Wand2, X } from "lucide-react";
import { triggerHaptic } from "../../utils/helpers";
import { PRESS_DURATION_OPTIONS } from "./pressDuration";
import Flourish from "./Flourish";
import Seal from "./Seal";

export default function SecretSettingsModal({ onClose, onExport, onImportFile, onImportTextRecipe, pressDuration, onSetPressDuration }) {
  const fileRef = useRef(null);
  const [showImportChoice, setShowImportChoice] = useState(false);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal grimoire-page" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h2 className="dropcap-title">Réglages secrets du grimoire</h2>
        <Flourish />
        <p className="hint" style={{ fontStyle: "normal" }}>Sauvegarde ou fusionne l'intégralité de ton grimoire.</p>
        <div className="cookmode-nav" style={{ marginTop: 16 }}>
          <Seal tone="gold" onClick={onExport}>
            <Download size={16} /> Exporter mon grimoire
          </Seal>
          <Seal tone="gold" onClick={() => setShowImportChoice((v) => !v)}>
            <Upload size={16} /> Importer un grimoire
          </Seal>
        </div>
        {showImportChoice && (
          <div className="add-choice-list" style={{ marginTop: 14 }}>
            <Seal tone="gold" onClick={() => fileRef.current && fileRef.current.click()}>
              <FileText size={16} /> Fichier JSON complet
            </Seal>
            <Seal tone="gold" onClick={() => { onImportTextRecipe(); onClose(); }}>
              <Wand2 size={16} /> Fiche texte individuelle
            </Seal>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={(e) => { onImportFile(e); onClose(); }}
        />

        <h4 style={{ marginTop: 24 }}>Temps d'appui long</h4>
        <p className="hint" style={{ fontStyle: "normal", marginBottom: 10 }}>
          Durée à maintenir pour supprimer une carte ou ajouter un titre de section.
        </p>
        <div className="press-duration-options">
          {PRESS_DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`press-duration-pill ${pressDuration === opt.value ? "active" : ""}`}
              onClick={() => { triggerHaptic(15); onSetPressDuration(opt.value); }}
            >
              <span className="press-duration-label">{opt.label}</span>
              <span className="press-duration-sub">{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

