import { readRecipeContents, writeRecipeContents } from "./fs";

class Ingredient {
  public name: string;
  public primary_amount: string;
  public primary_unit: string;
  public alt_amount: string;
  public alt_unit: string;
  public is_checked: boolean;

  constructor(
    name: string,
    primary_amount: string = "",
    primary_unit: string = "",
    alt_amount: string = "",
    alt_unit: string = "",
    is_checked = false,
  ) {
    this.name = name;
    this.primary_amount = primary_amount;
    this.primary_unit = primary_unit;
    this.alt_amount = alt_amount;
    this.alt_unit = alt_unit;
    this.is_checked = is_checked;
  }
}

interface Image {
  src: string;
  alt: string | undefined;
}

class Recipe {
  public json: { [key: string]: unknown };
  public filename: string;
  public collectionPath: string;

  constructor(
    json: { [key: string]: unknown },
    filename = "",
    collectionPath = "",
  ) {
    this.json = json;
    this.filename = filename;
    this.collectionPath = collectionPath;
  }

  static async loadRecipe(
    filename: string,
    collectionPath: string,
  ): Promise<Recipe> {
    try {
      const contents = await readRecipeContents(filename, collectionPath);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  async writeRecipe(): Promise<void> {
    try {
      const contents = JSON.stringify(this.json, null, 4);
      await writeRecipeContents(this.filename, contents, this.collectionPath);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getImageSrc() {
    try {
      const image: Image = this.json["image"] as Image;
      if (image) {
        return image.src;
      } else {
        return undefined;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setImageSrc(src: string) {
    try {
      const image: Image = this.json["image"] as Image;
      if (!image) {
        this.json["image"] = {
          src: src,
        };
      } else {
        image.src = src;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getImageAlt() {
    try {
      const image: Image = this.json["image"] as Image;
      return image.alt;
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

  setTitle(title: string) {
    try {
      this.json["title"] = title;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getIngredients() {
    try {
      return this.json["ingredients"] as Ingredient[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setIngredients(ingredients: Ingredient[]) {
    try {
      this.json["ingredients"] = ingredients;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getDirections() {
    try {
      return this.json["directions"] as string[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setDirections(directions: string[]) {
    try {
      this.json["directions"] = directions;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getNotes() {
    try {
      return this.json["notes"] as string[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setNotes(notes: string[]) {
    try {
      this.json["notes"] = notes;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getTags() {
    try {
      return this.json["tags"] as string[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setTags(tags: string[]) {
    try {
      this.json["tags"] = tags;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getPrep() {
    try {
      return this.json["prep"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setPrep(prep: string) {
    try {
      this.json["prep"] = prep;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getCook() {
    try {
      return this.json["cook"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setCook(cook: string) {
    try {
      this.json["cook"] = cook;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getServings() {
    try {
      return this.json["servings"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setServings(servings: string) {
    try {
      this.json["servings"] = servings;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getSource() {
    try {
      return this.json["source"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setSource(source: string) {
    try {
      this.json["source"] = source;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getDate() {
    try {
      return this.json["date"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setDate(date: string) {
    try {
      this.json["date"] = date;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getDescription() {
    try {
      return this.json["description"] as string;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setDescription(description: string) {
    try {
      this.json["description"] = description;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export { Recipe, Ingredient };
