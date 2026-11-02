import { audience, belief, stats } from '@/lib/content';
import SectionBar from '@/components/ui/SectionBar';
import Reveal from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';

export default function Audience() {
  return (
    <section
      className="section audience"
      data-theme="ink"
      data-formation="field"
      data-fy="-0.47"
      data-mfy="-0.46"
      data-label="Our audience"
      data-index="03"
    >
      <SectionBar index="03" label="Our audience" />
      <div className="audience__grid">
        <h2 className="audience__title display-1">
          <Reveal as="span" className="stack-line">
            {audience.title[0]}
          </Reveal>
          <Reveal as="span" className="stack-line is-muted" delay={0.1}>
            {audience.title[1]}
          </Reveal>
        </h2>
        <div className="audience__body">
          <Reveal as="p" className="lead">
            {belief}
          </Reveal>
          {audience.body.map((p) => (
            <Reveal as="p" key={p.slice(0, 16)} className="body-text is-muted-text">
              {p}
            </Reveal>
          ))}
        </div>
      </div>
      <ul className="stats">
        {stats.map((s) => (
          <li key={s.label} className="stats__item">
            <Counter value={s.value} suffix={s.suffix} plain={s.plain} className="stats__value" />
            <span className="meta">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
