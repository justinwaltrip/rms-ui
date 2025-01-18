import { open } from "@tauri-apps/plugin-dialog";
import {
  BaseDirectory,
  readFile as readBinaryFile,
} from "@tauri-apps/plugin-fs";
import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { useRef } from "react";
import AutosizeInput from "react-input-autosize";

import styles from "./ViewEditor.module.css";
import close from "../../assets/close.png";
import source from "../../assets/source.png";
import upload from "../../assets/upload.png";
import { AppContext } from "../../main";
import { FileService } from "../../services/FileService";
import { deleteImage, writeImage } from "../../utils/fs";
import { useDebounce } from "../../utils/hooks";
import { Ingredient, Recipe } from "../../utils/recipe";
import AddButton from "../add-button/AddButton";
import InfoBar from "../info-bar/InfoBar";
import Properties from "../properties/Properties";

const fileService = new FileService();

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
  const newDirectionRef = useRef<HTMLTextAreaElement>(null);
  const newNoteRef = useRef<HTMLTextAreaElement>(null);
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
  const [image, setImage] = useState<string | undefined>(undefined);
  const [ingredients, setIngredients] = useState<Ingredient[] | undefined>(
    undefined,
  );
  const [directions, setDirections] = useState<string[] | undefined>(undefined);
  const [notes, setNotes] = useState<string[] | undefined>(undefined);

  // set title from filename
  const [defaultTitle, setDefaultTitle] = useState<string>("");

  // new ingredient, direction, note
  const [newIngredientIndex, setNewIngredientIndex] = useState<number>(-1);
  const [newDirectionIndex, setNewDirectionIndex] = useState<number>(-1);
  const [newNoteIndex, setNewNoteIndex] = useState<number>(-1);

  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  // #endregion

  // #region effects

  /**
   * On tab load
   */
  useEffect(() => {
    if (filename && collectionPath) {
      // load markdown from file
      Recipe.loadRecipe(filename, collectionPath, fileService)
        .then((recipe) => {
          setRecipe(recipe);
        })
        .catch((err) => console.error(err));
    } else {
      if (recipe) {
        // reset recipe
        setRecipe(null);
      }

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
      setDescription(recipe.description);
      setImage(recipe.image);
      setIngredients(recipe.ingredients);
      setDirections(recipe.directions);
      setNotes(recipe.notes);

      setRecipeLoaded(true);
    } else {
      setTitle(undefined);
      setDescription(undefined);
      setImage(undefined);
      setIngredients(undefined);
      setDirections(undefined);
      setNotes(undefined);

      setRecipeLoaded(false);
    }
  }, [recipe]);

  // Create debounced write function
  const debouncedWrite = useDebounce(async (recipeToWrite: Recipe) => {
    try {
      await recipeToWrite.writeRecipe(fileService);
    } catch (err) {
      console.error(err);
    }
  }, 1000); // 1 second delay

  // Modify the effect that handles recipe updates
  useEffect(() => {
    if (recipe && recipeLoaded) {
      // set recipe data
      recipe.setTitle(title);
      recipe.setDescription(description);
      recipe.setImage(image);
      recipe.setIngredients(ingredients);
      recipe.setDirections(directions);
      recipe.setNotes(notes);

      // Call debounced write instead of immediate write
      debouncedWrite(recipe);
    }
  }, [
    recipe,
    title,
    description,
    image,
    ingredients,
    recipeLoaded,
    directions,
    notes,
    debouncedWrite,
  ]);

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
      // focus at end of text
      const direction = newDirectionRef.current;
      direction.focus();
      const length = direction.value.length;
      direction.setSelectionRange(length, length);
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

  /**
   * On directions change, set height of directions
   */
  useEffect(() => {
    resizeDirections();
  }, [directions]);

  /**
   * On ingredients change, set height of ingredients
   */
  useEffect(() => {
    resizeIngredients();
  }, [ingredients]);

  /**
   * On mount, add listener for resize
   */
  useEffect(() => {
    window.addEventListener("resize", resizeDirections);
    return () => window.removeEventListener("resize", resizeDirections);
  }, []);

  /**
   * Get image src
   * */
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
            extensions: ["png", "jpeg", "jpg"],
          },
        ],
      });
      if (result && !Array.isArray(result)) {
        // read image from file
        const bytes = await readBinaryFile(result, {
          baseDir: BaseDirectory.Home,
        });

        // get filename
        const filename = result.split("/").pop();

        // write image to file
        const path = `.rms/attachments/${filename}`;
        await writeImage(path, bytes, collectionPath);

        // update recipe
        setImage(path);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Resize directions
   */
  function resizeDirections() {
    const directions = document.getElementsByClassName(
      styles["direction-input"],
    );
    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i] as HTMLTextAreaElement;
      direction.style.height = "";
      direction.style.height = direction.scrollHeight + "px";
    }
  }

  /**
   * Resize ingredients
   */
  function resizeIngredients() {
    const ingredients = document.getElementsByClassName(
      styles["ingredient-name"],
    );
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i] as HTMLTextAreaElement;
      ingredient.style.height = "";
      ingredient.style.height = ingredient.scrollHeight + "px";
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
            <textarea
              className={styles["title-input"]}
              value={title || ""}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="title"
            />
            <div className={styles["image-container"]}>
              {image ? (
                <img
                  src={imageSrc}
                  alt={"recipe image"}
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
              {image && (
                <div className={styles["image-overlay"]}>
                  {image && (
                    <img
                      src={close}
                      alt="Close icon"
                      className={styles["close-icon"]}
                      onClick={() => {
                        deleteImage(image, collectionPath)
                          .then(() => {
                            setImage("");
                          })
                          .catch((err) => console.error(err));
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            <textarea
              className={styles["description-input"]}
              value={description || ""}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="description"
            />
            <Properties recipe={recipe} />
          </div>
          <div className={styles["column"]}>
            <h2>ingredients</h2>
            {ingredients &&
              ingredients.map(
                ({ ingredient, is_checked, imperial_measure }, index) => (
                  <div key={index} className={styles["ingredient"]}>
                    {/* checkbox */}
                    <div className="checkbox-wrapper-1">
                      <input
                        id={`ingredient-checkbox-${index}`}
                        className="substituted"
                        type="checkbox"
                        aria-hidden="true"
                        checked={is_checked}
                        onChange={(e) => {
                          const newIngredients = [...ingredients];
                          newIngredients[index].is_checked = e.target.checked;
                          setIngredients(newIngredients);
                        }}
                      />
                      <label htmlFor={`ingredient-checkbox-${index}`} />
                    </div>

                    {/* ingredient measurement */}
                    <AutosizeInput
                      //@ts-expect-error no overload matches this call
                      ref={
                        newIngredientIndex === index ? newIngredientRef : null
                      }
                      className={styles["ingredient-measure"]}
                      type="text"
                      value={imperial_measure || ""}
                      placeholder="measure"
                      onChange={function (e: ChangeEvent<HTMLInputElement>) {
                        const newIngredients = [...ingredients];
                        newIngredients[index].imperial_measure = e.target.value;
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
                                "textarea",
                              )[0];
                            ingredientName.focus();
                          }
                        }
                      }}
                    />

                    {/* ingredient name */}
                    <textarea
                      className={styles["ingredient-name"]}
                      rows={1}
                      value={ingredient || ""}
                      placeholder="ingredient"
                      onInput={(e) => {
                        e.currentTarget.style.height = "";
                        e.currentTarget.style.height =
                          e.currentTarget.scrollHeight + "px";
                      }}
                      onChange={function (e: ChangeEvent<HTMLTextAreaElement>) {
                        const newIngredients = [...ingredients];
                        newIngredients[index].ingredient = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      onKeyDown={function (
                        e: React.KeyboardEvent<HTMLTextAreaElement>,
                      ) {
                        if (
                          e.key === "Backspace" &&
                          (e.currentTarget as HTMLTextAreaElement).value === ""
                        ) {
                          e.preventDefault();

                          // focus on ingredient amount
                          const ingredientAmountDiv =
                            document.getElementsByClassName(
                              styles["ingredient-measure"],
                            )[index] as HTMLInputElement;
                          const ingredientAmount =
                            ingredientAmountDiv.getElementsByTagName(
                              "input",
                            )[0];
                          ingredientAmount.focus();
                        } else if (e.key === "Enter") {
                          e.preventDefault();

                          // add new ingredient at index + 1
                          const newIngredients = [...ingredients];
                          newIngredients.splice(index + 1, 0, new Ingredient());
                          setIngredients(newIngredients);

                          // focus on new ingredient amount
                          setNewIngredientIndex(index + 1);
                        }
                      }}
                      autoCorrect="off"
                    />
                  </div>
                ),
              )}
            <AddButton
              text="add ingredient"
              onClick={() => {
                if (!ingredients) {
                  setIngredients([new Ingredient("")]);
                  setNewIngredientIndex(0);
                } else {
                  // add new ingredient at end
                  const newIngredients = [...ingredients];
                  newIngredients.push(new Ingredient(""));
                  setIngredients(newIngredients);

                  // focus on new ingredient amount
                  setNewIngredientIndex(newIngredients.length - 1);
                }
              }}
            />
            <h2>directions</h2>
            {directions && (
              <div className={styles["directions"]}>
                {directions.map((direction, index) => (
                  <div key={index} className={styles["direction"]}>
                    {/* direction number */}
                    <div>{`${index + 1}.`}</div>

                    {/* direction text */}
                    <textarea
                      rows={1}
                      onInput={(e) => {
                        e.currentTarget.style.height = "";
                        e.currentTarget.style.height =
                          e.currentTarget.scrollHeight + "px";
                      }}
                      className={styles["direction-input"]}
                      ref={newDirectionIndex === index ? newDirectionRef : null}
                      value={direction || ""}
                      onChange={(e) => {
                        const newDirections = [...directions];
                        newDirections[index] = e.target.value;
                        setDirections(newDirections);
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          (e.currentTarget as HTMLTextAreaElement).value === ""
                        ) {
                          e.preventDefault();

                          // remove direction at index
                          const newDirections = [...directions];
                          newDirections.splice(index, 1);
                          setDirections(newDirections);

                          // focus on previous direction
                          if (index > 0) {
                            const directionDiv =
                              document.getElementsByClassName(
                                styles["direction"],
                              )[index - 1] as HTMLTextAreaElement;
                            const direction =
                              directionDiv.getElementsByTagName("textarea")[0];
                            direction.focus();
                          }
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
                      onPaste={(e) => {
                        // if pasting multiple lines, split into multiple directions
                        const clipboardData = e.clipboardData.getData("Text");
                        const clipboardLines = clipboardData.split("\n");
                        if (clipboardLines.length > 1) {
                          e.preventDefault();

                          // append first line to current direction
                          const newDirections = [...directions];
                          newDirections[index] += clipboardLines[0];

                          // add new directions for remaining lines
                          for (let i = 1; i < clipboardLines.length; i++) {
                            newDirections.splice(
                              index + i,
                              0,
                              clipboardLines[i],
                            );
                          }
                          setDirections(newDirections);

                          // focus on last new direction
                          setNewDirectionIndex(
                            index + clipboardLines.length - 1,
                          );
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <AddButton
              text="add direction"
              onClick={() => {
                if (!directions) {
                  setDirections([""]);
                  setNewDirectionIndex(0);
                } else {
                  // add new direction at end
                  const newDirections = [...directions];
                  newDirections.push("");
                  setDirections(newDirections);

                  // focus on new direction
                  setNewDirectionIndex(newDirections.length - 1);
                }
              }}
            />
            <h2>notes</h2>
            {notes &&
              notes.map((note, index) => (
                <div key={index} className={styles["note"]}>
                  <p>{`-`}</p>
                  <textarea
                    rows={1}
                    onInput={(e) => {
                      e.currentTarget.style.height = "";
                      e.currentTarget.style.height =
                        e.currentTarget.scrollHeight + "px";
                    }}
                    ref={newNoteIndex === index ? newNoteRef : null}
                    value={note || ""}
                    onChange={(e) => {
                      const newNotes = [...notes];
                      newNotes[index] = e.target.value;
                      setNotes(newNotes);
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        (e.currentTarget as HTMLTextAreaElement).value === ""
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
                    className={styles["note-input"]}
                  />
                </div>
              ))}
            <AddButton
              text="add note"
              onClick={() => {
                if (!notes) {
                  setNotes([""]);
                  setNewNoteIndex(0);
                } else {
                  // add new note at end
                  const newNotes = [...notes];
                  newNotes.push("");
                  setNotes(newNotes);

                  // focus on new note
                  setNewNoteIndex(newNotes.length - 1);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEditor;
