import React, { FC, useEffect } from "react";

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
  width: number;
  isWideScreen: boolean;
}

export const RecipeHeader: FC<RecipeHeaderProps> = ({ ...props }) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    image,
    setImage,
    isEditingDisabled,
    collectionPath,
    width,
    isWideScreen,
  } = props;

  /**
   * Resize description
   */
  function resizeDescription() {
    const description = document.getElementsByClassName(
      styles["description-input"],
    )[0] as HTMLTextAreaElement;
    description.style.height = "";
    description.style.height = description.scrollHeight + "px";
  }

  /**
   * On mount, add listener for resize
   */
  useEffect(() => {
    window.addEventListener("resize", resizeDescription);
    return () => window.removeEventListener("resize", resizeDescription);
  }, []);

  /**
   * On description change, set height of description
   */
  useEffect(() => {
    resizeDescription();
  }, [description, width, isWideScreen]);

  function resizeTitle() {
    const title = document.getElementsByClassName(
      styles["title-input"],
    )[0] as HTMLTextAreaElement;
    title.style.height = "";
    title.style.height = title.scrollHeight + "px";
  }

  /**
   * On mount, add listener for resize
   */
  useEffect(() => {
    window.addEventListener("resize", resizeTitle);
    return () => window.removeEventListener("resize", resizeTitle);
  }, []);

  /**
   * On title change, set height of title
   */
  useEffect(() => {
    resizeTitle();
  }, [title, width, isWideScreen]);

  return (
    <React.Fragment>
      <textarea
        rows={1}
        className={styles["title-input"]}
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="title"
        disabled={isEditingDisabled}
      />
      <ImageUploader
        image={image}
        setImage={setImage}
        isEditingDisabled={isEditingDisabled}
        collectionPath={collectionPath}
      />
      <textarea
        rows={1}
        className={styles["description-input"]}
        value={description || ""}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="description"
        disabled={isEditingDisabled}
      />
    </React.Fragment>
  );
};
