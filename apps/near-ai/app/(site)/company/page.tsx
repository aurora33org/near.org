import Image from "next/image";
import PillButton from "@/components/site/PillButton";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import AnimationsProvider from "@/components/site/providers/AnimationsProvider";
import CompanyAnimations from "@/components/site/company/CompanyAnimations";
import PersonCard from "@/components/site/company/PersonCard";

const TEAM = [
  { name: "Illia Polosukhin", role: "Founder", photo: "/company/IlliaPolosukhin.webp" },
  { name: "George Zeng", role: "CPO & GM", photo: "/company/GeorgeZeng.webp" },
  { name: "Sergey Astretsov", role: "Head of Product", photo: "/company/SergeyAstretsov.webp" },
  { name: "Cameron Dennis", role: "Director of AI", photo: "/company/CameronDennis.webp" },
  { name: "Pierre Le Guen", role: "Head of Engineering", photo: "/company/PierreLeGuen.webp" },
  { name: "Pranav Raja", role: "ML Researcher", photo: "/company/PranavRaja.webp" },
  { name: "Evrard-Nil Daillet", role: "Senior Software Engineer", photo: "/company/Evrard-NilDaillet.webp" },
  { name: "Henry Park", role: "Software Engineer", photo: "/company/HenryPark.webp" },
  { name: "Nick Pismenkov", role: "Software Engineer", photo: "/company/NickPismenkov.webp" },
  { name: "Emil Bogomolov", role: "Machine Learning Engineer", photo: "/company/EmilBogomolov.webp" },
];

const FOUNDATION = [
  { name: "Danny Carpentier Balogh", role: "Head of Product Marketing", photo: "/company/DannyCarpentierBalough.webp" },
  { name: "Anelda Grove Dempster", role: "Senior Legal Counsel", photo: "/company/AneldaGrove.webp" },
  { name: "Michael Coburn", role: "Information Technology and Security Director", photo: "/company/MichaelCoburn.webp" },
];

const TRUST_ITEMS = [
  { label: "For Users", text: "Increased productivity means surrendering your most personal secrets." },
  { label: "For Enterprises", text: "Handling the data needed to feed better AI is risky, slow, and expensive." },
  { label: "For the Public Sector", text: "AI is either out of reach or accessing it requires surrendering sovereignty and trusting foreign entities." },
];

