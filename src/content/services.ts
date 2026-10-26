import type { LucideIcon } from "lucide-react";
import { BrainCircuit, Cloud, CodeXml, Globe, PenTool, Smartphone } from "lucide-react";

export type Service = {
  id: string;
  title: string;
  /** Short label used in the contact form and footer. */
  shortTitle: string;
  summary: string;
  highlights: string[];
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    id: "custom-software",
    title: "Custom Software Development",
    shortTitle: "Custom software",
    summary:
      "Purpose-built systems shaped around how your business actually works — from internal tools to complex, multi-tenant platforms.",
    highlights: ["Domain-driven architecture", "Legacy modernisation", "API & systems integration"],
    icon: CodeXml,
  },
  {
    id: "web-development",
    title: "Web Development",
    shortTitle: "Web development",
    summary:
      "Fast, accessible web platforms and applications engineered for performance, search visibility and growth.",
    highlights: ["Next.js & React", "Headless CMS", "Core Web Vitals"],
    icon: Globe,
  },
  {
    id: "mobile-apps",
    title: "Mobile Application Development",
    shortTitle: "Mobile apps",
    summary:
      "Native and cross-platform apps with polished interactions, offline resilience and release pipelines you can trust.",
    highlights: ["iOS & Android", "React Native", "App store delivery"],
    icon: Smartphone,
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    shortTitle: "AI & automation",
    summary:
      "Practical AI that removes busywork — document processing, intelligent search and workflow automation grounded in your data.",
    highlights: ["LLM integration", "Retrieval pipelines", "Process automation"],
    icon: BrainCircuit,
  },
  {
    id: "cloud-devops",
    title: "Cloud Solutions & DevOps",
    shortTitle: "Cloud & DevOps",
    summary:
      "Secure, observable infrastructure with automated delivery, so shipping becomes routine instead of risky.",
    highlights: ["Infrastructure as code", "CI/CD", "Monitoring & cost control"],
    icon: Cloud,
  },
  {
    id: "product-design",
    title: "UI/UX Design & Digital Product Engineering",
    shortTitle: "UI/UX & product",
    summary:
      "Research-led product design that connects user needs to buildable, measurable software — and a design system to scale it.",
    highlights: ["Product discovery", "Design systems", "Prototyping & testing"],
    icon: PenTool,
  },
];

/** Options for the contact form's "Project type" field. */
export const projectTypes: string[] = [...services.map((s) => s.shortTitle), "Something else"];
