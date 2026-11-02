import TLink from './TLink';
import GLImage from '@/components/gl/GLImage';
import { PixelArrow } from './Pixel';

export default function CaseCard({ study, className = '' }) {
  return (
    <TLink
      href={`/work/${study.slug}`}
      label={study.client}
      className={`case ${className}`}
      data-hover-root=""
      data-cursor="View case"
    >
      <div className="case__media">
        <GLImage src={study.images[0]} alt={`${study.client} — website on screen`} />
      </div>
      <div className="case__info">
        <div className="case__meta">
          <span className="meta">Case study {study.number}</span>
          <span className="meta">{study.category}</span>
        </div>
        <h3 className="case__client">{study.client}</h3>
        <p className="case__title">{study.title}</p>
        <dl className="case__metrics">
          {study.metrics.map((m) => (
            <div key={m.label}>
              <dt>{m.value}</dt>
              <dd>{m.label}</dd>
            </div>
          ))}
        </dl>
        <span className="case__more">
          View case study <PixelArrow />
        </span>
      </div>
    </TLink>
  );
}
