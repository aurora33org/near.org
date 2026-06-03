export default function ConcentricRings() {
  return (
    <div className="relative flex items-center justify-center order-2 lg:order-2 z-10">
      <div
        data-b2-outer
        className="relative z-[10] flex items-center justify-center overflow-hidden rounded-full bg-[#ECECEC]"
        style={{ width: "clamp(300px,calc(100vw - 40px),638px)", height: "clamp(300px,calc(100vw - 40px),638px)" }}
      >
        <div className="absolute inset-0 rounded-full border border-[#101010]/20 pointer-events-none z-10" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/Near-logo-w.png')", backgroundRepeat: "no-repeat", backgroundPosition: "center 55%", backgroundSize: "70%", opacity: 0.25 }} />
        <span className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-[0.75rem] uppercase tracking-[0.25em] text-muted z-10">EXTERNAL WORLD</span>

        <div data-b2-mid className="relative z-[11] flex items-center justify-center overflow-hidden rounded-full bg-[#ECECEC] w-[78%] h-[78%] lg:w-[85%] lg:h-[85%]">
          <div className="absolute inset-0 rounded-full border border-[#101010]/20 pointer-events-none z-10" />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/Near-logo-w.png')", backgroundRepeat: "no-repeat", backgroundPosition: "center 55%", backgroundSize: "82%", opacity: 0.25 }} />
          <span className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-muted z-10">NEAR AI CLOUD</span>

          <div data-b2-inner className="relative z-[12] flex items-center justify-center overflow-hidden rounded-full bg-[#ECECEC] w-[76%] h-[76%] lg:w-[80%] lg:h-[80%]">
            <div className="absolute inset-0 rounded-full border border-[#101010]/20 pointer-events-none z-10" />
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/Near-logo-w.png')", backgroundRepeat: "no-repeat", backgroundPosition: "center 55%", backgroundSize: "103%", opacity: 0.25 }} />
            <span className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[0.75rem] uppercase tracking-[0.15em] text-muted z-10">TEE</span>

            <div
              data-b2-core
              className="relative z-[13] flex items-center justify-center overflow-hidden rounded-full border border-[#101010]/20 bg-[#ECECEC] w-[72%] lg:w-[74%]"
              style={{ aspectRatio: "1 / 1" }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/Near-logo-w.png')", backgroundRepeat: "no-repeat", backgroundPosition: "center 55%", backgroundSize: "139%", opacity: 0.25 }} />
              <h2 className="hidden lg:block relative z-10 font-sans font-medium leading-[1.1] tracking-tight text-[#101010] text-center px-3 [font-size:var(--font-size-h2)]">
                How<br />NEAR AI<br />works
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
