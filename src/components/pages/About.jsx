'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { principles, stats, studio, team, values } from '@/lib/content';
import Reveal from '@/components/ui/Reveal';
import SectionBar from '@/components/ui/SectionBar';
import Counter from '@/components/ui/Counter';
import PageHero from '@/components/ui/PageHero';
import NextPage from '@/components/ui/NextPage';
import Parallax from '@/components/ui/Parallax';
import GLImage from '@/components/gl/GLImage';
import { PixelMark } from '@/components/ui/Pixel';

const IDENTITY = [
  { src: '/images/brand/card.jpg', alt: 'Zerror business card in Electric Blue', caption: 'Business card' },
  { src: '/images/brand/poster.jpg', alt: 'Zerror digital system grid poster', caption: 'System poster' },
  { src: '/images/brand/app.jpg', alt: 'Zerror submark as an app icon', caption: 'Submark, app icon' },
  { src: '/images/brand/laptop.jpg', alt: 'Zerror pixel grid interface on a laptop', caption: 'Digital system' },
];

export default function About() {
  const [active, setActive] = useState(0);
  const panel = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(panel.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'zr.out' });
    },
    { dependencies: [active] },
  );

  return (
    <>
      <PageHero
        className="about-hero"
        index="01"
        label="About the studio"
        aside={`${studio.city} — Est. ${studio.founded}`}
        title="A studio for brands that refuse to look average."
        intro="For founders who dream in beta. We started in 2022 to bridge the gap between designers and developers. Today one team takes every project from design to build, launch and marketing."
        facts={[
          { value: String(studio.founded), label: 'Founded in Mumbai' },
          { value: String(team.length), label: 'Designers, engineers, strategists' },
          { value: '100+', label: 'Brands partnered' },
        ]}
        data-theme="blue"
        data-formation="brand"
        data-fx="0.31"
        data-fy="0.2"
        data-fs="0.46"
        data-mfx="0.26"
        data-mfy="0.3"
        data-mfs="0.32"
        data-label="About"
        data-index="01"
      />

      <section
        className="section name"
        data-theme="ink"
        data-formation="logo"
        data-fy="0.27"
        data-fs="0.56"
        data-mfy="0.24"
        data-mfs="1.05"
        data-label="The name"
        data-index="02"
      >
        <SectionBar index="02" label="The name" />
        <div className="name__grid">
          <h2 className="display-1">
            <Reveal as="span" className="stack-line">
              Zerror.
            </Reveal>
            <Reveal as="span" className="stack-line is-muted" delay={0.1}>
              Zero error.
            </Reveal>
          </h2>
          <div className="name__body">
            <Reveal as="p" className="lead">
              Naming a studio after perfection is a risk. Every launch has to keep the promise. That is the point.
            </Reveal>
            <Reveal as="p" className="body-text is-muted-text">
              Zerror is a system-driven studio at the intersection of design and technology. We approach identity,
              platforms and digital experiences as interconnected systems rather than isolated outputs, so every
              touchpoint stays consistent while the product keeps evolving.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section principles" data-theme="ink" data-formation="field" data-fy="-0.47" data-label="Principles" data-index="03">
        <SectionBar index="03" label="Principles" />
        <div className="principles__grid">
          <div className="principles__tabs" role="tablist" aria-label="Studio principles">
            {principles.map((p, i) => (
              <button
                key={p.label}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-controls="principle-panel"
                className={`principles__tab ${active === i ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
                onPointerEnter={() => setActive(i)}
              >
                <span className="meta">0{i + 1}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
          <div ref={panel} id="principle-panel" role="tabpanel" className="principles__panel">
            <p className="meta is-muted">Brand {principles[active].label.toLowerCase()}</p>
            <p className="display-3">{principles[active].text}</p>
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

      <section className="section identity" data-theme="light" data-formation="none" data-label="Identity" data-index="04">
        <SectionBar index="04" label="The identity" />
        <div className="identity__head">
          <Reveal as="h2" className="display-2">
            Systems. Structure. Precision.
          </Reveal>
          <Reveal as="p" className="body-text is-muted-text">
            Our mark is drawn on a modular grid, built from the same pixel unit as every brand element. It holds its
            clarity from an app icon to a poster, the way we expect our own systems to scale.
          </Reveal>
        </div>
        <div className="identity__grid">
          {IDENTITY.map((item, i) => (
            <figure key={item.src} className={`identity__item identity__item--${i + 1}`}>
              <Parallax speed={i % 2 ? -5 : 5}>
                <GLImage src={item.src} alt={item.alt} className="identity__media" />
              </Parallax>
              <figcaption className="meta">
                <span>0{i + 1}</span>
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section values-grid" data-theme="light" data-formation="none" data-label="Values" data-index="05">
        <SectionBar index="05" label="Values" />
        <Reveal as="h2" className="display-2 values-grid__title">
          Four values we design with, build by and hire for.
        </Reveal>
        <ul className="values-grid__list">
          {values.map((v, i) => (
            <li key={v} className="value">
              <span className="meta">0{i + 1}</span>
              <PixelMark seed={v} size={6} className="value__mark" />
              <span className="value__name">{v}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section team" data-theme="light" data-formation="none" data-label="Team" data-index="06">
        <SectionBar index="06" label="Team" />
        <div className="team__head">
          <Reveal as="h2" className="display-2">
            Designers, engineers and strategists. One team.
          </Reveal>
          <p className="meta is-muted">{team.length} people — Mumbai</p>
        </div>
        <ul className="team__grid">
          {team.map((m) => (
            <li key={m.name} className="member">
              <div className="member__avatar">
                <PixelMark seed={m.name} size={8} />
              </div>
              <div className="member__info">
                <span className="member__name">{m.name}</span>
                <span className="member__role">{m.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <NextPage
        href="/contact"
        label="Contact"
        kicker="Next — Start a project"
        note="Your next version starts here"
        title="Let’s build together"
        index="07"
      />
    </>
  );
}
