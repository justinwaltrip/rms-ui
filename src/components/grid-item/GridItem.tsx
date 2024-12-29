import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./GridItem.module.css";
import close from "../../assets/close.png";
import hdots from "../../assets/hdots.png";
import { AppContext } from "../../main";
import { FileService } from "../../services/FileService";
import { deleteRecipe } from "../../utils/fs";
import { Recipe } from "../../utils/recipe";
import Dropdown from "../dropdown/Dropdown";

const fileService = new FileService();

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
  const [image, setImage] = useState<string | undefined>(undefined);
  const [showMoreDropdown, setShowMoreDropdown] = useState<boolean>(false);
  // const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  // #endregion

  // #region effects

  /**
   * Load data from recipe
   */
  useEffect(() => {
    if (recipe) {
      setImage(recipe.image);
    }
  }, [recipe]);

  /**
   * Load image base64 for iOS
   */
  useEffect(() => {
    if (image) {
      fileService
        .getImageSrc(`${collectionPath}/${image}`)
        .then((src) => {
          setImageSrc(src);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [image, collectionPath]);

  return (
    <div
      className={styles["grid-item"]}
      onClick={() => {
        if (openFiles.includes(recipe.filename)) {
          navigate("/editor", {
            state: { activeFileIndex: openFiles.indexOf(recipe.filename) },
          });
        } else {
          setOpenFiles([...openFiles, recipe.filename]);
          navigate("/editor", {
            state: { activeFileIndex: openFiles.length },
          });
        }
      }}
    >
      {image ? (
        <img
          src={imageSrc}
          alt="recipe"
          className={styles["grid-item-image"]}
        />
      ) : (
        <div className={styles["grid-item-image-placeholder"]}>
          {recipe.title}
        </div>
      )}
      <div className={styles["grid-item-data"]}>
        <div className={styles["grid-item-title"]} title={recipe.title}>
          {recipe.title}
        </div>
        <div className={styles["grid-item-tags"]}>
          {recipe.tags &&
            recipe.tags.map((tag, index) => (
              <div key={index} className={styles["grid-item-tag"]}>
                {tag}
              </div>
            ))}
        </div>
        <img
          src={hdots}
          alt="More icon"
          className={styles["more-icon"]}
          onClick={(e) => {
            e.stopPropagation();
            setShowMoreDropdown(!showMoreDropdown);
          }}
        />
        {showMoreDropdown && (
          <div className={styles["more-dropdown-container"]}>
            <Dropdown
              options={[
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setShowMoreDropdown(false);
                    deleteRecipe(recipe.filename, collectionPath)
                      .then(() => {
                        if (openFiles.includes(recipe.filename)) {
                          const newOpenFiles = [...openFiles];
                          newOpenFiles.splice(
                            openFiles.indexOf(recipe.filename),
                            1,
                          );
                          setOpenFiles(newOpenFiles);
                        }

                        // reload recipes
                        window.location.reload();
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  },
                  icon: close,
                  text: "Delete recipe",
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GridItem;
