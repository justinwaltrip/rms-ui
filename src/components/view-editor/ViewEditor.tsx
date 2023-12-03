/* eslint-disable prettier/prettier */
import "./ViewEditor.css";
import { FC, useEffect, useState } from "react";

import source from "../../assets/source.png";
import { readImage, readRecipe } from "../../utils/fs";
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
  const [, setFileLoaded] = useState<boolean>(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");

  /**
   * On tab load
   */
  useEffect(() => {
    if (filename && collectionPath) {
      // load markdown from file
      readRecipe(filename, collectionPath)
        .then((recipe) => {
          setRecipe(recipe);
          setFileLoaded(true);
        })
        .catch((err) => console.error(err));
    } else {
      // prompt user to enter title
      document.getElementById("title-input")?.focus();
    }
  }, [filename]);

  /**
   * Load image
   */
  useEffect(() => {
    if (recipe && recipe.image.src) {
      readImage(recipe.image.src, collectionPath)
        .then((src) => {
          setImgSrc(src);
        })
        .catch((err) => console.error(err));
    }
  }, [recipe, collectionPath]);

  return (
    <div className="view-page">
      <img
        className="source-icon"
        src={source}
        alt="Source icon"
        onClick={() => setMode("source")}
      />
      <div className="content">
        <InfoBar filename={filename} setFilename={setFilename} />
        <div className="view-editor">
          <div className="column">
            <input
              className="title-input"
              type="text"
              value={recipe ? recipe.title : ""}
              onChange={(e) => {
                if (recipe) {
                  recipe.title = e.target.value;
                }
              }}
            />
            <img
              src={imgSrc}
              alt={recipe ? recipe.image.alt : ""}
              className="image"
            />
            <input
              className="description-input"
              type="text"
              value={recipe ? recipe.description : ""}
              // onChange={(e) =>
              //   setFrontmatter({ ...frontmatter, description: e.target.value })
              // }
            />
            <Properties recipe={recipe} />
          </div>
          <div className="column">
            <h2>ingredients</h2>
            {recipe &&
              recipe.ingredients.map(({ name, is_checked }, index) => (
                <div key={index} className="ingredient">
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
                    className="ingredient-label"
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
              recipe.directions.map((direction, index) => (
                <div key={index} className="direction">
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
              recipe.notes.map((note, index) => (
                <div key={index} className="note">
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
