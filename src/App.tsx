import "./App.css";
import { FC, useState } from "react";

import NoFile from "./components/no-file/NoFile";
import SideBar from "./components/sidebar/SideBar";
import SourceEditor from "./components/source-editor/SourceEditor";
import TitleBar from "./components/title-bar/TitleBar";

const App: FC = () => {
  const [openFiles, setOpenFiles] = useState<Array<string>>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(-1);

  return (
    <div>
      <TitleBar
        openFiles={openFiles}
        setOpenFiles={setOpenFiles}
        setActiveFileIndex={setActiveFileIndex}
      />
      <SideBar />
      {activeFileIndex === -1 ? <NoFile /> : <SourceEditor />}
    </div>
  );
};

export default App;
