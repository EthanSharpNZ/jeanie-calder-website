import { createRoot, hydrateRoot } from "react-dom/client";
import { AuthorWebsite } from "@/components/author-website";
import "./styles.css";

const root = document.getElementById("root");
if (root) {
  if (root.hasChildNodes()) hydrateRoot(root, <AuthorWebsite />);
  else createRoot(root).render(<AuthorWebsite />);
}
