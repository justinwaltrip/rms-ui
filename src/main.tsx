import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Editor from "./pages/editor/Editor";
import Home from "./pages/home/Home";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    // TODO remove
    // path: "/",
    path: "/editor",
    element: <Editor />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
