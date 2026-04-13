"use client";

import Image from "next/image";
import { useState } from "react";

export function CompanyLogo({ name, domain }: { name: string; domain: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-stone text-sm font-medium">{name}</span>
    );
  }

  return (
    <Image
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      width={120}
      height={32}
      className="h-8 w-auto object-contain grayscale opacity-60"
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
