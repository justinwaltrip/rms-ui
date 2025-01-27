import { FC, useEffect, useRef, useState } from "react";

import styles from "./NotesList.module.css";
import AddButton from "../add-button/AddButton";

interface NotesListProps {
  notes: string[] | undefined;
  setNotes: (notes: string[]) => void;
  isEditingDisabled: boolean;
}

export const NotesList: FC<NotesListProps> = ({ ...props }) => {
  const { notes, setNotes, isEditingDisabled } = props;

  const newNoteRef = useRef<HTMLTextAreaElement>(null);
  const [newNoteIndex, setNewNoteIndex] = useState<number>(-1);

  /**
   * If new note, focus on note
   */
  useEffect(() => {
    if (newNoteIndex !== -1 && newNoteRef.current) {
      newNoteRef.current.focus();
      setNewNoteIndex(-1);
    }
  }, [newNoteIndex]);

  /**
   * On notes change, set height of notes
   */
  useEffect(() => {
    resizeNotes();
  }, [notes]);

  /**
   * Resize notes
   */
  function resizeNotes() {
    const notes = document.getElementsByClassName(styles["note-input"]);
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i] as HTMLTextAreaElement;
      note.style.height = "";
      note.style.height = note.scrollHeight + "px";
    }
  }

  return (
    <div>
      <h2>notes</h2>
      {notes &&
        notes.map((note, index) => (
          <div key={index} className={styles["note"]}>
            {/* dash */}
            <div>{`-`}</div>

            {/* note text */}
            <textarea
              rows={1}
              onInput={(e) => {
                e.currentTarget.style.height = "";
                e.currentTarget.style.height =
                  e.currentTarget.scrollHeight + "px";
              }}
              ref={newNoteIndex === index ? newNoteRef : null}
              value={note || ""}
              onChange={(e) => {
                const newNotes = [...notes];
                newNotes[index] = e.target.value;
                setNotes(newNotes);
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Backspace" &&
                  (e.currentTarget as HTMLTextAreaElement).value === ""
                ) {
                  e.preventDefault();

                  // remove note at index
                  const newNotes = [...notes];
                  newNotes.splice(index, 1);
                  setNotes(newNotes);
                } else if (e.key === "Enter") {
                  e.preventDefault();

                  // add new note at index + 1
                  const newNotes = [...notes];
                  newNotes.splice(index + 1, 0, "");
                  setNotes(newNotes);

                  // focus on new note
                  setNewNoteIndex(index + 1);
                }
              }}
              className={styles["note-input"]}
              disabled={isEditingDisabled}
            />
          </div>
        ))}
      <AddButton
        text="add note"
        onClick={() => {
          if (!isEditingDisabled) {
            if (!notes) {
              setNotes([""]);
              setNewNoteIndex(0);
            } else {
              // add new note at end
              const newNotes = [...notes];
              newNotes.push("");
              setNotes(newNotes);

              // focus on new note
              setNewNoteIndex(newNotes.length - 1);
            }
          }
        }}
      />
    </div>
  );
};
