import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { open } from "@tauri-apps/plugin-dialog";
import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Home.module.css";
import close from "../../assets/close.png";
import folder from "../../assets/folder.png";
import hdots from "../../assets/hdots.png";
import rename from "../../assets/rename.png";
import CreateCollectionDialog from "../../components/create-collection-dialog/CreateCollectionDialog";
import Dropdown from "../../components/dropdown/Dropdown";
import { AppContext } from "../../main";
import { createCollection, renameCollection } from "../../utils/collection";
import { readAppConfig, writeAppConfig } from "../../utils/fs";
import { platform } from '@tauri-apps/plugin-os';

const appWindow = getCurrentWindow()
const currentPlatform = platform();


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
  const [reloadCollections, setReloadCollections] = useState(true);

  // create collection
  const [showCreateCollectionDialog, setShowCreateCollectionDialog] =
    useState(false);

  // collection options
  const [collectionOptionsIndex, setCollectionOptionsIndex] = useState(-1);
  const [showCollectionOptions, setShowCollectionOptions] = useState(false);
  const [collectionOptionsPosition, setCollectionOptionsPosition] = useState({
    x: 0,
    y: 0,
  });

  // rename collection
  const [renameCollectionIndex, setRenameCollectionIndex] = useState(-1);
  const [tempCollectionName, setTempCollectionName] = useState("");

  // open collection
  const [openCollectionPath, setOpenCollectionPath] = useState("");

  // #endregion

  // #region effects

  /**
   * On mount, set window size and prevent window from being resized
   */
  useEffect(() => {
    // set size and prevent window from being resized
    if (currentPlatform != "ios") {
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
    };

    // register click events to close collection options
    document.addEventListener("click", () => {
      setShowCollectionOptions(false);
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
   * On reload collections change, read app config
   */
  useEffect(() => {
    if (reloadCollections) {
      readAppConfig()
        .then((appConfig) => {
          if (appConfig.collections) {
            setCollections(appConfig.collections);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setReloadCollections(false);
        });
    }
  }, [reloadCollections]);

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

   /**
   * On rename collection index change, focus on input
   */
  useEffect(() => {
    if (renameCollectionIndex !== -1) {
      const input = document.getElementById("rename-collection-input");
      if (input) {
        input.focus();
      }
    }
  }, [renameCollectionIndex]);

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
                navigate("/grid", { state: { maximizeWindow: true } });
              }}
            >
              <div className={styles["option-text"]}>
                {renameCollectionIndex === index ? (
                  <input
                    id="rename-collection-input"
                    type="text"
                    value={tempCollectionName}
                    onChange={(e) => setTempCollectionName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" || e.key === "Enter") {
                        renameCollection(
                          collectionPath,
                          `${collectionPath
                            .split("/")
                            .slice(0, -1)
                            .join("/")}/${tempCollectionName}`,
                        )
                          .then(() => {
                            setRenameCollectionIndex(-1);
                            setReloadCollections(true);
                          })
                          .catch((err) => {
                            console.error(err);
                          });
                      } else if (e.key === "Escape") {
                        setRenameCollectionIndex(-1);
                      }
                    }}
                    autoCorrect="off"
                  />
                ) : (
                  <div className={styles["option-title"]}>
                    {collectionPath.split("/").pop()}
                  </div>
                )}
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
                  setShowCollectionOptions(true);
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
            onClick={() => setShowCreateCollectionDialog(true)}
          />
          <div className={styles["divider"]} />
          {currentPlatform == "ios" ? (
            <div className={styles["option"]}>
              <div className={styles["option-text"]}>
                <div className={styles["option-title"]}>Open folder as a collection</div>
                <div className={styles["option-description"]}>Write the path of an existing folder of recipe files</div>
              </div>
              <div className={styles["option-spacer"]} />
              <input
                type="text" 
                className={styles["option-input"]}
                placeholder="Enter path"
                value={openCollectionPath}
                onChange={(e) => setOpenCollectionPath(e.target.value)}
                />
                <button className={styles["option-button"]} onClick={() => {
                    setCollections([...collections, openCollectionPath]);
                    setOpenCollectionPath("");
                }}>
                  Open
                </button>
            </div>
          ) : (
          <Option
            text="Open folder as a collection"
            description="Choose an existing folder of recipe files"
            buttonLabel="Open"
            onClick={() => {
              openCollection();
            }}
          />
          )}
        </div>
      </div>
      {showCreateCollectionDialog && (
        <CreateCollectionDialog
          close={() => setShowCreateCollectionDialog(false)}
          reloadCollections={() => setReloadCollections(true)}
        />
      )}
      {showCollectionOptions && (
        <Dropdown
          x={collectionOptionsPosition.x}
          y={collectionOptionsPosition.y}
          options={[
            {
              onClick: () => {
                tauri
                  .invoke("show_in_folder", {
                    path: collections[collectionOptionsIndex],
                  })
                  .then(() => {})
                  .catch((err: any) => {
                    console.error(err);
                  });
              },
              icon: folder,
              text: "Reveal in Finder",
            },
            {
              onClick: () => {
                setRenameCollectionIndex(collectionOptionsIndex);
                setTempCollectionName(
                  collections[collectionOptionsIndex].split("/").pop() || "",
                );
              },
              icon: rename,
              text: "Rename collection",
            },
            {
              onClick: () => {
                removeCollection(collectionOptionsIndex);
              },
              icon: close,
              text: "Remove from list",
            },
          ]}
        ></Dropdown>
      )}
    </div>
  );
};

export default Home;
