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
import { FC, useState } from "react";

import view from "../../assets/view.png";
import InfoBar from "../info-bar/InfoBar";

const Source: FC = () => {
  const [value, setValue] = useState(`
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
  `);
  return (
    <div className="source-page">
      <img className="view-icon" src={view} alt="View icon" />
      <div className="content">
        <InfoBar />
        <div className="md-editor">
          <MDXEditor
            markdown={value}
            plugins={[
              headingsPlugin(),
              imagePlugin(),
              listsPlugin(),
              frontmatterPlugin(),
              diffSourcePlugin({ viewMode: "source" }),
            ]}
            onChange={setValue}
            contentEditableClassName="prose"
          />
        </div>
      </div>
    </div>
  );
};

export default Source;
