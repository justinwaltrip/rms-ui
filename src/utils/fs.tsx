import {
  BaseDirectory,
  createDir,
  exists,
  readBinaryFile,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";

import { Recipe } from "./recipe";

/**
 * Write recipe to file
 * @param filename
 * @param contents
 */
async function writeRecipe(
  filename: string,
  recipe: Recipe,
  collectionPath: string,
) {
  try {
    const path = `${collectionPath}/${filename}.json`;
    await writeTextFile(path, JSON.stringify(recipe, null, "\t"), {
      dir: BaseDirectory.Home,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Write recipe contents to file
 */
async function writeRecipeContents(
  filename: string,
  contents: string,
  collectionPath: string,
) {
  try {
    const path = `${collectionPath}/${filename}.json`;
    await writeTextFile(path, contents, {
      dir: BaseDirectory.Home,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Read recipe from file
 * @param filename
 * @param collectionPath
 * @returns recipe content
 */
async function readRecipe(filename: string, collectionPath: string) {
  try {
    const path = `${collectionPath}/${filename}.json`;
    const json = await readTextFile(path, {
      dir: BaseDirectory.Home,
    });
    return JSON.parse(json) as Recipe;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Read recipe contents from file
 */
async function readRecipeContents(filename: string, collectionPath: string) {
  try {
    const path = `${collectionPath}/${filename}.json`;
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
 * @param filename
 * @param collectionPath
 * @returns image url
 */
async function readImage(filename: string, collectionPath: string) {
  try {
    // read image from file
    const path = `${collectionPath}/${filename}`;
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

/**
 * Write app config
 * @param appConfig
 */
async function writeAppConfig(appConfig: { [name: string]: unknown }) {
  try {
    // check if AppConfig directory exists
    console.log("Checking if AppConfig directory exists");
    const appConfigDirExists = await exists("", {
      dir: BaseDirectory.AppConfig,
    });
    console.log(`AppConfig directory exists: ${appConfigDirExists}`);

    if (!appConfigDirExists) {
      // create AppConfig directory
      console.log("Creating AppConfig directory");
      await createDir("", {
        dir: BaseDirectory.AppConfig,
      });
      console.log("AppConfig directory created");
    }

    // write app config
    console.log("Saving app.json");
    await writeTextFile("app.json", JSON.stringify(appConfig, null, 2), {
      dir: BaseDirectory.AppConfig,
    });
    console.log("app.json saved");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Read from app config
 * @returns app config
 */
async function readAppConfig() {
  try {
    // check if app.json exists
    const appConfigExists = await exists("app.json", {
      dir: BaseDirectory.AppConfig,
    });

    if (!appConfigExists) {
      return {};
    }

    // read app config
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const appConfig: { [name: string]: unknown } = JSON.parse(
      await readTextFile("app.json", {
        dir: BaseDirectory.AppConfig,
      }),
    );

    return appConfig;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  readRecipe,
  writeRecipe,
  readImage,
  writeAppConfig,
  readAppConfig,
  writeRecipeContents,
  readRecipeContents,
};
