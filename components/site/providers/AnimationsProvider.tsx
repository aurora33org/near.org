"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AnimationsProvider() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {

        document.querySelectorAll("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 28, duration: 0.75, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          });
        });

        document.querySelectorAll("[data-reveal-group]").forEach((group) => {
          const items = group.querySelectorAll("[data-reveal-item]");
          if (!items.length) return;
          gsap.from(items, {
            opacity: 0, y: 28, duration: 0.75, ease: "power2.out", stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 82%", once: true },
          });
        });

        const blueCard = document.querySelector("[data-reveal-scale]");
        if (blueCard) {
          gsap.from(blueCard, {
            opacity: 0, scale: 0.97, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: blueCard, start: "top 82%", once: true },
          });
        }

        document.querySelectorAll("[data-reveal-partners]").forEach((group) => {
          const rows = group.querySelectorAll("[data-reveal-row]");
          if (!rows.length) return;
          gsap.from(rows, {
            opacity: 0, y: 20, duration: 0.6, ease: "power2.out", stagger: 0.06,
            scrollTrigger: { trigger: group, start: "top 82%", once: true },
          });
        });

        const howItWorks = document.querySelector("[data-how-it-works]");
        const ringOuter  = document.querySelector("[data-ring-outer]");
        const ringMid    = document.querySelector("[data-ring-mid]");
        const ringInner  = document.querySelector("[data-ring-inner]");
        const ringCore   = document.querySelector("[data-ring-core]");

        if (howItWorks && ringOuter && ringMid && ringInner && ringCore) {
          gsap.set([ringOuter, ringMid, ringInner, ringCore], { transformOrigin: "50% 50%" });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: howItWorks,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.8,
            },
          });

          tl.fromTo(ringOuter, { rotation: -18 }, { rotation:  0, ease: "power2.inOut", duration: 0.48 }, 0)
            .to(ringOuter,                         { rotation: 18, ease: "power2.inOut", duration: 0.49 }, 0.51)
            .fromTo(ringMid,   { rotation:  32 }, { rotation:  0, ease: "power2.inOut", duration: 0.48 }, 0)
            .to(ringMid,                           { rotation:-32, ease: "power2.inOut", duration: 0.49 }, 0.51)
            .fromTo(ringInner, { rotation: -50 }, { rotation:  0, ease: "power2.inOut", duration: 0.48 }, 0)
            .to(ringInner,                         { rotation: 50, ease: "power2.inOut", duration: 0.49 }, 0.51)
            .fromTo(ringCore,  { rotation:  70 }, { rotation:  0, ease: "power2.inOut", duration: 0.48 }, 0)
            .to(ringCore,                          { rotation:-70, ease: "power2.inOut", duration: 0.49 }, 0.51);
        }

        const b2Section = document.querySelector("[data-b2-section]");
        const b2Outer   = document.querySelector("[data-b2-outer]");
        const b2Mid     = document.querySelector("[data-b2-mid]");
        const b2Inner   = document.querySelector("[data-b2-inner]");
        const b2Core    = document.querySelector("[data-b2-core]");

        if (b2Section && b2Outer && b2Mid && b2Inner && b2Core) {
          gsap.set([b2Outer, b2Mid, b2Inner, b2Core], { transformOrigin: "50% 50%" });

          const tl2 = gsap.timeline({
            scrollTrigger: {
              trigger: b2Section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.8,
            },
          });

          tl2.fromTo(b2Outer, { rotation: -18 }, { rotation:  0, ease: "power2.inOut", duration: 0.48 }, 0)
             .to(b2Outer,                         { rotation: 18, ease: "power2.inOut", duration: 0.49 }, 0.51)
             .fromTo(b2Mid,   { rotation:  32 }, { rotation:  0, ease: "power2.inOut", duration: 0.48 }, 0)
             .to(b2Mid,                           { rotation:-32, ease: "power2.inOut", duration: 0.49 }, 0.51)
             .fromTo(b2Inner, { rotation: -50 }, { rotation:  0, ease: "power2.inOut", duration: 0.48 }, 0)
             .to(b2Inner,                         { rotation: 50, ease: "power2.inOut", duration: 0.49 }, 0.51)
             .fromTo(b2Core,  { rotation:  50 }, { rotation:  0, ease: "power2.inOut", duration: 0.48 }, 0)
             .to(b2Core,                          { rotation:-50, ease: "power2.inOut", duration: 0.49 }, 0.51);
        }

        const stackHeader = document.querySelector("[data-stack-header]") as HTMLElement | null;
        const cardLast = document.querySelector("[data-stack-card-last]") as HTMLElement | null;

        if (stackHeader && cardLast) {
          ScrollTrigger.create({
            trigger: cardLast,
            start: "top 136px",
            onEnter: () => {
              gsap.to(stackHeader, {
                y: -stackHeader.offsetHeight - 32,
                duration: 0.35,
                ease: "power2.in",
              });
            },
            onLeaveBack: () => {
              gsap.to(stackHeader, {
                y: 0,
                duration: 0.35,
                ease: "power2.out",
              });
            },
          });
        }

      });
      return () => ctx.revert();
    });

    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
      const ctx = gsap.context(() => {

        const card1 = document.querySelector("[data-hero-card-1]");
        const card2 = document.querySelector("[data-hero-card-2]");
        const heroSection = document.querySelector("[data-hero-section]");

        if (card1 && heroSection) {
          gsap.to(card1, {
            y: -100,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "+=500",
              scrub: 0.6,
            },
          });
        }

        if (card2 && heroSection) {
          gsap.to(card2, {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "+=900",
              scrub: 1.5,
            },
          });
        }

        gsap.to("[data-parallax-slow]", {
          y: "40%",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-parallax-slow]",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        gsap.to("[data-parallax-mid]", {
          y: "-40%",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero-section]",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to("[data-parallax-dragon]", {
          y: "-22%",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-parallax-dragon]",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        gsap.to("[data-parallax-card]", {
          y: "10%",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-parallax-card]",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

      });

      return () => ctx.revert();
    });

    function equalizeStackCards() {
      const cards = Array.from(
        document.querySelectorAll<HTMLElement>("[data-stack-card]")
      );
      if (cards.length < 2) return;
      cards.forEach((c) => (c.style.height = "auto"));
      const maxH = Math.max(...cards.map((c) => c.offsetHeight));
      cards.forEach((c) => (c.style.height = `${maxH}px`));
    }

    equalizeStackCards();
    const ro = new ResizeObserver(equalizeStackCards);
    ro.observe(document.documentElement);

    return () => {
      mm.revert();
      ro.disconnect();
    };
  }, []);

  return null;
}
