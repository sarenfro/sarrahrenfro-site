import Link from "next/link";
import Image from "next/image";
import { Clock, CheckCircle, Users, Zap, ArrowRight } from "lucide-react";
import { getSubstackPosts, formatDate, truncate } from "@/lib/rss";

export const revalidate = 3600;

const outcomeCards = [
  {
    icon: Clock,
    title: "Reclaim Time",
    description:
      "Strategic triage so leaders stay focused on the work only they can do.",
  },
  {
    icon: CheckCircle,
    title: "Drop Fewer Balls",
    description:
      "Systems and follow-through that keep nothing falling through the cracks.",
  },
  {
    icon: Users,
    title: "Align Teams",
    description:
      "Cross-functional clarity that reduces back-and-forth and moves decisions forward.",
  },
  {
    icon: Zap,
    title: "Move Faster",
    description:
      "Less context-switching, fewer bottlenecks, more momentum toward what actually matters.",
  },
];

const featuredProjects = [
  {
    name: "PowROI",
    outcome:
      "Built a web app that helps skiers calculate and compare pass ROI across resorts. Translated V1 user feedback into a structured V2 feature roadmap.",
    tags: ["Product", "Next.js", "Deployed"],
    href: "/work",
  },
  {
    name: "Quizzler",
    outcome:
      "Built and deployed a FastAPI quiz app, then wrote about the process publicly. Technical range meets communication.",
    tags: ["Engineering", "Python", "FastAPI"],
    href: "/work",
  },
  {
    name: "LLM Evaluation Framework",
    outcome:
      "Designed a business-focused benchmark comparing ChatGPT, Claude, Gemini, and Copilot across five dimensions: strategy, financial modeling, executive communication, due diligence, and ambiguity handling.",
    tags: ["AI", "Research", "Product Strategy"],
    href: "/work",
  },
];

const companies = [
  { name: "Boeing", domain: "boeing.com" },
  { name: "T-Mobile", domain: "t-mobile.com" },
  { name: "TD Bank", domain: "td.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "University of Washington", domain: "washington.edu" },
];

export default async function HomePage() {
  const posts = await getSubstackPosts(3);

  return (
    <>
      {/* HERO */}
      <section className="bg-sand px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-navy leading-tight mb-6">
            I help teams move faster with fewer dropped balls.
          </h1>
          <p className="text-charcoal text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            Whether you&apos;re a scrappy startup trying to build leverage or an
            established team navigating a complex initiative, I bring strategic
            clarity and operational follow-through to the work that matters
            most.
          </p>
          <p className="text-stone text-sm mb-10">
            MBA candidate at UW Foster &nbsp;&middot;&nbsp; PM and Chief of Staff
            recruiting for 2026 &nbsp;&middot;&nbsp; Seattle-based
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-terracotta text-cream font-medium px-8 py-3 rounded-full hover:bg-terracotta-dark transition-colors text-center"
            >
              Let&apos;s Talk
            </Link>
            <Link
              href="/work"
              className="border border-navy text-navy font-medium px-8 py-3 rounded-full hover:bg-navy hover:text-cream transition-colors text-center"
            >
              See My Work
            </Link>
          </div>
        </div>
      </section>

      {/* LOGO BAR */}
      <section className="bg-cream border-y border-pebble px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-stone text-xs uppercase tracking-widest text-center mb-8">
            Experience across
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {companies.map((company) => (
              <div
                key={company.name}
                className="flex items-center justify-center h-8"
              >
                <Image
                  src={`https://logo.clearbit.com/${company.domain}`}
                  alt={company.name}
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain grayscale opacity-60"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="bg-sand px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy text-center mb-14">
            What working with me looks like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {outcomeCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-cream border border-pebble rounded-2xl p-8"
                >
                  <div className="w-10 h-10 bg-light rounded-xl flex items-center justify-center mb-5">
                    <Icon size={20} className="text-terracotta" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy mb-2">
                    {card.title}
                  </h3>
                  <p className="text-charcoal text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CREDIBILITY SNAPSHOT */}
      <section className="bg-light px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-charcoal text-lg leading-relaxed mb-6">
            I&apos;m a product strategist and operator with a background in
            computer engineering and five-plus years working inside Boeing,
            T-Mobile, TD Bank, and Microsoft. I&apos;m currently an MBA candidate
            at UW Foster, concentrating in Product Management. I build things,
            ship things, and make sure teams don&apos;t lose the thread.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-terracotta font-medium hover:gap-3 transition-all"
          >
            More about me <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="bg-sand px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy text-center mb-14">
            Selected projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.name}
                className="bg-cream border border-pebble rounded-2xl p-7 flex flex-col"
              >
                <h3 className="font-display text-xl font-bold text-navy mb-3">
                  {project.name}
                </h3>
                <p className="text-charcoal text-sm leading-relaxed mb-5 flex-1">
                  {project.outcome}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-light text-stone text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={project.href}
                  className="inline-flex items-center gap-2 text-terracotta text-sm font-medium hover:gap-3 transition-all"
                >
                  View Project <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-light px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-navy text-center mb-10">
            What others say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-cream border border-pebble rounded-2xl p-8"
              >
                <p className="text-stone text-sm italic leading-relaxed mb-6">
                  &ldquo;[Reference quote from executive or professor — to be added]&rdquo;
                </p>
                <div>
                  <p className="text-navy font-semibold text-sm">Name, Title</p>
                  <p className="text-stone text-xs">Company</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WRITING TEASER */}
      <section className="bg-sand px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">
              Sarrah&apos;s Sandbox
            </h2>
            <p className="text-charcoal max-w-lg mx-auto">
              AI and technology, explained for people who think differently
              about it. No jargon, no gatekeeping.
            </p>
          </div>

          {posts ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {posts.map((post) => (
                <a
                  key={post.link}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cream border border-pebble rounded-2xl p-6 hover:border-terracotta transition-colors group"
                >
                  <p className="text-stone text-xs mb-3">
                    {formatDate(post.pubDate)}
                  </p>
                  <h3 className="font-display text-base font-bold text-navy mb-3 group-hover:text-terracotta transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-charcoal text-xs leading-relaxed">
                    {truncate(post.contentSnippet)}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center mb-10">
              <a
                href="https://sarrahsandbox.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta font-medium hover:underline"
              >
                Head to Substack to read the latest.
              </a>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/writing"
              className="inline-flex items-center gap-2 text-terracotta font-medium hover:gap-3 transition-all"
            >
              Read the Latest <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section className="bg-terracotta px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
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
