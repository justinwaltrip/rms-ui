import { FC, useContext } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./SideBar.module.css";
import changeCollection from "../../assets/change-collection.png";
import grid from "../../assets/grid.png";
import { AppContext } from "../../main";
// import search from "../../assets/search.png";

const SideBar: FC = () => {
  // #region hooks
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const { setCollectionPath, setOpenFiles } = appContext;
  // #endregion

  return (
    <div className={styles["sidebar"]}>
      <div className={styles["sidebar-item"]}>
        <img
          className={styles["sidebar-icon"]}
          src={grid}
          alt="Grid icon"
          onClick={() => {
            navigate("/grid");
          }}
          title="Grid view"
        />
      </div>
      {/* <div className={styles["sidebar-item"]}>
        <img
          className={styles["sidebar-icon"]}
          src={search}
          alt="Search icon"
        />
      </div> */}
      <div className={styles["spacer"]} />
      <div className={styles["sidebar-item"]}>
        <img
          className={`${styles["change-collection-icon"]}`}
          src={changeCollection}
          alt="Change collection icon"
          onClick={() => {
            // reset app context
            setCollectionPath("");
            setOpenFiles([]);

            navigate("/");
          }}
          title="Change collection"
        />
      </div>
    </div>
  );
};

export default SideBar;
