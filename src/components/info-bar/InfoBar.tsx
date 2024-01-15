import { FC, useContext, useEffect, useState } from "react";

import styles from "./InfoBar.module.css";
import { AppContext } from "../../main";
import { renameRecipe, writeRecipeContents } from "../../utils/fs";

interface InfoBarProps {
  filename: string;
  setFilename: (filename: string) => void;
  setDefaultTitle: (defaultTitle: string) => void;
}

const InfoBar: FC<InfoBarProps> = ({
  filename,
  setFilename,
  setDefaultTitle,
}) => {
  // #region contexts
  const appContext = useContext(AppContext);
  const { collectionPath } = appContext;
  // #endregion

  const [tempFilename, setTempFilename] = useState<string>(filename);

  /**
   * Update temp filename when filename changes
   */
  useEffect(() => {
    setTempFilename(filename);
  }, [filename]);

  return (
    <div className={styles["info-bar"]}>
      <input
        id="filename-input"
        className={styles["filename-input"]}
        type="text"
        value={tempFilename || ""}
        onChange={(e) => setTempFilename(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Tab" || e.key === "Enter") {
            // if original filename is non-empty, rename file
            if (filename && filename !== tempFilename) {
              renameRecipe(filename, tempFilename, collectionPath)
                .then(() => {
                  setFilename(tempFilename);
                })
                .catch((err) => {
                  console.error(err);
                });
            } else if (!filename && tempFilename) {
              // create recipe file
              writeRecipeContents(tempFilename, "{}", collectionPath)
                .then(() => {
                  setFilename(tempFilename);
                  setDefaultTitle(tempFilename);
                })
                .catch((err) => {
                  console.error(err);
                });
            }
          }
        }}
        autoCorrect="off"
        placeholder="filename"
      />
    </div>
  );
};

export default InfoBar;
