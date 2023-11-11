import "./TitleBar.css";
import { FC } from "react";
import create from "../../assets/create.png";

const TitleBar: FC = () => (
  <div data-tauri-drag-region className="title-bar">
    <img className="create-icon" src={create} alt="Create icon" />
  </div>
);

export default TitleBar;
