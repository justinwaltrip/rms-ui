import {
  BaseDirectory,
  BinaryFileContents,
  createDir,
  exists,
  readTextFile,
  removeFile,
  renameFile,
  writeBinaryFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";

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
function getImageUrl(filename: string, collectionPath: string) {
  try {
    const path = `${collectionPath}/${filename}`;
    return convertFileSrc(path);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Delete image
 */
async function deleteImage(filename: string, collectionPath: string) {
  try {
    // delete image
    const path = `${collectionPath}/${filename}`;
    await removeFile(path, {
      dir: BaseDirectory.Home,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Write image
 */
async function writeImage(
  filename: string,
  image: BinaryFileContents,
  collectionPath: string,
) {
  try {
    // create parent directories if they don't exist
    const parentDirectories = filename.split("/");
    for (let i = 0; i < parentDirectories.length - 1; i++) {
      const dir = parentDirectories.slice(0, i + 1).join("/");
      const dirExists = await exists(`${collectionPath}/${dir}`, {
        dir: BaseDirectory.Home,
      });

      if (!dirExists) {
        await createDir(`${collectionPath}/${dir}`, {
          dir: BaseDirectory.Home,
        });
      }
    }

    // write image to file
    const path = `${collectionPath}/${filename}`;
    await writeBinaryFile(path, image, {
      dir: BaseDirectory.Home,
    });
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
    const appConfigDirExists = await exists("", {
      dir: BaseDirectory.AppConfig,
    });

    if (!appConfigDirExists) {
      // create AppConfig directory
      await createDir("", {
        dir: BaseDirectory.AppConfig,
      });
    }

    // write app config
    await writeTextFile("app.json", JSON.stringify(appConfig, null, 2), {
      dir: BaseDirectory.AppConfig,
    });
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
      return {
        collections: [],
      };
    }

    // read app config
    const content = await readTextFile("app.json", {
      dir: BaseDirectory.AppConfig,
    });
    const appConfig: { collections: Array<string> } = JSON.parse(content) as {
      collections: Array<string>;
    };
    return appConfig;
  } catch (err) {
    console.error(err);

    // delete app.json
    await removeFile("app.json", {
      dir: BaseDirectory.AppConfig,
    });

    return {
      collections: [],
    };
  }
}

async function renameRecipe(
  oldPath: string,
  newPath: string,
  collectionPath: string,
) {
  try {
    // rename file
    await renameFile(
      `${collectionPath}/${oldPath}.json`,
      `${collectionPath}/${newPath}.json`,
      {
        dir: BaseDirectory.Home,
      },
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteRecipe(filename: string, collectionPath: string) {
  try {
    // delete file
    await removeFile(`${collectionPath}/${filename}.json`, {
      dir: BaseDirectory.Home,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  getImageUrl,
  writeAppConfig,
  readAppConfig,
  writeRecipeContents,
  readRecipeContents,
  deleteImage,
  writeImage,
  renameRecipe,
  deleteRecipe,
};
