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
import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
import { FC, useEffect, useRef, useState } from "react";

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
  //     `);
  const [markdown, setMarkdown] = useState("");

  const ref = useRef<MDXEditorMethods>(null);

  /**
   * If title is empty, set focus to title input
   */
  useEffect(() => {
    if (!title) {
      document.getElementById("title-input")?.focus();
    }
  }, []);

  async function write() {
    // write markdown to file
    await writeTextFile(`${title}.md`, markdown, { dir: BaseDirectory.Home });
  }

  /**
   * If title is non-empty, write markdown to file
   */
  useEffect(() => {
    if (title) {
      write()
        .then(() => {})
        .catch((err) => console.error(err));
    }
  }, [title, markdown]);

  /**
   * Check if markdown has changed every 5 seconds
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
        </div>
      </div>
    </div>
  );
};

export default SourceEditor;
