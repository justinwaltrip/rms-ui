import "./Home.module.css";
import { LogicalSize, appWindow } from "@tauri-apps/api/window";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import hdots from "../../assets/hdots.png";
import CreateCollectionDialog from "../../components/create-collection-dialog/CreateCollectionDialog";
import { readAppConfig, writeAppConfig } from "../../utils/fs";

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

const Home: FC = () => {
  const [collections, setCollections] = useState<
    Array<{ name: string; path: string }>
  >([]);
  const [createCollectionDialogVisible, setCreateCollectionDialogVisible] =
    useState(false);

  const navigate = useNavigate();
  const unlistenFunctions: Array<() => void> = [];

  /**
   * On mount function
   */
  useEffect(() => {
    // read app config and set collections
    readAppConfig()
      .then((appConfig) => {
        if (appConfig.collections) {
          setCollections(
            appConfig.collections as Array<{ name: string; path: string }>,
          );
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

    return () => {
      if (unlistenFunctions) {
        for (const unlistenFn of unlistenFunctions) {
          unlistenFn();
        }
      }
    };
  }, []);

  /**
   * On collections update, write app config
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
   * Remove collection
   */
  function removeCollection(index: number) {
    const newCollections = [...collections];
    newCollections.splice(index, 1);
    setCollections(newCollections);
  }

  return (
    <div>
      <div data-tauri-drag-region className={styles["title-bar"]} />
      <div className={styles["home-sidebar"]}>
        <div className={styles["options sidebar-options"]}>
          {collections.map((collection, index) => (
            <div
              key={index}
              className={styles["option sidebar-option"]}
              onClick={() => {
                navigate("/editor", { state: { collection } });
              }}
            >
              <div className={styles["option-text"]}>
                <div className={styles["option-title"]}>{collection.name}</div>
                <div className={styles["option-description"]}>
                  {collection.path}
                </div>
              </div>
              <div className={styles["option-spacer"]} />
              <img
                src={hdots}
                alt="Horizontal dots"
                className={styles["hdots-icon"]}
                onClick={(e) => {
                  e.stopPropagation();
                  removeCollection(index);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles["home-content"]}>
        <div className={styles["options content-options"]}>
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
            onClick={() => {}}
          />
        </div>
      </div>
      <CreateCollectionDialog
        visible={createCollectionDialogVisible}
        close={() => setCreateCollectionDialogVisible(false)}
      />
    </div>
  );
};

export default Home;
