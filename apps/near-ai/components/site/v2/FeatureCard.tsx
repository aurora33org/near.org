import PillButton from "@/components/site/PillButton";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  href: string;
  cta: string;
  children: ReactNode;
};

export default function FeatureCard({ title, description, href, cta, children }: Props) {
  return (
    <div data-reveal-item className="w-full md:w-1/3 flex">
      <div className="w-full h-full rounded-[2rem] p-8 flex flex-col items-center justify-start gap-6 border border-[#CAC8C8]">
        <div className="h-52 flex items-end justify-center w-full">
          {children}
        </div>
        <div className="flex flex-col items-center w-full">
          <h3 className="text-balance font-medium leading-[1.15] text-[#101010] mb-4 text-center [font-size:var(--font-size-h3)]">{title}</h3>
          <p className="text-pretty font-mono [font-size:var(--font-size-body)] text-muted text-center leading-[1.6] w-full">{description}</p>
        </div>
        <PillButton href={href} target="_blank" rel="noopener noreferrer" label={cta} className="mt-auto" />
      </div>
    </div>
  );
}
