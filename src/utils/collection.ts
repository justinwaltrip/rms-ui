import {
  BaseDirectory,
  mkdir as createDir,
  exists,
  readTextFile,
  rename as renameFile,
} from "@tauri-apps/plugin-fs";

import { readAppConfig, writeAppConfig } from "./fs";

async function createCollection(collectionPath: string) {
  try {
    // check if collection already exists
    const collectionExists = await exists(collectionPath, {
      dir: BaseDirectory.Home,
    });

    if (!collectionExists) {
      // create new collection directory
      await createDir(collectionPath, {
        dir: BaseDirectory.Home,
      });
    }

    // check if app.json exists
    const appConfigExists = await exists("app.json", {
      baseDir: BaseDirectory.AppCache,
    });

    let appConfig: { [name: string]: unknown };
    if (appConfigExists) {
      appConfig = JSON.parse(
        await readTextFile("app.json", {
          baseDir: BaseDirectory.AppCache,
        }),
      );
    } else {
      appConfig = {};
    }

    // add collection to app config
    if (!appConfig.collections) {
      appConfig.collections = [];
    }
    if (Array.isArray(appConfig.collections)) {
      appConfig.collections.push(collectionPath);
    }

    // save app config
    await writeAppConfig(appConfig);

    // close dialog
    close();
  } catch (error) {
    console.log(error);
  }
}

async function renameCollection(oldPath: string, newPath: string) {
  try {
    // rename file
    await renameFile(oldPath, newPath, {
      dir: BaseDirectory.Home,
    });

    // update app config
    const appConfig = await readAppConfig();
    const index = appConfig.collections.indexOf(oldPath);
    appConfig.collections[index] = newPath;
    await writeAppConfig(appConfig);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { createCollection, renameCollection };
