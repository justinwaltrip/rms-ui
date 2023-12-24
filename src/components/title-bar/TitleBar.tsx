import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./TitleBar.module.css";
import close from "../../assets/close.png";
import create from "../../assets/create.png";

interface TitleBarProps {
  openFiles: Array<string>;
  setOpenFiles: (openFiles: Array<string>) => void;
  activeFileIndex: number;
}

const TitleBar: FC<TitleBarProps> = ({
  openFiles,
  setOpenFiles,
  activeFileIndex,
}) => {
  const navigate = useNavigate();

  /**
   * On mount, register keydown events
   */
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      // on command + w, close the active tab
      if (e.metaKey && e.key === "w") {
        closeTab(activeFileIndex, openFiles, setOpenFiles);
        // on command + n, create a new tab
      } else if (e.metaKey && e.key === "n") {
        createFile(openFiles, setOpenFiles);
      }
    });
  }, []);

  // #region functions

  /**
   * Create a new file
   * @param openFiles
   * @param setOpenFiles
   */
  function createFile(
    openFiles: Array<string>,
    setOpenFiles: (openFiles: Array<string>) => void,
  ) {
    setOpenFiles([...openFiles, ""]);
    navigate("/editor", { state: { activeFileIndex: openFiles.length } });
  }

  /**
   * Close a tab
   * @param index
   * @param openFiles
   * @param setOpenFiles
   */
  function closeTab(
    index: number,
    openFiles: Array<string>,
    setOpenFiles: (openFiles: Array<string>) => void,
  ) {
    if (openFiles.length === 1) {
      setOpenFiles([]);
    } else {
      setOpenFiles(openFiles.filter((_, i) => i !== index));
    }
  }

  // #endregion

  return (
    <div data-tauri-drag-region className={styles["title-bar"]}>
      <img
        className={styles["create-icon"]}
        src={create}
        alt="Create icon"
        onClick={() => createFile(openFiles, setOpenFiles)}
        title="Create new file"
      />
      {openFiles.map((file, index) => (
        <div
          key={index}
          className={`${styles["tab"]} ${
            index === activeFileIndex
              ? styles["active-tab"]
              : styles["inactive-tab"]
          }`}
          onClick={() => {
            navigate("/editor", { state: { activeFileIndex: index } });
          }}
        >
          <p className={styles["tab-label"]}>{file ? file : "New tab"}</p>
          <img
            className={styles["close-icon"]}
            src={close}
            alt="Close icon"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(index, openFiles, setOpenFiles);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default TitleBar;
