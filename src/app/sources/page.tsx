import type { Metadata } from "next";
import { SourceIndex } from "@/components/SourceIndex";
import { getSources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Sources",
  description: "The public sources behind every figure in the UK AI Monitor.",
};

export default function SourcesPage() {
  const sources = getSources();

  return (
    <main id="main">
      <SourceIndex sources={sources} />
    </main>
  );
}
