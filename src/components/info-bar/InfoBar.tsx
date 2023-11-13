import "./InfoBar.css";
import { FC, useState } from "react";

interface InfoBarProps {
  title: string;
  setTitle: (title: string) => void;
}

const InfoBar: FC<InfoBarProps> = ({ title, setTitle }) => {
  const [titleInput, setTitleInput] = useState<string>(title);

  return (
    <div className="info-bar">
      <input
        id="title-input"
        type="text"
        defaultValue={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        // on tab, set title
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            setTitle(titleInput);
          }
        }}
      />
    </div>
  );
};

export default InfoBar;
