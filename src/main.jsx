import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

const container = document.getElementById("root");
const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The production build ships pre-rendered markup inside #root, so React attaches
// to what is already on screen. In dev the container is empty and we mount fresh.
if (container.hasChildNodes()) hydrateRoot(container, tree);
else createRoot(container).render(tree);
