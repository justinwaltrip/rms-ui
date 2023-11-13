import "./InfoBar.css";
import { FC } from "react";

interface InfoBarProps {
  title: string;
  setTitle: (title: string) => void;
}

const InfoBar: FC<InfoBarProps> = ({ title, setTitle }) => {
  return (
    <div className="info-bar">
      <input
        className="title"
        type="text"
        defaultValue={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
};

export default InfoBar;
