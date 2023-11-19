/**
 * Get title from markdown
 * @param markdown
 * @returns title
 */
function getTitle(markdown: string) {
  return markdown.match(/^#\s(.*)$/m);
}

export { getTitle };