export default function CompanyPage() {
  return (
    <div className="relative w-full font-sans bg-[#e4e4e4] text-[#101010]">
      <AnimationsProvider />
      <CompanyAnimations />
      <div className="relative w-full flex flex-col">

        {/* HERO + MISSION CARD */}
        <div data-mission-wrapper className="relative">
        <section
          data-company-hero
          className="relative lg:sticky lg:top-0 h-[70vh] lg:h-screen min-h-[480px] lg:min-h-0 flex flex-col bg-[#525252] lg:overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/company/Company_Banner-scaled.webp"
              alt=""
              fill
              priority
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>

          <div className="absolute inset-0 z-[1] bg-[#101010]/55 pointer-events-none" />
          <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b from-transparent to-[#101010]/40" />

          <div className="relative z-10 flex flex-col flex-1 mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
            <SiteHeader />
            <div className="flex flex-col flex-1 justify-end pt-8 pb-10 lg:pb-24 lg:max-w-[56%]">
              <h1
                data-reveal-hero-h1
                className="text-white font-medium leading-[1.05] tracking-tight"
                style={{ fontSize: "var(--font-size-h1)" }}
              >
                We&apos;re Building Shared Intelligence Privately, for Everyone
              </h1>
              <p
                data-reveal
                className="mt-4 text-white/60 font-mono tracking-wide max-w-[520px] leading-relaxed text-pretty"
                style={{ fontSize: "var(--font-size-body)" }}
              >
                NEAR AI is an artificial intelligence research, engineering, and product development company.
              </p>
            </div>
          </div>

          {/* Mission card — desktop only */}
          <div className="hidden lg:flex absolute inset-y-0 right-0 z-20 w-[42%] items-center pr-20 pl-4 pointer-events-none">
            <div
              data-mission-card
              className="w-full rounded-[2rem] bg-[#ECECEC] lg:px-12 py-14 pointer-events-auto"
            >
              <div className="flex flex-col gap-5">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted">Our Mission</span>
                <p className="text-pretty text-muted leading-[1.8]" style={{ fontSize: "var(--font-size-body)" }}>
                  Our mission is to build verifiable, privacy-preserving AI that ensures every computation is private, every result provable, and every participant rewarded.
                </p>
                <p className="text-pretty text-muted leading-[1.8]" style={{ fontSize: "var(--font-size-body)" }}>
                  We believe the future of AI is user-owned and verifiable. NEAR AI enables a world where AI models operate with transparent proofs of integrity and governance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="hidden lg:block h-[50vh]" />
        </div>

        {/* Mission card — mobile/tablet only */}
        <div className="lg:hidden bg-[#ECECEC] px-5 sm:px-10 pt-10 pb-4">
          <div className="rounded-[2rem] bg-white px-8 py-10">
            <div className="flex flex-col gap-5">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted">Our Mission</span>
              <p className="text-pretty text-muted leading-[1.8]" style={{ fontSize: "var(--font-size-body)" }}>
                Our mission is to build verifiable, privacy-preserving AI that ensures every computation is private, every result provable, and every participant rewarded.
              </p>
              <p className="text-pretty text-muted leading-[1.8]" style={{ fontSize: "var(--font-size-body)" }}>
                We believe the future of AI is user-owned and verifiable. NEAR AI enables a world where AI models operate with transparent proofs of integrity and governance.
              </p>
            </div>
          </div>
        </div>

        {/* TRUST */}
        <section className="bg-[#ECECEC] pt-24 pb-24 lg:pt-32 lg:pb-32">
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">

            <h2
              data-reveal
              className="text-pretty font-medium leading-[1.15] tracking-tight text-[#101010] [font-size:var(--font-size-h2)] mb-10"
            >
              Today, AI Is Based on Trust
            </h2>

            <div data-reveal-group className="flex flex-col md:flex-row gap-10 w-full items-stretch">
              {TRUST_ITEMS.map(({ label, text }) => (
                <div key={label} className="w-full md:w-1/4 flex" data-reveal-item>
                  <div className="w-full h-full rounded-[2rem] p-8 flex flex-col items-center justify-start gap-6 border border-[#CAC8C8]">
                    <div className="flex flex-col items-center w-full">
                      <h3 className="text-pretty font-medium leading-[1.15] text-[#101010] mb-4 text-center [font-size:var(--font-size-h3)]">{label}</h3>
                      <p className="text-pretty font-mono [font-size:var(--font-size-body)] text-muted text-center leading-[1.6] w-full">{text}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="w-full md:w-1/4 flex" data-reveal-item>
                <div className="w-full h-full flex flex-col items-start justify-center">
                  <h2 className="text-pretty font-medium leading-[1.1] tracking-tight text-[#101010] text-left [font-size:var(--font-size-h2)]">
                    Tomorrow, AI Will Be Based on Verified, User-Owned Privacy
                  </h2>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* TEAM */}
        <section className="bg-[#ECECEC] py-12 lg:py-16">
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">

            <div className="flex items-center gap-6 mb-10">
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.3em] text-muted shrink-0">TEAM</span>
              <div className="flex-1 border-t border-[#CAC8C8]" />
            </div>

            <h2
              data-reveal
              className="text-balance font-medium leading-[1.1] tracking-tight text-[#101010] mb-6"
              style={{ fontSize: "var(--font-size-h2)" }}
            >
              NEAR AI was founded by former Google Research team member Illia Polosukhin, co-author of the landmark Transformer research paper &ldquo;Attention Is All You Need&rdquo; and creator of the NEAR blockchain.
            </h2>

            <p data-reveal className="text-pretty [font-size:var(--font-size-body)] text-muted font-mono leading-[1.8] max-w-[720px] mb-16">
              Today, we&apos;re a growing group of globally-dispersed engineers, researchers, product managers, scientists, and creatives collaborating to build a better tomorrow.
            </p>

            <div data-reveal-group className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
              {TEAM.map((person) => (
                <PersonCard key={person.name} {...person} />
              ))}
            </div>

          </div>
        </section>

        {/* NEAR FOUNDATION */}
        <section className="bg-[#ECECEC] py-12 lg:py-16">
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">

            <h2
              data-reveal
              className="font-medium leading-[1.1] tracking-tight text-[#101010] mb-4"
              style={{ fontSize: "var(--font-size-h2)" }}
            >
              NEAR Foundation
            </h2>

            <p data-reveal className="text-pretty [font-size:var(--font-size-body)] text-muted font-mono leading-[1.8] mb-12">
              NEAR AI is supported by key contributors from NEAR Foundation.
            </p>

            <div data-reveal-group className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
              {FOUNDATION.map((person) => (
                <PersonCard key={person.name} {...person} />
              ))}
            </div>

          </div>
        </section>

        {/* HIRING CTA */}
        <section className="relative bg-[linear-gradient(to_bottom,#ECECEC_33%,#575757_100%)] pt-12 lg:pt-16">
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">

            <div
              data-reveal-scale
              className="relative w-full rounded-[2rem] overflow-hidden min-h-[420px] lg:min-h-[480px] flex flex-col bg-gradient-to-b from-[#F3F3F3] via-[#E2E1E1] to-[#FCFCFC]"
            >
              <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                <Image
                  src="/demo-v1/LOGO_near 3.png"
                  alt=""
                  width={1200}
                  height={400}
                  className="w-[600px] sm:w-[900px] lg:w-[1200px] opacity-20 translate-y-32"
                  style={{ height: "auto" }}
                />
              </div>

              <div className="absolute inset-0 z-[1] pointer-events-none">
                <Image
                  src="/demo-v1/background-1.webp"
                  alt=""
                  fill
                  data-parallax-card
                  style={{ objectFit: "cover", objectPosition: "center", opacity: 0.75 }}
                  className="translate-y-[66%]"
                />
              </div>

              <div className="relative z-10 flex flex-col flex-1 items-center justify-center text-center px-6 py-12 md:py-16 lg:py-20 gap-8">
                <div className="flex flex-col items-center gap-4 max-w-[900px]">
                  <h2
                    className="text-balance font-medium leading-[1.1] tracking-tight text-[#101010]"
                    style={{ fontSize: "var(--font-size-h2)", textWrap: "balance" } as React.CSSProperties}
                  >
                    Are You Ready to Build the Future of AI?
                  </h2>
                  <p className="font-mono text-[0.75rem] uppercase tracking-[0.25em] text-muted">Join Us</p>
                  <p className="text-pretty [font-size:var(--font-size-body)] font-mono text-muted leading-[1.9]">
                    Be a part of the user-owned AI future.
                  </p>
                </div>

                <PillButton href="https://job-boards.eu.greenhouse.io/nearai" target="_blank" rel="noopener noreferrer" label="WE ARE HIRING" />
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />

      </div>
    </div>
  );
}
