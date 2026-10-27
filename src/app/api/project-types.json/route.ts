import { projectTypes } from "@/content/services";

/**
 * Written to out/api/project-types.json at build time so public/api/contact.php
 * validates against the same list as the client form.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(projectTypes);
}
