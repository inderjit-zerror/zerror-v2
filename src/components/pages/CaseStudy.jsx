import Reveal from '@/components/ui/Reveal';
import SectionBar from '@/components/ui/SectionBar';
import PageHero from '@/components/ui/PageHero';
import NextPage from '@/components/ui/NextPage';
import ExpandMedia from '@/components/ui/ExpandMedia';
import Parallax from '@/components/ui/Parallax';
import StoryCards from '@/components/ui/StoryCards';
import TLink from '@/components/ui/TLink';
import GLImage from '@/components/gl/GLImage';
import { PixelArrow } from '@/components/ui/Pixel';

// Mirrors the deck's case-study pages: overview + scope, then Problem / Solution / Outcome.
export default function CaseStudy({ study, next }) {
  const story = [
    ['The Problem', study.problem],
    ['The Solution', study.solution],
    ['The Outcome', study.outcome],
  ];

  return (
    <>
      <PageHero
        className="case-hero"
        index={study.number}
        label={`Case study — ${study.category}`}
        aside={String(study.year)}
        title={study.client}
        intro={study.title}
        facts={study.metrics.map((m) => ({ value: m.value, label: m.label }))}
        data-theme="blue"
        data-formation="pixels"
        data-label={study.client}
        data-index="01"
      >
        <TLink href="/work" className="back-link meta page-hero__fade">
          <PixelArrow direction="left" /> All work
        </TLink>
      </PageHero>

      <section className="case-cover" data-theme="light" data-formation="none" data-label="Overview" data-index="02">
        <ExpandMedia>
          <GLImage src={study.images[0]} alt={`${study.client} — website`} className="case-cover__media" />
        </ExpandMedia>
      </section>

      <section className="section case-overview" data-theme="light" data-formation="none" data-label="Overview" data-index="02">
        <SectionBar index="02" label="Overview" />
        <div className="case-overview__grid">
          <Reveal as="p" className="lead">
            {study.overview}
          </Reveal>
          <div className="case-overview__aside">
            <div>
              <p className="meta is-muted">Scope of work</p>
              <ol className="scope">
                {study.scope.map((s, i) => (
                  <li key={s}>
                    <span className="meta">0{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="case-overview__facts">
              <div>
                <p className="meta is-muted">Sector</p>
                <p>{study.category}</p>
              </div>
              <div>
                <p className="meta is-muted">Year</p>
                <p>{study.year}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section case-story" data-theme="light" data-formation="none" data-label="The story" data-index="03">
        <SectionBar index="03" label="Problem — Solution — Outcome" />
        <StoryCards story={story} />
      </section>

      <section className="section case-gallery" data-theme="light" data-formation="none" data-label="Gallery" data-index="04">
        <SectionBar index="04" label="In use" />
        <div className="case-gallery__grid">
          <Parallax speed={6}>
            <GLImage src={study.images[1]} alt={`${study.client} — detail`} className="case-gallery__item" />
            <p className="meta case-gallery__caption">Desktop</p>
          </Parallax>
          <Parallax speed={-6} className="case-gallery__offset">
            <GLImage src={study.images[2]} alt={`${study.client} — on mobile`} className="case-gallery__item" />
            <p className="meta case-gallery__caption">Responsive</p>
          </Parallax>
        </div>
      </section>

      <NextPage
        href={`/work/${next.slug}`}
        label={next.client}
        kicker={`Next case study — ${next.number}`}
        note={next.category}
        title={next.client}
        index="05"
      />
    </>
  );
}
