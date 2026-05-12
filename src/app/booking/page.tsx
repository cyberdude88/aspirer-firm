import { Container } from "@/components/Container";
import { CardGrid, type CardItem } from "@/components/CardGrid";
import { SERVICES } from "@/lib/services";

const items: CardItem[] = SERVICES.map(s => ({
  href: `/booking/${s.slug}`,
  title: s.title,
  description: s.blurb,
  meta: `${s.durationMin} min`,
}));

export default function BookingIndex() {
  return (
    <main>
      <Container className="py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Booking</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Choose a service</h1>
        <p className="mt-2 max-w-xl text-gray-600">Click any card to see open times on the connected calendar.</p>
        <div className="mt-10">
          <CardGrid items={items} columns={3} />
        </div>
      </Container>
    </main>
  );
}
