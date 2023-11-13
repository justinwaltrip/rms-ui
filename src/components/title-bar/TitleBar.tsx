import "./TitleBar.css";
import { FC } from "react";

import close from "../../assets/close.png";
import create from "../../assets/create.png";

interface TitleBarProps {
  openFiles: Array<string>;
  setOpenFiles: (openFiles: Array<string>) => void;
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

const TitleBar: FC<TitleBarProps> = ({
  openFiles,
  setOpenFiles,
  setActiveFileIndex,
}) => (
  <div data-tauri-drag-region className="title-bar">
    <img
      className="create-icon"
      src={create}
      alt="Create icon"
      onClick={() => createFile(openFiles, setOpenFiles, setActiveFileIndex)}
    />
    {openFiles.map((file, index) => (
      <div key={index} className="tab">
        <p className="tab-label">{file ? file : "New tab"}</p>
        <img
          className="close-icon"
          src={close}
          alt="Close icon"
          onClick={() => {
            if (openFiles.length === 1) {
              setOpenFiles([]);
              setActiveFileIndex(-1);
            } else {
              setOpenFiles(openFiles.filter((_, i) => i !== index));
              setActiveFileIndex(
                index === openFiles.length - 1 ? index - 1 : index,
              );
            }
          }}
        />
      </div>
    ))}
  </div>
);

export default TitleBar;
