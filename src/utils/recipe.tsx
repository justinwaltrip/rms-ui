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
  public tags: string[];
  public date: string;
  public source: string;
  public rating: number;
  public prep: number;
  public cook: number;
  public servings: number;
  public description: string;
  public title: string;
  public image: Image;
  public ingredients: Ingredient[];
  public directions: string[];
  public notes: string[];

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
