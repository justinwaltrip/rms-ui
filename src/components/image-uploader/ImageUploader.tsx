import { open } from "@tauri-apps/plugin-dialog";
import {
  BaseDirectory,
  readFile as readBinaryFile,
} from "@tauri-apps/plugin-fs";
import { FC, useEffect, useState } from "react";

import styles from "./ImageUploader.module.css";
import close from "../../assets/close.png";
import upload from "../../assets/upload.png";
import { FileService } from "../../services/FileService";
import { deleteImage, writeImage } from "../../utils/fs";

interface ImageUploaderProps {
  image?: string;
  setImage: (image: string) => void;
  isEditingDisabled: boolean;
  collectionPath: string;
}

const fileService = new FileService();

export const ImageUploader: FC<ImageUploaderProps> = ({
  image,
  setImage,
  isEditingDisabled,
  collectionPath,
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  /**
   * Get image source
   */
  useEffect(() => {
    if (image) {
      fileService
        .getImageSrc(`${collectionPath}/${image}`)
        .then((src) => {
          setImageSrc(src);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [image, collectionPath]);

  /**
   * Select image from file system
   */
  async function selectImage() {
    try {
      const result = await open({
        multiple: false,
        directory: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpeg", "jpg"],
          },
        ],
      });

      if (result && !Array.isArray(result)) {
        // read image from file
        const bytes = await readBinaryFile(result, {
          baseDir: BaseDirectory.Home,
        });

        // get filename
        const filename = result.split("/").pop();

        // write image to file
        const path = `.rms/attachments/${filename}`;
        await writeImage(path, bytes, collectionPath);

        // update recipe
        setImage(path);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Handle image deletion
   */
  const handleDeleteImage = async () => {
    try {
      if (image) {
        await deleteImage(image, collectionPath);
        setImage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles["image-container"]}>
      {image ? (
        <img src={imageSrc} alt="recipe" className={styles["image"]} />
      ) : (
        <img
          src={upload}
          alt="Upload"
          className={styles["upload-icon"]}
          onClick={() => {
            if (!isEditingDisabled) {
              selectImage().catch((err) => console.error(err));
            }
          }}
        />
      )}
      {image && (
        <div className={styles["image-overlay"]}>
          <img
            src={close}
            alt="Remove"
            className={styles["close-icon"]}
            onClick={handleDeleteImage}
          />
        </div>
      )}
    </div>
  );
};
