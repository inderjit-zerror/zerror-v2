import { cta, studio } from '@/lib/content';
import SectionBar from '@/components/ui/SectionBar';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/ui/Magnetic';
import RollText from '@/components/ui/RollText';

// Deck slide 18.
export default function Cta({ index = '08' }) {
  return (
    <section
      className="section cta"
      data-theme="blue"
      data-formation="brand"
      data-fx="0.32"
      data-fy="0.06"
      data-fs="0.54"
      data-mfx="0.24"
      data-mfy="0.34"
      data-mfs="0.36"
      data-label="Let’s build together"
      data-index={index}
    >
      <SectionBar index={index} label="Let’s build together" />
      <Reveal as="h2" className="cta__title display-1">
        {cta.title.map((seg) => (seg.em ? <em key={seg.t}>{seg.t}</em> : seg.t))}
      </Reveal>
      <div className="cta__foot">
        <Reveal as="p" className="cta__sub">
          <em>{cta.sub}</em>
        </Reveal>
        <div className="cta__actions">
          <Magnetic strength={0.2}>
            <a className="cta__mail" href={`mailto:${studio.email}`} data-cursor="Write us">
              <RollText text={studio.email} />
            </a>
          </Magnetic>
          <Button href="/contact">Start a project</Button>
        </div>
      </div>
    </section>
  );
}
