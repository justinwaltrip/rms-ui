import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

const BASE_PATH = "rms/recipes";

async function write(filename: string, contents: string) {
  try {
    // write markdown to file
    const path = `${BASE_PATH}/${filename}`;
    await writeTextFile(path, contents, { dir: BaseDirectory.Home });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Read markdown from file
 */
async function read(filename: string) {
  try {
    // read markdown from file
    const path = `${BASE_PATH}/${filename}`;
    return await readTextFile(path, {
      dir: BaseDirectory.Home,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { read, write };
