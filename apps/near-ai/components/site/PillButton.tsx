import { Plus } from "lucide-react";
import { AnchorHTMLAttributes } from "react";

interface PillButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
}

export default function PillButton({ label, className = "", ...rest }: PillButtonProps) {
  return (
    <a
      {...rest}
      className={`flex items-center gap-3 border border-[#101010]/25 rounded-full pl-1.5 pr-6 py-1.5 [font-size:var(--font-size-body)] text-[#101010] hover:bg-[#101010]/05 transition-colors duration-200 ${className}`}
    >
      <div className="w-9 h-9 rounded-full border border-[#101010]/25 flex items-center justify-center shrink-0">
        <Plus className="w-4 h-4" />
      </div>
      {label}
    </a>
  );
}
