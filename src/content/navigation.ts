export type NavItem = {
  label: string;
  href: string;
};

/** Primary navigation: each item is its own route. */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Footer links; the hash links open a page at a specific section. */
export const footerNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Case studies", href: "/work" },
  { label: "Why Adtech", href: "/about#why-adtech" },
  { label: "Process", href: "/services#process" },
  { label: "Solutions & stack", href: "/solutions" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** A nav item is active on its own route and on any route nested under it. */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
