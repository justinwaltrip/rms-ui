import { FC } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./SideBar.module.css";
import changeCollection from "../../assets/change-collection.png";
import search from "../../assets/search.png";

const SideBar: FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["sidebar"]}>
      <div className={styles["sidebar-item"]}>
        <img className={styles["search-icon"]} src={search} alt="Search icon" />
      </div>
      <div className={styles["spacer"]} />
      <div className={styles["sidebar-item"]}>
        <img
          className={styles["change-collection-icon"]}
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
