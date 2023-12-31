import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./GridItem.module.css";
import { AppContext } from "../../main";
import { getImageUrl } from "../../utils/fs";
import { Recipe } from "../../utils/recipe";

interface GridItemProps {
  recipe: Recipe;
}

const GridItem: FC<GridItemProps> = ({ recipe }) => {
  const navigate = useNavigate();

  // #region contexts
  const appContext = useContext(AppContext);
  const { collectionPath, openFiles, setOpenFiles } = appContext;
  // #endregion

  // #region states
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  // #endregion

  // #region effects

  /**
   * Load data from recipe
   */
  useEffect(() => {
    if (recipe) {
      setImageSrc(recipe.getImageSrc());
    }
  }, [recipe]);

  return (
    <div
      className={styles["grid-item"]}
      onClick={() => {
        setOpenFiles([...openFiles, recipe.filename]);
        navigate("/editor");
      }}
    >
      <img
        src={imageSrc && getImageUrl(imageSrc, collectionPath)}
        alt="recipe"
        className={styles["grid-item-image"]}
      />
      <div className={styles["grid-item-data"]}>
        <div className={styles["grid-item-title"]}>{recipe.title}</div>
        <div className={styles["grid-item-tags"]}>
          {recipe.tags &&
            recipe.tags.map((tag, index) => (
              <div key={index} className={styles["grid-item-tag"]}>
                {tag}
              </div>
            ))}
        </div>
        {/* <img src={hdots} alt="More icon" className={styles["more-icon"]} /> */}
      </div>
    </div>
  );
};

export default GridItem;
