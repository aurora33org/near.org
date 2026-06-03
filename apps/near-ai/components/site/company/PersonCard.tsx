import Image from "next/image";

interface PersonCardProps {
  name: string;
  role: string;
  photo: string;
}

export default function PersonCard({ name, role, photo }: PersonCardProps) {
  return (
    <div className="flex flex-col gap-3" data-reveal-item>
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#D4D4D4]">
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[#101010] font-medium leading-tight" style={{ fontSize: "var(--font-size-body)" }}>{name}</span>
        <span className="font-mono text-[14px] uppercase tracking-widest text-muted">{role}</span>
      </div>
    </div>
  );
}
