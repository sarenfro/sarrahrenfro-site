import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Sarrah Renfro",
  description:
    "Selected projects showing AI fluency, technical range, and what happens when you actually ship.",
};

interface Project {
  name: string;
  outcome: string;
  description: string;
  tags: string[];
  link?: string;
  linkLabel?: string;
  github?: string;
  screenshot?: string;
}

const projects: Project[] = [
  {
    name: "AI Learning Lab",
    outcome: "Program infrastructure for Foster's AI Learning Lab.",
    description:
      "Built the full operational backbone for the Foster AI Learning Lab: a student portal, company portal, and admin layer, all backed by Supabase with row-level security. Static HTML front-end with TypeScript glue connecting the pieces. Designed to scale as the program grows.",
    tags: ["AI", "Product", "TypeScript", "Supabase"],
    github: "https://github.com/sarrahrenfro/ai-learning-lab",
    linkLabel: "View on GitHub",
  },
  {
    name: "HuskySync",
    outcome: "A from-scratch Calendly equivalent built for university teams.",
    description:
      "Personal booking pages, team scheduling, Google Calendar sync, iCal support, and an admin dashboard — all built from the ground up in TypeScript with Supabase. The same scheduling infrastructure that powers the booking system on this site.",
    tags: ["Product", "TypeScript", "Supabase", "Scheduling"],
    github: "https://github.com/sarrahrenfro/teamhubsyncscaled",
    linkLabel: "View on GitHub",
  },
  {
    name: "MBAA Event Calendar",
    outcome: "Governance and event tooling for Foster's MBA student association.",
    description:
      "TypeScript monorepo (pnpm workspaces) covering the full event and governance lifecycle for Foster MBAA. Includes a Supabase-backed voting module with anonymized ballots and row-level security policies that separate ballots from voter identity.",
    tags: ["TypeScript", "Supabase", "Governance", "Monorepo"],
    github: "https://github.com/sarrahrenfro/UW-MBAA-Calendar",
    linkLabel: "View on GitHub",
  },
  {
    name: "Mail Merge Tool",
    outcome: "Rich-text mail merge with production-grade delivery.",
    description:
      "TipTap rich text editor, Supabase-backed recipient management, and Brevo for sending. Built in Next.js and TypeScript. Designed to replace clunky spreadsheet-based mail merge workflows with something that actually handles formatting and delivery reliably.",
    tags: ["Next.js", "TypeScript", "Supabase", "Brevo"],
    github: "https://github.com/sarrahrenfro/mail-merge",
    linkLabel: "View on GitHub",
  },
  {
    name: "PowROI",
    outcome: "Helps skiers calculate whether a season pass actually pays off.",
    description:
      "Compares Ikon, Epic, Mountain Collective, and Indy passes across 50 resorts based on your skiing habits. Interactive Leaflet map, break-even charts, and sensitivity tables for trip planning. Currently translating V1 user feedback into a V2 roadmap with expanded resort coverage.",
    tags: ["Product", "Web App", "Live"],
    link: "https://powroi.lovable.app",
    linkLabel: "View Live App",
    screenshot: "/screenshots/powroi.png",
  },
  {
    name: "sarrahrenfro.com",
    outcome: "This site — personal portfolio, writing hub, and booking system.",
    description:
      "Next.js on Vercel with a custom Steel and Electric Blue design system. Includes a live Outlook calendar availability checker, a full booking flow with ICS calendar invites, and Substack RSS integration for the writing section.",
    tags: ["Next.js", "Vercel", "TypeScript", "Design System"],
    github: "https://github.com/sarenfro/sarrahrenfro-site",
    linkLabel: "View on GitHub",
  },
];

