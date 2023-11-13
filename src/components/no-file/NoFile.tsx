import "./NoFile.css";

import { FC } from "react";

const NoFile: FC = () => {
  return (
    <div className="no-file">
      <div className="no-file-message">No file selected</div>
    </div>
  );
};

export default NoFile;
