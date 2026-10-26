import { InnerPage } from "@/components/layout/InnerPage";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/work",
  "Work",
  "Concept projects that illustrate how Adtech approaches web platforms, AI automation and mobile products.",
);

export default function WorkPage() {
  return (
    <InnerPage>
      <FeaturedWork titleAs="h1" />
      <CtaBand />
    </InnerPage>
  );
}
