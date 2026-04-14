import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Sarrah Renfro",
  description:
    "Selected projects showing strategic thinking, technical range, and what happens when you actually ship.",
};

interface Project {
  name: string;
  outcome: string;
  description: string;
  tags: string[];
  link?: string;
  linkLabel?: string;
  placeholder?: boolean;
}

const projects: Project[] = [
  {
    name: "PowROI",
    outcome: "Helps skiers calculate whether a season pass actually pays off.",
    description:
      "Built a web app from scratch that compares ski pass ROI across resorts based on your skiing habits. Deployed on Lovable. Currently translating V1 user feedback into a structured V2 feature roadmap with improved UX and expanded resort coverage.",
    tags: ["Product", "Web App", "Live"],
    link: "https://powroi.lovable.app",
    linkLabel: "View Live App",
  },
  {
    name: "Quizzler",
    outcome: "A quiz app that went from idea to deployed in a weekend.",
    description:
      "Built a FastAPI quiz application and deployed it on Railway. Then wrote publicly about the process: what broke, what I learned, and what I'd do differently. Designed to demonstrate that I can move from concept to shipped product without a team.",
    tags: ["Engineering", "Python", "FastAPI"],
    link: "https://github.com/sarrahrenfro",
    linkLabel: "View on GitHub",
  },
  {
    name: "LLM Evaluation Framework",
    outcome: "A structured rubric for evaluating AI tools on real business tasks.",
    description:
      "Designed and executed a benchmark comparing ChatGPT, Claude, Gemini, and Copilot across five business use cases: strategy, financial modeling, executive communication, due diligence, and ambiguity handling. Produced scoring rubrics, a scorer's guide, and a master scorecard.",
    tags: ["AI", "Research", "Product Strategy"],
  },
  {
    name: "Sarrah's Sandbox",
    outcome: "Making AI and technology accessible to non-traditional audiences.",
    description:
      "A recurring publication covering AI tools, product thinking, and technology trends, written for people who weren't born into it. Published pieces include original frameworks, product teardowns, and reflections from inside an MBA program.",
    tags: ["Writing", "AI", "Content Strategy"],
    link: "https://sarrahsandbox.substack.com",
    linkLabel: "Read on Substack",
  },
  {
    name: "TeamSyncHubScaled",
    outcome: "",
    description: "",
    tags: [],
    placeholder: true,
  },
];

export default function WorkPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-ink px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-hero mb-4">
            This is where I practice skills and bring messy ideas to life.
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            Selected projects that show strategic thinking, technical range,
            and what happens when you actually ship.
          </p>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="bg-light px-6 py-16">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {projects.map((project) => {
            if (project.placeholder) {
              return (
                <div
                  key={project.name}
                  className="bg-cream border border-pebble rounded-2xl p-8 opacity-60"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-light text-stone text-xs px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-navy mb-3">
                    {project.name}
                  </h2>
                  <p className="text-stone text-sm">
                    Project details coming soon.
                  </p>
                </div>
              );
            }

            return (
              <div
                key={project.name}
                className="bg-cream border border-pebble rounded-2xl p-8"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-light text-stone text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-2">
                  {project.name}
                </h2>
                {project.outcome && (
                  <p className="text-terracotta font-medium text-sm mb-4">
                    {project.outcome}
                  </p>
                )}
                {project.description && (
                  <p className="text-charcoal text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-terracotta text-sm font-medium hover:gap-3 transition-all"
                  >
                    {project.linkLabel ?? "View Project"}{" "}
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section className="bg-terracotta px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-cream mb-4">
            Let&apos;s connect.
          </h2>
          <p className="text-cream/80 mb-8">
            Recruiting for a PM, Chief of Staff, or strategic operator role?
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
