import "./SideBar.css";
import { FC } from "react";

import search from "../../assets/search.png";

const SideBar: FC = () => (
  <div className="sidebar">
    <div className="sidebar-item">
      <img className="search-icon" src={search} alt="Search icon" />
    </div>
  </div>
);

export default SideBar;
