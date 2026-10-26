import { InnerPage } from "@/components/layout/InnerPage";
import { Contact } from "@/components/sections/Contact";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/contact",
  "Contact",
  "Tell Adtech about the product you want to build or the problem you need solved.",
);

export default function ContactPage() {
  return (
    <InnerPage>
      <Contact titleAs="h1" />
    </InnerPage>
  );
}
