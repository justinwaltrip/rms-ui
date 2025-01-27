import React, { FC } from "react";

import styles from "./RecipeHeader.module.scss";
import { ImageUploader } from "../image-uploader/ImageUploader";

interface RecipeHeaderProps {
  title: string | undefined;
  setTitle: (title: string) => void;
  description: string | undefined;
  setDescription: (description: string) => void;
  image: string | undefined;
  setImage: (image: string) => void;
  isEditingDisabled: boolean;
  collectionPath: string;
}

export const RecipeHeader: FC<RecipeHeaderProps> = ({ ...props }) => {
  return (
    <React.Fragment>
      <textarea
        className={styles["title-input"]}
        value={props.title || ""}
        onChange={(e) => props.setTitle(e.target.value)}
        placeholder="title"
        disabled={props.isEditingDisabled}
      />
      <ImageUploader
        image={props.image}
        setImage={props.setImage}
        isEditingDisabled={props.isEditingDisabled}
        collectionPath={props.collectionPath}
      />
      <textarea
        className={styles["description-input"]}
        value={props.description || ""}
        onChange={(e) => props.setDescription(e.target.value)}
        placeholder="description"
        disabled={props.isEditingDisabled}
      />
    </React.Fragment>
  );
};
