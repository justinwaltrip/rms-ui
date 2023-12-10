import "./NoFile.module.css";

import { FC } from "react";

const NoFile: FC = () => {
  return (
    <div className={styles["no-file"]}>
      <div className={styles["no-file-message"]}>No file selected</div>
    </div>
  );
};

export default NoFile;
