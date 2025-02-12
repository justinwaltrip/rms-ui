import { FC, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import styles from "./Import.module.css";
import SideBar from "../../components/sidebar/SideBar";
import TitleBar from "../../components/title-bar/TitleBar";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface RecipeData {
  [key: string]: any;
}

const BASE_URL = "http://localhost:8000";

const Import: FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type.startsWith("image/"))
    ) {
      setSelectedFile(file);
      await convertToJson(file);
    } else {
      alert("Please select a PDF or image file");
    }
  };

  const convertToJson = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${BASE_URL}/convert/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const data = await response.json();
      setRecipeData(data);
    } catch (error) {
      console.error("Error converting file:", error);
      alert("Failed to convert file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className={styles["container"]}>
      <TitleBar activeFileIndex={-1} />
      <SideBar />
      <div className={styles["content"]}>
        <div className={styles["document-section"]}>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className={styles["file-input"]}
          />
          {selectedFile && selectedFile.type === "application/pdf" && (
            <div className={styles["pdf-viewer"]}>
              <Document
                file={selectedFile}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={400}
                  />
                ))}
              </Document>
            </div>
          )}
          {selectedFile && selectedFile.type.startsWith("image/") && (
            <div className={styles["image-viewer"]}>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Recipe"
                style={{ maxWidth: "400px" }}
              />
            </div>
          )}
        </div>
        <div className={styles["text-section"]}>
          {isLoading && <div>Converting...</div>}
          {recipeData && (
            <pre className={styles["recipe-data"]}>
              {JSON.stringify(recipeData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default Import;
