import { BaseDirectory, exists, readTextFile } from "@tauri-apps/plugin-fs";

import { readAppConfig, writeAppConfig } from "./fs";
import { FileService } from "../services/FileService";

async function createCollection(
  collectionPath: string,
  fileService: FileService,
) {
  try {
    try {
      const collectionExists = await fileService.exists(collectionPath);
      if (!collectionExists) {
        await fileService.createDirectory(collectionPath);
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create collection");
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

async function renameCollection(
  oldPath: string,
  newPath: string,
  fileService: FileService,
) {
  try {
    // rename file
    await fileService.rename(oldPath, newPath);

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
