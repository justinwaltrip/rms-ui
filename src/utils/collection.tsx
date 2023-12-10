import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
} from "@tauri-apps/api/fs";

import { writeAppConfig } from "./fs";

async function createCollection(
  collectionName: string,
  collectionLocation: string,
) {
  try {
    // check if collection already exists
    const collectionExists = await exists(
      `${collectionLocation}/${collectionName}`,
      {
        dir: BaseDirectory.Home,
      },
    );

    if (!collectionExists) {
      // create new collection directory
      await createDir(`${collectionLocation}/${collectionName}`, {
        dir: BaseDirectory.Home,
      });
    }

    // check if app.json exists
    const appConfigExists = await exists("app.json", {
      dir: BaseDirectory.AppConfig,
    });

    let appConfig: { [name: string]: unknown };
    if (appConfigExists) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      appConfig = JSON.parse(
        await readTextFile("app.json", {
          dir: BaseDirectory.AppConfig,
        }),
      );
    } else {
      appConfig = {};
    }

    // TODO remove
    console.log(appConfig);

    // add collection to app config
    if (!appConfig.collections) {
      appConfig.collections = [];
    }
    if (Array.isArray(appConfig.collections)) {
      appConfig.collections.push({
        name: collectionName,
        path: `${collectionLocation}/${collectionName}`,
      });
    }

    // save app config
    await writeAppConfig(appConfig);

    // close dialog
    close();
  } catch (error) {
    console.log(error);
  }
}

export { createCollection };
