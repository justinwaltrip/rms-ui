import { FC, useState } from "react";

import styles from "./AddFilterDialog.module.css";
import { FILTERS, Filter } from "../../utils/filter";

interface AddFilterDialogProps {
  setShowAddFilterDialog: (showAddFilterDialog: boolean) => void;
  filters: Array<Filter>;
  setFilters: (filters: Array<Filter>) => void;
}

const AddFilterDialog: FC<AddFilterDialogProps> = ({
  setShowAddFilterDialog,
  filters,
  setFilters,
}) => {
  // #region states
  const [filterField, setFilterField] = useState<"title">("title");
  const [filterOperator, setFilterOperator] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");
  // #endregion

  /**
   * Apply the filter to the grid
   */
  function applyFilter() {
    const newFilters = [...filters];
    newFilters.push({
      field: filterField,
      operator: filterOperator!,
      value: filterValue,
    });
    setFilters(newFilters);
    setShowAddFilterDialog(false);
  }

  return (
    <div className={styles["dialog"]} onClick={(e) => e.stopPropagation()}>
      <div className={styles["filter-dropdown"]}>
        <select
          className={styles["filter-dropdown-select"]}
          value={filterField}
          onChange={(event) => setFilterField(event.target.value as "title")}
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
            onClick={(e) => {
              e.stopPropagation();
              setFilterOperator(operator);
            }}
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
        onClick={(e) => {
          e.stopPropagation();
          applyFilter();
        }}
      >
        apply
      </button>
    </div>
  );
};

export default AddFilterDialog;
