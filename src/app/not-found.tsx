import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[70svh] flex-col items-start justify-center pt-[4.5rem]">
      <p className="eyebrow text-red-400">404</p>
      <h1 className="mt-4 text-heading font-semibold text-fg">This page could not be found.</h1>
      <p className="mt-4 max-w-md text-muted">
        The link may be broken or the page may have moved. Let&apos;s get you back on track.
      </p>
      <ButtonLink href="/" size="lg" variant="secondary" className="mt-8" icon={<ArrowLeft className="size-4" />}>
        Back to home
      </ButtonLink>
    </section>
  );
}
