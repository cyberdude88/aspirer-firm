import { Container } from "@/components/Container";
import { CardGrid, type CardItem } from "@/components/CardGrid";
import { SERVICES, CATEGORIES } from "@/lib/services";

export default function BookingIndex() {
  return (
    <main>
      <Container className="py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Booking</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Choose what you&apos;d like to discuss</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Pick a service — we&apos;ll show open times on our team calendar. Free audits are
          complimentary; engagement-scoping sessions are booked through secure checkout.
        </p>

        <div className="mt-12 space-y-12">
          {CATEGORIES.map(cat => {
            const items: CardItem[] = SERVICES
              .filter(s => s.category === cat)
              .map(s => ({
                href: `/booking/${s.slug}`,
                title: s.title,
                description: s.blurb,
                meta: `${s.durationMin} min`,
              }));
            if (!items.length) return null;
            return (
              <div key={cat}>
                <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-500">{cat}</h2>
                <CardGrid items={items} columns={3} />
              </div>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
