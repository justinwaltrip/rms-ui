import {
  BaseDirectory,
  createDir,
  exists,
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

/**
 * Write to app config
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
 */
async function readAppConfig() {
  try {
    // check if app.json exists
    console.log("Checking if app.json exists");
    const appConfigExists = await exists("app.json", {
      dir: BaseDirectory.AppConfig,
    });
    console.log(`app.json exists: ${appConfigExists}`);

    if (!appConfigExists) {
      return {};
    }

    // read app config
    console.log("Loading app.json");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const appConfig: { [name: string]: unknown } = JSON.parse(
      await readTextFile("app.json", {
        dir: BaseDirectory.AppConfig,
      }),
    );
    console.log("app.json loaded");

    return appConfig;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { read, write, readImage, writeAppConfig, readAppConfig };
