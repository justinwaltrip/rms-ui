import { open } from "@tauri-apps/api/dialog";
import { BaseDirectory, readBinaryFile } from "@tauri-apps/api/fs";
import { FC, useEffect, useState } from "react";

import styles from "./ViewEditor.module.css";
import close from "../../assets/close.png";
import source from "../../assets/source.png";
import upload from "../../assets/upload.png";
import { deleteImage, getImageUrl, writeImage } from "../../utils/fs";
import { Recipe } from "../../utils/recipe";
import InfoBar from "../info-bar/InfoBar";
import Properties from "../properties/Properties";

interface ViewEditorProps {
  filename: string;
  setFilename: (filename: string) => void;
  setMode: (mode: "source" | "view") => void;
  collectionPath: string;
}

const ViewEditor: FC<ViewEditorProps> = ({
  filename,
  setFilename,
  setMode,
  collectionPath,
}) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeLoaded, setRecipeLoaded] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string>("");

  const [imageUrl, setImgUrl] = useState<string>("");

  /**
   * On tab load
   */
  useEffect(() => {
    if (filename && collectionPath) {
      // load markdown from file
      Recipe.loadRecipe(filename, collectionPath)
        .then((recipe) => {
          setRecipe(recipe);
        })
        .catch((err) => console.error(err));
    } else {
      // prompt user to enter title
      document.getElementById("title-input")?.focus();
    }
  }, [filename, collectionPath]);

  /**
   * Load data from recipe
   */
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.getTitle());
      setDescription(recipe.getDescription());
      setImageSrc(recipe.getImageSrc());

      setRecipeLoaded(true);
    }
  }, [recipe, collectionPath]);

  /**
   * Update image url
   */
  useEffect(() => {
    if (imageSrc) {
      getImageUrl(imageSrc, collectionPath)
        .then((src) => {
          setImgUrl(src);
        })
        .catch((err) => console.error(err));
    } else {
      setImgUrl("");
    }
  }, [imageSrc, collectionPath]);

  /**
   * Update recipe data
   */
  useEffect(() => {
    if (recipe && recipeLoaded) {
      // set recipe data
      recipe.setTitle(title);
      recipe.setDescription(description);
      recipe.setImageSrc(imageSrc);

      // save recipe
      recipe
        .writeRecipe()
        .then(() => {})
        .catch((err) => console.error(err));
    }
  }, [recipe, title, description, imageSrc]);

  async function selectImage() {
    try {
      const result = await open({
        multiple: false,
        directory: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpeg"],
          },
        ],
      });
      if (result && !Array.isArray(result)) {
        // read image from file
        const bytes = await readBinaryFile(result, {
          dir: BaseDirectory.Home,
        });

        // get filename
        const filename = result.split("/").pop();

        // write image to file
        const path = `.rms/attachments/${filename}`;
        await writeImage(path, bytes, collectionPath);

        // update recipe
        setImageSrc(path);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles["view-page"]}>
      <img
        className={styles["source-icon"]}
        src={source}
        alt="Source icon"
        onClick={() => setMode("source")}
      />
      <div className={styles["content"]}>
        <InfoBar filename={filename} setFilename={setFilename} />
        <div className={styles["view-editor"]}>
          <div className={styles["column"]}>
            <input
              className={styles["title-input"]}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <div className={styles["image-container"]}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={recipe ? recipe.getImageAlt() : ""}
                  className={styles["image"]}
                />
              ) : (
                <img
                  src={upload}
                  alt="Upload icon"
                  className={styles["upload-icon"]}
                  onClick={() => {
                    selectImage()
                      .then(() => {})
                      .catch((err) => console.error(err));
                  }}
                />
              )}
              {imageUrl && (
                <div className={styles["image-overlay"]}>
                  {imageSrc && (
                    <img
                      src={close}
                      alt="Close icon"
                      className={styles["close-icon"]}
                      onClick={() => {
                        deleteImage(imageSrc, collectionPath)
                          .then(() => {
                            setImageSrc("");
                          })
                          .catch((err) => console.error(err));
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            <input
              className={styles["description-input"]}
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <Properties recipe={recipe} />
          </div>
          <div className={styles["column"]}>
            <h2>ingredients</h2>
            {recipe &&
              recipe.getIngredients().map(({ name, is_checked }, index) => (
                <div key={index} className={styles["ingredient"]}>
                  <input
                    type="checkbox"
                    checked={is_checked}
                    // onChange={(e) => {
                    //   const newIngredients = [...ingredients];
                    //   newIngredients[index].checked = e.target.checked;
                    //   setIngredients(newIngredients);
                    // }}
                  />
                  <input
                    className={styles["ingredient-label"]}
                    type="text"
                    value={name}
                    // onChange={(e) => {
                    //   const newIngredients = [...ingredients];
                    //   newIngredients[index].name = e.target.value;
                    //   setIngredients(newIngredients);
                    // }}
                  />
                </div>
              ))}
            <h2>directions</h2>
            {recipe &&
              recipe.getDirections().map((direction, index) => (
                <div key={index} className={styles["direction"]}>
                  <p>{`${index + 1}.`}</p>
                  <input
                    type="text"
                    value={direction}
                    // onChange={(e) => {
                    //   const newDirections = [...directions];
                    //   newDirections[index] = e.target.value;
                    //   setDirections(newDirections);
                    // }}
                  />
                </div>
              ))}
            <h2>notes</h2>
            {recipe &&
              recipe.getNotes().map((note, index) => (
                <div key={index} className={styles["note"]}>
                  <p>{`-`}</p>
                  <input
                    type="text"
                    value={note}
                    // onChange={(e) => {
                    //   const newNotes = [...notes];
                    //   newNotes[index] = e.target.value;
                    //   setNotes(newNotes);
                    // }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEditor;
