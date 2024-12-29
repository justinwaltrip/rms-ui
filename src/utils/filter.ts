import { Recipe } from "./recipe";

const FILTERS: {
  [key: string]: {
    operators: Array<string>;
    placeholder: string;
  };
} = {
  title: {
    operators: ["is", "is not", "contains", "does not contain"],
    placeholder: "title",
  },
  tags: {
    operators: ["includes", "does not include"],
    placeholder: "tag",
  },
};

interface Filter {
  field: "title" | "tags";
  operator: string;
  value: string;
}

function filterRecipes(
  recipes: Array<Recipe>,
  filters: Array<Filter>,
  applyAllFilters: boolean = false,
): Array<Recipe> {
  return recipes.filter((item) => {
    const matches = filters.map((filter) => {
      const fieldValue = item[filter.field];
      switch (filter.operator) {
        case "is":
          return fieldValue === filter.value;
        case "is not":
          return fieldValue !== filter.value;
        case "contains":
          return (
            typeof fieldValue === "string" && fieldValue.includes(filter.value)
          );
        case "does not contain":
          return (
            typeof fieldValue === "string" && !fieldValue.includes(filter.value)
          );
        case "includes":
          return Array.isArray(fieldValue) && fieldValue.includes(filter.value);
        case "does not include":
          return (
            Array.isArray(fieldValue) && !fieldValue.includes(filter.value)
          );
      }
      return false; // default return value if no operator matched
    });

    if (applyAllFilters) {
      return matches.every((match) => match); // all filters must pass
    } else {
      if (matches.length === 0) {
        return true; // no filters, so all items pass
      }
      return matches.some((match) => match); // any filter passing is sufficient
    }
  });
}

export { FILTERS, filterRecipes };
export type { Filter };
