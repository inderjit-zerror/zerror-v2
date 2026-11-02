'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { caseStudies, projects } from '@/lib/content';
import PageHero from '@/components/ui/PageHero';
import NextPage from '@/components/ui/NextPage';
import SectionBar from '@/components/ui/SectionBar';
import CaseCard from '@/components/ui/CaseCard';
import TLink from '@/components/ui/TLink';
import { PixelArrow, PixelMark } from '@/components/ui/Pixel';

const SECTORS = ['All', ...new Set(projects.map((p) => p.sector))];
const coverFor = (slug) => caseStudies.find((c) => c.slug === slug)?.images[0];

export default function WorkIndex() {
  const list = useRef(null);
  const preview = useRef(null);
  const [filter, setFilter] = useState('All');
  const [hovered, setHovered] = useState(null);
  const visible = filter === 'All' ? projects : projects.filter((p) => p.sector === filter);

  // Floating preview follows the pointer over the index.
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = preview.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    gsap.to(preview.current, { scale: hovered ? 1 : 0, opacity: hovered ? 1 : 0, duration: 0.45, ease: 'zr.out' });
  }, [hovered]);

  useGSAP(
    () => {
      gsap.from(list.current.querySelectorAll('.index__row'), {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.035,
        ease: 'zr.out',
      });
    },
    { scope: list, dependencies: [filter] },
  );

  return (
    <>
      <PageHero
        index="01"
        label="Work"
        aside="Index 2022 — 2026"
        title="Selected work"
        count={projects.length}
        intro="We build systems designed for your business. Not websites forced into templates."
        facts={[
          { value: String(projects.length), label: 'Projects shipped and counting' },
          { value: String(caseStudies.length).padStart(2, '0'), label: 'In-depth case studies' },
          { value: String(SECTORS.length - 1), label: 'Sectors, from publishing to commerce' },
        ]}
        data-theme="light"
        data-formation="pixels"
        data-label="Work"
        data-index="01"
      />

      <section className="section featured" data-theme="light" data-formation="none" data-label="Case studies" data-index="02">
        <SectionBar index="02" label="Case studies" />
        <div className="featured__grid">
          {caseStudies.map((study) => (
            <CaseCard key={study.slug} study={study} className="case--stacked" />
          ))}
        </div>
      </section>

      <section className="section index" data-theme="light" data-formation="none" data-label="All projects" data-index="03">
        <SectionBar index="03" label="All projects" />
        <div className="index__filters" role="group" aria-label="Filter projects by sector">
          {SECTORS.map((s) => (
            <button
              key={s}
              type="button"
              className={`filter ${filter === s ? 'is-active' : ''}`}
              aria-pressed={filter === s}
              onClick={() => setFilter(s)}
            >
              {s}
              <sup>{s === 'All' ? projects.length : projects.filter((p) => p.sector === s).length}</sup>
            </button>
          ))}
        </div>

        <div className="index__head meta" aria-hidden="true">
          <span>No.</span>
          <span>Project</span>
          <span>Category</span>
          <span>Year</span>
        </div>
        <ul ref={list} className="index__list" onPointerLeave={() => setHovered(null)}>
          {visible.map((p) => {
            const n = String(projects.indexOf(p) + 1).padStart(2, '0');
            const inner = (
              <>
                <span className="index__num">{n}</span>
                <span className="index__name">{p.name}</span>
                <span className="index__cat">{p.category}</span>
                <span className="index__year">
                  {p.year}
                  {p.slug && <PixelArrow />}
                </span>
              </>
            );
            return (
              <li key={p.name} className="index__row" onPointerEnter={() => setHovered(p)}>
                {p.slug ? (
                  <TLink href={`/work/${p.slug}`} className="index__link" data-cursor="View case">
                    {inner}
                  </TLink>
                ) : (
                  <div className="index__link">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        <div ref={preview} className="index__preview" aria-hidden="true">
          {hovered &&
            (hovered.slug ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverFor(hovered.slug)} alt="" />
            ) : (
              <div className="index__preview-mark">
                <PixelMark seed={hovered.name} size={7} />
                <span>{hovered.category}</span>
              </div>
            ))}
        </div>
      </section>

      <NextPage
        href="/about"
        label="About"
        kicker="Next — The studio"
        note="Zero error, by design"
        title="About Zerror"
        index="04"
      />
    </>
  );
}
