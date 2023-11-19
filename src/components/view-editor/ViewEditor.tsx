import "./ViewEditor.css";
import { FC, useEffect, useState } from "react";

import source from "../../assets/source.png";
import { read, readImage } from "../../services/fs";
import { getImage, getTitle } from "../../services/md";
import InfoBar from "../info-bar/InfoBar";

interface ViewEditorProps {
  title: string;
  setTitle: (title: string) => void;
  setMode: (mode: "source" | "view") => void;
}

const ViewEditor: FC<ViewEditorProps> = ({ title, setTitle, setMode }) => {
  const [markdown, setMarkdown] = useState("");
  const [alt, setAlt] = useState<string>("");
  const [image, setImage] = useState<string | ArrayBuffer | null>("");

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
          <img src={image} alt={alt} />
        </div>
      </div>
    </div>
  );
};

export default ViewEditor;
