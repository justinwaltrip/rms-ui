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

export { getTitle, getImage };
