"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    // Store reference so the exact same function can be removed on cleanup
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // Recalculate scroll limit whenever the document height changes
    // (fonts loading, images rendering, code blocks, dynamic content)
    const ro = new ResizeObserver(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
    ro.observe(document.documentElement);

    // Also force a recalculation once everything (images, fonts) is fully loaded
    const onLoad = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
      ro.disconnect();
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return <>{children}</>;
}
