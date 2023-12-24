import { Recipe } from "./recipe";

const FILTERS: {
  [key: string]: {
    operators: Array<string>;
    placeholder: string;
  };
} = {
  title: {
    operators: ["is", "is not", "contains", "does not contain"],
    placeholder: "name",
  },
};

interface Filter {
  field: "title";
  operator: string;
  value: string;
}

function filterRecipes(
  recipes: Array<Recipe>,
  filters: Array<Filter>,
): Array<Recipe> {
  return recipes.filter((item) => {
    let keep = true;
    for (const filter of filters) {
      if (!keep) {
        break;
      }
      switch (filter.operator) {
        case "is":
          keep = item[filter.field] === filter.value;
          break;
        case "is not":
          keep = item[filter.field] !== filter.value;
          break;
        case "contains":
          keep = item[filter.field].includes(filter.value);
          break;
        case "does not contain":
          keep = !item[filter.field].includes(filter.value);
          break;
      }
    }
    return keep;
  });
}

export { FILTERS, filterRecipes };
export type { Filter };
