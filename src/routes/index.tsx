import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "@/components/Terminal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ajay — Terminal Portfolio" },
      {
        name: "description",
        content:
          "Interactive retro Linux terminal portfolio of Ajay — DevOps and Cloud Infrastructure enthusiast.",
      },
      { property: "og:title", content: "Ajay — Terminal Portfolio" },
      {
        property: "og:description",
        content:
          "Interactive retro Linux terminal portfolio of Ajay — DevOps and Cloud Infrastructure enthusiast.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <Terminal />;
}
