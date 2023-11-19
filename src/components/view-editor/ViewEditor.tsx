/* eslint-disable prettier/prettier */
import "./ViewEditor.css";
import { FC, useEffect, useState } from "react";

import source from "../../assets/source.png";
import { read, readImage } from "../../services/fs";
import {
  getDirections,
  getImage,
  getIngredients,
  getNotes,
  getTitle,
  parseFrontmatter,
} from "../../services/md";
import InfoBar from "../info-bar/InfoBar";

interface ViewEditorProps {
  title: string;
  setTitle: (title: string) => void;
  setMode: (mode: "source" | "view") => void;
}

const ViewEditor: FC<ViewEditorProps> = ({ title, setTitle, setMode }) => {
  const [markdown, setMarkdown] = useState("");
  const [alt, setAlt] = useState<string>("");
  const [image, setImage] = useState<string | undefined>("");
  const [frontmatter, setFrontmatter] = useState<{ [key: string]: string }>({});
  const [ingredients, setIngredients] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [directions, setDirections] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);

  /**
   * On tab load
   */
  useEffect(() => {
    if (title) {
      // load markdown from file
      read(`${title}.md`)
        .then((contents) => setMarkdown(contents))
        .catch((err) => console.error(err));
    } else {
      // prompt user to enter title
      document.getElementById("title-input")?.focus();
    }
  }, [title]);

  /**
   * On markdown change
   */
  useEffect(() => {
    const { src, alt } = getImage(markdown);
    if (src) {
      readImage(src)
        .then((image) => setImage(image))
        .catch((err) => console.error(err));
    }
    if (alt) {
      setAlt(alt);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    setFrontmatter(parseFrontmatter(markdown));
    setIngredients(getIngredients(markdown));
    setDirections(getDirections(markdown));
    setNotes(getNotes(markdown));
  }, [markdown]);

  return (
    <div className="view-page">
      <img
        className="source-icon"
        src={source}
        alt="Source icon"
        onClick={() => setMode("source")}
      />
      <div className="content">
        <InfoBar title={title} setTitle={setTitle} />
        <div className="view-editor">
          <h1>{getTitle(markdown)}</h1>
          <img src={image} alt={alt} className="image" />
          <p>{frontmatter["description"]}</p>
          <h2>ingredients</h2>
          {Object.keys(ingredients).map((ingredient) => (
            <div key={ingredient} className="ingredient">
              <input
                type="checkbox"
                checked={ingredients[ingredient]}
                onChange={() => {
                  ingredients[ingredient] = !ingredients[ingredient];
                  setIngredients({ ...ingredients });
                }}
              />
              <p className="ingredient-label">{ingredient}</p>
            </div>
          ))}
          <h2>directions</h2>
          {directions.map((direction, index) => (
            <p className="direction" key={index}>{`${
              index + 1
            }. ${direction}`}</p>
          ))}
          <h2>notes</h2>
          {notes.map((note, index) => (
            <p className="note" key={index}>{`- ${note}`}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewEditor;
