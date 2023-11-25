interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface Image {
  src: string;
  alt: string;
}

class Recipe {
  private tags: string[];
  private date: string;
  private source: string;
  private rating: number;
  private prep: number;
  private cook: number;
  private servings: number;
  private description: string;
  private title: string;
  private image: Image;
  private ingredients: Ingredient[];
  private directions: string[];
  private notes: string[];

  constructor(
    tags: string[],
    date: string,
    source: string,
    rating: number,
    prep: number,
    cook: number,
    servings: number,
    description: string,
    title: string,
    image: Image,
    ingredients: Ingredient[],
    directions: string[],
    notes: string[],
  ) {
    this.tags = tags;
    this.date = date;
    this.source = source;
    this.rating = rating;
    this.prep = prep;
    this.cook = cook;
    this.servings = servings;
    this.description = description;
    this.title = title;
    this.image = image;
    this.ingredients = ingredients;
    this.directions = directions;
    this.notes = notes;
  }
}

export { Recipe };
