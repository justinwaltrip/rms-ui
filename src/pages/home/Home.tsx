import "./Home.css";
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
    <div className="option">
      <div className="option-text">
        <div className="option-title">{text}</div>
        <div className="option-description">{description}</div>
      </div>
      <div className="option-spacer" />
      <button className="option-button" onClick={onClick}>
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
      <div data-tauri-drag-region className="title-bar" />
      <div className="home-sidebar">
        <div className="options sidebar-options">
          {collections.map((collection, index) => (
            <div
              key={index}
              className="option sidebar-option"
              onClick={() => {
                navigate("/editor", { state: { collection } });
              }}
            >
              <div className="option-text">
                <div className="option-title">{collection.name}</div>
                <div className="option-description">{collection.path}</div>
              </div>
              <div className="option-spacer" />
              <img
                src={hdots}
                alt="Horizontal dots"
                className="hdots-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCollection(index);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="home-content">
        <div className="options content-options">
          <Option
            text="Create a new collection"
            description="Create a new recipe collection in your local file system"
            buttonLabel="Create"
            onClick={() => setCreateCollectionDialogVisible(true)}
          />
          <div className="divider" />
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
