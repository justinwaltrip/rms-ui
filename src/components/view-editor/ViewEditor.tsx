import { open } from "@tauri-apps/api/dialog";
import { BaseDirectory, readBinaryFile } from "@tauri-apps/api/fs";
import React, {
  ChangeEvent,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AutosizeInput from "react-input-autosize";

import styles from "./ViewEditor.module.css";
import close from "../../assets/close.png";
import source from "../../assets/source.png";
import upload from "../../assets/upload.png";
import { AppContext } from "../../main";
import { deleteImage, getImageUrl, writeImage } from "../../utils/fs";
import { Ingredient, Recipe } from "../../utils/recipe";
import InfoBar from "../info-bar/InfoBar";
import Properties from "../properties/Properties";

interface ViewEditorProps {
  filename: string;
  setFilename: (filename: string) => void;
  setMode: (mode: "source" | "view") => void;
}

const ViewEditor: FC<ViewEditorProps> = ({
  filename,
  setFilename,
  setMode,
}) => {
  // #region variables
  const newIngredientRef = useRef<HTMLInputElement>(null);
  const newDirectionRef = useRef<HTMLInputElement>(null);
  const newNoteRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region contexts
  const appContext = useContext(AppContext);
  const { collectionPath } = appContext;
  // #endregion

  // #region states

  // recipe
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeLoaded, setRecipeLoaded] = useState<boolean>(false);

  // recipe data
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [ingredients, setIngredients] = useState<Ingredient[] | undefined>(
    undefined,
  );
  const [directions, setDirections] = useState<string[] | undefined>(undefined);
  const [notes, setNotes] = useState<string[] | undefined>(undefined);

  // set title from filename
  const [defaultTitle, setDefaultTitle] = useState<string>("");

  // render data
  const [imageUrl, setImgUrl] = useState<string>("");

  // new ingredient, direction, note
  const [newIngredientIndex, setNewIngredientIndex] = useState<number>(-1);
  const [newDirectionIndex, setNewDirectionIndex] = useState<number>(-1);
  const [newNoteIndex, setNewNoteIndex] = useState<number>(-1);
  // #endregion

  // #region effects

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
      document.getElementById("filename-input")?.focus();
    }
  }, [filename, collectionPath]);

  /**
   * Load data from recipe
   */
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setDescription(recipe.getDescription());
      setImageSrc(recipe.getImageSrc());
      setIngredients(recipe.getIngredients());
      setDirections(recipe.getDirections());
      setNotes(recipe.getNotes());

      setRecipeLoaded(true);
    }
  }, [recipe, collectionPath]);

  /**
   * Update recipe data
   */
  useEffect(() => {
    if (recipe && recipeLoaded) {
      // set recipe data
      if (title !== undefined) {
        recipe.setTitle(title);
      }
      if (description !== undefined) {
        recipe.setDescription(description);
      }
      if (imageSrc !== undefined) {
        recipe.setImageSrc(imageSrc);
      }
      if (ingredients !== undefined) {
        recipe.setIngredients(ingredients);
      }
      if (directions !== undefined) {
        recipe.setDirections(directions);
      }
      if (notes !== undefined) {
        recipe.setNotes(notes);
      }

      // save recipe
      recipe
        .writeRecipe()
        .then(() => {})
        .catch((err) => console.error(err));
    }
  }, [
    recipe,
    title,
    description,
    imageSrc,
    ingredients,
    recipeLoaded,
    directions,
    notes,
  ]);

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
   * If new ingredient, focus on ingredient name
   */
  useEffect(() => {
    if (newIngredientIndex !== -1 && newIngredientRef.current) {
      newIngredientRef.current.focus();
      setNewIngredientIndex(-1);
    }
  }, [newIngredientIndex]);

  /**
   * If new direction, focus on direction
   */
  useEffect(() => {
    if (newDirectionIndex !== -1 && newDirectionRef.current) {
      newDirectionRef.current.focus();
      setNewDirectionIndex(-1);
    }
  }, [newDirectionIndex]);

  /**
   * If new note, focus on note
   */
  useEffect(() => {
    if (newNoteIndex !== -1 && newNoteRef.current) {
      newNoteRef.current.focus();
      setNewNoteIndex(-1);
    }
  }, [newNoteIndex]);

  /**
   * If default title changes, update title
   */
  useEffect(() => {
    if (defaultTitle && recipeLoaded) {
      setTitle(defaultTitle);
      setDefaultTitle("");
    }
  }, [defaultTitle, recipeLoaded]);

  // #endregion

  // #region functions

  /**
   * Select image from file system
   */
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
  // #endregion

  return (
    <div className={styles["view-page"]}>
      <img
        className={styles["source-icon"]}
        src={source}
        alt="Source icon"
        onClick={() => setMode("source")}
      />
      <div className={styles["content"]}>
        <InfoBar
          filename={filename}
          setFilename={setFilename}
          setDefaultTitle={setDefaultTitle}
        />
        <div className={styles["view-editor"]}>
          <div className={styles["column"]}>
            <input
              className={styles["title-input"]}
              type="text"
              value={title || ""}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="title"
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
              value={description || ""}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <Properties recipe={recipe} />
          </div>
          <div className={styles["column"]}>
            <h2>ingredients</h2>
            {ingredients &&
              ingredients.map(
                ({ name, is_checked, primary_amount, primary_unit }, index) => (
                  <div key={index} className={styles["ingredient"]}>
                    <input
                      type="checkbox"
                      checked={is_checked}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].is_checked = e.target.checked;
                        setIngredients(newIngredients);
                      }}
                    />
                    <AutosizeInput
                      //@ts-expect-error no overload matches this call
                      ref={
                        newIngredientIndex === index ? newIngredientRef : null
                      }
                      className={styles["ingredient-amount"]}
                      type="text"
                      value={primary_amount || ""}
                      onChange={function (e: ChangeEvent<HTMLInputElement>) {
                        const newIngredients = [...ingredients];
                        newIngredients[index].primary_amount = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      onKeyDown={function (
                        e: React.KeyboardEvent<HTMLInputElement>,
                      ) {
                        if (
                          e.key === "Backspace" &&
                          (e.currentTarget as HTMLInputElement).value === ""
                        ) {
                          e.preventDefault();

                          // remove ingredient at index
                          const newIngredients = [...ingredients];
                          newIngredients.splice(index, 1);
                          setIngredients(newIngredients);

                          // focus on previous ingredient name
                          if (index > 0) {
                            const ingredientNameDiv =
                              document.getElementsByClassName(
                                styles["ingredient-name"],
                              )[index - 1] as HTMLInputElement;
                            const ingredientName =
                              ingredientNameDiv.getElementsByTagName(
                                "input",
                              )[0];
                            ingredientName.focus();
                          }
                        } else if (e.key === " ") {
                          e.preventDefault();

                          // focus on ingredient unit
                          const ingredientUnitDiv =
                            document.getElementsByClassName(
                              styles["ingredient-unit"],
                            )[index] as HTMLInputElement;
                          const ingredientUnit =
                            ingredientUnitDiv.getElementsByTagName("input")[0];
                          ingredientUnit.focus();
                        }
                      }}
                    />
                    <AutosizeInput
                      className={styles["ingredient-unit"]}
                      type="text"
                      value={primary_unit || ""}
                      onChange={function (e: ChangeEvent<HTMLInputElement>) {
                        const newIngredients = [...ingredients];
                        newIngredients[index].primary_unit = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      onKeyDown={function (
                        e: React.KeyboardEvent<HTMLInputElement>,
                      ) {
                        if (
                          e.key === "Backspace" &&
                          (e.currentTarget as HTMLInputElement).value === ""
                        ) {
                          e.preventDefault();

                          // focus on ingredient amount
                          const ingredientAmountDiv =
                            document.getElementsByClassName(
                              styles["ingredient-amount"],
                            )[index] as HTMLInputElement;
                          const ingredientAmount =
                            ingredientAmountDiv.getElementsByTagName(
                              "input",
                            )[0];
                          ingredientAmount.focus();
                        } else if (e.key === " ") {
                          e.preventDefault();

                          // focus on ingredient name
                          const ingredientNameDiv =
                            document.getElementsByClassName(
                              styles["ingredient-name"],
                            )[index] as HTMLInputElement;
                          const ingredientName =
                            ingredientNameDiv.getElementsByTagName("input")[0];
                          ingredientName.focus();
                        }
                      }}
                    />
                    <input
                      className={styles["ingredient-name"]}
                      type="text"
                      value={name || ""}
                      onChange={function (e: ChangeEvent<HTMLInputElement>) {
                        const newIngredients = [...ingredients];
                        newIngredients[index].name = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      onKeyDown={function (
                        e: React.KeyboardEvent<HTMLInputElement>,
                      ) {
                        if (
                          e.key === "Backspace" &&
                          (e.currentTarget as HTMLInputElement).value === ""
                        ) {
                          e.preventDefault();

                          // how to focus on current ingredient unit
                          const ingredientUnitDiv =
                            document.getElementsByClassName(
                              styles["ingredient-unit"],
                            )[index] as HTMLInputElement;
                          const ingredientUnit =
                            ingredientUnitDiv.getElementsByTagName("input")[0];
                          ingredientUnit.focus();
                        } else if (e.key === "Enter") {
                          e.preventDefault();

                          // add new ingredient at index + 1
                          const newIngredients = [...ingredients];
                          newIngredients.splice(
                            index + 1,
                            0,
                            new Ingredient(""),
                          );
                          setIngredients(newIngredients);

                          // focus on new ingredient amount
                          setNewIngredientIndex(index + 1);
                        }
                      }}
                    />
                  </div>
                ),
              )}
            <h2>directions</h2>
            {directions &&
              directions.map((direction, index) => (
                <div key={index} className={styles["direction"]}>
                  <p>{`${index + 1}.`}</p>
                  <input
                    ref={newDirectionIndex === index ? newDirectionRef : null}
                    type="text"
                    value={direction || ""}
                    onChange={(e) => {
                      const newDirections = [...directions];
                      newDirections[index] = e.target.value;
                      setDirections(newDirections);
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        (e.currentTarget as HTMLInputElement).value === ""
                      ) {
                        e.preventDefault();

                        // remove direction at index
                        const newDirections = [...directions];
                        newDirections.splice(index, 1);
                        setDirections(newDirections);
                      } else if (e.key === "Enter") {
                        e.preventDefault();

                        // add new direction at index + 1
                        const newDirections = [...directions];
                        newDirections.splice(index + 1, 0, "");
                        setDirections(newDirections);

                        // focus on new direction
                        setNewDirectionIndex(index + 1);
                      }
                    }}
                  />
                </div>
              ))}
            <h2>notes</h2>
            {notes &&
              notes.map((note, index) => (
                <div key={index} className={styles["note"]}>
                  <p>{`-`}</p>
                  <input
                    ref={newNoteIndex === index ? newNoteRef : null}
                    type="text"
                    value={note || ""}
                    onChange={(e) => {
                      const newNotes = [...notes];
                      newNotes[index] = e.target.value;
                      setNotes(newNotes);
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        (e.currentTarget as HTMLInputElement).value === ""
                      ) {
                        e.preventDefault();

                        // remove note at index
                        const newNotes = [...notes];
                        newNotes.splice(index, 1);
                        setNotes(newNotes);
                      } else if (e.key === "Enter") {
                        e.preventDefault();

                        // add new note at index + 1
                        const newNotes = [...notes];
                        newNotes.splice(index + 1, 0, "");
                        setNotes(newNotes);

                        // focus on new note
                        setNewNoteIndex(index + 1);
                      }
                    }}
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
