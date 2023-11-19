import "@mdxeditor/editor/style.css";

import "./SourceEditor.css";
import {
  MDXEditor,
  MDXEditorMethods,
  diffSourcePlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  listsPlugin,
} from "@mdxeditor/editor";
import { FC, useEffect, useRef, useState } from "react";

import view from "../../assets/view.png";
// TODO remove
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { read, write } from "../../services/fs";
import InfoBar from "../info-bar/InfoBar";

interface SourceEditorProps {
  title: string;
  setTitle: (title: string) => void;
  setMode: (mode: "source" | "view") => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultMarkdown = `
  ---
  tags:
  - tag 1
  - tag 2
  date: year-month-day
  source: url
  rating: integer
  prep: minutes
  cook: minutes
  servings: serving size
  ---

  # title

  ![image](/source/path)

  description paragraph

  ## ingredients
  - [ ] first ingredient
  - [ ] second ingredient

  ## directions
  1. step one
  2. step two

  ## notes
  - first note
  - second note
`;

const SourceEditor: FC<SourceEditorProps> = ({ title, setTitle, setMode }) => {
  const [markdown, setMarkdown] = useState("");

  const ref = useRef<MDXEditorMethods>(null);

  /**
   * On tab load
   */
  useEffect(() => {
    if (title) {
      // load markdown from file
      read(`${title}.md`)
        .then((contents) => ref.current?.setMarkdown(contents))
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
    if (title) {
      // TODO prevent data loss
      // write(`${title}.md`, markdown)
      //   .then(() => {})
      //   .catch((err) => console.error(err));
    }
  }, [markdown]);

  /**
   * Every 5 seconds, get markdown from editor and update state
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const newMarkdown = ref.current?.getMarkdown();
      if (markdown !== newMarkdown) {
        setMarkdown(newMarkdown || "");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="source-page">
      <img
        className="view-icon"
        src={view}
        alt="View icon"
        onClick={() => setMode("view")}
      />
      <div className="content">
        <InfoBar title={title} setTitle={setTitle} />
        <div className="md-editor">
          {title && (
            <MDXEditor
              ref={ref}
              markdown={markdown}
              plugins={[
                headingsPlugin(),
                imagePlugin(),
                listsPlugin(),
                frontmatterPlugin(),
                diffSourcePlugin({ viewMode: "source" }),
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceEditor;
