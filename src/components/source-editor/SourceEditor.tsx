import { FC, useContext, useEffect, useState } from "react";

import styles from "./SourceEditor.module.css";
import view from "../../assets/view.png";
import { AppContext } from "../../main";
import { readRecipeContents, writeRecipeContents } from "../../utils/fs";
import InfoBar from "../info-bar/InfoBar";

interface SourceEditorProps {
  filename: string;
  setFilename: (filename: string) => void;
  setMode: (mode: "source" | "view") => void;
}

const SourceEditor: FC<SourceEditorProps> = ({
  filename,
  setFilename,
  setMode,
}) => {
  // #region contexts
  const appContext = useContext(AppContext);
  const { collectionPath } = appContext;
  // #endregion

  // #region states
  const [fileLoaded, setFileLoaded] = useState(false);
  const [json, setJson] = useState("");
  // #endregion

  // #region effects

  /**
   * On tab load
   */
  useEffect(() => {
    if (filename && collectionPath) {
      // load markdown from file
      readRecipeContents(filename, collectionPath)
        .then((json) => {
          setJson(json);
          setFileLoaded(true);
        })
        .catch((err) => console.error(err));
    } else {
      // prompt user to enter title
      document.getElementById("filename-input")?.focus();
    }
  }, [filename, collectionPath]);

  /**
   * On markdown change
   */
  useEffect(() => {
    if (filename && fileLoaded) {
      writeRecipeContents(filename, json, collectionPath)
        .then(() => {})
        .catch((err) => console.error(err));
    }
  }, [json]);

  // #endregion

  return (
    <div className={styles["source-page"]}>
      <img
        className={styles["view-icon"]}
        src={view}
        alt="View icon"
        onClick={() => setMode("view")}
      />
      <div className={styles["source-editor-content"]}>
        <InfoBar filename={filename} setFilename={setFilename} />
        <div className={styles["json-editor"]}>
          {filename && (
            <textarea
              className={styles["json-input"]}
              value={json}
              onChange={(e) => setJson(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceEditor;
