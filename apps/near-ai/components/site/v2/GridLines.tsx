type Props = { variant?: "dark" | "light" };

export default function GridLines({ variant = "light" }: Props) {
  if (variant === "dark") {
    return (
      <div className="absolute inset-0 hidden lg:grid grid-cols-4 pointer-events-none mix-blend-overlay opacity-15">
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="h-full" />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 hidden lg:grid grid-cols-4 pointer-events-none opacity-[0.03]">
      <div className="border-r border-[#CAC8C8] h-full" />
      <div className="border-r border-[#CAC8C8] h-full" />
      <div className="border-r border-[#CAC8C8] h-full" />
      <div className="h-full" />
    </div>
  );
}
