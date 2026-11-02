import { WORDMARK, SUBMARK } from '@/lib/logo-paths';

export function Wordmark({ className = '', title = 'Zerror' }) {
  return (
    <svg className={`wordmark ${className}`} viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`} role="img" aria-label={title}>
      {WORDMARK.letters.map((d, i) => (
        <path key={i} d={d} fillRule="evenodd" style={{ '--i': i }} />
      ))}
    </svg>
  );
}

export function Submark({ className = '', title = 'Zerror' }) {
  return (
    <svg className={`submark ${className}`} viewBox={`0 0 ${SUBMARK.width} ${SUBMARK.height}`} role="img" aria-label={title}>
      <path d={SUBMARK.path} />
    </svg>
  );
}
