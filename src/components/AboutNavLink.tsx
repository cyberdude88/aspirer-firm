"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type AboutNavLinkProps = Omit<ComponentProps<typeof Link>, "href">;

export function AboutNavLink(props: AboutNavLinkProps) {
  const { onClick, ...rest } = props;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    window.scrollTo(0, 0);
  };

  return <Link href="/about" scroll onClick={handleClick} {...rest} />;
}