const supporting: Project[] = [
  {
    name: "calendar-api",
    outcome: "Finds shared free time across team calendars.",
    description:
      "Node.js scheduling API that parses .ics files from Google, Apple, and Outlook to find overlapping availability. Handles recurring events, configurable working hours, and time zone normalization.",
    tags: ["Node.js", "TypeScript", "iCal"],
    github: "https://github.com/sarrahrenfro/calendar-api",
    linkLabel: "View on GitHub",
  },
  {
    name: "Wayfinders Retro",
    outcome: "Anonymous retrospective feedback collector for teams.",
    description:
      "Node.js + Express app with a public submission form and exportable results. Deployed on Heroku. Built for teams that want honest retro feedback without attribution pressure.",
    tags: ["Node.js", "Express", "Heroku"],
    github: "https://github.com/sarrahrenfro/wayfinders-retro",
    linkLabel: "View on GitHub",
  },
  {
    name: "Quizzler",
    outcome: "FastAPI quiz app that loads questions from an Excel sheet.",
    description:
      "Python backend with a static HTML front-end. Built and deployed in a weekend, then written about publicly — designed to show that I can move from idea to shipped product without a team.",
    tags: ["Python", "FastAPI", "Deployed"],
    github: "https://github.com/sarrahrenfro/Quizzler",
    linkLabel: "View on GitHub",
  },
  {
    name: "ConfusionlessConfucius",
    outcome: "Sandbox for testing RAG retrieval strategies and prompt variations.",
    description:
      "Experimental repo for exploring how different retrieval approaches and prompt structures affect LLM output quality. Used as a personal research environment for AI evaluation work.",
    tags: ["AI", "RAG", "Research"],
    github: "https://github.com/sarrahrenfro/ConfusionlessConfucious",
    linkLabel: "View on GitHub",
  },
];

function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className="bg-cream border border-pebble rounded-2xl overflow-hidden">
      {project.screenshot && (
        <div className="relative w-full h-52">
          <Image
            src={project.screenshot}
            alt={`${project.name} screenshot`}
            fill
            className="object-cover object-top"
          />
        </div>
      )}
      <div className={compact ? "p-6" : "p-8"}>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-light text-stone text-xs px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h2 className={`font-display font-bold text-navy mb-2 ${compact ? "text-xl" : "text-2xl md:text-3xl"}`}>
          {project.name}
        </h2>
        {project.outcome && (
          <p className="text-terracotta font-medium text-sm mb-3">{project.outcome}</p>
        )}
        <p className="text-charcoal text-sm leading-relaxed mb-5">{project.description}</p>
        <div className="flex flex-wrap gap-4">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-terracotta text-sm font-medium hover:gap-3 transition-all"
            >
              {project.linkLabel ?? "View Project"} <ExternalLink size={14} />
            </a>
          )}
          {project.github && !project.link && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-terracotta text-sm font-medium hover:gap-3 transition-all"
            >
              {project.linkLabel ?? "View on GitHub"} <GithubIcon size={14} />
            </a>
          )}
          {project.github && project.link && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-stone text-sm font-medium hover:text-navy transition-colors"
            >
              GitHub <GithubIcon size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorkPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-ink px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-hero mb-4">
            This is where AI strategy meets execution.
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            Selected projects that demonstrate AI fluency, technical range,
            and what happens when you actually ship.
          </p>
        </div>
      </section>

      {/* PRIMARY PROJECTS */}
      <section className="bg-light px-6 py-16">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      {/* SUPPORTING WORK */}
      <section className="bg-sand px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-navy mb-2">Supporting work</h2>
          <p className="text-stone text-sm mb-10">Smaller builds, experiments, and infrastructure that didn&apos;t make the main list but show the range.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supporting.map((project) => (
              <ProjectCard key={project.name} project={project} compact />
            ))}
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section className="bg-terracotta px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-cream mb-4">
            Ready to build something together?
          </h2>
          <p className="text-cream/80 mb-8">
            Looking for AI product leadership or transformation strategy?
            Let&apos;s talk.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-cream text-terracotta font-semibold px-8 py-3 rounded-full hover:bg-sand transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
