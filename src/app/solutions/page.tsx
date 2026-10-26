import { InnerPage } from "@/components/layout/InnerPage";
import { Capabilities } from "@/components/sections/Capabilities";
import { CtaBand } from "@/components/sections/CtaBand";
import { TechStack } from "@/components/sections/TechStack";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/solutions",
  "Solutions & Technology",
  "The technologies Adtech uses across frontend, backend, mobile, data, cloud and AI — chosen for long-term fit, not trends.",
);

export default function SolutionsPage() {
  return (
    <InnerPage>
      <TechStack titleAs="h1" />
      <Capabilities />
      <CtaBand />
    </InnerPage>
  );
}
