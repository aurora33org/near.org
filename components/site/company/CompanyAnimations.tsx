"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CompanyAnimations() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-company-hero]");
    const card = document.querySelector<HTMLElement>("[data-mission-card]");

    if (!hero || !card) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        card,
        { y: "100vh" },
        {
          y: "30vh",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-mission-wrapper]",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.2,
          },
        }
      );
    });

    return () => mm.revert();
  }, []);

  return null;
}
