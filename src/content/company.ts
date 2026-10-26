/**
 * Company narrative content. Edit freely — none of this contains invented
 * facts (founding year, team size, clients, locations or statistics).
 */

export const capabilities: string[] = [
  "Product Engineering",
  "Web & App Development",
  "AI & Automation",
  "Cloud & Infrastructure",
  "Digital Transformation",
];

export type Principle = { title: string; description: string };

export const principles: Principle[] = [
  {
    title: "Engineering-first mindset",
    description:
      "Every decision is weighed against correctness, security and long-term cost — not just how fast it can be demoed.",
  },
  {
    title: "Scalable architecture",
    description:
      "Systems designed to grow with you: clear boundaries, observable services and data models that survive new requirements.",
  },
  {
    title: "User-centered design",
    description:
      "We validate with real users early, so the product that ships solves the problem people actually have.",
  },
  {
    title: "Reliable delivery",
    description:
      "Short iterations, working software every sprint and transparent progress — no surprises at the end.",
  },
  {
    title: "Maintainable code",
    description:
      "Typed, tested and documented codebases your own team can confidently own, extend and hire for.",
  },
  {
    title: "Long-term partnership",
    description:
      "We stay invested after launch — measuring, improving and evolving the product as your business changes.",
  },
];

export type ProcessStep = {
  title: string;
  summary: string;
  activities: string[];
  outcome: string;
};

export const processSteps: ProcessStep[] = [
  {
    title: "Discover",
    summary:
      "We dig into your goals, users, constraints and existing systems to understand the real problem worth solving.",
    activities: ["Stakeholder interviews", "Technical audit", "User & market research"],
    outcome: "A shared understanding of goals, risks and success criteria.",
  },
  {
    title: "Define",
    summary:
      "We turn insight into a focused scope, a delivery roadmap and the architecture decisions that matter early.",
    activities: ["Scope & priorities", "Solution architecture", "Delivery roadmap"],
    outcome: "A clear plan with milestones everyone agrees on.",
  },
  {
    title: "Design",
    summary:
      "Flows, interfaces and a design system are prototyped and tested with users before a line of production code.",
    activities: ["User flows & wireframes", "Visual design system", "Interactive prototypes"],
    outcome: "Validated designs that are ready to build.",
  },
  {
    title: "Develop",
    summary:
      "Engineers ship in short iterations with code review, automated tests and a working build you can see every sprint.",
    activities: ["Iterative sprints", "Code review & CI", "Regular demos"],
    outcome: "Production-quality software, delivered incrementally.",
  },
  {
    title: "Test",
    summary:
      "Automated and manual testing across devices, performance budgets and accessibility checks before every release.",
    activities: ["Automated test suites", "Performance & accessibility", "Security review"],
    outcome: "Confidence that it works — for every user.",
  },
  {
    title: "Launch & Improve",
    summary:
      "We release safely, monitor real-world usage and keep iterating on what the data and your users tell us.",
    activities: ["Staged rollout", "Monitoring & analytics", "Continuous improvement"],
    outcome: "A live product that keeps getting better.",
  },
];

export const about = {
  heading: "Thoughtful engineering for businesses that intend to lead.",
  paragraphs: [
    "Adtech is a software development company that partners with businesses to design, build and scale digital products. We combine product thinking, modern engineering and practical AI to turn complex problems into software that is clear to use and dependable to run.",
    "We care about outcomes more than output. That means understanding the business behind every requirement, choosing technology for its long-term fit rather than its novelty, and writing code that your team can maintain with confidence long after launch.",
  ],
  pillars: [
    { label: "Technology", text: "Modern, proven stacks chosen for longevity." },
    { label: "Outcomes", text: "Software measured by the business results it enables." },
    { label: "Quality", text: "Tested, accessible and secure by default." },
  ],
};
