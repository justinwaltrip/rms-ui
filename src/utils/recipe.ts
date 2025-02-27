import {
  bulkReadRecipeContents,
  readRecipeContents,
  writeRecipeContents,
} from "./fs";
import { FileService } from "../services/FileService";

class Ingredient {
  public imperial_measure: string | undefined;
  public metric_measure: string | undefined;
  public ingredient: string;
  public is_checked: boolean;

  constructor(
    imperial_measure?: string,
    metric_measure?: string,
    ingredient: string = "",
    is_checked: boolean = false,
  ) {
    this.imperial_measure = imperial_measure;
    this.metric_measure = metric_measure;
    this.ingredient = ingredient;
    this.is_checked = is_checked;
  }
}

/**
 * Recipe class
 */
class Recipe {
  public json: { [key: string]: unknown };
  public filename: string;
  public collectionPath: string;

  /**
   * Recipe constructor
   * @param json
   * @param filename
   * @param collectionPath
   */
  constructor(
    json: { [key: string]: unknown },
    filename = "",
    collectionPath = "",
  ) {
    this.json = json;
    this.filename = filename;
    this.collectionPath = collectionPath;
  }

  /**
   * Load a recipe from a file
   * @param filename
   * @param collectionPath
   * @returns promise of a recipe
   */
  static async loadRecipe(
    filename: string,
    collectionPath: string,
    fileService: FileService,
  ): Promise<Recipe> {
    try {
      const contents = await readRecipeContents(
        filename,
        collectionPath,
        fileService,
      );

      const json: { [key: string]: unknown } = JSON.parse(contents);

      if (json !== null && typeof json === "object") {
        return new Recipe(json, filename, collectionPath);
      } else {
        throw new Error("Invalid recipe file");
      }
    } catch (err) {
      // Make sure to properly log or handle the error
      console.error(err);
      throw err;
    }
  }

  static async bulkLoadRecipe(
    filenames: string[],
    collectionPath: string,
    fileService: FileService,
  ): Promise<Recipe[]> {
    try {
      const recipes: Recipe[] = [];
      const contents = await bulkReadRecipeContents(
        filenames,
        collectionPath,
        fileService,
      );

      for (let i = 0; i < contents.length; i++) {
        const json: { [key: string]: unknown } = JSON.parse(contents[i]);

        if (json !== null && typeof json === "object") {
          recipes.push(new Recipe(json, filenames[i], collectionPath));
        } else {
          throw new Error("Invalid recipe file");
        }
      }

      return recipes;
    } catch (err) {
      // Make sure to properly log or handle the error
      console.error(err);
      throw err;
    }
  }

  /**
   * Write recipe contents to a file
   */
  async writeRecipe(fileService: FileService): Promise<void> {
    try {
      const contents = JSON.stringify(this.json, null, 4);
      await writeRecipeContents(
        this.filename,
        contents,
        this.collectionPath,
        fileService,
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get image() {
    try {
      return this.json["image"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setImage(image: string | undefined) {
    try {
      this.json["image"] = image;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get title() {
    try {
      return this.json["title"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setTitle(title: string | undefined) {
    try {
      this.json["title"] = title;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get ingredients() {
    try {
      return this.json["ingredients"] as Ingredient[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setIngredients(ingredients: Ingredient[] | undefined) {
    try {
      this.json["ingredients"] = ingredients;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get directions() {
    try {
      return this.json["directions"] as string[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setDirections(directions: string[] | undefined) {
    try {
      this.json["directions"] = directions;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get notes() {
    try {
      return this.json["notes"] as string[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setNotes(notes: string[] | undefined) {
    try {
      this.json["notes"] = notes;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get tags() {
    try {
      return this.json["tags"] as string[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setTags(tags: string[] | undefined) {
    try {
      this.json["tags"] = tags;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get prep() {
    try {
      return this.json["prep"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setPrep(prep: string | undefined) {
    try {
      this.json["prep"] = prep;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get cook() {
    try {
      return this.json["cook"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setCook(cook: string | undefined) {
    try {
      this.json["cook"] = cook;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get servings() {
    try {
      return this.json["servings"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setServings(servings: string | undefined) {
    try {
      this.json["servings"] = servings;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get source() {
    try {
      return this.json["source"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setSource(source: string | undefined) {
    try {
      this.json["source"] = source;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get date() {
    try {
      return this.json["date"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setDate(date: string | undefined) {
    try {
      this.json["date"] = date;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  get description() {
    try {
      return this.json["description"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setDescription(description: string | undefined) {
    try {
      this.json["description"] = description;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export { Recipe, Ingredient };
