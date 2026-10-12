import { createFileRoute } from "@tanstack/react-router";
import { AuthorWebsite } from "@/components/author-website";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Jeanie Calder — Author Website" },
    { name: "description", content: "Explore How to Lose Weight and Keep It Off by Jeanie Calder and programmes focused on food, self-perception and self-acceptance." },
    { property: "og:title", content: "Jeanie Calder — Author Website" },
    { property: "og:description", content: "Explore How to Lose Weight and Keep It Off by Jeanie Calder and her programmes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AuthorWebsite,
});
