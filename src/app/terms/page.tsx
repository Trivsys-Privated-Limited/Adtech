import { LegalDocument } from "@/components/legal/LegalDocument";
import { terms } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/terms", terms.title, terms.summary);

export default function TermsPage() {
  return <LegalDocument doc={terms} />;
}
