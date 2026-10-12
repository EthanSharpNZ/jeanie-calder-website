import { createRoot } from "react-dom/client";
import { AuthorWebsite } from "@/components/author-website";
import "./styles.css";

const root = document.getElementById("root");
if (root) createRoot(root).render(<AuthorWebsite />);