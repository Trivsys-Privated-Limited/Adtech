import { LegalDocument } from "@/components/legal/LegalDocument";
import { privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/privacy-policy", privacyPolicy.title, privacyPolicy.summary);

export default function PrivacyPolicyPage() {
  return <LegalDocument doc={privacyPolicy} />;
}
