import { FC, useEffect, useState } from "react";

import styles from "./Properties.module.css";
import cookIcon from "../../assets/cook.png";
import dateIcon from "../../assets/date.png";
import link from "../../assets/link.png";
import prepIcon from "../../assets/prep.png";
import remove from "../../assets/remove.png";
import servingsIcon from "../../assets/servings.png";
import tagsIcon from "../../assets/tags.png";
import { Recipe } from "../../utils/recipe";

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

interface PropertiesProps {
  recipe: Recipe | null;
}

const Properties: FC<PropertiesProps> = ({ recipe }) => {
  const [recipeLoaded, setRecipeLoaded] = useState<boolean>(false);

  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [prep, setPrep] = useState<number | null>(null);
  const [cook, setCook] = useState<number | null>(null);
  const [servings, setServings] = useState<number | null>(null);

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
      recipe.setTags(tags);
      recipe.setDate(date);
      recipe.setSource(source);
      if (prep) {
        recipe.setPrep(prep);
      }
      if (cook) {
        recipe.setCook(cook);
      }
      if (servings) {
        recipe.setServings(servings);
      }

      // save recipe
      recipe
        .writeRecipe()
        .then(() => {})
        .catch((err) => console.error(err));
    }
  }, [recipe, tags, date, source, prep, cook, servings, recipeLoaded]);

  const Tag = ({ tag }: { tag: string }) => {
    return (
      <div className={styles["tag"]}>
        <p>{tag}</p>
        <img
          src={remove}
          alt="remove"
          className={styles["remove-icon"]}
          onClick={() => {
            setTags(tags.filter((t) => t !== tag));
          }}
        />
      </div>
    );
  };

  return (
    <div className={styles["grid-container"]}>
      <PropertyLabel label="tags" src={tagsIcon} />
      <div className={styles["grid-item"]}>
        {tags.map((tag: string, index: number) => (
          <Tag tag={tag} key={index} />
        ))}
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setTags([...tags, e.currentTarget.value]);
              e.currentTarget.value = "";
            } else if (e.key === "Backspace" && e.currentTarget.value === "") {
              setTags(tags.slice(0, tags.length - 1));
            }
          }}
        />
      </div>
      <PropertyLabel label="date" src={dateIcon} />
      <div className={styles["grid-item"]}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <PropertyLabel label="source" src={link} />
      <div className={styles["grid-item"]}>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
      </div>
      <PropertyLabel label="prep" src={prepIcon} />
      <div className={styles["grid-item"]}>
        <input
          type="text"
          value={prep ? prep.toString() : ""}
          onChange={(e) => setPrep(parseInt(e.target.value))}
        />
      </div>
      <PropertyLabel label="cook" src={cookIcon} />
      <div className={styles["grid-item"]}>
        <input
          type="text"
          value={cook ? cook.toString() : ""}
          onChange={(e) => setCook(parseInt(e.target.value))}
        />
      </div>
      <PropertyLabel label="servings" src={servingsIcon} />
      <div className={styles["grid-item"]}>
        <input
          type="text"
          value={servings ? servings.toString() : ""}
          onChange={(e) => setServings(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Properties;
