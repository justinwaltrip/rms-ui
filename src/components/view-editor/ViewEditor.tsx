import { FC, useContext, useEffect, useState } from "react";

import styles from "./ViewEditor.module.css";
import source from "../../assets/source.png";
import { AppContext } from "../../main";
import { FileService } from "../../services/FileService";
import { useDebounce } from "../../utils/hooks";
import { Ingredient, Recipe } from "../../utils/recipe";
import { DirectionsList } from "../directions/DirectionsList";
import InfoBar from "../info-bar/InfoBar";
import { IngredientsList } from "../ingredients/IngredientsList";
import { NotesList } from "../notes/NotesList";
import Properties from "../properties/Properties";
import { RecipeHeader } from "../recipe-header/RecipeHeader";

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
  const appContext = useContext(AppContext);
  const { collectionPath } = appContext;

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

  /**
   * Debounce write recipe
   */
  const debouncedWrite = useDebounce(async (recipeToWrite: Recipe) => {
    try {
      await recipeToWrite.writeRecipe(fileService);
    } catch (err) {
      console.error(err);
    }
  }, 1000); // 1 second delay

  /**
   * On recipe data change, write recipe
   */
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
   * If default title changes, update title
   */
  useEffect(() => {
    if (defaultTitle && recipeLoaded) {
      setTitle(defaultTitle);
      setDefaultTitle("");
    }
  }, [defaultTitle, recipeLoaded]);

  const isEditingDisabled = !filename || !recipeLoaded;

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
            <RecipeHeader
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              image={image}
              setImage={setImage}
              isEditingDisabled={isEditingDisabled}
              collectionPath={collectionPath}
            />
            <Properties recipe={recipe} isEditingDisabled={isEditingDisabled} />
          </div>
          <div className={styles["column"]}>
            <IngredientsList
              ingredients={ingredients}
              setIngredients={setIngredients}
              isEditingDisabled={isEditingDisabled}
            />
            <DirectionsList
              directions={directions}
              setDirections={setDirections}
              isEditingDisabled={isEditingDisabled}
            />
            <NotesList
              notes={notes}
              setNotes={setNotes}
              isEditingDisabled={isEditingDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEditor;
