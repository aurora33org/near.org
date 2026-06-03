import { Plus } from "lucide-react";

type Props = {
  category: string;
  context: string;
  logo: string;
  logoH: string;
  desc: string;
  note: string;
};

export default function PartnerRow({ category, context, logo, logoH, desc, note }: Props) {
  return (
    <details data-reveal-row className="border-b border-[#CAC8C8] group">
      <summary className="py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">

        {/* Mobile */}
        <div className="flex flex-col gap-2 md:hidden">
          <div className="flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={category} className="h-6 w-auto max-w-[160px] object-contain object-left" />
            <div className="w-8 h-8 rounded-full border border-[#101010]/30 flex items-center justify-center shrink-0 group-open:bg-[#101010] transition-colors duration-200">
              <Plus className="w-3 h-3 text-[#101010] group-open:text-white transition-colors duration-200" />
            </div>
          </div>
          <span className="font-mono [font-size:var(--font-size-body)] font-semibold uppercase tracking-[0.18em] text-[#101010]">{category}</span>
          <span className="font-mono [font-size:var(--font-size-body)] text-muted">{context}</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-2 md:items-center md:gap-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={category} className={`${logoH} w-auto max-w-[220px] object-contain object-left`} />
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono [font-size:var(--font-size-body)] font-semibold uppercase tracking-[0.18em] text-[#101010] flex-1 min-w-0 truncate">{category}</span>
            <span className="flex-1 min-w-0 font-mono [font-size:var(--font-size-body)] text-muted overflow-hidden whitespace-nowrap">{"_ ".repeat(80)}</span>
            <span className="font-mono [font-size:var(--font-size-body)] text-muted shrink-0">{context}</span>
            <div className="w-8 h-8 rounded-full border border-[#101010]/30 flex items-center justify-center shrink-0 group-open:bg-[#101010] transition-colors duration-200">
              <Plus className="w-3 h-3 text-[#101010] group-open:text-white transition-colors duration-200" />
            </div>
          </div>
        </div>

      </summary>

      <div className="pb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="hidden md:block" />
        <div>
          <p className="[font-size:var(--font-size-body)] text-muted leading-[1.8] mb-3">{desc}</p>
          <p className="font-mono text-[0.75rem] text-muted">{note}</p>
        </div>
      </div>
    </details>
  );
}
