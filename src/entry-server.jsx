// Used only at build time, by scripts/prerender.mjs. Rendering the page to HTML
// once, up front, means a crawler or a browser with JavaScript disabled sees the
// actual content instead of an empty <div id="root">.
import { renderToString } from "react-dom/server";
import App from "./App.jsx";

export function render() {
  return renderToString(<App />);
}
