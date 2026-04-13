import Link from "next/link";
import { ArrowRight, GraduationCap, Award, Code, Briefcase } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Sarrah Renfro",
  description:
    "Product strategist and operator with roots in computer engineering and five-plus years of cross-functional experience at Boeing, T-Mobile, TD Bank, and Microsoft.",
};

const capabilities = [
  {
    icon: Code,
    title: "Computer engineering background",
    description:
      "I can work with technical teams without translation, and I catch when something is technically sound but strategically off.",
  },
  {
    icon: Briefcase,
    title: "Cross-functional operator experience",
    description:
      "I've coordinated across engineering, marketing, finance, and leadership in enterprise and startup-adjacent environments.",
  },
  {
    icon: ArrowRight,
    title: "Product and strategy",
    description:
      "I think in systems, prioritize ruthlessly, and communicate up and across without losing fidelity.",
  },
];

const credentials = [
  { icon: GraduationCap, label: "UW Foster MBA, Class of 2027 — Concentration: Product Management" },
  { icon: Award, label: "Certified Scrum Master" },
  { icon: Code, label: "B.S. Computer Engineering" },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-sand px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-navy mb-8 leading-tight">
            Why Sarrah, specifically?
          </h1>
          <p className="text-charcoal text-lg leading-relaxed max-w-2xl">
            I&apos;m a product strategist and operator with roots in computer
            engineering and five-plus years of cross-functional experience at
            Boeing, T-Mobile, TD Bank, and Microsoft. I&apos;m currently an MBA
            candidate at UW Foster (Class of 2027), concentrating in Product
            Management. My superpower is operating at the intersection of
            technical and strategic: I can read a system diagram and a market
            map in the same afternoon, and I know which one to act on first.
          </p>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="bg-light px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-10">
            Skills as capabilities, not a tag cloud
          </h2>
          <div className="flex flex-col gap-6">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="bg-cream border border-pebble rounded-2xl p-7 flex gap-5"
                >
                  <div className="w-10 h-10 bg-light rounded-xl flex items-center justify-center shrink-0 mt-1">
                    <Icon size={20} className="text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy mb-2">
                      {cap.title}
                    </h3>
                    <p className="text-charcoal text-sm leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="bg-sand px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-10">
            Credentials
          </h2>
          <div className="flex flex-col gap-4">
            {credentials.map((cred) => {
              const Icon = cred.icon;
              return (
                <div key={cred.label} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-light rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-terracotta" />
                  </div>
                  <p className="text-charcoal">{cred.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUOTE PLACEHOLDER */}
      <section className="bg-light px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-cream border border-pebble rounded-2xl p-8">
            <p className="text-stone text-base italic leading-relaxed mb-6">
              &ldquo;[Reference quote from executive or professor — to be added]&rdquo;
            </p>
            <div>
              <p className="text-navy font-semibold text-sm">Name, Title</p>
              <p className="text-stone text-xs">Company</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section className="bg-terracotta px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-cream mb-4">
            Want to work together?
          </h2>
          <p className="text-cream/80 mb-8">
            Let&apos;s talk about what you&apos;re building and where I can help.
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
