import { FC } from "react";

import styles from "./NoFile.module.css";

const NoFile: FC = () => {
  return (
    <div className={styles["no-file"]}>
      <div className={styles["no-file-message"]}>No file selected</div>
    </div>
  );
};

export default NoFile;
