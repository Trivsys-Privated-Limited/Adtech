/**
 * Technology capabilities shown in the "Solutions & stack" section.
 * EDITABLE: keep this list limited to technologies the team genuinely works with.
 */
export type TechCategory = {
  name: string;
  description: string;
  items: string[];
};

export const techCategories: TechCategory[] = [
  {
    name: "Frontend",
    description: "Fast, accessible interfaces",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Three.js"],
  },
  {
    name: "Backend",
    description: "Reliable services & APIs",
    items: ["Node.js", "NestJS", "Python", "FastAPI", "GraphQL", "REST"],
  },
  {
    name: "Mobile",
    description: "Native & cross-platform apps",
    items: ["React Native", "Expo", "Swift", "Kotlin"],
  },
  {
    name: "Database",
    description: "Data that scales with you",
    items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
  },
  {
    name: "Cloud & DevOps",
    description: "Automated, observable delivery",
    items: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
  },
  {
    name: "AI & Automation",
    description: "Practical, grounded intelligence",
    items: ["LLM integration", "Retrieval (RAG)", "Document AI", "Workflow automation"],
  },
];
