import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import AutosizeInput from "react-input-autosize";

import styles from "./IngredientsList.module.css";
import { Ingredient } from "../../utils/recipe";
import AddButton from "../add-button/AddButton";

interface IngredientsListProps {
  ingredients: Ingredient[] | undefined;
  setIngredients: (ingredients: Ingredient[]) => void;
  isEditingDisabled: boolean;
}

export const IngredientsList: FC<IngredientsListProps> = ({ ...props }) => {
  const { ingredients, setIngredients, isEditingDisabled } = props;
  const newIngredientRef = useRef<HTMLInputElement>(null);
  const [newIngredientIndex, setNewIngredientIndex] = useState<number>(-1);
  const [useMetric, setUseMetric] = useState<boolean>(false);

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

  /**
   * On ingredients change, set height of ingredients.
   *
   * Uses requestAnimationFrame to ensure that the height is set after the textarea has been resized.
   */
  useEffect(() => {
    const handleResizeIngredients = () => {
      requestAnimationFrame(() => {
        resizeIngredients();
      });
    };

    handleResizeIngredients();
  }, [ingredients, useMetric]);

  return (
    <React.Fragment>
      <div className={styles["ingredients-header"]}>
        <h2>ingredients</h2>
        <div className={styles["unit-toggle"]}>
          <label className={styles["switch"]}>
            <input
              type="checkbox"
              checked={useMetric}
              onChange={(e) => setUseMetric(e.target.checked)}
              disabled={isEditingDisabled}
            />
            <span className={styles["slider"]}></span>
          </label>
          <span className={styles["unit"]}>
            {useMetric ? "metric" : "imperial"}
          </span>
        </div>
      </div>
      {ingredients &&
        ingredients.map(
          (
            { ingredient, is_checked, imperial_measure, metric_measure },
            index,
          ) => (
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
                  disabled={isEditingDisabled}
                />
                <label htmlFor={`ingredient-checkbox-${index}`} />
              </div>

              {/* ingredient measurement */}
              <AutosizeInput
                //@ts-expect-error no overload matches this call
                ref={newIngredientIndex === index ? newIngredientRef : null}
                className={styles["ingredient-measure"]}
                type="text"
                value={
                  useMetric ? metric_measure || "" : imperial_measure || ""
                }
                placeholder="measure"
                onChange={function (e: ChangeEvent<HTMLInputElement>) {
                  const newIngredients = [...ingredients];
                  if (useMetric) {
                    newIngredients[index].metric_measure = e.target.value;
                  } else {
                    newIngredients[index].imperial_measure = e.target.value;
                  }
                  setIngredients(newIngredients);
                }}
                onKeyDown={function (e: React.KeyboardEvent<HTMLInputElement>) {
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
                      const ingredientNameDiv = document.getElementsByClassName(
                        styles["ingredient-name"],
                      )[index - 1] as HTMLInputElement;
                      const ingredientName =
                        ingredientNameDiv.getElementsByTagName("textarea")[0];
                      ingredientName.focus();
                    }
                  }
                }}
                disabled={isEditingDisabled}
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
                    const ingredientAmountDiv = document.getElementsByClassName(
                      styles["ingredient-measure"],
                    )[index] as HTMLInputElement;
                    const ingredientAmount =
                      ingredientAmountDiv.getElementsByTagName("input")[0];
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
                disabled={isEditingDisabled}
              />
            </div>
          ),
        )}
      <AddButton
        text="add ingredient"
        onClick={() => {
          if (!isEditingDisabled) {
            if (!ingredients) {
              setIngredients([new Ingredient()]);
              setNewIngredientIndex(0);
            } else {
              // add new ingredient at end
              const newIngredients = [...ingredients];
              newIngredients.push(new Ingredient());
              setIngredients(newIngredients);

              // focus on new ingredient amount
              setNewIngredientIndex(newIngredients.length - 1);
            }
          }
        }}
      />
    </React.Fragment>
  );
};
