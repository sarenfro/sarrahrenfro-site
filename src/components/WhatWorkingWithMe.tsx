import { Clock, CheckCircle, Users, Zap } from "lucide-react";

const cards = [
  {
    icon: Clock,
    title: "Reclaim Time",
    body: "Strategic triage so leaders stay focused on the work only they can do.",
  },
  {
    icon: CheckCircle,
    title: "Drop Fewer Balls",
    body: "Systems and follow-through that keep nothing falling through the cracks.",
  },
  {
    icon: Users,
    title: "Align Teams",
    body: "Cross-functional clarity that reduces back-and-forth and moves decisions forward.",
  },
  {
    icon: Zap,
    title: "Move Faster",
    body: "Less context-switching, fewer bottlenecks, more momentum toward what actually matters.",
  },
];

export default function WhatWorkingWithMe() {
  return (
    <section className="py-24 bg-[#EEF3FA]">
      <div className="mx-auto max-w-5xl px-6 md:px-10">

        {/* Heading */}
        <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-tight text-[#0B1E3D] text-center mb-14">
          What working with me looks like
        </h2>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="
                bg-[#1E2D45]
                border border-[#334D6E]/40
                rounded-xl
                p-6
                transition-colors duration-200
                hover:bg-[#243455]
                hover:border-[#334D6E]
              "
            >
              {/* Icon inline with title */}
              <div className="flex items-center gap-2 mb-[0.5rem]">
                <Icon
                  size={17}
                  className="text-[#4D9EFF] shrink-0"
                  strokeWidth={2}
                />
                <h3 className="font-display text-[1.0625rem] font-bold text-[#F0F4FA] leading-snug">
                  {title}
                </h3>
              </div>

              {/* Body */}
              <p className="text-[0.875rem] text-[#A8BACE] leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
