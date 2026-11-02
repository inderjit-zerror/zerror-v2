// Text pre-split into words so a scroll timeline can light them up one by one.
// segments: [{ t: 'text', key?: true, em?: true }]
export default function ScrubText({ as: Tag = 'p', segments, className = '' }) {
  let index = 0;
  return (
    <Tag className={`scrub ${className}`}>
      {segments.map((seg, s) =>
        seg.t.split(/(\s+)/).map((word, w) => {
          if (!word) return null;
          if (/^\s+$/.test(word)) return ' ';
          const i = index++;
          const Word = seg.em ? 'em' : 'span';
          return (
            <Word key={`${s}-${w}`} className="w" data-key={seg.key ? '' : undefined} style={{ '--w': i }}>
              {word}
            </Word>
          );
        }),
      )}
    </Tag>
  );
}
