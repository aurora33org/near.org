import { Metadata } from "next";
import ThreadsClient from "@/components/site/ThreadsClient";
import WordCycle from "@/components/site/WordCycle";

export const metadata: Metadata = {
  title: "NEAR AI Private Chat — Talk to AI Without Anyone Watching",
  description:
    "Chat privately with AI about health, legal, financial, or personal topics. Hardware-encrypted, verified execution, zero data collection. Same models you trust, fully private.",
  openGraph: {
    title: "NEAR AI Private Chat — AI That Can't Spy on You",
    description:
      "Ask AI anything about health, legal, financial, or personal matters. End-to-end encrypted. Verified private. Your data is never stored, sold, or used for training.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const D = { fontFamily: "var(--font-display)" } as const;
const T = { fontFamily: "var(--font-tech)" } as const;

export default function PrivateChatPage() {
  return (
    <div className="bg-white text-black">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-black flex items-center overflow-hidden" style={{ minHeight: "70vh" }}>
        {/* Threads WebGL */}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <ThreadsClient
            color={[0.345, 0.584, 0.847]}
            amplitude={1.2}
            distance={0.5}
            enableMouseInteraction
          />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} aria-hidden="true" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-8">
            <span style={T} className="text-[#5895d8] text-xs tracking-widest uppercase border border-[#5895d8]/30 rounded-full px-3 py-1">
              NEAR AI Private Chat
            </span>
          </div>

          {/* Rotating headline */}
          <p style={T} className="text-white/40 text-sm tracking-widest uppercase mb-4">
            Talk to AI like your&nbsp;<WordCycle />
          </p>

          <h1
            style={D}
            className="text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-5"
          >
            Talk to AI Like<br />No One Is Listening.
          </h1>
          <p className="text-base lg:text-lg text-white/60 leading-relaxed max-w-xl mx-auto mb-10">
            Same AI models you already trust. Running inside hardware-encrypted environments where
            no one can read your conversations — not the model provider, not us.
          </p>

          <a
            href="https://private-chat.near.ai/welcome"
            target="_blank"
            rel="noreferrer"
            style={D}
            className="inline-block px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
          >
            Start Chatting Privately →
          </a>

          <p className="text-white/25 text-xs mt-6" style={T}>
            🔒 End-to-end encrypted · Verified private execution · No sign-up required
          </p>
        </div>
      </section>

      {/* ── FAMILIARITY + DIFFERENTIATION ───────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div>
            <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-6">
              Same AI. Actually private.
            </p>
            <h2 style={D} className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-black">
              The AI Chat You Already Know. The Privacy You&apos;ve Always Wanted.
            </h2>
            <p className="text-black/50 text-base leading-relaxed mt-6">
              You already use AI to think through problems and get answers. But every time you type
              something personal — a health concern, a legal question, a financial worry — you wonder:
              who else is reading this?
            </p>
            <p className="text-black/50 text-base leading-relaxed mt-4">
              NEAR AI Private Chat runs the same AI models you trust (OpenAI, DeepSeek) inside
              hardware-encrypted environments where no one can see your conversations. Not the model
              provider. Not the cloud operator. Not us.
            </p>
            <a
              href="https://private-chat.near.ai/welcome"
              target="_blank"
              rel="noreferrer"
              style={D}
              className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-[#5895d8] transition-colors mt-6"
            >
              Try it free →
            </a>
          </div>

          {/* Model trust logos (text badges) */}
          <div className="pt-1 space-y-3">
            {[
              { provider: "OpenAI", model: "GPT OSS 120B", note: "General-purpose · 131K context" },
              { provider: "DeepSeek", model: "DeepSeek V3.1", note: "Deep reasoning · 128K context" },
              { provider: "Zhipu AI", model: "GLM-4.6 FP8", note: "Long-doc analysis · 200K context" },
              { provider: "Alibaba Qwen", model: "Qwen3 30B", note: "Cost-efficient · 262K context" },
            ].map((m, i) => (
              <div
                key={m.model}
                className="flex items-center justify-between px-5 py-4 border border-black/8 hover:border-[#5895d8]/30 hover:bg-[#5895d8]/[0.02] transition-all group"
              >
                <div>
                  <p style={D} className="text-sm font-semibold text-black">{m.model}</p>
                  <p style={T} className="text-black/30 text-xs mt-0.5">{m.note}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-black/25 text-xs">{m.provider}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5895d8]" title="Hardware encrypted" />
                </div>
              </div>
            ))}
            <p style={T} className="text-black/25 text-xs px-1 pt-1">
              All models run inside hardware-encrypted TEEs.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4 PILLARS ───────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            How NEAR AI does privacy differently
          </p>
          <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-black">
            Other chat apps promise privacy in their terms of service.
          </h2>
          <p className="text-black/40 text-base mb-12">We prove it with hardware and math.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/8">
            {[
              {
                num: "01",
                title: "Your Conversations Stay Yours",
                label: "Private",
                body: "Your chats run inside Trusted Execution Environments — hardware-encrypted areas inside Intel and NVIDIA processors. A locked vault that processes your questions without anyone peeking inside. Not even NEAR AI.",
              },
              {
                num: "02",
                title: "Encrypted at Every Layer",
                label: "Secure",
                body: "TEEs are encrypted areas inside CPUs and GPUs that run code in total isolation. Your data can't be seen by the OS, the cloud provider, or any other application on the same server.",
              },
              {
                num: "03",
                title: "Don't Trust. Verify.",
                label: "Verifiable",
                body: "Each session generates a cryptographic attestation — a digital certificate you can check yourself to verify the TEE is genuine and running the exact code it's supposed to.",
              },
              {
                num: "04",
                title: "Your Data Stays Your Data",
                label: "Yours",
                body: "Your conversations are never stored, mined, or used to train models. Model providers, cloud providers, and NEAR AI itself can't access, read, or profit from anything you type.",
              },
            ].map((p) => (
              <div
                key={p.num}
                className="bg-white p-8 hover:bg-[#5895d8]/[0.02] transition-colors relative overflow-hidden group"
              >
                <span
                  style={{ ...D, lineHeight: 1 }}
                  className="absolute -bottom-2 -right-1 text-[64px] font-black text-black/[0.04] select-none pointer-events-none group-hover:text-[#5895d8]/[0.06] transition-colors"
                  aria-hidden="true"
                >
                  {p.num}
                </span>
                <p style={T} className="text-[#5895d8] text-xs tracking-widest mb-1">{p.num}</p>
                <p style={T} className="text-black/30 text-xs tracking-widest uppercase mb-3">{p.label}</p>
                <h3 style={D} className="text-sm font-bold mb-3 text-black">{p.title}</h3>
                <p className="text-black/40 text-xs leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            What makes Private Chat different
          </p>
          <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-12 text-black">
            A Different Kind of Privacy
          </h2>

          <div className="space-y-px bg-black/8">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr] bg-white px-6 py-3">
              <div />
              <p style={T} className="text-black/30 text-xs uppercase tracking-widest">Typical AI Chat</p>
              <p style={T} className="text-[#5895d8] text-xs uppercase tracking-widest">NEAR AI Private Chat</p>
            </div>
            {[
              { label: "Your data", bad: "Stored on provider servers", good: "Never stored, never accessed" },
              { label: "Who can read it", bad: "Provider employees & pipelines", good: "No one — hardware-enforced" },
              { label: "Training", bad: "May train on your inputs", good: "Never used for training" },
              { label: "Privacy proof", bad: "Terms of service (a promise)", good: "Cryptographic attestation (a proof)" },
              { label: "Encryption", bad: "In transit only", good: "In transit + during processing" },
              { label: "Models available", bad: "Provider's own model only", good: "Multiple open-source models" },
            ].map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[2fr_1fr_1fr] bg-white px-6 py-4 hover:bg-gray-50 transition-colors items-center"
              >
                <p style={D} className="text-sm font-semibold text-black">{row.label}</p>
                <p className="text-black/35 text-xs leading-snug pr-4">{row.bad}</p>
                <div className="flex items-start gap-1.5">
                  <span className="text-[#5895d8] text-xs shrink-0 mt-0.5">✓</span>
                  <p className="text-black/60 text-xs leading-snug">{row.good}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-black/30 text-sm mt-6 border-l-2 border-[#5895d8]/30 pl-4 italic">
            This isn&apos;t about trusting a different company. It&apos;s about removing the need to trust anyone.
          </p>
        </div>
      </section>

      {/* ── USE CASES ───────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            Use cases
          </p>
          <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-black">
            Ask Anything. Privately.
          </h2>
          <p className="text-black/40 text-base mb-12">
            Whether it&apos;s personal, professional, or sensitive — your conversations stay between you and the AI.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8">
            {[
              {
                num: "01",
                title: "Health Questions",
                body: "Research symptoms, understand diagnoses, prepare for doctor visits — without your health data being stored or shared.",
              },
              {
                num: "02",
                title: "Legal Concerns",
                body: "Explore your rights, understand contracts, prepare questions for your lawyer — without creating a record anyone can access.",
              },
              {
                num: "03",
                title: "Financial Planning",
                body: "Analyze investments, plan budgets, understand tax implications — without your financial information being harvested.",
              },
              {
                num: "04",
                title: "Research & Ideas",
                body: "Explore sensitive topics, brainstorm freely, test controversial hypotheses — without worrying about judgment or surveillance.",
              },
              {
                num: "05",
                title: "Work & Career",
                body: "Draft resignation letters, negotiate salary, discuss workplace issues — without leaving a digital trail on company servers.",
              },
              {
                num: "06",
                title: "Personal Matters",
                body: "Relationships, mental health, family issues, personal struggles — ask AI for perspective without anyone knowing.",
              },
            ].map((card) => (
              <div
                key={card.num}
                className="bg-white p-8 hover:bg-[#5895d8]/[0.02] transition-colors relative overflow-hidden group"
              >
                <span
                  style={{ ...D, lineHeight: 1 }}
                  className="absolute -bottom-2 -right-1 text-[64px] font-black text-black/[0.04] select-none pointer-events-none group-hover:text-[#5895d8]/[0.06] transition-colors"
                  aria-hidden="true"
                >
                  {card.num}
                </span>
                <p style={T} className="text-[#5895d8] text-xs tracking-widest mb-3">{card.num}</p>
                <h3 style={D} className="text-sm font-bold mb-2 text-black">{card.title}</h3>
                <p className="text-black/40 text-xs leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          <p style={T} className="text-black/25 text-xs mt-6">
            Not a substitute for professional medical, legal, or financial advice. Always consult qualified professionals for important decisions.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────── */}
      <section className="py-24 px-8 bg-black relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #5895d8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 style={D} className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4 text-white">
            Chat <em className="not-italic text-[#5895d8]">Freely.</em>
          </h2>
          <p className="text-white/45 text-base mb-3 max-w-sm mx-auto">
            No sign-up required. No credit card. No data collection.
          </p>
          <p style={T} className="text-white/25 text-xs mb-10 tracking-widest uppercase">
            Just private AI.
          </p>
          <a
            href="https://private-chat.near.ai/welcome"
            target="_blank"
            rel="noreferrer"
            style={D}
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
          >
            Start Chatting →
          </a>
        </div>
      </section>

    </div>
  );
}
