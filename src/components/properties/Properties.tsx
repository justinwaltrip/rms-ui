import { FC, useEffect, useState } from "react";

import styles from "./Properties.module.css";
import add from "../../assets/add.png";
import cookIcon from "../../assets/cook.png";
import dateIcon from "../../assets/date.png";
import link from "../../assets/link.png";
import prepIcon from "../../assets/prep.png";
import remove from "../../assets/remove.png";
import servingsIcon from "../../assets/servings.png";
import tagsIcon from "../../assets/tags.png";
import { Recipe } from "../../utils/recipe";
import Dropdown from "../dropdown/Dropdown";

interface PropertiesProps {
  recipe: Recipe | null;
}

const Properties: FC<PropertiesProps> = ({ recipe }) => {
  // #region states
  const [recipeLoaded, setRecipeLoaded] = useState<boolean>(false);

  // recipe data
  const [tags, setTags] = useState<string[] | undefined>(undefined);
  const [date, setDate] = useState<string | undefined>(undefined);
  const [source, setSource] = useState<string | undefined>(undefined);
  const [prep, setPrep] = useState<string | undefined>(undefined);
  const [cook, setCook] = useState<string | undefined>(undefined);
  const [servings, setServings] = useState<string | undefined>(undefined);

  const [showAddPropertyDropdown, setShowAddPropertyDropdown] =
    useState<boolean>(false);

  // #endregion

  // #region effects

  /**
   * Load data from recipe
   */
  useEffect(() => {
    if (recipe) {
      setTags(recipe.getTags());
      setDate(recipe.getDate());
      setSource(recipe.getSource());
      setPrep(recipe.getPrep());
      setCook(recipe.getCook());
      setServings(recipe.getServings());

      setRecipeLoaded(true);
    }
  }, [recipe]);

  /**
   * Update recipe data
   */
  useEffect(() => {
    if (recipe && recipeLoaded) {
      if (tags !== undefined) {
        recipe.setTags(tags);
      }
      if (date !== undefined) {
        recipe.setDate(date);
      }
      if (source !== undefined) {
        recipe.setSource(source);
      }
      if (prep !== undefined) {
        recipe.setPrep(prep);
      }
      if (cook !== undefined) {
        recipe.setCook(cook);
      }
      if (servings !== undefined) {
        recipe.setServings(servings);
      }

      // save recipe
      recipe
        .writeRecipe()
        .then(() => {})
        .catch((err) => console.error(err));
    }
  }, [recipe, tags, date, source, prep, cook, servings, recipeLoaded]);

  /**
   * On mount, add click listener to close dropdown
   */
  useEffect(() => {
    document.addEventListener("click", () => {
      setShowAddPropertyDropdown(false);
    });
  }, []);

  // #endregion

  // #region components

  const Tag = ({ tag }: { tag: string }) => {
    return (
      <div className={styles["tag"]}>
        <p>{tag}</p>
        <img
          src={remove}
          alt="remove"
          className={styles["remove-icon"]}
          onClick={() => {
            if (tags === undefined) return;
            setTags(tags.filter((t) => t !== tag));
          }}
        />
      </div>
    );
  };

  const PropertyLabel: FC<{
    label: string;
    src: string;
  }> = ({ label, src }) => {
    return (
      <div className={styles["grid-item"]}>
        <img src={src} alt="tags" className={styles["icon"]} />
        <p className={styles["label"]}>{label}</p>
      </div>
    );
  };

  // #endregion

  // define options for add property dropdown
  const addPropertyOptions = [
    {
      onClick: () => {
        setShowAddPropertyDropdown(false);
        if (tags === undefined) {
          setTags([]);
        }
      },
      icon: tagsIcon,
      text: "tags",
    },
    {
      onClick: () => {
        setShowAddPropertyDropdown(false);
        // set date to today
        setDate(new Date().toISOString());
      },
      icon: dateIcon,
      text: "date",
    },
    {
      onClick: () => {
        setShowAddPropertyDropdown(false);
        setSource("");
      },
      icon: link,
      text: "source",
    },
    {
      onClick: () => {
        setShowAddPropertyDropdown(false);
        setPrep("");
      },
      icon: prepIcon,
      text: "prep",
    },
    {
      onClick: () => {
        setShowAddPropertyDropdown(false);
        setCook("");
      },
      icon: cookIcon,
      text: "cook",
    },
    {
      onClick: () => {
        setShowAddPropertyDropdown(false);
        setServings("");
      },
      icon: servingsIcon,
      text: "servings",
    },
  ];

  // filter out properties that already exist
  const filteredAddPropertyOptions = addPropertyOptions.filter(
    (option) =>
      (option.text === "tags" && tags === undefined) ||
      (option.text === "date" && date === undefined) ||
      (option.text === "source" && source === undefined) ||
      (option.text === "prep" && prep === undefined) ||
      (option.text === "cook" && cook === undefined) ||
      (option.text === "servings" && servings === undefined),
  );

  return (
    <div className={styles["properties"]}>
      <div className={styles["grid-container"]}>
        {tags !== undefined && (
          <>
            <PropertyLabel label="tags" src={tagsIcon} />
            <div className={styles["grid-item"]}>
              {tags.length > 0 && (
                <div className={styles["tags"]}>
                  {tags.map((tag: string, index: number) => (
                    <Tag tag={tag} key={index} />
                  ))}
                </div>
              )}
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (tags === undefined) {
                      setTags([e.currentTarget.value]);
                    } else {
                      setTags([...tags, e.currentTarget.value]);
                    }
                    e.currentTarget.value = "";
                  } else if (
                    e.key === "Backspace" &&
                    e.currentTarget.value === ""
                  ) {
                    if (tags === undefined || tags.length === 0) return;
                    setTags(tags.slice(0, tags.length - 1));
                  }
                }}
                autoCorrect="off"
              />
            </div>
          </>
        )}
        {date !== undefined && (
          <>
            <PropertyLabel label="date" src={dateIcon} />
            <div className={styles["grid-item"]}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </>
        )}
        {source !== undefined && (
          <>
            <PropertyLabel label="source" src={link} />
            <div className={styles["grid-item"]}>
              <input
                type="text"
                value={source || ""}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
          </>
        )}
        {prep !== undefined && (
          <>
            <PropertyLabel label="prep" src={prepIcon} />
            <div className={styles["grid-item"]}>
              <input
                type="text"
                value={prep || ""}
                onChange={(e) => setPrep(e.target.value)}
              />
            </div>
          </>
        )}
        {cook !== undefined && (
          <>
            <PropertyLabel label="cook" src={cookIcon} />
            <div className={styles["grid-item"]}>
              <input
                type="text"
                value={cook || ""}
                onChange={(e) => setCook(e.target.value)}
              />
            </div>
          </>
        )}
        {servings !== undefined && (
          <>
            <PropertyLabel label="servings" src={servingsIcon} />
            <div className={styles["grid-item"]}>
              <input
                type="text"
                value={servings || ""}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
      <div className={styles["add-property-button"]}>
        <img src={add} alt="add" className={styles["add-icon"]} />
        <p
          className={styles["add-property"]}
          onClick={(e) => {
            e.stopPropagation();
            setShowAddPropertyDropdown(!showAddPropertyDropdown);
          }}
        >
          add property
        </p>
      </div>
      {showAddPropertyDropdown && (
        <Dropdown options={filteredAddPropertyOptions} />
      )}
    </div>
  );
};

export default Properties;
