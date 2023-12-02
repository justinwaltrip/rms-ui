import "./Properties.css";
import { FC } from "react";

import cook from "../../assets/cook.png";
import date from "../../assets/date.png";
import link from "../../assets/link.png";
import prep from "../../assets/prep.png";
import remove from "../../assets/remove.png";
import servings from "../../assets/servings.png";
import tags from "../../assets/tags.png";
import { Recipe } from "../../utils/recipe";

const PropertyLabel: FC<{
  label: string;
  src: string;
}> = ({ label, src }) => {
  return (
    <div className="grid-item">
      <img src={src} alt="tags" className="icon" />
      <p className="label">{label}</p>
    </div>
  );
};

interface PropertiesProps {
  recipe: Recipe | null;
}

const Properties: FC<PropertiesProps> = ({ recipe }) => {
  const Tag = ({ tag }: { tag: string }) => {
    return (
      <div className="tag">
        <p>{tag}</p>
        <img
          src={remove}
          alt="remove"
          className="remove-icon"
          // onClick={() => {
          //   if (Array.isArray(frontmatter["tags"])) {
          //     const newTags = frontmatter["tags"].filter(
          //       (t: string) => t !== tag,
          //     );
          //     setFrontmatter({ ...frontmatter, tags: newTags });
          //   }
          // }}
        />
      </div>
    );
  };

  return (
    <div className="grid-container">
      <PropertyLabel label="tags" src={tags} />
      <div className="grid-item">
        {recipe &&
          recipe.tags.map((tag: string, index: number) => (
            <Tag tag={tag} key={index} />
          ))}
      </div>
      <PropertyLabel label="date" src={date} />
      <div className="grid-item">
        <input
          type="date"
          value={recipe ? recipe.date : ""}
          // onChange={(e) =>
          //   setFrontmatter &&
          //   setFrontmatter({ ...frontmatter, date: e.target.value })
          // }
        />
      </div>
      <PropertyLabel label="source" src={link} />
      <div className="grid-item">
        <input
          type="text"
          value={recipe ? recipe.source : ""}
          // onChange={(e) =>
          //   setFrontmatter &&
          //   setFrontmatter({ ...frontmatter, source: e.target.value })
          // }
        />
      </div>
      <PropertyLabel label="prep" src={prep} />
      <div className="grid-item">
        <input
          type="text"
          value={recipe ? recipe.prep.toString() : ""}
          // onChange={(e) =>
          //   setFrontmatter &&
          //   setFrontmatter({ ...frontmatter, prep: e.target.value })
          // }
        />
      </div>
      <PropertyLabel label="cook" src={cook} />
      <div className="grid-item">
        <input
          type="text"
          value={recipe ? recipe.cook.toString() : ""}
          // onChange={(e) =>
          //   setFrontmatter &&
          //   setFrontmatter({ ...frontmatter, cook: e.target.value })
          // }
        />
      </div>
      <PropertyLabel label="servings" src={servings} />
      <div className="grid-item">
        <input
          type="text"
          value={recipe ? recipe.servings.toString() : ""}
          // onChange={(e) =>
          //   setFrontmatter &&
          //   setFrontmatter({ ...frontmatter, servings: e.target.value })
          // }
        />
      </div>
    </div>
  );
};

export default Properties;
