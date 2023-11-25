import "./Editor.css";
import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import NoFile from "../../components/no-file/NoFile";
import SideBar from "../../components/sidebar/SideBar";
import SourceEditor from "../../components/source-editor/SourceEditor";
import TitleBar from "../../components/title-bar/TitleBar";
import ViewEditor from "../../components/view-editor/ViewEditor";

const Editor: FC = () => {
  const [openFiles, setOpenFiles] = useState<Array<string>>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(-1);

  const [mode, setMode] = useState<"source" | "view">("view");

  const location = useLocation();

  useEffect(() => {
    console.log(location.state);
  }, [location]);

  useEffect(() => {
    // update activeFileIndex when openFiles changes
    if (openFiles.length > 0) {
      setActiveFileIndex(openFiles.length - 1);
    } else {
      setActiveFileIndex(-1);
    }
  }, [openFiles]);

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
