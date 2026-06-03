import { Hexagon } from "lucide-react";
import PillButton from "@/components/site/PillButton";
import IsoCube from "@/components/site/IsoCube";
import IsoLayer from "@/components/site/IsoLayer";
import AnimationsProvider from "@/components/site/providers/AnimationsProvider";
import GridLines from "@/components/site/v2/GridLines";
import SiteHeader from "@/components/site/SiteHeader";
import FeatureCard from "@/components/site/v2/FeatureCard";
import UseCaseCard from "@/components/site/v2/UseCaseCard";
import PartnerRow from "@/components/site/v2/PartnerRow";
import ConcentricRings from "@/components/site/v2/ConcentricRings";
import SiteFooter from "@/components/site/SiteFooter";


const PARTNERS = [
  {
    category: "Financial Autopilot", context: "via IronClaw",
    logo: "/logos/typo-abound.png", logoH: "h-10",
    desc: "AI Financial Autopilot connecting to regulated Indian bank accounts via IronClaw. No credentials stored at any point.",
    note: ">> Backed by Times of India Group",
  },
  {
    category: "Private LLM Platform", context: "on NEAR AI Cloud",
    logo: "/logos/typo-venice.png", logoH: "h-10",
    desc: "Privacy-first AI platform running production inference on NEAR AI Cloud.",
    note: ">> venice.ai",
  },
  {
    category: "Browser", context: "in Brave Nightly",
    logo: "/logos/typo-brave.png", logoH: "h-10",
    desc: "Confidential inference integrated into Brave Nightly.",
    note: ">> brave.com",
  },
  {
    category: "Government", context: "Sovereign workload",
    logo: "/logos/typo-bermuda-goverment.png", logoH: "h-10",
    desc: "Confidential AI workloads running on NEAR AI infrastructure.",
    note: ">> gov.bm",
  },
];

const HOW_IT_WORKS = [
  { label: "Hardware Isolation", text: "IronClaw runs inside a Trusted Execution Environment. Nothing leaks out. No one can see in." },
  { label: "Triple Lockout", text: "The host OS, GPU operator, and NEAR AI itself are cryptographically excluded from the execution context." },
  { label: "Independent Verification", text: "Every request returns a hardware-signed attestation certificate any third party can independently verify." },
];

const USE_CASES = [
  {
    number: "#01", title: "Repetitive Work / Ops Automation",
    icon: "/icons/repetitive.svg",
    description: "Your team is spending hours on work an agent can handle. Scheduling, data pulls, document processing, reporting, summarization. Connect IronClaw to your stack, define the workflow, and let it run. Your team gets the output without doing the work.",
    align: "left" as const, zIndex: 10,
  },
  {
    number: "#02", title: "Internal Knowledge & Research",
    icon: "/icons/internal.png",
    description: "Stop losing context across tools, threads, and teammates. IronClaw monitors your Slack, email, Notion, and internal docs and builds a live picture of what’s happening across your organization. Ask it anything. Get the answer from your own data, not a guess.",
    align: "center" as const, zIndex: 20, marginTop: "40px",
  },
  {
    number: "#03", title: "Any Team Buying or Building AI",
    icon: "/icons/building.png",
    description: "The hardest part isn’t the model — it’s everything around it. IronClaw handles the secure execution layer so you don’t have to build it from scratch. Drop it into your stack, connect your tools, and ship AI features your customers can trust. Every run is verifiable.",
    align: "right" as const, zIndex: 30, marginTop: "40px",
  },
];

