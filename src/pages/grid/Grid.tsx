import { BaseDirectory, readDir } from "@tauri-apps/api/fs";
import { appWindow } from "@tauri-apps/api/window";
import { FC, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import styles from "./Grid.module.css";
import close from "../../assets/close.png";
import filter from "../../assets/filter.png";
import sort from "../../assets/sort.png";
import GridItem from "../../components/grid-item/GridItem";
import SideBar from "../../components/sidebar/SideBar";
import TitleBar from "../../components/title-bar/TitleBar";
import { AppContext } from "../../main";
import { Recipe } from "../../utils/recipe";

interface Filter {
  field: string;
  operator: string;
  value: string;
}

const SORT_FIELDS = ["name"];

const Grid: FC = () => {
  // #region contexts
  const appContext = useContext(AppContext);
  const { collectionPath } = appContext;
  const location = useLocation();
  // #endregion

  // #region states
  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const [sortedRecipes, setSortedRecipes] = useState<Array<Recipe>>([]);
  const [filters, setFilters] = useState<Array<Filter>>([
    {
      field: "name",
      operator: "is",
      value: "value",
    },
  ]);
  const [sortField, setSortField] = useState<string>(SORT_FIELDS[0]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [booleanField, setBooleanField] = useState<"any" | "all">("all");
  // #endregion

  // #region effects

  /**
   * On mount, check if maximizeWindow is in location.state
   */
  let isMaximized = false;
  useEffect(() => {
    if (location.state) {
      const { maximizeWindow } = location.state as {
        maximizeWindow: boolean;
      };
      if (maximizeWindow && !isMaximized) {
        isMaximized = true;
        appWindow.maximize().catch((err) => console.error(err));
      }
    }
  }, [location.state]);

  /**
   * Load recipes from collectionPath
   */
  useEffect(() => {
    if (collectionPath) {
      // get all files at collectionPath
      readDir(collectionPath, {
        dir: BaseDirectory.Home,
        recursive: true,
      })
        .then((files) => {
          const promises: Array<Promise<Recipe>> = [];
          for (const file of files) {
            if (file.name?.endsWith(".json")) {
              const filename = file.name.substring(
                0,
                file.name.length - ".json".length,
              );
              promises.push(Recipe.loadRecipe(filename, collectionPath));
            }
          }
          Promise.all(promises)
            .then((recipes) => {
              setRecipes(recipes);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  }, [collectionPath]);

  /**
   * Sort recipes by getTitle()
   */
  useEffect(() => {
    const sortedRecipes = [...recipes];
    sortedRecipes.sort((a, b) => {
      const titleA = a.getTitle();
      const titleB = b.getTitle();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });

    if (sortOrder === "desc") {
      sortedRecipes.reverse();
    }

    setSortedRecipes(sortedRecipes);
  }, [recipes, sortOrder]);

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
          <div className={styles["filter-selector"]}>
            <img
              src={filter}
              alt="Filter icon"
              className={styles["filter-icon"]}
            />
            <div className={styles["filter-text"]}>filter</div>
          </div>
          <div className={styles["filters"]}>
            <div className={styles["boolean-dropdown"]}>
              <select
                value={booleanField}
                onChange={(event) =>
                  setBooleanField(event.target.value as "any" | "all")
                }
              >
                <option value="any">any</option>
                <option value="all">all</option>
              </select>
              <div className={styles["boolean-dropdown-arrow"]}></div>
            </div>
            <div className={styles["filter-of-text"]}>of:</div>
            {filters.map((filter, index) => (
              <div key={index} className={styles["filter"]}>
                <div className={styles["field"]}>{filter.field}</div>
                <div className={styles["operator"]}>{filter.operator}</div>
                <div className={styles["value"]}>{filter.value}</div>
                <img
                  src={close}
                  alt="Remove icon"
                  className={styles["remove-icon"]}
                  onClick={() => {
                    const newFilters = [...filters];
                    newFilters.splice(index, 1);
                    setFilters(newFilters);
                  }}
                />
              </div>
            ))}
            <div className={styles["spacer"]}></div>
            <div className={styles["sort-dropdown"]}>
              <select
                value={sortField}
                onChange={(event) => setSortField(event.target.value)}
              >
                {SORT_FIELDS.map((field, index) => (
                  <option key={index} value={field}>
                    {field}
                  </option>
                ))}
              </select>
              <div className={styles["sort-dropdown-arrow"]}></div>
            </div>
            <img
              src={sort}
              alt="Sort icon"
              className={`${styles["sort-icon"]} ${
                sortOrder === "desc" ? styles["sort-icon-desc"] : ""
              }`}
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            />
          </div>
          <div className={styles["grid"]}>
            {sortedRecipes.map((recipe, index) => (
              <div key={index}>
                <GridItem recipe={recipe} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;
