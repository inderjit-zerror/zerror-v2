// Pixel-built marks drawn on the brand's modular grid.

const ARROW = ['..#..', '...#.', '#####', '...#.', '..#..'];

export function PixelArrow({ className = '', direction = 'right' }) {
  const rotate = { right: 0, down: 90, left: 180, up: 270, 'up-right': -45 }[direction] ?? 0;
  return (
    <svg className={`pixel-arrow ${className}`} viewBox="0 0 5 5" aria-hidden="true" style={{ transform: `rotate(${rotate}deg)` }}>
      {ARROW.flatMap((row, y) =>
        [...row].map((c, x) => (c === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" /> : null)),
      )}
    </svg>
  );
}

function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// A deterministic brand pixel element generated from a seed (names, project titles).
export function PixelMark({ seed, size = 6, className = '' }) {
  const rand = seeded(seed);
  const cells = new Set();
  let x = Math.floor(size / 2);
  let y = Math.floor(size / 2);
  cells.add(`${x}:${y}`);
  const target = Math.floor(size * size * 0.32) + Math.floor(rand() * size);
  let guard = 0;
  while (cells.size < target && guard++ < 400) {
    const d = Math.floor(rand() * 4);
    x = Math.max(0, Math.min(size - 1, x + (d === 0 ? 1 : d === 1 ? -1 : 0)));
    y = Math.max(0, Math.min(size - 1, y + (d === 2 ? 1 : d === 3 ? -1 : 0)));
    cells.add(`${x}:${y}`);
  }
  return (
    <svg className={`pixel-mark ${className}`} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {[...cells].map((key, i) => {
        const [cx, cy] = key.split(':').map(Number);
        return <rect key={key} x={cx} y={cy} width="1.02" height="1.02" style={{ '--i': i }} />;
      })}
    </svg>
  );
}
