import "@mdxeditor/editor/style.css";

import "./SourceEditor.css";
import {
  MDXEditor,
  diffSourcePlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  listsPlugin,
} from "@mdxeditor/editor";
import { FC, useState, useEffect } from "react";

import view from "../../assets/view.png";
import InfoBar from "../info-bar/InfoBar";


interface SourceEditorProps {
  title: string;
  setTitle: (title: string) => void;
}


const SourceEditor: FC<SourceEditorProps> = ({ title, setTitle }) => {
//   const [markdown, setMarkdown] = useState(`
// ---
// tags: 
// - tag 1
// - tag 2
// date: year-month-day
// source: url
// rating: integer
// prep: minutes
// cook: minutes
// servings: serving size
// ---

// # title

// ![image](/source/path)

// description paragraph

// ## ingredients
// - [ ] first ingredient 
// - [ ] second ingredient

// ## directions
// 1. step one
// 2. step two

// ## notes
// - first note
// - second note
//   `);
  const [markdown, setMarkdown] = useState("");

  /**
   * If title is empty, set focus to title input
   */
  useEffect(() => {
    if (!title) {
      document.getElementById("title-input")?.focus();
    }
  }, []);

  /**
   * If title is non-empty, write markdown to file
   */
  useEffect(() => {
    if (title) {
      // write markdown to file
    }
  }, [title]);

  return (
    <div className="source-page">
      <img className="view-icon" src={view} alt="View icon" />
      <div className="content">
        <InfoBar title={title} setTitle={setTitle} />
        <div className="md-editor">
          <MDXEditor
            markdown={markdown}
            plugins={[
              headingsPlugin(),
              imagePlugin(),
              listsPlugin(),
              frontmatterPlugin(),
              diffSourcePlugin({ viewMode: "source" }),
            ]}
            onChange={setMarkdown}
            contentEditableClassName="prose"
          />
        </div>
      </div>
    </div>
  );
};

export default SourceEditor;
