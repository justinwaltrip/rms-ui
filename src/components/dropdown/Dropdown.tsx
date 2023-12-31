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
      style={x && y ? { left: x, top: y, position: "absolute" } : {}}
    >
      {options.map((option, index) => (
        <div
          className={styles["option"]}
          key={index}
          tabIndex={0}
          onClick={option.onClick}
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault();
              option.onClick();
            }
          }}
        >
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
