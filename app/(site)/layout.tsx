import LenisProvider from "@/components/site/providers/LenisProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <LenisProvider>{children}</LenisProvider>;
}
