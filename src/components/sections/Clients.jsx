import { clients } from '@/lib/content';
import SectionBar from '@/components/ui/SectionBar';
import Reveal from '@/components/ui/Reveal';

const CELLS = 24; // 6 × 4 hover pixels per tile

// Deterministic pseudo-random delays so the pixel wipe differs per tile without hydration drift.
const delay = (tile, cell) => (((tile * 7919 + cell * 104729) % 97) / 97) * 0.32;

// Deck slide 07. Logos are alpha masks tinted with the theme colour; hover wipes the tile
// with brand pixels.
export default function Clients() {
  return (
    <section className="section clients" data-theme="light" data-formation="none" data-label="Our clients" data-index="06">
      <SectionBar index="06" label="Our clients" />
      <div className="clients__head">
        <Reveal as="h2" className="display-2">
          Trusted by publishers, film houses, fashion labels and founders.
        </Reveal>
        <p className="meta clients__count">100+ brands since 2022</p>
      </div>
      <ul className="clients__grid">
        {clients.map((c, t) => (
          <li key={c.name} className="client">
            <span className="client__pixels" aria-hidden="true">
              {Array.from({ length: CELLS }, (_, i) => (
                <i key={i} style={{ '--d': `${delay(t, i).toFixed(3)}s` }} />
              ))}
            </span>
            <span
              className="client__logo"
              role="img"
              aria-label={c.name}
              style={{
                '--logo': `url(${c.logo})`,
                '--ratio': c.ratio,
                '--w': `${Math.min(64, Math.sqrt(c.ratio) * 24).toFixed(1)}%`,
              }}
            />
            <span className="client__name">{c.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
