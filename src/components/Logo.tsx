import Image from "next/image";

type LogoProps = {
  size?: number;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export function Logo({
  size = 34,
  src = "/aspirer-firm-logo.svg",
  alt = "Aspirer Firm logo",
  width,
  height,
}: LogoProps) {
  const imageWidth = width ?? size;
  const imageHeight = height ?? size;

  return (
    <Image
      src={src}
      alt={alt}
      width={imageWidth}
      height={imageHeight}
      sizes={`${imageWidth}px`}
      priority
      className="brand-mark"
    />
  );
}