export default function HomePage() {
  return (
    <div className="relative w-full font-sans bg-[#e4e4e4] text-[#101010]">
      <AnimationsProvider />
      <div className="relative w-full flex flex-col">

        {/* HERO */}
        <section data-hero-section className="relative min-h-dvh flex flex-col bg-gradient-to-b from-[#525252] from-[35%] to-[#ECECEC]">

          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-parallax-mid src="/demo-v1/LOGO_near 3.png" alt="" className="w-[1600px] opacity-100 translate-y-[112%]" />
          </div>

          <div className="absolute inset-0 z-[1] pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-parallax-slow src="/demo-v1/background-1.webp" alt="" className="w-full h-full object-cover object-center opacity-100 translate-y-[10%]" />
          </div>

          <GridLines variant="dark" />

          <div className="relative z-30 flex flex-col flex-1 mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">

            <SiteHeader />

            <main className="flex-grow flex flex-col md:flex-row pb-24 gap-8">

              <div className="w-full md:w-[40%] flex flex-col pt-8 lg:pt-12 relative z-40">
                <h1 data-reveal-hero-h1 className="text-balance text-white leading-[1.05] font-medium tracking-tight" style={{ fontSize: "var(--font-size-h1)" }}>
                  AI agents for the work your team has been afraid to automate.
                </h1>
                <div className="hidden lg:block absolute bottom-12 left-0 text-[0.75rem] lg:text-[0.875rem] font-mono uppercase tracking-[0.3em] text-muted whitespace-nowrap">
                  &gt;&gt; CLIENT KEY PAIR<br />
                  &gt;&gt; ENVIRONMENT
                </div>
              </div>

              <div className="md:hidden self-start flex items-start gap-3 text-white/50 [font-size:var(--font-size-body)] font-mono tracking-widest">
                <Hexagon className="w-3 h-3 mt-0.5 shrink-0" />
                <span>NEAR AI runs sensitive workloads for enterprises, governments, and AI applications. Inference and agents execute inside hardware-enforced enclaves where requests are confidential by design and outputs are independently verifiable.</span>
              </div>

              <div className="w-full md:w-[30%] flex flex-col items-center md:pt-[8vh] lg:pt-[15vh] relative z-30">
                <div data-hero-card-1 className="w-full bg-[#E6E6E6] rounded-[2rem] p-6 shadow-2xl border border-white/40 lg:mt-[12vh]">
                  <div className="text-[0.75rem] lg:text-[0.875rem] font-mono uppercase tracking-widest mb-4 text-muted">IronClaw</div>
                  <h3 className="text-balance font-medium leading-[1.15] mb-6 text-[#101010] [font-size:var(--font-size-h3)]">
                    Your AI agent framework, private by default.
                  </h3>
                  <p className="text-pretty [font-size:var(--font-size-body)] font-mono text-muted leading-relaxed mb-8">
                    Run autonomous agents inside hardware-enforced enclaves with zero operator access.
                  </p>
                  <div className="flex justify-end">
                    <PillButton href="https://ironclaw.com" target="_blank" rel="noopener noreferrer" label="Explore IronClaw" />
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[30%] flex flex-col items-center md:pt-[10vh] lg:pt-[20vh] relative z-30">
                <div className="hidden md:flex order-2 md:order-1 self-start items-start gap-3 text-white/50 [font-size:var(--font-size-body)] font-mono tracking-widest pt-8 md:pt-0">
                  <Hexagon className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>NEAR AI runs sensitive workloads for enterprises, governments, and AI applications. Inference and agents execute inside hardware-enforced enclaves where requests are confidential by design and outputs are independently verifiable.</span>
                </div>
                <div data-hero-card-2 className="order-1 md:order-2 w-full bg-[#E6E6E6] rounded-[2rem] p-6 shadow-2xl border border-white/50 mt-6 lg:mt-[8vh]">
                  <div className="text-[0.75rem] lg:text-[0.875rem] font-mono uppercase tracking-widest mb-4 text-muted">NEAR AI Cloud</div>
                  <h3 className="text-balance font-medium leading-[1.15] mb-6 text-[#101010] [font-size:var(--font-size-h3)]">
                    Deploy private models. Start in minutes.
                  </h3>
                  <p className="text-pretty [font-size:var(--font-size-body)] font-mono text-muted leading-relaxed mb-8">
                    Scalable confidential inference for teams that can&apos;t afford to compromise.
                  </p>
                  <div className="flex justify-end">
                    <PillButton href="https://cloud.near.ai" target="_blank" rel="noopener noreferrer" label="Start Building" />
                  </div>
                </div>
              </div>

            </main>
          </div>
        </section>

        {/* FEATURES */}
        <section className="relative flex flex-col pt-4 lg:pt-6 bg-gradient-to-b from-[#ECECEC] to-[#ECECEC]">
          <GridLines variant="light" />
          <div className="relative z-10 mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
            <h2 className="text-pretty text-[#101010] font-medium leading-[1.15] tracking-tight [font-size:var(--font-size-h2)] mb-10">
              Confidential AI Infrastructure
            </h2>
            <div data-reveal-group className="flex flex-col md:flex-row gap-10 w-full items-stretch">

              <FeatureCard title="IronClaw" description="An AI agent that connects to your tools, runs your workflows, and gets things done without you babysitting it. Secure by default, open source, and built to handle real business tasks." href="https://ironclaw.com" cta="Meet IronClaw">
                <svg width="200" height="200" viewBox="-100 -100 200 200" className="overflow-visible scale-75 xl:scale-100">
                  <IsoCube x={-33} y={-19} scale={0.8} />
                  <IsoCube x={33} y={-19} scale={0.8} />
                  <IsoCube x={0} y={0} scale={0.8} />
                  <IsoCube x={0} y={-44} scale={0.8} />
                  <IsoCube x={0} y={44} scale={0.8} />
                  <IsoCube x={-33} y={19} scale={0.8} />
                  <IsoCube x={33} y={19} scale={0.8} />
                </svg>
              </FeatureCard>

              <FeatureCard title="NEAR AI Cloud" description="Where everything runs. Every job executes in a sealed environment with no outside access. The infrastructure handles security by default so you don't have to." href="https://cloud.near.ai" cta="Start Building">
                <svg width="200" height="200" viewBox="-100 -110 200 220" className="overflow-visible scale-75 xl:scale-100">
                  <IsoLayer yOffset={45} topF="#888888" leftF="#555555" rightF="#333333" />
                  <IsoLayer yOffset={0} topF="#c4c4c4" leftF="#999999" rightF="#666666" />
                  <IsoLayer yOffset={-45} topF="#ffffff" leftF="#d4d4d4" rightF="#a0a0a0" />
                </svg>
              </FeatureCard>

              <FeatureCard title="Agent Marketplace" description="Agents built for real business workflows. Finance, legal, ops, research, and security. Browse what's available, deploy what you need, list your own." href="https://market.near.ai" cta="Browse The Marketplace">
                <svg width="200" height="200" viewBox="-100 -100 200 200" className="overflow-visible scale-75 xl:scale-100">
                  <IsoCube x={-33} y={-30} scale={0.8} topFill="#d4d4d4" leftFill="#a0a0a0" rightFill="#787878" />
                  <IsoCube x={33} y={-30} scale={0.8} topFill="#e8e8e8" leftFill="#b4b4b4" rightFill="#909090" />
                  <IsoCube x={0} y={10} scale={0.8} topFill="#f0f0f0" leftFill="#c4c4c4" rightFill="#a0a0a0" />
                  <IsoCube x={-33} y={10} scale={0.8} topFill="#c8c8c8" leftFill="#969696" rightFill="#6e6e6e" />
                  <IsoCube x={33} y={10} scale={0.8} topFill="#dcdcdc" leftFill="#aaaaaa" rightFill="#848484" />
                </svg>
              </FeatureCard>

            </div>
          </div>
        </section>

        {/* HOW NEAR AI WORKS */}
        <section data-b2-section className="relative bg-[#ECECEC] py-20 lg:py-32 overflow-hidden">
          <div className="relative z-10 mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
            <h2 className="lg:hidden font-sans font-medium leading-[1.1] tracking-tight text-[#101010] mb-8 [font-size:var(--font-size-h2)]">
              How NEAR AI works
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 items-center">

              <ConcentricRings />

              <div className="order-1 lg:order-1">
                <div className="mb-10">
                  {HOW_IT_WORKS.map(({ label, text }, i, arr) => (
                    <div key={label} className={`relative ${i !== 0 ? "pt-6" : ""} pb-6 flex flex-col gap-2`}>
                      {i !== 0 && <div className="absolute top-0 left-0 h-px bg-[#101010]/10 z-[5]" style={{ right: "-90%" }} />}
                      {i === arr.length - 1 && <div className="absolute bottom-0 left-0 h-px bg-[#101010]/10 z-[5]" style={{ right: "-90%" }} />}
                      <span className="text-[#101010] font-medium tracking-[0.02em] [font-size:var(--font-size-h3)]">{label}</span>
                      <p className="text-pretty text-muted leading-[1.6]" style={{ fontSize: "var(--font-size-body)" }} dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                  ))}
                </div>
                <PillButton href="https://docs.near.ai" target="_blank" rel="noopener noreferrer" label="Read the docs" className="w-fit" />
              </div>

            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="relative bg-[#ECECEC]">
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
            <div className="relative pb-20">

              <div data-stack-header className="sticky top-0 z-[5] pt-12 pb-8 flex justify-between items-start">
                <h2 className="text-balance text-[2rem] lg:text-[2.75rem] font-medium leading-[1.1] tracking-tight text-[#101010]">
                  Built for Real Work
                </h2>
                <div className="hidden md:block text-[0.75rem] lg:text-[0.875rem] text-muted font-mono tracking-[0.2em] uppercase text-right leading-relaxed shrink-0">
                  &gt;&gt; CLIENT KEY PAIR<br />
                  &gt;&gt; ENVIRONMENT
                </div>
              </div>

              {USE_CASES.map((card) => (
                <UseCaseCard key={card.number} {...card} />
              ))}

            </div>
          </div>
        </section>

        {/* PARTNERS */}
        <section className="relative bg-[#ECECEC]">
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20 pb-20">

            <div className="flex items-center gap-6 mb-12">
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.3em] text-muted shrink-0">PARTNERS</span>
              <div className="flex-1 border-t border-[#CAC8C8]" />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-16">
              <h2 className="text-balance font-medium leading-[1.1] tracking-tight text-[#101010] max-w-[920px] [font-size:var(--font-size-h2)]">
                Global enterprises and governments are using NEAR AI in production today.
              </h2>
              <div className="flex items-start gap-2 lg:ml-auto shrink-0 pb-2">
                <div className="hidden lg:flex flex-col justify-between self-stretch gap-[6px] shrink-0 py-1">
                  {[0,1,2,3].map(i => <div key={i} className="w-20 h-px bg-[#CAC8C8]" />)}
                </div>
                <p className="text-balance font-mono [font-size:var(--font-size-body)] text-muted leading-[1.15] max-w-[480px]">
                  NEAR AI Cloud and IronClaw serve production workloads for teams that cannot compromise on data confidentiality.
                </p>
              </div>
            </div>

            <div data-reveal-partners className="flex flex-col border-t border-[#CAC8C8]">
              {PARTNERS.map((p) => <PartnerRow key={p.category} {...p} />)}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-12">
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.3em] text-muted">
                Inference &amp; Infrastructure Partners&nbsp;&nbsp;/&nbsp;&nbsp;02
              </span>
              <div className="flex items-center gap-8 opacity-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/NVIDIA.png" alt="NVIDIA" className="h-5 w-auto object-contain" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/intel.png" alt="Intel" className="h-5 w-auto object-contain" />
              </div>
            </div>

          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="relative bg-[linear-gradient(to_bottom,#ECECEC_33%,#575757_100%)]">
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
            <div className="relative w-full rounded-[2rem] overflow-hidden min-h-[420px] lg:min-h-[480px] flex flex-col bg-gradient-to-b from-[#F3F3F3] via-[#E2E1E1] to-[#FCFCFC]">
              <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/demo-v1/LOGO_near 3.png" alt="" className="w-[600px] sm:w-[900px] lg:w-[1200px] opacity-20 translate-y-32" />
              </div>
              <div className="absolute inset-0 z-[1] pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-parallax-card src="/demo-v1/background-1.webp" alt="" className="w-full h-full object-cover object-center opacity-75 translate-y-[66%]" />
              </div>
              <div className="relative z-10 flex flex-col flex-1 items-center justify-center text-center px-6 py-12 md:py-16 lg:py-20 gap-8">
                <div className="flex flex-col items-center gap-4 max-w-[1280px]">
                  <h2 data-reveal className="text-balance font-medium leading-[1.1] tracking-tight text-[#101010] [font-size:var(--font-size-h2)]" style={{ textWrap: "balance" }}>
                    Your first agent is one command away.
                  </h2>
                  <p data-reveal className="text-pretty font-mono [font-size:var(--font-size-body)] text-muted leading-[1.9]" style={{ textWrap: "balance" }}>
                    Everything you need to deploy, manage, and scale AI agents across your organization: open source, TEE-secured, running on NEAR. The rest is up to you.
                  </p>
                </div>
                <PillButton data-reveal href="https://cloud.near.ai" target="_blank" rel="noopener noreferrer" label="Contact Us" />
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />

      </div>
    </div>
  );
}
