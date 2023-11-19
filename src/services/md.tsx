import { parse } from "yaml";

/**
 * Get title from markdown
 * @param markdown
 * @returns title
 */
function getTitle(markdown: string) {
  const match = markdown.match(/^#\s(.*)$/m);
  return match ? match[1] : "";
}

/**
 * Get image from markdown
 * @param markdown
 * @returns image source and alt text
 */
function getImage(markdown: string) {
  const match = markdown.match(/!\[([^\]]*)\]\(([^)]*)\)/);
  const alt = match ? match[1] : "";
  const src = match ? match[2] : "";
  return { alt, src };
}

/**
 * Parse frontmatter from markdown
 */
function parseFrontmatter(markdown: string) {
  const match = markdown.match(/---\n([\s\S]*)\n---/);
  const frontmatter = match ? match[1] : "";
  if (frontmatter) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return parse(frontmatter);
  } else {
    return {};
  }
}

/**
 * Get ingredients from markdown
 */
function getIngredients(markdown: string) {
  const match = markdown.match(/## ingredients\n([\s\S]*?)\n##/);
  const section = match ? match[1] : "";
  const lines = section.split("\n");
  const ingredients: { [key: string]: boolean } = {};
  for (const line of lines) {
    const match = line.match(/- \[(.)\] (.*)/);
    if (match) {
      const checked = match[1] === "x";
      const name = match[2];
      ingredients[name] = checked;
    }
  }
  return ingredients;
}

/**
 * Get directions from markdown
 */
function getDirections(markdown: string) {
  const match = markdown.match(/## directions\n([\s\S]*)/);
  const section = match ? match[1] : "";
  const lines = section.split("\n");
  const directions: string[] = [];
  for (const line of lines) {
    // match a number followed by a period
    const match = line.match(/^\d+\.\s(.*)/);
    if (match) {
      const direction = match[1];
      directions.push(direction);
    }
  }
  return directions;
}

/**
 * Get notes from markdown
 */
function getNotes(markdown: string) {
  const match = markdown.match(/## notes\n([\s\S]*)/);
  const section = match ? match[1] : "";
  const lines = section.split("\n");
  const notes: string[] = [];
  for (const line of lines) {
    // match a - followed by a space
    const match = line.match(/-\s(.*)/);
    if (match) {
      const note = match[1];
      notes.push(note);
    }
  }
  return notes;
}

export {
  getTitle,
  getImage,
  parseFrontmatter,
  getIngredients,
  getDirections,
  getNotes,
};
