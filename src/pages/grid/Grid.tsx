import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { platform } from "@tauri-apps/plugin-os";
import { FC, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import styles from "./Grid.module.css";
import close from "../../assets/close.png";
import filter from "../../assets/filter.png";
import sort from "../../assets/sort.png";
import AddFilterDialog from "../../components/add-filter-dialog/AddFilterDialog";
import GridItem from "../../components/grid-item/GridItem";
import SideBar from "../../components/sidebar/SideBar";
import TitleBar from "../../components/title-bar/TitleBar";
import { AppContext } from "../../main";
import { FileService } from "../../services/FileService";
import { Filter } from "../../utils/filter";
import { filterRecipes } from "../../utils/filter";
import { Recipe } from "../../utils/recipe";

const appWindow = getCurrentWebviewWindow();
const currentPlatform = platform();
const fileService = new FileService();

const SORT_FIELDS = ["title"];

const Grid: FC = () => {
  // #region contexts
  const appContext = useContext(AppContext);
  const { collectionPath } = appContext;
  const location = useLocation();
  // #endregion

  // #region states

  // recipes
  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const [displayRecipes, setDisplayRecipes] = useState<Array<Recipe>>([]);

  const [filters, setFilters] = useState<Array<Filter>>([]);
  const [sortField, setSortField] = useState<string>(SORT_FIELDS[0]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [booleanField, setBooleanField] = useState<"any" | "all">("any");

  // add filter dialog
  const [showAddFilterDialog, setShowAddFilterDialog] = useState(false);
  // #endregion

  // #region effects

  /**
   * On mount, register click events to close add filter dialog
   */
  useEffect(() => {
    document.addEventListener("click", () => {
      setShowAddFilterDialog(false);
    });
  }, []);

  /**
   * Check if maximizeWindow is in location.state
   */
  let isMaximized = false;
  useEffect(() => {
    if (location.state) {
      const { maximizeWindow } = location.state as {
        maximizeWindow: boolean;
      };
      if (maximizeWindow && !isMaximized && currentPlatform != "ios") {
        isMaximized = true;
        appWindow.maximize().catch((err) => console.error(err));
      }
    }
  }, [location.state]);

  /**
   * Load recipes from collectionPath
   */
  const loadRecipesFromDirectory = async (collectionPath: string) => {
    try {
      const files = await fileService.readDir(collectionPath);
      const promises: Array<Promise<Recipe>> = [];
      for (const file of files) {
        if (file.endsWith(".json")) {
          const filename = file.substring(0, file.length - ".json".length);
          promises.push(
            Recipe.loadRecipe(filename, collectionPath, fileService),
          );
        }
      }
      return await Promise.all(promises);
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    if (collectionPath) {
      loadRecipesFromDirectory(collectionPath)
        .then((recipes) => {
          setRecipes(recipes);
        })
        .catch((err) => console.error(err));
    }
  }, [collectionPath]);

  /**
   * Sort and filter recipes
   */
  useEffect(() => {
    const filteredRecipes = filterRecipes(
      recipes,
      filters,
      booleanField === "all",
    );

    const sortedRecipes = [...filteredRecipes];
    sortedRecipes.sort((a, b) => {
      const titleA = a.title;
      const titleB = b.title;
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

    setDisplayRecipes(sortedRecipes);
  }, [recipes, sortOrder, filters, booleanField]);

  // #endregion

  return (
    <div>
      <TitleBar activeFileIndex={-1} />
      <SideBar />
      <div className={styles["content"]}>
        <div className={styles["container"]}>
          <div className={styles["header"]}>
            <div className={styles["title"]}>recipes</div>
          </div>
          <div>
            <div
              className={styles["add-filter-button"]}
              onClick={(e) => {
                e.stopPropagation();
                setShowAddFilterDialog(true);
              }}
            >
              <img
                src={filter}
                alt="Filter icon"
                className={styles["filter-icon"]}
              />
              <div className={styles["filter-text"]}>filter</div>
            </div>
            {showAddFilterDialog && (
              <AddFilterDialog
                setShowAddFilterDialog={setShowAddFilterDialog}
                filters={filters}
                setFilters={setFilters}
              />
            )}
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
            {displayRecipes.map((recipe, index) => (
              <div key={index} className={styles["grid-item"]}>
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
