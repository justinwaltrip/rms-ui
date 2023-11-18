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
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { FC, useEffect, useRef, useState } from "react";

import view from "../../assets/view.png";
import InfoBar from "../info-bar/InfoBar";

interface SourceEditorProps {
  title: string;
  setTitle: (title: string) => void;
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

const SourceEditor: FC<SourceEditorProps> = ({ title, setTitle }) => {
  const [markdown, setMarkdown] = useState("");

  const ref = useRef<MDXEditorMethods>(null);

  /**
   * Write markdown to file
   */
  async function write() {
    try {
      // write markdown to file
      await writeTextFile(`${title}.md`, markdown, { dir: BaseDirectory.Home });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * Read markdown from file
   */
  async function read() {
    try {
      // read markdown from file
      const contents = await readTextFile(`${title}.md`, {
        dir: BaseDirectory.Home,
      });
      ref.current?.setMarkdown(contents);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * On tab load
   */
  useEffect(() => {
    if (title) {
      // load markdown from file
      read()
        .then(() => {})
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
      write()
        .then(() => {})
        .catch((err) => console.error(err));
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
      <img className="view-icon" src={view} alt="View icon" />
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
