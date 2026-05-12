"use client";

import Image from "next/image";
import { useState } from "react";
import { FIRM } from "@/lib/firm";

export function AboutPortraitCard() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="about-portrait-card reveal d1">
      <div className="about-portrait-media">
        <Image
          src="/portrait.jpg"
          alt={`${FIRM.founder.name} — ${FIRM.founder.title}`}
          fill
          sizes="(max-width: 900px) 100vw, 340px"
          className={`show-portrait about-portrait${isLoaded ? " is-loaded" : ""}`}
          onLoad={() => setIsLoaded(true)}
        />
        <div className="about-portrait-shade" />
      </div>
      <div className="about-portrait-copy">
        <span className="mono">FOUNDER</span>
        <strong>{FIRM.founder.name}</strong>
        <p>{FIRM.founder.title}</p>
      </div>
    </div>
  );
}
