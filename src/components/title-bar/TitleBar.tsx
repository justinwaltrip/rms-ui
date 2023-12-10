/* eslint-disable prettier/prettier */
import { FC } from "react";

import styles from "./TitleBar.module.css";
import close from "../../assets/close.png";
import create from "../../assets/create.png";

interface TitleBarProps {
  openFiles: Array<string>;
  setOpenFiles: (openFiles: Array<string>) => void;
  activeFileIndex: number;
  setActiveFileIndex: (activeFileIndex: number) => void;
}

function createFile(
  openFiles: Array<string>,
  setOpenFiles: (openFiles: Array<string>) => void,
  setActiveFileIndex: (activeFileIndex: number) => void,
) {
  setOpenFiles([...openFiles, ""]);
  setActiveFileIndex(openFiles.length);
}

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

const TitleBar: FC<TitleBarProps> = ({
  openFiles,
  setOpenFiles,
  activeFileIndex,
  setActiveFileIndex,
}) => {
  document.addEventListener("keydown", (e) => {
    // on command + w, close the active tab
    if (e.metaKey && e.key === "w") {
      closeTab(activeFileIndex, openFiles, setOpenFiles);
      // on command + n, create a new tab
    } else if (e.metaKey && e.key === "n") {
      createFile(openFiles, setOpenFiles, setActiveFileIndex);
    }
  });
  return (
    <div data-tauri-drag-region className={styles["title-bar"]}>
      <img
        className={styles["create-icon"]}
        src={create}
        alt="Create icon"
        onClick={() => createFile(openFiles, setOpenFiles, setActiveFileIndex)}
      />
      {openFiles.map((file, index) => (
        <div
          key={index}
          className={`tab ${
            index === activeFileIndex ? "active-tab" : "inactive-tab"
          }`}
          onClick={() => setActiveFileIndex(index)}
        >
          <p className={styles["tab-label"]}>{file ? file : "New tab"}</p>
          <img
            className={styles["close-icon"]}
            src={close}
            alt="Close icon"
            onClick={() => closeTab(index, openFiles, setOpenFiles)}
          />
        </div>
      ))}
    </div>
  );
};

export default TitleBar;
