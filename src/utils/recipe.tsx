import { readRecipeContents, writeRecipeContents } from "./fs";

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
  public json: { [key: string]: unknown };
  private filename: string;
  private collectionPath: string;

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
      return image.src;
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

  getTitle() {
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

  getDirections() {
    try {
      return this.json["directions"] as string[];
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

  getTags() {
    try {
      return this.json["tags"] as string[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getPrep() {
    try {
      return this.json["prep"] as number;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getCook() {
    try {
      return this.json["cook"] as number;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getServings() {
    try {
      return this.json["servings"] as number;
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

  getDate() {
    try {
      return this.json["date"] as string;
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

export { Recipe };
