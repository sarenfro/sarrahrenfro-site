import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import WhatWorkingWithMe from "@/components/WhatWorkingWithMe";
import LogoMarquee from "@/components/LogoMarquee";
import { getSubstackPosts, formatDate, truncate } from "@/lib/rss";

export const revalidate = 3600;


const featuredProjects = [
  {
    name: "AI Learning Lab",
    outcome:
      "Built the program infrastructure for Foster's AI Learning Lab — student portal, company portal, and admin layer on Supabase.",
    tags: ["AI", "Product", "TypeScript", "Supabase"],
    href: "/work",
  },
  {
    name: "HuskySync",
    outcome:
      "Built a from-scratch Calendly equivalent with personal booking pages, team scheduling, Google Calendar sync, iCal support, and an admin dashboard.",
    tags: ["Product", "TypeScript", "Supabase"],
    href: "/work",
  },
  {
    name: "MBAA Event Calendar",
    outcome:
      "Governance and event tooling for Foster's MBA student association, including an anonymous voting module with row-level security.",
    tags: ["TypeScript", "Supabase", "Governance"],
    href: "/work",
  },
];


export default async function HomePage() {
  const posts = await getSubstackPosts(3);

  return (
    <>
      {/* HERO */}
      <section className="bg-ink px-6 pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-eyebrow mb-4 animate-fade-up delay-100">
            AI Strategist &nbsp;&middot;&nbsp; Product Manager &nbsp;&middot;&nbsp; Digital Transformation
          </p>
          <h1 className="text-hero mb-5 animate-fade-up delay-200" style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}>
            I help organizations turn AI strategy into business results.
          </h1>
          <p className="text-base max-w-xl mx-auto mb-8 leading-relaxed animate-fade-up delay-300" style={{ color: "var(--color-slate-muted)" }}>
            From defining your AI roadmap to shipping AI-powered products, I
            bring technical fluency and strategic clarity to the initiatives
            that actually move the needle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up delay-400">
            <Link href="/contact" className="btn-primary">
              Let&apos;s Talk &rarr;
            </Link>
            <Link href="/work" className="btn-ghost">
              See My Work
            </Link>
          </div>
        </div>
      </section>

      {/* LOGO BAR */}
      <section className="bg-cream border-y border-pebble py-10">
        <p className="text-stone text-xs uppercase tracking-widest text-center mb-8">
          Experience across
        </p>
        <LogoMarquee />
      </section>

      {/* OUTCOMES */}
      <WhatWorkingWithMe />

      {/* CREDIBILITY SNAPSHOT */}
      <section className="bg-cream px-6 py-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Photo */}
          <div className="shrink-0 w-56 md:w-64">
            <Image
              src="/sarrah-paccar.png"
              alt="Sarrah Renfro at UW Foster Paccar Hall"
              width={320}
              height={480}
              className="rounded-2xl object-cover object-top w-full"
            />
          </div>
          {/* Text */}
          <div>
            <div className="w-10 h-1 rounded-full mb-6" style={{ backgroundColor: "var(--accent)" }} />
            <p className="text-navy text-xl md:text-2xl leading-relaxed font-semibold mb-6">
              I&apos;m a product strategist and AI transformation specialist with a
              background in computer engineering and five-plus years inside Boeing,
              T-Mobile, TD Bank, and Microsoft. I&apos;m currently an MBA candidate
              at UW Foster, concentrating in AI &amp; Business Operations. I
              evaluate AI systems, build AI-powered products, and help
              organizations move from AI curiosity to AI capability.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-terracotta font-medium hover:gap-3 transition-all"
            >
              More about me <ArrowRight size={16} />
            </Link>
          </div>
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
            Ready to transform your business with AI?
          </h2>
          <p className="text-cream/80 mb-8">
            Whether you&apos;re exploring where AI fits or already building and
            need strategic leadership — let&apos;s talk.
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
