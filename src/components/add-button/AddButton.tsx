import { FC } from "react";

import styles from "./AddButton.module.css";
import add from "../../assets/add.png";

interface AddButtonProps {
  onClick: (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  text: string;
}

const AddButton: FC<AddButtonProps> = ({ onClick, text }) => {
  return (
    <div
      className={styles["add-button"]}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          onClick(e);
        }
      }}
    >
      <img src={add} alt="add" className={styles["add-icon"]} />
      <p className={styles["add-button-text"]}>{text}</p>
    </div>
  );
};

export default AddButton;
