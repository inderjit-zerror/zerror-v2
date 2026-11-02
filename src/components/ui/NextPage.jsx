import TLink from './TLink';
import { PixelArrow } from './Pixel';

const COLS = 12;
const ROWS = 3;
// Deterministic stagger so server and client markup match.
const delay = (i) => (((i * 7919) % 101) / 101) * 0.35;

// Closing band on every inner page: one large link onward, wiped with brand pixels on hover.
export default function NextPage({ href, label, kicker, title, note, index = '' }) {
  return (
    <section
      className="next-page"
      data-theme="blue"
      data-formation="none"
      data-label="Next"
      data-index={index}
    >
      <TLink href={href} label={label} className="next-page__link" data-cursor="Next">
        <span className="next-page__pixels" aria-hidden="true">
          {Array.from({ length: COLS * ROWS }, (_, i) => (
            <i key={i} style={{ '--d': `${delay(i).toFixed(3)}s` }} />
          ))}
        </span>
        <span className="next-page__meta">
          <span className="meta">{kicker}</span>
          <span className="meta">{note}</span>
        </span>
        <span className="next-page__title">
          <span>{title}</span>
          <PixelArrow />
        </span>
      </TLink>
    </section>
  );
}
