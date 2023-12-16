import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./GridItem.module.css";
import { AppContext } from "../../main";
import { getImageUrl } from "../../utils/fs";
import { Recipe } from "../../utils/recipe";

const GridItem: FC<{
  recipe: Recipe;
}> = ({ recipe }) => {
  // #region variables
  const navigate = useNavigate();
  // #endregion

  // #region contexts
  const appContext = useContext(AppContext);
  const { collectionPath } = appContext;

  // #region states
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
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

  /**
   * Update image url
   */
  useEffect(() => {
    if (imageSrc) {
      getImageUrl(imageSrc, collectionPath)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [imageSrc, collectionPath]);
  // #endregion

  return (
    <div
      className={styles["grid-item"]}
      onClick={() => {
        navigate("/editor", {
          state: {
            openFiles: [recipe.filename],
          },
        });
      }}
    >
      <img src={imageUrl} alt="recipe" className={styles["grid-item-image"]} />
      <div className={styles["grid-item-title"]}>{recipe.getTitle()}</div>
      <div className="grid-item-tags">
        {recipe.getTags().map((tag, index) => (
          <div key={index} className="grid-item-tag">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridItem;
