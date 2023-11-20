/* eslint-disable prettier/prettier */
import "./ViewEditor.css";
import { FC, useEffect, useState } from "react";

import source from "../../assets/source.png";
import { read, readImage, write } from "../../services/fs";
import {
  getDirections,
  getImage,
  getIngredients,
  getNotes,
  getTitle,
  parseFrontmatter,
  setFrontmatter as setFrontmatterMarkdown,
  setTitle as setTitleMarkdown,
} from "../../services/md";
import InfoBar from "../info-bar/InfoBar";
import Properties from "../properties/Properties";

interface ViewEditorProps {
  filename: string;
  setFilename: (filename: string) => void;
  setMode: (mode: "source" | "view") => void;
}

const ViewEditor: FC<ViewEditorProps> = ({ filename, setFilename, setMode }) => {
  const [fileLoaded, setFileLoaded] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState("");

  const [title, setTitle] = useState<string>("");
  const [alt, setAlt] = useState<string>("");
  const [image, setImage] = useState<string | undefined>("");
  const [frontmatter, setFrontmatter] = useState<{ [key: string]: unknown }>({});
  const [ingredients, setIngredients] = useState<{ name: string; checked: boolean }[]>(
    [],
  );
  const [directions, setDirections] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);

  /**
   * On tab load
   */
  useEffect(() => {
    if (filename) {
      // load markdown from file
      read(`${filename}.md`)
        .then((contents) => {
          setMarkdown(contents);
          setFileLoaded(true);
        })
        .catch((err) => console.error(err));
    } else {
      // prompt user to enter title
      document.getElementById("title-input")?.focus();
    }
  }, [filename]);

  /**
   * On markdown change
   */
  useEffect(() => {
    if (filename && fileLoaded) {
      write(`${filename}.md`, markdown)
        .then(() => {})
        .catch((err) => console.error(err));

      setTitle(getTitle(markdown));
      const { src, alt } = getImage(markdown);
      if (src) {
        readImage(src)
          .then((image) => setImage(image))
          .catch((err) => console.error(err));
      }
      if (alt) {
        setAlt(alt);
      }
      setFrontmatter(parseFrontmatter(markdown));
      setIngredients(getIngredients(markdown));
      setDirections(getDirections(markdown));
      setNotes(getNotes(markdown));
    }
  }, [markdown]);

  useEffect(() => {
    setMarkdown(setTitleMarkdown(markdown, title));
  }, [title]);

  useEffect(() => {
    setMarkdown(setFrontmatterMarkdown(markdown, frontmatter));
  }, [frontmatter]);

  return (
    <div className="view-page">
      <img
        className="source-icon"
        src={source}
        alt="Source icon"
        onClick={() => setMode("source")}
      />
      <div className="content">
        <InfoBar filename={filename} setFilename={setFilename} />
        <div className="view-editor">
          <input
            className="title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <img src={image} alt={alt} className="image" />
          <input
            className="description-input"
            type="text"
            value={frontmatter["description"]}
            onChange={(e) =>
              setFrontmatter({ ...frontmatter, description: e.target.value })
            }
          />
          <Properties frontmatter={frontmatter} setFrontmatter={setFrontmatter} />
          <h2>ingredients</h2>
          {ingredients.map(({ name, checked }, index) => (
            <div key={index} className="ingredient">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[index].checked = e.target.checked;
                  setIngredients(newIngredients);
                }}
              />
              <input
                className="ingredient-label"
                type="text"
                value={name}
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[index].name = e.target.value;
                  setIngredients(newIngredients);
                }}
              />
            </div>
          ))}
          <h2>directions</h2>
          {directions.map((direction, index) => (
            <div key={index} className="direction">
              <p>{`${index + 1}.`}</p>
              <input
                type="text"
                value={direction}
                onChange={(e) => {
                  const newDirections = [...directions];
                  newDirections[index] = e.target.value;
                  setDirections(newDirections);
                }}
              />
            </div>
          ))}
          <h2>notes</h2>
          {notes.map((note, index) => (
            <div key={index} className="note">
              <p>{`-`}</p>
              <input
                type="text"
                value={note}
                onChange={(e) => {
                  const newNotes = [...notes];
                  newNotes[index] = e.target.value;
                  setNotes(newNotes);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewEditor;
