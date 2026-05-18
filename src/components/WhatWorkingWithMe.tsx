import { Zap, Package, Users, BarChart2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const cards = [
  {
    icon: Zap,
    title: "AI Strategy",
    body: "Turning vague AI ambitions into clear, prioritized roadmaps your teams can actually execute on.",
  },
  {
    icon: Package,
    title: "Product Development",
    body: "From AI-powered prototypes to shipped products — bridging the gap between what's technically possible and what the business needs.",
  },
  {
    icon: Users,
    title: "Organizational Adoption",
    body: "Making AI tools and workflows stick across teams through structured change management and rollout.",
  },
  {
    icon: BarChart2,
    title: "Measurable Impact",
    body: "Connecting AI investments to the business metrics that matter to your leadership team.",
  },
];

export default function WhatWorkingWithMe() {
  return (
    <section className="py-24 bg-[#EEF3FA]">
      <div className="mx-auto max-w-5xl px-6 md:px-10">

        <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-tight text-[#0B1E3D] text-center mb-14">
          What working with me looks like
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(({ icon: Icon, title, body }, i) => (
            <ScrollReveal key={title} delay={i * 100} className="h-full">
              <div className="bg-white border border-blue-100 rounded-xl p-6 transition-colors duration-200 hover:bg-blue-50 hover:border-blue-200 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={17} className="text-[#4D9EFF] shrink-0" strokeWidth={2} />
                  <h3 className="font-display text-[1.0625rem] font-bold text-[#0F172A] leading-snug">
                    {title}
                  </h3>
                </div>
                <p className="text-[0.875rem] text-[#475569] leading-relaxed">
                  {body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
