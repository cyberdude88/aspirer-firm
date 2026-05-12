import Image from "next/image";

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <Image
      src="/aspirer-firm-logo.svg"
      alt="Aspirer Firm logo"
      width={size}
      height={size}
      priority
      className="brand-mark"
    />
  );
}
