import "./InfoBar.css";
import { FC, useEffect, useState } from "react";

interface InfoBarProps {
  filename: string;
  setFilename: (filename: string) => void;
}

const InfoBar: FC<InfoBarProps> = ({ filename, setFilename }) => {
  const [tempFilename, setTempFilename] = useState<string>(filename);

  useEffect(() => {
    setTempFilename(filename);
  }, [filename]);

  return (
    <div className="info-bar">
      <input
        id="title-input"
        type="text"
        value={tempFilename}
        onChange={(e) => setTempFilename(e.target.value)}
        // on tab, set title
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            setFilename(tempFilename);
          }
        }}
      />
    </div>
  );
};

export default InfoBar;
