import { open } from "@tauri-apps/api/dialog";
import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
} from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";
import { FC, useState } from "react";

import styles from "./CreateCollectionDialog.module.css";
import back from "../../assets/back.png";
import { writeAppConfig } from "../../utils/fs";

const CreateCollectionDialog: FC<{ visible: boolean; close: () => void }> = ({
  visible,
  close,
}) => {
  const [collectionName, setCollectionName] = useState("");
  const [collectionLocation, setCollectionLocation] = useState("");

  async function selectFolder(): Promise<void> {
    try {
      const selected = await open({
        multiple: false,
        directory: true,
        defaultPath: await homeDir(),
      });
      if (selected && !Array.isArray(selected)) {
        setCollectionLocation(selected);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function createCollection() {
    try {
      // create new collection directory
      await createDir(`${collectionLocation}/${collectionName}`, {
        dir: BaseDirectory.Home,
      });

      // check if app.json exists
      console.log("Checking if app.json exists");
      const appConfigExists = await exists("app.json", {
        dir: BaseDirectory.AppConfig,
      });
      console.log(`app.json exists: ${appConfigExists}`);

      let appConfig: { [name: string]: unknown };
      if (appConfigExists) {
        // load app config
        console.log("Loading app.json");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        appConfig = JSON.parse(
          await readTextFile("app.json", {
            dir: BaseDirectory.AppConfig,
          }),
        );
        console.log("app.json loaded");
      } else {
        appConfig = {};
      }

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

  return visible ? (
    <div className={styles["dialog"]}>
      <img
        src={back}
        alt="Back Icon"
        onClick={close}
        className={styles["back-icon"]}
      />
      <div className={styles["dialog-options"]}>
        <div className={styles["dialog-option-header"]}>Create collection</div>
        <div className={styles["divider"]} />
        <div className={styles["dialog-option"]}>
          <div className={styles["dialog-option-text"]}>
            <div className={styles["dialog-option-title"]}>Collection name</div>
            <div className={styles["dialog-option-description"]}>
              Pick a name for your collection
            </div>
          </div>
          <div className={styles["dialog-option-spacer"]} />
          <input
            type="text"
            className={styles["dialog-option-input"]}
            placeholder="Collection name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </div>
        <div className={styles["divider"]} />
        <div className={styles["dialog-option"]}>
          <div className={styles["dialog-option-text"]}>
            <div className={styles["dialog-option-title"]}>Location</div>
            <div className={styles["dialog-option-description"]}>
              {collectionLocation
                ? `Your collection will be stored at ${collectionLocation}/${collectionName}`
                : "Pick a place to store your collection"}
            </div>
          </div>
          <div className={styles["dialog-option-spacer"]} />
          <button
            className={styles["dialog-option-button"]}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => selectFolder()}
          >
            Browse
          </button>
        </div>
        <div className={styles["dialog-option-footer"]}>
          <button
            className={styles["dialog-option-button create-button"]}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => createCollection()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default CreateCollectionDialog;
