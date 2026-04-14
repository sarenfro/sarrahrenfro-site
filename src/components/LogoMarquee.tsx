"use client";

import { CompanyLogo } from "@/components/CompanyLogo";

const companies = [
  { name: "Boeing", slug: "boeing" },
  { name: "T-Mobile", slug: "tmobile" },
  { name: "TD Bank", slug: "tdbank" },
  { name: "Microsoft", slug: "microsoft" },
];

export default function LogoMarquee() {
  // Duplicate for seamless loop
  const items = [...companies, ...companies];

  return (
    <div className="overflow-hidden">
      <div className="flex animate-marquee gap-20 w-max items-center">
        {items.map((company, i) => (
          <div key={i} className="flex items-center justify-center h-12 shrink-0">
            <CompanyLogo name={company.name} slug={company.slug} />
          </div>
        ))}
      </div>
    </div>
  );
}
