import { useRef } from "react";
import { Clock, Heart, Users } from "lucide-react";
import { NUTRI_COLORS } from "../../utils/nutriscore";
import { categoryLabel, categoryClass, triggerHaptic } from "../../utils/helpers";
import useNutriscore from "../../hooks/useNutriscore";
import DishArt from "../art/DishArt";

export default function RecipeCard({ recipe, onOpen, onToggleFavorite, onRequestDelete, enterDelay = 0, pressDuration = 750 }) {
  const nutri = useNutriscore(recipe.ingredients);
  const pressTimer = useRef(null);
  const longPressFired = useRef(false);

  const startPress = () => {
    longPressFired.current = false;
    pressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      triggerHaptic(30);
      onRequestDelete(recipe);
    }, pressDuration);
  };
  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };
  const handleClick = () => {
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    onOpen(recipe);
  };

  return (
    <div
      className="card recipe-card card-enter"
      style={{ animationDelay: `${enterDelay}ms` }}
      onClick={handleClick}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="illus-wrap">
        <DishArt recipe={recipe} />
        <button
          type="button"
          className={`fav-btn ${recipe.favorite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
            triggerHaptic(15);
          }}
        >
          <Heart size={16} fill={recipe.favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-body">
        <div className="card-top-row">
          <span className={`chip ${categoryClass(recipe)}`}>{categoryLabel(recipe)}</span>
          <span className="nutri-badge" style={{ background: NUTRI_COLORS[nutri] }}>{nutri}</span>
        </div>
        <h3>{recipe.title}</h3>
        <div className="card-meta">
          <span><Clock size={13} /> {recipe.time} min</span>
          <span><Users size={13} /> {recipe.servings}</span>
        </div>
      </div>
    </div>

  );
}

