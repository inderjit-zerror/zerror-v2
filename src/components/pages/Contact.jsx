'use client';

import { useState } from 'react';
import { projectTypes, studio } from '@/lib/content';
import PageHero from '@/components/ui/PageHero';
import NextPage from '@/components/ui/NextPage';
import SectionBar from '@/components/ui/SectionBar';
import LocalTime from '@/components/ui/LocalTime';
import RollText from '@/components/ui/RollText';
import Magnetic from '@/components/ui/Magnetic';
import TLink from '@/components/ui/TLink';
import { PixelArrow } from '@/components/ui/Pixel';

const NEXT_STEPS = [
  { title: 'We read your brief', text: 'Every enquiry is read by the people who would work on it, not a sales queue.' },
  { title: 'We map it together', text: 'A short call to understand the goals, the users and what “done” looks like.' },
  { title: 'You get a clear plan', text: 'Scope, stages and cost in one document, so design, build and launch are agreed up front.' },
];

// No backend: the enquiry is composed into an email to the studio's inbox.
export default function Contact() {
  const [types, setTypes] = useState([]);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const toggle = (t) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!types.length) {
      setError('Pick at least one project type.');
      return;
    }
    setError('');
    const lines = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      data.get('company') ? `Company: ${data.get('company')}` : null,
      `Project: ${types.join(', ')}`,
      '',
      String(data.get('details') || ''),
    ].filter((l) => l !== null);
    const subject = `New project — ${types.join(', ')}`;
    window.location.href = `mailto:${studio.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setSent(true);
  };

  return (
    <>
      <PageHero
        className="contact-hero"
        index="01"
        label="Let’s build together"
        aside={<LocalTime />}
        title="Let’s build together."
        intro="For founders who move fast and brands that refuse to look average. Your next version starts here."
        data-theme="blue"
        data-formation="pixels"
        data-label="Contact"
        data-index="01"
      >
        <div className="contact-hero__direct page-hero__fade">
          <p className="meta is-muted">Write to us</p>
          <Magnetic strength={0.2}>
            <a className="cta__mail" href={`mailto:${studio.email}`} data-cursor="Write us">
              <RollText text={studio.email} />
            </a>
          </Magnetic>
        </div>
      </PageHero>

      <section className="section contact" data-theme="blue" data-formation="none" data-label="Start a project" data-index="02">
        <SectionBar index="02" label="Start a project" />
        <div className="contact__grid">
          {sent ? (
            <div className="form-done" role="status">
              <p className="meta">Enquiry ready</p>
              <p className="display-3">Your mail app should have opened with your brief. Hit send and we’ll take it from there.</p>
              <button type="button" className="btn btn--ghost" onClick={() => setSent(false)}>
                <RollText text="Edit the brief" />
                <span className="btn__icon">
                  <PixelArrow direction="left" />
                </span>
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={submit} noValidate={false}>
              <fieldset className="form__group">
                <legend className="meta">01 — What are we building?</legend>
                <div className="form__chips">
                  {projectTypes.map((t) => (
                    <label key={t} className={`filter filter--large ${types.includes(t) ? 'is-active' : ''}`}>
                      <input type="checkbox" className="sr-only" checked={types.includes(t)} onChange={() => toggle(t)} />
                      {t}
                    </label>
                  ))}
                </div>
                {error && (
                  <p className="form__error" role="alert">
                    {error}
                  </p>
                )}
              </fieldset>
              <div className="form__row">
                <label className="field">
                  <span className="meta">02 — Your name</span>
                  <input name="name" type="text" required autoComplete="name" placeholder="Full name" />
                </label>
                <label className="field">
                  <span className="meta">03 — Email</span>
                  <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
                </label>
              </div>
              <label className="field">
                <span className="meta">04 — Company (optional)</span>
                <input name="company" type="text" autoComplete="organization" placeholder="Company or brand" />
              </label>
              <label className="field">
                <span className="meta">05 — Project details</span>
                <textarea name="details" rows={5} required placeholder="Goals, timeline, links — whatever helps us understand the work." />
              </label>
              <div className="form__foot">
                <p className="meta is-muted">Opens your email app with the brief filled in.</p>
                <Magnetic strength={0.25}>
                  <button type="submit" className="btn btn--solid">
                    <RollText text="Send enquiry" />
                    <span className="btn__icon">
                      <PixelArrow />
                    </span>
                  </button>
                </Magnetic>
              </div>
            </form>
          )}

          <aside className="contact__info">
            <div>
              <p className="meta is-muted">Email</p>
              <a href={`mailto:${studio.email}`} className="contact__line">
                <RollText text={studio.email} />
              </a>
            </div>
            <div>
              <p className="meta is-muted">Phone</p>
              <a href={studio.phoneHref} className="contact__line">
                <RollText text={studio.phone} />
              </a>
            </div>
            <div>
              <p className="meta is-muted">Studio</p>
              <address className="contact__address">
                {studio.address.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </address>
            </div>
            <div>
              <p className="meta is-muted">Follow</p>
              <div className="contact__socials">
                {studio.socials.map((s) => (
                  <TLink key={s.label} href={s.href} className="contact__line">
                    <RollText text={s.label} />
                  </TLink>
                ))}
              </div>
            </div>
            <a
              className="contact__call"
              href={`mailto:${studio.email}?subject=${encodeURIComponent('Schedule a call')}`}
              data-cursor="Book"
            >
              <span>Prefer a call?</span>
              <span className="contact__call-cta">
                Schedule a call <PixelArrow />
              </span>
            </a>
          </aside>
        </div>
      </section>

      <section className="section next-steps" data-theme="ink" data-formation="none" data-label="What happens next" data-index="03">
        <SectionBar index="03" label="What happens next" />
        <ol className="next-steps__list">
          {NEXT_STEPS.map((step, i) => (
            <li key={step.title} className="next-steps__item">
              <span className="meta">0{i + 1}</span>
              <h3 className="next-steps__title">{step.title}</h3>
              <p className="body-text is-muted-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <NextPage href="/work" label="Work" kicker="Next — Selected work" note="20 projects since 2022" title="See the work" index="04" />
    </>
  );
}
