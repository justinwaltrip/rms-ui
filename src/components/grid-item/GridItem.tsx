import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./GridItem.module.css";
import hdots from "../../assets/hdots.png";
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
  const { collectionPath, openFiles, setOpenFiles } = appContext;
  // #endregion

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
        setOpenFiles([...openFiles, recipe.filename]);
        navigate("/editor");
      }}
    >
      <img src={imageUrl} alt="recipe" className={styles["grid-item-image"]} />
      <div className={styles["grid-item-data"]}>
        <div className={styles["grid-item-title"]}>{recipe.getTitle()}</div>
        <div className={styles["grid-item-tags"]}>
          {recipe.getTags().map((tag, index) => (
            <div key={index} className={styles["grid-item-tag"]}>
              {tag}
            </div>
          ))}
        </div>
        <img src={hdots} alt="More icon" className={styles["more-icon"]} />
      </div>
    </div>
  );
};

export default GridItem;
