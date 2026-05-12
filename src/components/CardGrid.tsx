import Link from "next/link";
import { type ReactNode } from "react";

export type CardItem = {
  href: string;
  title: string;
  description: string;
  meta?: string;
  external?: boolean;
};

export function CardGrid({ items, columns = 3 }: { items: CardItem[]; columns?: 2 | 3 | 4 }) {
  const cols =
    columns === 2 ? "sm:grid-cols-2" :
    columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" :
    "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <ul className={`grid gap-4 ${cols}`}>
      {items.map(item => (
        <li key={item.href}>
          <Card {...item} />
        </li>
      ))}
    </ul>
  );
}

function Card({ href, title, description, meta, external }: CardItem) {
  const body = (
    <div className="group h-full rounded-xl border border-white/12 bg-white/[0.02] p-5 transition-all duration-200 hover:border-[color:var(--gold)] hover:bg-white/[0.04] hover:shadow-[0_0_0_1px_rgba(201,168,117,0.32),0_0_30px_rgba(201,168,117,0.18)]">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-medium">{title}</h3>
        {meta && <span className="text-xs text-white/55">{meta}</span>}
      </div>
      <p className="mt-2 text-sm text-white/68">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-white/72 transition-colors group-hover:text-[color:var(--gold)]">
        Open <Arrow />
      </span>
    </div>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {body}
    </a>
  ) : (
    <Link href={href} className="block h-full">{body}</Link>
  );
}

function Arrow(): ReactNode {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" className="transition-transform group-hover:translate-x-0.5">
      <path d="M2 6h7M6 3l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
