import "./Editor.css";

import { BaseDirectory, exists, writeBinaryFile } from "@tauri-apps/api/fs";
import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import fakeRecipe from "../../../test/fake-recipe.json";
import recipeImageBase64 from "../../../test/recipe-image.txt";
import NoFile from "../../components/no-file/NoFile";
import SideBar from "../../components/sidebar/SideBar";
import SourceEditor from "../../components/source-editor/SourceEditor";
import TitleBar from "../../components/title-bar/TitleBar";
import ViewEditor from "../../components/view-editor/ViewEditor";
import { writeRecipe } from "../../utils/fs";

const Editor: FC = () => {
  const [, setCollectionName] = useState<string>("");
  const [collectionPath, setCollectionPath] = useState<string>("");

  // TODO remove
  const [openFiles, setOpenFiles] = useState<Array<string>>(["test"]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [mode, setMode] = useState<"source" | "view">("view");
  // const [openFiles, setOpenFiles] = useState<Array<string>>([]);
  // const [activeFileIndex, setActiveFileIndex] = useState<number>(-1);
  // const [mode, setMode] = useState<"source" | "view">("view");

  const location = useLocation();

  // TODO remove
  useEffect(() => {
    if (collectionPath) {
      // check if test.json exists
      exists(`${collectionPath}/recipes/test.json`)
        .then((exists) => {
          if (!exists) {
            // create test.json file
            writeRecipe("test", fakeRecipe, collectionPath)
              .then(() => {})
              .catch((err) => console.error(err));
          }
        })
        .catch((err) => console.error(err));
      // check if .rms/attachments/recipe-image.png exists
      exists(`${collectionPath}/recipes/.rms/attachments/recipe-image.png`)
        .then((exists) => {
          if (!exists) {
            // write recipe-image.png file
            const recipeImage = Buffer.from(recipeImageBase64, "base64");
            writeBinaryFile(
              `${collectionPath}/recipes/.rms/attachments/recipe-image.png`,
              recipeImage,
              { dir: BaseDirectory.Home },
            )
              .then(() => {})
              .catch((err) => console.error(err));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [collectionPath]);

  useEffect(() => {
    if (location.state !== null && typeof location.state === "object") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const collection = location.state["collection"];
      if (collection !== null && typeof collection === "object") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const name = collection["name"];
        if (name !== null && typeof name === "string") {
          setCollectionName(name);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const path = collection["path"];
        if (path !== null && typeof path === "string") {
          setCollectionPath(path);
        }
      }
    }
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
          collectionPath={collectionPath}
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
          collectionPath={collectionPath}
        />
      )}
    </div>
  );
};

export default Editor;
