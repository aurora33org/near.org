"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import IsoCube from "@/components/site/IsoCube";

const CUBES: { x: number; y: number; scale: number; top: string; left: string; opacity: number }[] = [
  { x: 0, y: 0, scale: 2.8, top: "8%",  left: "2%",   opacity: 0.06 },
  { x: 0, y: 0, scale: 1.6, top: "18%", left: "12%",  opacity: 0.04 },
  { x: 0, y: 0, scale: 3.4, top: "60%", left: "78%",  opacity: 0.07 },
  { x: 0, y: 0, scale: 2.0, top: "75%", left: "88%",  opacity: 0.05 },
  { x: 0, y: 0, scale: 1.4, top: "82%", left: "6%",   opacity: 0.04 },
  { x: 0, y: 0, scale: 4.2, top: "30%", left: "70%",  opacity: 0.05 },
  { x: 0, y: 0, scale: 1.8, top: "50%", left: "55%",  opacity: 0.03 },
];

// EE#2 — sequence: ↓ ↓ ← → ↑
const OVERRIDE_SEQUENCE = ["ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp"];

type GhostPhase = "idle" | "glitching" | "vanishing" | "gone";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // EE#1
  const [ghostPhase, setGhostPhase] = useState<GhostPhase>("idle");
  const clickCountRef = useRef(0);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // EE#2
  const [showOverride, setShowOverride] = useState(false);
  const seqIndexRef = useRef(0);

  // EE#3
  const [showDevTag, setShowDevTag] = useState(false);
  const keyBufferRef = useRef("");
  const devTagTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.05,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // EE#2 & EE#3 keydown listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // EE#2
      if (e.key === OVERRIDE_SEQUENCE[seqIndexRef.current]) {
        seqIndexRef.current += 1;
        if (seqIndexRef.current === OVERRIDE_SEQUENCE.length) {
          seqIndexRef.current = 0;
          setShowOverride(true);
        }
      } else {
        seqIndexRef.current = e.key === OVERRIDE_SEQUENCE[0] ? 1 : 0;
      }

      // EE#3
      if (e.key.length === 1) {
        keyBufferRef.current = (keyBufferRef.current + e.key).slice(-3);
        if (keyBufferRef.current === "a33") {
          keyBufferRef.current = "";
          setShowDevTag(true);
          if (devTagTimerRef.current) clearTimeout(devTagTimerRef.current);
          devTagTimerRef.current = setTimeout(() => setShowDevTag(false), 3500);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // EE#1 — ghost click handler
  const handleGhostClick = useCallback(() => {
    if (ghostPhase === "vanishing" || ghostPhase === "gone") return;

    clickCountRef.current += 1;
    const count = clickCountRef.current;

    if (count === 3) {
      // 3rd click: start glitching
      setGhostPhase("glitching");
    } else if (count >= 4) {
      // 4th click: vanish then gone
      setGhostPhase("vanishing");
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = setTimeout(() => {
        setGhostPhase("gone");
        // reset back to idle after 6s so the egg can be triggered again
        phaseTimerRef.current = setTimeout(() => {
          setGhostPhase("idle");
          clickCountRef.current = 0;
        }, 6000);
      }, 900);
    }
    // clicks 1 & 2: silent — no visual change
  }, [ghostPhase]);

  const ghostVisible = ghostPhase !== "gone";
  const ghostOpacity =
    ghostPhase === "vanishing" ? 0
    : ghostPhase === "glitching" ? 0.055
    : 0.025;
  const ghostShadow =
    ghostPhase === "glitching"
      ? "6px 0 rgba(255,30,30,0.85), -6px 0 rgba(0,255,200,0.85), 0 0 30px rgba(255,255,255,0.1)"
      : ghostPhase === "vanishing"
      ? "12px 0 rgba(255,0,0,1), -12px 0 rgba(0,255,220,1), 0 0 80px rgba(255,80,80,0.5)"
      : "none";
  const ghostClass =
    ghostPhase === "glitching" ? "ghost-glitch"
    : ghostPhase === "vanishing" ? "ghost-vanish"
    : "";

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B0B0B] text-white overflow-hidden">

      <style>{`
        @keyframes glitch-shake {
          0%,100% { transform: skewX(-3deg) translateX(0); }
          20%     { transform: skewX(-6deg) translateX(-6px); }
          40%     { transform: skewX(4deg)  translateX(5px); }
          60%     { transform: skewX(-5deg) translateX(-4px); }
          80%     { transform: skewX(3deg)  translateX(6px); }
        }
        @keyframes vanish-shake {
          0%,100% { transform: skewX(-8deg) translateX(0) scaleX(1.02); }
          15%     { transform: skewX(10deg)  translateX(-10px) scaleX(0.98); }
          30%     { transform: skewX(-12deg) translateX(12px) scaleX(1.04); }
          50%     { transform: skewX(8deg)   translateX(-8px) scaleX(0.97); }
          70%     { transform: skewX(-10deg) translateX(10px) scaleX(1.03); }
        }
        @keyframes msg-appear {
          from { opacity: 0; letter-spacing: 0.5em; }
          to   { opacity: 1; letter-spacing: 0.25em; }
        }
        @keyframes overlay-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
        @keyframes dev-tag-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ghost-glitch  { animation: glitch-shake 0.1s infinite; }
        .ghost-vanish  { animation: vanish-shake 0.08s infinite; }
        .top-msg       { animation: msg-appear 0.8s ease-out forwards; }
        .attest-modal  { animation: overlay-in 0.25s ease-out forwards; }
        .dev-tag-enter { animation: dev-tag-in 0.3s ease-out forwards; }
      `}</style>

      {/* Particle field */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" aria-hidden />

      {/* Grid lines */}
      <div className="absolute inset-0 hidden lg:grid grid-cols-4 pointer-events-none z-0 opacity-[0.04]">
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="h-full" />
      </div>

      {/* Background IsoCubes */}
      {mounted && CUBES.map((c, i) => (
        <div key={i} className="absolute pointer-events-none z-0" style={{ top: c.top, left: c.left, opacity: c.opacity }}>
          <svg width={200 * c.scale} height={120 * c.scale} viewBox={`${-80 * c.scale} ${-80 * c.scale} ${160 * c.scale} ${120 * c.scale}`}>
            <IsoCube x={c.x} y={c.y} scale={c.scale} topFill="#ffffff" leftFill="#cccccc" rightFill="#888888" />
          </svg>
        </div>
      ))}

      {/* EE#1 — big top message after ghost disappears */}
      {ghostPhase === "gone" && (
        <div className="absolute top-28 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <span
            className="top-msg font-mono text-white/40 uppercase select-none text-center px-4"
            style={{ fontSize: "clamp(0.75rem, 1.8vw, 1rem)", letterSpacing: "0.45em" }}
          >
            no signal detected.
          </span>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between py-8 px-5 sm:px-10 lg:px-[100px] text-[0.75rem] uppercase tracking-[0.2em] text-white/80">
        <a href="/"><Image src="/near-ai.png" alt="NEAR AI" width={120} height={24} style={{ width: "auto", height: "24px" }} /></a>
        <a href="/company" className="hover:text-white transition-colors">OUR COMPANY</a>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 text-center select-none">

        {/* Ghost 404 — EE#1 */}
        {ghostVisible && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <span
              onClick={handleGhostClick}
              className={`font-sans font-bold cursor-default ${ghostClass}`}
              style={{
                fontSize: "clamp(18rem, 40vw, 52rem)",
                lineHeight: 1,
                color: `rgba(255,255,255,${ghostOpacity})`,
                textShadow: ghostShadow,
                letterSpacing: "-0.05em",
                opacity: ghostPhase === "vanishing" ? 0 : 1,
                transition: ghostPhase === "vanishing" ? "opacity 0.7s ease-in, color 0.3s" : "color 0.2s, text-shadow 0.2s",
                userSelect: "none",
                WebkitUserSelect: "none",
                outline: "none",
              }}
            >
              404
            </span>
          </div>
        )}

        {/* Foreground content */}
        <div className="relative flex flex-col items-center gap-8 max-w-lg">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-white/40">Error · 404</p>

          <h1 className="font-sans font-medium text-white leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Page Not Found
          </h1>

          <p className="text-white/45 leading-relaxed text-balance" style={{ fontSize: "var(--font-size-body)" }}>
            You&apos;re in a secure environment. Whatever you were looking for just isn&apos;t here.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Link
              href="/"
              className="flex items-center gap-3 border border-white/20 rounded-full pl-1.5 pr-6 py-1.5 text-white/70 hover:text-white hover:border-white/40 transition-all duration-200"
              style={{ fontSize: "var(--font-size-body)" }}
            >
              <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
              </div>
              Back to home
            </Link>
            <Link href="/blog" className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors">
              Read the blog →
            </Link>
          </div>

          {/* Attestation card */}
          <div className="mt-8 border border-white/10 rounded-lg px-6 py-4 text-left w-full max-w-sm">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/25 mb-2">NEAR AI · Route Attestation</p>
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[0.6rem] text-white/20">
                <span>STATUS</span><span className="text-white/40">SECURE</span>
              </div>
              <div className="flex justify-between font-mono text-[0.6rem] text-white/20">
                <span>ENVIRONMENT</span><span>TEE / NEAR AI CLOUD</span>
              </div>
              <div className="flex justify-between font-mono text-[0.6rem] text-white/20">
                <span>ROUTE</span><span>NOT FOUND</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-5 sm:px-10 lg:px-[100px] py-8 flex items-center justify-between border-t border-white/[0.06]">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/20">© 2026 Jasnah Inc., DBA as NEAR AI</p>
        <a href="https://x.com/near_ai" target="_blank" rel="noopener noreferrer" className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors">
          @near_ai
        </a>
      </footer>

      {/* ── Easter Egg #2 — Secure environment overlay ── */}
      {showOverride && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setShowOverride(false)}
        >
          <div
            className="attest-modal relative max-w-xs w-full mx-4 flex flex-col items-center gap-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Spinner */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div
                className="absolute inset-0 rounded-full border-t border-white/50"
                style={{ animation: "spin 1.2s linear infinite" }}
              />
              <div className="absolute inset-[6px] rounded-full border border-white/[0.06]" />
              <div
                className="absolute inset-[6px] rounded-full border-t border-white/25"
                style={{ animation: "spin 2s linear infinite reverse" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-white/60">
                Loading secure environment
                <span style={{ animation: "blink 1s step-end infinite" }}>_</span>
              </p>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/20">
                Establishing TEE connection
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-px bg-white/[0.06] overflow-hidden rounded-full">
              <div
                className="h-full bg-white/30 rounded-full"
                style={{ animation: "progress-bar 3s ease-out forwards" }}
              />
            </div>

            <a
              href="/"
              className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors border border-white/10 hover:border-white/25 rounded px-5 py-2"
            >
              Go to home →
            </a>
          </div>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {/* ── Easter Egg #3 — dev by Aurora33 ── */}
      {showDevTag && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none dev-tag-enter">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/25 border border-white/10 rounded px-3 py-1.5 bg-[#0B0B0B]/80 backdrop-blur-sm block">
            dev by Aurora33
          </span>
        </div>
      )}
    </div>
  );
}
