import { homeDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { FC, useEffect, useState } from "react";

import styles from "./CreateCollectionDialog.module.css";
import back from "../../assets/back.png";
import { createCollection } from "../../utils/collection";

interface CreateCollectionDialogProps {
  close: () => void;
  reloadCollections: () => void;
}

const CreateCollectionDialog: FC<CreateCollectionDialogProps> = ({
  close,
  reloadCollections,
}) => {
  // #region states
  const [collectionName, setCollectionName] = useState("");
  const [collectionLocation, setCollectionLocation] = useState("");
  // #endregion

  /**
   * On mount, set focus to the collection name input
   */
  useEffect(() => {
    const input = document.getElementById(
      "dialog-option-input",
    ) as HTMLInputElement;
    input.focus();
  }, []);

  /**
   * Select a folder to store the collection
   */
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

  return (
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
            id="dialog-option-input"
            className={styles["dialog-option-input"]}
            placeholder="Collection name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            autoCorrect="off"
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
            onClick={() => {
              selectFolder()
                .then(() => {})
                .catch((err) => {
                  console.error(err);
                });
            }}
          >
            Browse
          </button>
        </div>
        <div className={styles["spacer"]} />
        <div className={styles["dialog-option-footer"]}>
          <button
            className={`${styles["dialog-option-button"]} ${styles["create-button"]}`}
            onClick={() => {
              createCollection(`${collectionLocation}/${collectionName}`)
                .then(() => {
                  close();
                  reloadCollections();
                })
                .catch((err) => {
                  console.error(err);
                });
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionDialog;
