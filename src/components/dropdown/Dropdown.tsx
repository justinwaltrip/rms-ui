import { FC } from "react";

import styles from "./Dropdown.module.css";

interface DropdownProps {
  options: Array<{
    onClick: () => void;
    icon: string;
    text: string;
  }>;
  x?: number | undefined;
  y?: number | undefined;
}

const Dropdown: FC<DropdownProps> = ({ options, x, y }) => {
  return (
    <div
      className={styles["dropdown"]}
      style={{
        left: x,
        top: y,
      }}
    >
      {options.map((option, index) => (
        <div className={styles["option"]} key={index} onClick={option.onClick}>
          <img
            src={option.icon}
            alt="Folder"
            className={styles["option-icon"]}
          />
          <div className={styles["option-text"]}>{option.text}</div>
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
