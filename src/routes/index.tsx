import { createFileRoute } from "@tanstack/react-router";
import { PortfolioShell } from "@/components/PortfolioShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ajay — IT / DevOps Portfolio" },
      {
        name: "description",
        content:
          "Ajay — IT & DevOps Professional. Explore as a retro Linux terminal or switch to a modern visual portfolio.",
      },
      { property: "og:title", content: "Ajay — IT / DevOps Portfolio" },
      {
        property: "og:description",
        content:
          "Ajay — IT & DevOps Professional. Retro terminal meets modern executive portfolio.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <PortfolioShell />;
}
