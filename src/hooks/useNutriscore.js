import { useState, useEffect, useRef } from "react";
import { estimateNutriscore, estimateNutriscoreLocal } from "../utils/nutriscore";

/* ------------------------------------------------------------------ */
/*  NUTRI-SCORE EN DIRECT                                              */
/*  Affiche l'estimation locale immédiatement (rendu optimiste), puis  */
/*  la remplace par l'estimation en ligne dès qu'elle arrive. Comme    */
/*  estimateNutriscore() met en cache chaque ingrédient déjà cherché,  */
/*  changer de portions ne redéclenche aucun appel réseau superflu.    */
/* ------------------------------------------------------------------ */
export default function useNutriscore(ingredients) {
  const [grade, setGrade] = useState(() => estimateNutriscoreLocal(ingredients));
  const requestId = useRef(0);
  const key = JSON.stringify(ingredients || []);

  useEffect(() => {
    setGrade(estimateNutriscoreLocal(ingredients));
    const id = ++requestId.current;
    let cancelled = false;
    estimateNutriscore(ingredients).then((online) => {
      // On ignore une réponse arrivée en retard si les ingrédients ont
      // déjà changé entre-temps (portion modifiée, recette différente...).
      if (!cancelled && id === requestId.current) setGrade(online);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return grade;
}
