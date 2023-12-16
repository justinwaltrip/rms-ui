import { BaseDirectory, readDir } from "@tauri-apps/api/fs";
import { FC, useContext, useEffect, useState } from "react";

import styles from "./Grid.module.css";
import GridItem from "../../components/grid-item/GridItem";
import SideBar from "../../components/sidebar/SideBar";
import TitleBar from "../../components/title-bar/TitleBar";
import { AppContext } from "../../main";
import { Recipe } from "../../utils/recipe";

const Grid: FC = () => {
  // #region contexts
  const appContext = useContext(AppContext);
  const { collectionPath } = appContext;

  // #region states
  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  // #endregion

  // #region effects
  useEffect(() => {
    if (collectionPath) {
      // get all files at collectionPath
      readDir(collectionPath, {
        dir: BaseDirectory.Home,
        recursive: true,
      })
        .then((files) => {
          const recipes: Array<Recipe> = [];
          for (const file of files) {
            if (file.name?.endsWith(".json")) {
              const filename = file.name.substring(
                0,
                file.name.length - ".json".length,
              );
              Recipe.loadRecipe(filename, collectionPath)
                .then((recipe) => {
                  recipes.push(recipe);
                })
                .catch((err) => console.error(err));
            }
          }
          setRecipes(recipes);
        })
        .catch((err) => console.error(err));
    }
  }, [collectionPath]);
  // #endregion

  return (
    <div>
      <TitleBar
        openFiles={[]}
        setOpenFiles={() => {}}
        activeFileIndex={-1}
        setActiveFileIndex={() => {}}
      />
      <SideBar />
      <div className={styles["content"]}>
        <div className={styles["container"]}>
          <div className={styles["header"]}>
            <div className={styles["title"]}>recipes</div>
          </div>
          <div className={styles["grid"]}>
            {recipes.map((recipe, index) => (
              <div key={index}>
                <GridItem recipe={recipe} collectionPath={collectionPath} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;
