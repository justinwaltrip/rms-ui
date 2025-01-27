import React, { FC, useEffect, useRef, useState } from "react";

import styles from "./DirectionsList.module.css";
import AddButton from "../add-button/AddButton";

interface DirectionsListProps {
  directions: string[] | undefined;
  setDirections: (directions: string[]) => void;
  isEditingDisabled: boolean;
}

export const DirectionsList: FC<DirectionsListProps> = ({ ...props }) => {
  const { directions, setDirections, isEditingDisabled } = props;
  const newDirectionRef = useRef<HTMLTextAreaElement>(null);
  const [newDirectionIndex, setNewDirectionIndex] = useState<number>(-1);

  /**
   * If new direction, focus on direction
   */
  useEffect(() => {
    if (newDirectionIndex !== -1 && newDirectionRef.current) {
      // focus at end of text
      const direction = newDirectionRef.current;
      direction.focus();
      const length = direction.value.length;
      direction.setSelectionRange(length, length);
      setNewDirectionIndex(-1);
    }
  }, [newDirectionIndex]);

  /**
   * Resize directions
   */
  function resizeDirections() {
    const directions = document.getElementsByClassName(
      styles["direction-input"],
    );
    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i] as HTMLTextAreaElement;
      direction.style.height = "";
      direction.style.height = direction.scrollHeight + "px";
    }
  }

  /**
   * On mount, add listener for resize
   */
  useEffect(() => {
    window.addEventListener("resize", resizeDirections);
    return () => window.removeEventListener("resize", resizeDirections);
  }, []);

  /**
   * On directions change, set height of directions
   */
  useEffect(() => {
    resizeDirections();
  }, [directions]);

  return (
    <React.Fragment>
      <h2>directions</h2>
      {directions && (
        <div className={styles["directions"]}>
          {directions.map((direction, index) => (
            <div key={index} className={styles["direction"]}>
              {/* direction number */}
              <div>{`${index + 1}.`}</div>

              {/* direction text */}
              <textarea
                rows={1}
                onInput={(e) => {
                  e.currentTarget.style.height = "";
                  e.currentTarget.style.height =
                    e.currentTarget.scrollHeight + "px";
                }}
                className={styles["direction-input"]}
                ref={newDirectionIndex === index ? newDirectionRef : null}
                value={direction || ""}
                onChange={(e) => {
                  const newDirections = [...directions];
                  newDirections[index] = e.target.value;
                  setDirections(newDirections);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    (e.currentTarget as HTMLTextAreaElement).value === ""
                  ) {
                    e.preventDefault();

                    // remove direction at index
                    const newDirections = [...directions];
                    newDirections.splice(index, 1);
                    setDirections(newDirections);

                    // focus on previous direction
                    if (index > 0) {
                      const directionDiv = document.getElementsByClassName(
                        styles["direction"],
                      )[index - 1] as HTMLTextAreaElement;
                      const direction =
                        directionDiv.getElementsByTagName("textarea")[0];
                      direction.focus();
                    }
                  } else if (e.key === "Enter") {
                    e.preventDefault();

                    // add new direction at index + 1
                    const newDirections = [...directions];
                    newDirections.splice(index + 1, 0, "");
                    setDirections(newDirections);

                    // focus on new direction
                    setNewDirectionIndex(index + 1);
                  }
                }}
                onPaste={(e) => {
                  // if pasting multiple lines, split into multiple directions
                  const clipboardData = e.clipboardData.getData("Text");
                  const clipboardLines = clipboardData.split("\n");
                  if (clipboardLines.length > 1) {
                    e.preventDefault();

                    // append first line to current direction
                    const newDirections = [...directions];
                    newDirections[index] += clipboardLines[0];

                    // add new directions for remaining lines
                    for (let i = 1; i < clipboardLines.length; i++) {
                      newDirections.splice(index + i, 0, clipboardLines[i]);
                    }
                    setDirections(newDirections);

                    // focus on last new direction
                    setNewDirectionIndex(index + clipboardLines.length - 1);
                  }
                }}
                disabled={isEditingDisabled}
              />
            </div>
          ))}
        </div>
      )}
      <AddButton
        text="add direction"
        onClick={() => {
          if (!isEditingDisabled) {
            if (!directions) {
              setDirections([""]);
              setNewDirectionIndex(0);
            } else {
              // add new direction at end
              const newDirections = [...directions];
              newDirections.push("");
              setDirections(newDirections);

              // focus on new direction
              setNewDirectionIndex(newDirections.length - 1);
            }
          }
        }}
      />
    </React.Fragment>
  );
};
