import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-red-600 text-white shadow-cta hover:bg-red-700 hover:shadow-[0_14px_36px_-14px_rgb(240_68_82_/_0.7)]",
  secondary:
    "border border-line-strong bg-white/[0.03] text-fg backdrop-blur-sm hover:border-blue-300/50 hover:bg-white/[0.06]",
  ghost: "text-fg hover:text-red-400",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[0.9375rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cx(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
};

export function ButtonLink({ variant, size, className, icon, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {icon ? (
        <span
          aria-hidden="true"
          className="transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5"
        >
          {icon}
        </span>
      ) : null}
    </Link>
  );
}
