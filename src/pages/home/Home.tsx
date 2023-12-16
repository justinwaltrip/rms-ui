import { tauri } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { LogicalSize, appWindow } from "@tauri-apps/api/window";
import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Home.module.css";
import close from "../../assets/close.png";
import folder from "../../assets/folder.png";
import hdots from "../../assets/hdots.png";
// import rename from "../../assets/rename.png";
import CreateCollectionDialog from "../../components/create-collection-dialog/CreateCollectionDialog";
import { AppContext } from "../../main";
import { createCollection } from "../../utils/collection";
import { readAppConfig, writeAppConfig } from "../../utils/fs";

const Home: FC = () => {
  // #region variables
  const navigate = useNavigate();
  const unlistenFunctions: Array<() => void> = [];
  // #endregion

  // #region contexts
  const appContext = useContext(AppContext);
  const { setCollectionPath } = appContext;
  // #endregion

  // #region states

  // collections
  const [collections, setCollections] = useState<Array<string>>([]);

  // create collection
  const [createCollectionDialogVisible, setCreateCollectionDialogVisible] =
    useState(false);

  // collection options
  const [collectionOptionsIndex, setCollectionOptionsIndex] = useState(-1);
  const [collectionOptionsVisible, setCollectionOptionsVisible] =
    useState(false);
  const [collectionOptionsPosition, setCollectionOptionsPosition] = useState({
    x: 0,
    y: 0,
  });
  // #endregion

  // #region effects

  /**
   * On mount, read app config and set collections
   */
  useEffect(() => {
    // read app config and set collections
    readAppConfig()
      .then((appConfig) => {
        if (appConfig.collections) {
          setCollections(appConfig.collections as Array<string>);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    // set size and prevent window from being resized
    appWindow
      .setSize(new LogicalSize(800, 600))
      .then(() => {
        appWindow
          .listen("tauri://resize", () => {
            appWindow
              .setSize(new LogicalSize(800, 600))
              .then(() => {})
              .catch((err) => {
                console.error(err);
              });
          })
          .then((unlistenFn) => {
            unlistenFunctions.push(unlistenFn);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });

    // register click events to close collection options
    document.addEventListener("click", () => {
      setCollectionOptionsVisible(false);
    });

    return () => {
      if (unlistenFunctions) {
        for (const unlistenFn of unlistenFunctions) {
          unlistenFn();
        }
      }
    };
  }, []);

  /**
   * On collections change, write app config
   */
  useEffect(() => {
    readAppConfig()
      .then((appConfig) => {
        appConfig.collections = collections;
        return appConfig;
      })
      .then((appConfig) => {
        return writeAppConfig(appConfig);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [collections]);
  // #endregion

  // #region functions

  /**
   * Remove collection
   *
   * @param index Index of collection to remove
   */
  function removeCollection(index: number) {
    const newCollections = [...collections];
    newCollections.splice(index, 1);
    setCollections(newCollections);
  }

  /**
   * Select folder
   */
  function openCollection() {
    open({
      multiple: false,
      directory: true,
    })
      .then((collectionPath) => {
        if (collectionPath && !Array.isArray(collectionPath)) {
          createCollection(collectionPath)
            .then(() => {
              setCollections([...collections, collectionPath]);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // #endregion

  // #region components
  const Option: FC<{
    text: string;
    description: string;
    buttonLabel: string;
    onClick: () => void;
  }> = ({ text, description, buttonLabel, onClick }) => {
    return (
      <div className={styles["option"]}>
        <div className={styles["option-text"]}>
          <div className={styles["option-title"]}>{text}</div>
          <div className={styles["option-description"]}>{description}</div>
        </div>
        <div className={styles["option-spacer"]} />
        <button className={styles["option-button"]} onClick={onClick}>
          {buttonLabel}
        </button>
      </div>
    );
  };
  // #endregion

  return (
    <div>
      <div data-tauri-drag-region className={styles["title-bar"]} />
      <div className={styles["sidebar"]}>
        <div className={`${styles["options"]} ${styles["sidebar-options"]}`}>
          {collections.map((collectionPath, index) => (
            <div
              key={index}
              className={`${styles["option"]} ${styles["sidebar-option"]}`}
              onClick={() => {
                setCollectionPath(collectionPath);
                navigate("/grid");
              }}
            >
              <div className={styles["option-text"]}>
                <div className={styles["option-title"]}>
                  {collectionPath.split("/").pop()}
                </div>
                <div className={styles["option-description"]}>
                  {collectionPath}
                </div>
              </div>
              <div className={styles["option-spacer"]} />
              <img
                src={hdots}
                alt="Horizontal dots"
                className={styles["hdots-icon"]}
                onClick={(e) => {
                  e.stopPropagation();
                  setCollectionOptionsIndex(index);
                  setCollectionOptionsVisible(true);
                  setCollectionOptionsPosition({
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles["home-content"]}>
        <div className={`${styles["options"]} ${styles["content-options"]}`}>
          <Option
            text="Create a new collection"
            description="Create a new recipe collection in your local file system"
            buttonLabel="Create"
            onClick={() => setCreateCollectionDialogVisible(true)}
          />
          <div className={styles["divider"]} />
          <Option
            text="Open folder as a collection"
            description="Choose an existing folder of recipe files"
            buttonLabel="Open"
            onClick={() => {
              openCollection();
            }}
          />
        </div>
      </div>
      <CreateCollectionDialog
        visible={createCollectionDialogVisible}
        close={() => setCreateCollectionDialogVisible(false)}
      />
      {collectionOptionsVisible && (
        <div
          className={styles["collection-options"]}
          style={{
            left: collectionOptionsPosition.x,
            top: collectionOptionsPosition.y,
          }}
        >
          <div
            className={styles["collection-option"]}
            onClick={() => {
              tauri
                .invoke("show_in_folder", {
                  path: collections[collectionOptionsIndex],
                })
                .then(() => {})
                .catch((err) => {
                  console.error(err);
                });
            }}
          >
            <img src={folder} alt="Folder" className={styles["option-icon"]} />
            <div className={styles["collection-option-text"]}>
              Reveal in Finder
            </div>
          </div>
          {/* <div className={styles["collection-option"]} onClick={() => {}}>
            <img src={rename} alt="Rename" className={styles["option-icon"]} />
            <div className={styles["collection-option-text"]}>
              Rename collection
            </div>
          </div> */}
          <div
            className={styles["collection-option"]}
            onClick={() => {
              removeCollection(collectionOptionsIndex);
            }}
          >
            <img src={close} alt="Remove" className={styles["option-icon"]} />
            <div className={styles["collection-option-text"]}>
              Remove from list
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
