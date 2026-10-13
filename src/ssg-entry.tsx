import { renderToString } from "react-dom/server";
import { AuthorWebsite } from "./components/author-website";

// Executed only at build time. The browser hydrates this exact component tree.
export function render() {
  return renderToString(<AuthorWebsite />);
}
