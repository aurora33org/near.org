type Props = {
  number: string;
  title: string;
  icon: string;
  description: string;
  align?: "left" | "center" | "right";
  zIndex?: number;
  marginTop?: string;
};

export default function UseCaseCard({ number, title, icon, description, align = "left", zIndex = 10, marginTop }: Props) {
  const alignClass =
    align === "center" ? "mx-auto" : align === "right" ? "ml-auto mr-0" : "ml-0 mr-auto";

  return (
    <div
      data-stack-card
      {...(align === "right" ? { "data-stack-card-last": true } : {})}
      className={`sticky top-[136px] ${alignClass} w-[95%] md:w-[77%] bg-[#ECECEC] border border-[#CAC8C8] rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-8 px-6 sm:px-10 md:px-12 lg:px-14 py-8 md:py-10`}
      style={{ zIndex, marginTop }}
    >
      <div className="shrink-0 w-24 flex items-center justify-center opacity-70 mr-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" width={96} height={96} />
      </div>
      <div className="md:w-[28%] shrink-0">
        <span className="block text-[0.75rem] lg:text-[0.875rem] font-mono text-muted tracking-widest mb-2">{number}</span>
        <h3 className="text-balance font-medium text-[#101010] leading-[1.15] [font-size:var(--font-size-h3)]">{title}</h3>
      </div>
      <div className="flex-1">
        <p className="text-pretty [font-size:var(--font-size-body)] font-mono text-muted leading-[1.8]">{description}</p>
      </div>
    </div>
  );
}
