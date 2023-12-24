import { FC, useState } from "react";

import styles from "./AddFilterDialog.module.css";

const FILTERS: {
  [key: string]: {
    operators: Array<string>;
    placeholder: string;
  };
} = {
  name: {
    operators: ["is", "is not", "contains", "does not contain"],
    placeholder: "name",
  },
};

const AddFilterDialog: FC = () => {
  const [filterField, setFilterField] = useState<string>("name");
  const [filterOperator, setFilterOperator] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");

  return (
    <div className={styles["dialog"]}>
      <div className={styles["filter-dropdown"]}>
        <select
          className={styles["filter-dropdown-select"]}
          value={filterField}
          onChange={(event) => setFilterField(event.target.value)}
        >
          {Object.keys(FILTERS).map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>
        <div className={styles["filter-dropdown-arrow"]} />
      </div>
      <div className={styles["filter-operators"]}>
        {FILTERS[filterField]["operators"].map((operator) => (
          <div
            key={operator}
            className={`${styles["filter-operator"]} ${
              filterOperator === operator
                ? styles["selected-filter-operator"]
                : ""
            }`}
            onClick={() => setFilterOperator(operator)}
          >
            {operator}
          </div>
        ))}
      </div>
      <input
        className={styles["filter-value"]}
        value={filterValue}
        onChange={(event) => setFilterValue(event.target.value)}
        placeholder={FILTERS[filterField]["placeholder"] || "value"}
      />
      <button
        className={styles["apply-filter-button"]}
        disabled={!filterOperator || !filterValue}
      >
        apply
      </button>
    </div>
  );
};

export default AddFilterDialog;
