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
      switch (filter.operator) {
        case "is":
          return item[filter.field] === filter.value;
        case "is not":
          return item[filter.field] !== filter.value;
        case "contains":
          return (item[filter.field] as string).includes(filter.value);
        case "does not contain":
          return !(item[filter.field] as string).includes(filter.value);
        case "includes":
          return (item[filter.field] as Array<string>).includes(filter.value);
        case "does not include":
          return !(item[filter.field] as Array<string>).includes(filter.value);
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
