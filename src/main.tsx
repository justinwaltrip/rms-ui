import React, { FC, ReactNode, createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Editor from "./pages/editor/Editor";
import Grid from "./pages/grid/Grid";
import Home from "./pages/home/Home";
import "./styles.css";

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
  const [collectionPath, setCollectionPath] = useState<string>("");
  const [openFiles, setOpenFiles] = useState<Array<string>>([]);
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

const router = createBrowserRouter([
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
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </React.StrictMode>,
);
