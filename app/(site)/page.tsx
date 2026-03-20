import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <section className="relative min-h-[calc(100vh-64px)] bg-[#0b0e17] overflow-hidden flex items-end">
        {/* Full-bleed 3D image */}
        <div className="absolute inset-0">
          <Image
            src="/images/mockup-3d-abraham.jpeg"
            alt="NEAR 3D visualization"
            fill
            className="object-cover object-left scale-[1.2]"
            priority
          />
          {/* Right-side gradient so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent from-40% to-[#0b0e17]/70" />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17]/60 via-transparent to-transparent" />
        </div>

        {/* Text — bottom-right */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-24 flex justify-end">
          <div className="max-w-lg text-white">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-5">
              Turn Sensitive Data into Safe Intelligence
            </h1>
            <p className="text-base lg:text-lg text-gray-300 leading-relaxed">
              Unlock inference for sensitive data with privacy you can verify and models you control.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture section */}
      <section className="bg-[#f2f2f0] py-24 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <h2 className="text-5xl lg:text-[3.75rem] font-bold text-black leading-[1.1] max-w-3xl mb-20">
            NEAR AI&apos;s Architecture Is Built on the Principle of User-Owned, Verifiable AI.
          </h2>

          {/* Two-column body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <p className="text-gray-500 text-base leading-relaxed">
              Deploy models through Private Inference or interact through Private Chat, both powered by the same Intel TDX and NVIDIA Confidential Computing hardware-secured infrastructure.
            </p>
            <p className="text-gray-500 text-base leading-relaxed">
              Every request runs inside a Trusted Execution Environment with real-time verification, keeping data encrypted and isolated at all times. Built for developers, trusted by enterprises, ready for sensitive workloads.
            </p>
          </div>

          {/* Dark card */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0d1117] min-h-[480px] flex flex-col justify-end">
            {/* Globe gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#0d1828] to-[#0d1117]" />
            {/* Glowing planet arc */}
            <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
              <div
                className="w-[140%] aspect-square rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, #1a6fa8 0%, #0a3d6b 30%, transparent 70%)",
                  transform: "translateY(-45%)",
                  filter: "blur(2px)",
                }}
              />
            </div>
            {/* Horizon glow */}
            <div
              className="absolute inset-x-0 pointer-events-none"
              style={{
                top: "38%",
                height: "80px",
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(100,180,255,0.35) 0%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />

            {/* Bottom content */}
            <div className="relative z-10 p-8 pt-0">
              {/* Cloud label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                  </svg>
                </div>
                <span className="text-white text-xl font-medium">cloud</span>
              </div>

              {/* Description */}
              <p className="text-white/60 text-base leading-relaxed max-w-2xl mb-8">
                Run open-source or custom models with complete privacy. Deploy in minutes through a simple API and verify every request with hardware-backed proof that your data stays secure.
              </p>

              {/* CTA */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl leading-none">
                  +
                </div>
                <span className="text-white font-semibold tracking-widest text-sm uppercase">
                  Get API Keys
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
