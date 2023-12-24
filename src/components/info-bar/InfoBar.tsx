import { FC, useEffect, useState } from "react";

import styles from "./InfoBar.module.css";

interface InfoBarProps {
  filename: string;
  setFilename: (filename: string) => void;
}

const InfoBar: FC<InfoBarProps> = ({ filename, setFilename }) => {
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
        id="title-input"
        type="text"
        value={tempFilename}
        onChange={(e) => setTempFilename(e.target.value)}
        onKeyDown={(e) => {
          // on tab, set title
          if (e.key === "Tab") {
            setFilename(tempFilename);
          }
        }}
      />
    </div>
  );
};

export default InfoBar;
