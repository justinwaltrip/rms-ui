import { FC, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./TitleBar.module.css";
import close from "../../assets/close.png";
import create from "../../assets/create.png";
import { AppContext } from "../../main";

interface TitleBarProps {
  activeFileIndex: number;
}

const TitleBar: FC<TitleBarProps> = ({ activeFileIndex }) => {
  // #region contexts
  const navigate = useNavigate();
  const { openFiles, setOpenFiles } = useContext(AppContext);
  // #endregion

  /**
   * On mount, register keydown events
   */
  useEffect(() => {
    /**
     * command + w: close the active tab
     * command + n: create a new tab
     * command + 1-9: switch to the tab
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "w") {
        closeTab();
      } else if (e.metaKey && e.key === "n") {
        createFile();
      } else if (e.metaKey && !isNaN(parseInt(e.key))) {
        const index = parseInt(e.key) - 1;
        if (index < openFiles.length) {
          navigate("/editor", { state: { activeFileIndex: index } });
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeFileIndex, openFiles, setOpenFiles]);

  // #region functions

  /**
   * Create a new file
   * @param openFiles
   * @param setOpenFiles
   */
  function createFile() {
    setOpenFiles([...openFiles, ""]);
    navigate("/editor", { state: { activeFileIndex: openFiles.length } });
  }

  /**
   * Close a tab
   * @param index
   * @param openFiles
   * @param setOpenFiles
   */
  function closeTab() {
    if (openFiles.length === 1) {
      setOpenFiles([]);
    } else {
      setOpenFiles(openFiles.filter((_, i) => i !== activeFileIndex));
    }
  }

  // #endregion

  return (
    <div data-tauri-drag-region className={styles["title-bar"]}>
      <img
        className={styles["create-icon"]}
        src={create}
        alt="Create icon"
        onClick={() => createFile()}
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
          <p className={styles["tab-label"]}>{file ? file : "new tab"}</p>
          <img
            className={styles["close-icon"]}
            src={close}
            alt="Close icon"
            onClick={(e) => {
              e.stopPropagation();
              closeTab();
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default TitleBar;
