// Letters roll up one after another on hover of the closest .roll-trigger (or the text itself).
export default function RollText({ text, className = '' }) {
  return (
    <span className={`roll ${className}`}>
      <span className="sr-only">{text}</span>
      <span className="roll__chars" aria-hidden="true">
        {[...text].map((char, i) => (
          <span key={i} style={{ '--i': i }}>
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </span>
    </span>
  );
}
