import { FC, useEffect, useState } from "react";

// import styles from "./Editor.module.css";
import NoFile from "../../components/no-file/NoFile";
import SideBar from "../../components/sidebar/SideBar";
import SourceEditor from "../../components/source-editor/SourceEditor";
import TitleBar from "../../components/title-bar/TitleBar";
import ViewEditor from "../../components/view-editor/ViewEditor";

const Editor: FC = () => {
  // #region states
  // TODO remove
  const [openFiles, setOpenFiles] = useState<Array<string>>(["test"]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [mode, setMode] = useState<"source" | "view">("view");
  // const [openFiles, setOpenFiles] = useState<Array<string>>([]);
  // const [activeFileIndex, setActiveFileIndex] = useState<number>(-1);
  // const [mode, setMode] = useState<"source" | "view">("view");
  // #endregion

  // #region effects
  useEffect(() => {
    // update activeFileIndex when openFiles changes
    if (openFiles.length > 0) {
      setActiveFileIndex(openFiles.length - 1);
    } else {
      setActiveFileIndex(-1);
    }
  }, [openFiles]);
  // #endregion

  return (
    <div>
      <TitleBar
        openFiles={openFiles}
        setOpenFiles={setOpenFiles}
        activeFileIndex={activeFileIndex}
        setActiveFileIndex={setActiveFileIndex}
      />
      <SideBar />
      {activeFileIndex === -1 ? (
        <NoFile />
      ) : mode === "view" ? (
        <ViewEditor
          filename={openFiles[activeFileIndex]}
          setFilename={(title: string) => {
            const newOpenFiles = [...openFiles];
            newOpenFiles[activeFileIndex] = title;
            setOpenFiles(newOpenFiles);
          }}
          setMode={setMode}
        />
      ) : (
        <SourceEditor
          filename={openFiles[activeFileIndex]}
          setFilename={(title: string) => {
            const newOpenFiles = [...openFiles];
            newOpenFiles[activeFileIndex] = title;
            setOpenFiles(newOpenFiles);
          }}
          setMode={setMode}
        />
      )}
    </div>
  );
};

export default Editor;
