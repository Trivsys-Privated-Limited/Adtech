import { InnerPage } from "@/components/layout/InnerPage";
import { CtaBand } from "@/components/sections/CtaBand";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/services",
  "Services",
  "Custom software, web and mobile development, AI & automation, cloud & DevOps, and UI/UX design — delivered by one accountable engineering team.",
);

export default function ServicesPage() {
  return (
    <InnerPage>
      <Services titleAs="h1" />
      <Process />
      <CtaBand />
    </InnerPage>
  );
}
