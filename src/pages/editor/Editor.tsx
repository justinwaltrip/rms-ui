import { FC, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import NoFile from "../../components/no-file/NoFile";
import SideBar from "../../components/sidebar/SideBar";
import SourceEditor from "../../components/source-editor/SourceEditor";
import TitleBar from "../../components/title-bar/TitleBar";
import ViewEditor from "../../components/view-editor/ViewEditor";
import { AppContext } from "../../main";

const Editor: FC = () => {
  // #region contexts
  const appContext = useContext(AppContext);
  const { openFiles, setOpenFiles } = appContext;
  const location = useLocation();
  // #endregion

  // #region states
  const [activeFileIndex, setActiveFileIndex] = useState<number>(-1);
  const [mode, setMode] = useState<"source" | "view">("view");
  // #endregion

  // #region effects

  /**
   * Update activeFileIndex when openFiles changes
   */
  useEffect(() => {
    if (openFiles.length > 0) {
      setActiveFileIndex(openFiles.length - 1);
    } else {
      setActiveFileIndex(-1);
    }
  }, [openFiles]);

  /**
   * Get activeFileIndex from location.state
   */
  useEffect(() => {
    if (location.state) {
      const { activeFileIndex } = location.state as {
        activeFileIndex: number;
      };
      setActiveFileIndex(activeFileIndex);

      // remove activeFileIndex from location.state
      location.state = undefined;
    }
  }, [location.state]);

  // #endregion

  return (
    <div>
      <TitleBar
        openFiles={openFiles}
        setOpenFiles={setOpenFiles}
        activeFileIndex={activeFileIndex}
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
