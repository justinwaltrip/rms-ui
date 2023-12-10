import { readRecipeContents } from "./fs";

interface Ingredient {
  name: string;
  primary_amount: number;
  primary_unit: string;
  alt_amount: number | null;
  alt_unit: string | null;
  is_checked: boolean;
}

interface Image {
  src: string;
  alt: string | undefined;
}

class Recipe {
  // public tags: string[];
  // public date: string;
  // public source: string;
  // public rating: number;
  // public prep: number;
  // public cook: number;
  // public servings: number;
  // public description: string;
  // public title: string;
  // public image: Image;
  // public ingredients: Ingredient[];
  // public directions: string[];
  // public notes: string[];
  public json: string;

  constructor(
    // tags: string[],
    // date: string,
    // source: string,
    // rating: number,
    // prep: number,
    // cook: number,
    // servings: number,
    // description: string,
    // title: string,
    // image: Image,
    // ingredients: Ingredient[],
    // directions: string[],
    // notes: string[],
    json: string,
  ) {
    // this.tags = tags;
    // this.date = date;
    // this.source = source;
    // this.rating = rating;
    // this.prep = prep;
    // this.cook = cook;
    // this.servings = servings;
    // this.description = description;
    // this.title = title;
    // this.image = image;
    // this.ingredients = ingredients;
    // this.directions = directions;
    // this.notes = notes;
    this.json = json;
  }

  static loadRecipe(filename: string, collectionPath: string) {
    readRecipeContents(filename, collectionPath)
      .then((json) => {
        const recipe = JSON.parse(json);

        // TODO validate args

        // TODO create recipe
        return recipe as Recipe;
      })
      .catch((err) => console.log(err));
  }
}

export { Recipe };
