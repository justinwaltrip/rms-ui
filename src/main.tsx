import React, {
  FC,
  ReactNode,
  createContext,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeContext";
import Editor from "./pages/editor/Editor";
import Grid from "./pages/grid/Grid";
import Home from "./pages/home/Home";
import "./styles.css";
import Import from "./pages/import/Import";

export const AppContext = createContext<{
  collectionPath: string;
  setCollectionPath: (collectionPath: string) => void;
  openFiles: Array<string>;
  setOpenFiles: (openFiles: Array<string>) => void;
}>({
  collectionPath: "",
  setCollectionPath: () => {},
  openFiles: [],
  setOpenFiles: () => {},
});

const AppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [collectionPath, setCollectionPath] = useState<string>(() => {
    return sessionStorage.getItem("collectionPath") || "";
  });
  const [openFiles, setOpenFiles] = useState<Array<string>>(() => {
    const files = sessionStorage.getItem("openFiles");
    return files ? (JSON.parse(files) as Array<string>) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("collectionPath", collectionPath);
  }, [collectionPath]);
  useEffect(() => {
    sessionStorage.setItem("openFiles", JSON.stringify(openFiles));
  }, [openFiles]);

  return (
    <AppContext.Provider
      value={{
        collectionPath,
        setCollectionPath,
        openFiles,
        setOpenFiles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/grid",
      element: <Grid />,
    },
    {
      path: "/editor",
      element: <Editor />,
    },
    {
      path: "/import",
      element: <Import />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <ThemeProvider>
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      </ThemeProvider>
    </AppContextProvider>
  </React.StrictMode>,
);
