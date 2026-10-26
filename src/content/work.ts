/**
 * Featured work.
 *
 * DEMONSTRATION CONTENT: these are concept projects that illustrate the kind
 * of work Adtech delivers. They are not real clients and contain no results
 * or metrics. Replace them with real case studies (and set `isConcept: false`)
 * once they are available.
 */
export type PreviewVariant = "dashboard" | "pipeline" | "mobile";

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  overview: string;
  tags: string[];
  preview: PreviewVariant;
  isConcept: boolean;
  challenge: string;
  approach: string[];
  architecture: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "fleet-operations-platform",
    title: "Fleet Operations Platform",
    category: "Logistics · Web platform",
    overview:
      "A real-time operations console that unifies vehicle telemetry, dispatch and maintenance planning in a single view.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets"],
    preview: "dashboard",
    isConcept: true,
    challenge:
      "Operations teams in growing logistics businesses often juggle spreadsheets, telematics portals and messaging apps. The concept explores how a single console could surface what needs attention right now.",
    approach: [
      "Map the dispatcher's day to identify the decisions that are slowest today.",
      "Design an exception-first dashboard: normal operations stay quiet, issues rise to the top.",
      "Stream telemetry over WebSockets with graceful degradation on poor connections.",
    ],
    architecture: [
      "Event-driven ingestion service normalising telemetry from multiple providers",
      "PostgreSQL with time-series partitioning for location history",
      "Role-based access for dispatch, maintenance and management",
    ],
  },
  {
    slug: "ai-document-intake",
    title: "AI Document Intake",
    category: "Financial services · AI & automation",
    overview:
      "An automation pipeline that reads, classifies and extracts data from incoming documents, with a human review step for edge cases.",
    tags: ["Python", "LLM integration", "FastAPI", "Queues"],
    preview: "pipeline",
    isConcept: true,
    challenge:
      "Document-heavy back offices spend hours re-keying data from forms and statements. The concept shows how AI extraction can be paired with human review to stay accurate and auditable.",
    approach: [
      "Classify documents and route each type to a dedicated extraction schema.",
      "Score extraction confidence and send low-confidence fields to a reviewer.",
      "Log every decision so outputs remain traceable and auditable.",
    ],
    architecture: [
      "Queue-based processing pipeline with retry and dead-letter handling",
      "Schema-validated LLM extraction with deterministic post-processing",
      "Review interface with keyboard-first workflows for operators",
    ],
  },
  {
    slug: "patient-companion-app",
    title: "Patient Companion App",
    category: "Healthcare · Mobile app",
    overview:
      "A mobile companion that helps patients manage appointments, medication reminders and secure messages with their care team.",
    tags: ["React Native", "Node.js", "Accessibility", "Offline-first"],
    preview: "mobile",
    isConcept: true,
    challenge:
      "Patients often receive care instructions across paper, phone calls and portals that are hard to use on mobile. The concept focuses on clarity, accessibility and reliability on any connection.",
    approach: [
      "Design for large text, screen readers and one-handed use from day one.",
      "Keep schedules and reminders available offline with background sync.",
      "Keep sensitive data minimal on device and encrypted in transit and at rest.",
    ],
    architecture: [
      "React Native app with an offline-first local store",
      "Node.js API with audit logging and granular consent controls",
      "Push notification service with quiet hours and delivery tracking",
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
