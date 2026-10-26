import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Props shared by section components that appear both on the Home page and
 * as the main content of an inner page.
 */
export type SectionProps = {
  /** Eyebrow number, used for the Home page's 01–07 sequence. Omit on inner pages. */
  index?: string;
  /** Use "h1" when the section is the main content of its own page. */
  titleAs?: "h1" | "h2";
};

/** Small uppercase label above a heading, with an optional red index number. */
export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cx("eyebrow flex items-center gap-3", className)}>
      {index ? (
        <>
          <span className="text-red-500">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        </>
      ) : null}
      {children}
    </p>
  );
}

type SectionHeadingProps = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  align?: "start" | "center";
  className?: string;
};

/** Eyebrow + heading + optional lead, shared by every section. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  id,
  as: Heading = "h2",
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div
      data-reveal
      className={cx("max-w-3xl", align === "center" && "mx-auto text-center", className)}
    >
      <Eyebrow index={index} className={cx(align === "center" && "justify-center")}>
        {eyebrow}
      </Eyebrow>
      <Heading id={id} className="mt-5 text-heading font-semibold text-balance text-fg">
        {title}
      </Heading>
      {description ? (
        <p className="mt-5 text-lead text-pretty text-muted">{description}</p>
      ) : null}
    </div>
  );
}
