import "./SideBar.css";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import changeCollection from "../../assets/change-collection.png";
import search from "../../assets/search.png";

const SideBar: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="sidebar-item">
        <img className="search-icon" src={search} alt="Search icon" />
      </div>
      <div className="spacer" />
      <div className="sidebar-item">
        <img
          className="change-collection-icon"
          src={changeCollection}
          alt="Change collection icon"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};

export default SideBar;
