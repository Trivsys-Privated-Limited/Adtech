import { InnerPage } from "@/components/layout/InnerPage";
import { About } from "@/components/sections/About";
import { CtaBand } from "@/components/sections/CtaBand";
import { Process } from "@/components/sections/Process";
import { WhyAdtech } from "@/components/sections/WhyAdtech";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/about",
  "About",
  "Adtech is a software development company combining product thinking, modern engineering and practical AI to build dependable digital products.",
);

export default function AboutPage() {
  return (
    <InnerPage>
      <About titleAs="h1" />
      <WhyAdtech />
      <Process />
      <CtaBand />
    </InnerPage>
  );
}
