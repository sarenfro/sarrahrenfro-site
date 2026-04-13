"use client";

import Image from "next/image";
import { useState } from "react";

export function CompanyLogo({ name, slug }: { name: string; slug: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className="text-stone text-sm font-medium">{name}</span>;
  }

  return (
    <Image
      src={`/logos/${slug}.svg`}
      alt={name}
      width={120}
      height={32}
      className="h-8 w-auto object-contain grayscale opacity-60 transition-all duration-300 hover:h-12 hover:grayscale-0 hover:opacity-100"
      onError={() => setFailed(true)}
    />
  );
}
