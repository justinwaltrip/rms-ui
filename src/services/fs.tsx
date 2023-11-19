import {
  BaseDirectory,
  readBinaryFile,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";

const BASE_PATH = "rms";
const RECIPES_PATH = BASE_PATH + "/recipes";

async function write(filename: string, contents: string) {
  try {
    // write markdown to file
    const path = `${RECIPES_PATH}/${filename}`;
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
    const path = `${RECIPES_PATH}/${filename}`;
    return await readTextFile(path, {
      dir: BaseDirectory.Home,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Read image from file
 */
async function readImage(filename: string) {
  try {
    // read image from file
    const path = `${BASE_PATH}/${filename}`;
    const bytes = await readBinaryFile(path, {
      dir: BaseDirectory.Home,
    });
    const blob = new Blob([bytes]);
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { read, write, readImage };
