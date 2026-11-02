import { WORDMARK, SUBMARK } from '@/lib/logo-paths';

// Every formation is a list of voxels: { p: [x, y, z], s: size, a: accent 0|1 }.
// Formations are built from the brand's own construction grid: the wordmark and the
// submark are rasterised on their 20-unit grid, everything else is grid-snapped.

export const FORMATION_INDEX = {
  logo: 0,
  split: 1,
  unified: 2,
  field: 3,
  web: 4,
  software: 5,
  commerce: 6,
  brand: 7,
  pixels: 8,
};

// How each formation moves while it holds: continuous spin and/or sway (radians).
export const FORMATION_MOTION = [
  { spin: 0, sway: 0 },
  { spin: 0, sway: 0.18 },
  { spin: 0.22, sway: 0 },
  { spin: 0, sway: 0 },
  { spin: 0, sway: 0.32 },
  { spin: 0, sway: 0.38 },
  { spin: 0, sway: 0.55 },
  { spin: 0, sway: 0.5 },
  { spin: 0, sway: 0 },
];

// Laid out against the viewport width instead of fitted into a box.
export const SCREEN_FORMATIONS = new Set([FORMATION_INDEX.field]);
// Fitted to (almost) the full viewport rather than the content box.
export const FILL_FORMATIONS = new Set([FORMATION_INDEX.pixels]);

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, rand) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function rasterize(paths, width, height, cell) {
  const ctx = document.createElement('canvas').getContext('2d');
  const shapes = paths.map((d) => new Path2D(d));
  const points = [];
  for (let y = cell / 2; y < height; y += cell) {
    for (let x = cell / 2; x < width; x += cell) {
      if (shapes.some((s) => ctx.isPointInPath(s, x, y, 'evenodd'))) points.push([x, y]);
    }
  }
  return points;
}

function rotate(list, rx, ry) {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  for (const v of list) {
    const [x, y, z] = v.p;
    const y1 = y * cx - z * sx;
    const z1 = y * sx + z * cx;
    v.p = [x * cy + z1 * sy, y1, -x * sy + z1 * cy];
  }
  return list;
}

// ── Formations ──────────────────────────────────────────────────────────────

function logo() {
  const cell = 5; // a quarter of the logo's 20-unit construction module
  const k = 7 / WORDMARK.width;
  const out = [];
  for (const [x, y] of rasterize(WORDMARK.letters, WORDMARK.width, WORDMARK.height, cell)) {
    for (let layer = 0; layer < 2; layer++) {
      out.push({
        p: [(x - WORDMARK.width / 2) * k, -(y - WORDMARK.height / 2) * k, (layer - 0.5) * cell * k],
        s: cell * k * 0.84,
        a: 0,
      });
    }
  }
  return out;
}

// Design (organic) and development (rigid lattice), with the gap between them.
function split(n, rand) {
  const out = [];
  const half = Math.floor(n / 2);
  while (out.length < half) {
    const x = rand() * 2 - 1;
    const y = rand() * 2 - 1;
    const z = rand() * 2 - 1;
    const d = Math.hypot(x, y, z);
    if (d > 1) continue;
    const th = Math.atan2(y, x);
    const ph = Math.acos(z / (d || 1));
    const r = 1.2 * (0.86 + 0.2 * Math.sin(3 * th) * Math.sin(2 * ph));
    out.push({ p: [-2.4 + x * r, y * r, z * r], s: 0.045 + rand() * 0.075, a: 0 });
  }
  const m = Math.floor(Math.cbrt(n - half));
  const sp = 0.2;
  const lattice = [];
  for (let i = 0; i < m; i++)
    for (let j = 0; j < m; j++)
      for (let k = 0; k < m; k++)
        lattice.push({ p: [(i - (m - 1) / 2) * sp, (j - (m - 1) / 2) * sp, (k - (m - 1) / 2) * sp], s: sp * 0.72, a: 0 });
  rotate(lattice, 0.45, 0.65);
  for (const v of lattice) v.p[0] += 2.4;
  return out.concat(lattice);
}

// Both halves merged into one precise voxel sphere.
function unified(n) {
  const R = 1.75;
  let cells = [];
  for (let s = 0.34; s > 0.04; s *= 0.97) {
    cells = [];
    const m = Math.ceil(R / s) + 1;
    for (let i = -m; i <= m; i++)
      for (let j = -m; j <= m; j++)
        for (let k = -m; k <= m; k++) {
          const d = Math.hypot(i * s, j * s, k * s);
          if (d <= R && d > R - s) cells.push({ p: [i * s, j * s, k * s], s: s * 0.8, a: 0 });
        }
    if (cells.length >= n) break;
  }
  return cells;
}

// A floor of pixels in unit space: x ∈ [-1, 1], z in world units.
function field(n, rand) {
  const cols = Math.ceil(Math.sqrt(n * 2.2));
  const rows = Math.ceil(n / cols);
  const sx = 2 / cols;
  const out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push({
        p: [-1 + (c + 0.5) * sx, 0, -9.5 + (r / (rows - 1)) * 7.5],
        s: sx * 0.38,
        a: rand() < 0.06 ? 1 : 0,
      });
    }
  }
  return out;
}

function gridShape(w, h, g, depth, cells) {
  const out = [];
  for (const [x, y, a] of cells) {
    for (let l = 0; l < depth; l++) {
      out.push({ p: [(x - w / 2 + 0.5) * g, (h / 2 - y - 0.5) * g, (l - (depth - 1) / 2) * g], s: g * 0.84, a: a ? 1 : 0 });
    }
  }
  return out;
}

// Website: a browser window with a headline, copy, a call to action and an image.
function web() {
  const W = 36;
  const H = 24;
  const cells = [];
  const rect = (x0, y0, w, h, a = 0) => {
    for (let x = x0; x < x0 + w; x++) for (let y = y0; y < y0 + h; y++) cells.push([x, y, a]);
  };
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      const dot = y === 1 && (x === 2 || x === 4 || x === 6);
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1 || y <= 2) cells.push([x, y, dot ? 1 : 0]);
    }
  }
  rect(3, 5, 16, 2);
  rect(3, 8, 11, 2);
  rect(3, 12, 14, 1);
  rect(3, 14, 10, 1);
  rect(3, 18, 6, 2, 1);
  rect(21, 5, 12, 15);
  return gridShape(W, H, 0.1, 2, cells);
}

// Software: three stacked layers — data, cards and a live chart.
function software() {
  const W = 16;
  const D = 11;
  const g = 0.13;
  const out = [];
  const add = (x, y, z, a = 0) =>
    out.push({ p: [(x - W / 2 + 0.5) * g, y, (z - D / 2 + 0.5) * g], s: g * 0.84, a });
  for (let x = 0; x < W; x++) {
    for (let z = 0; z < D; z++) {
      const border = x === 0 || z === 0 || x === W - 1 || z === D - 1;
      add(x, -0.8, z);
      if (border || ((x % 5 === 2 || x % 5 === 3) && (z % 4 === 2 || z % 4 === 3) && x < W - 1)) add(x, 0, z);
      if (border) add(x, 0.8, z);
    }
  }
  [3, 5, 2, 6, 4].forEach((h, i) => {
    for (let k = 0; k < h; k++) add(3 + i * 2.5, 0.8 + (k + 1) * g, 5, k === h - 1 ? 1 : 0);
  });
  return rotate(out, 0.55, -0.7);
}

// eCommerce: a shopping bag with an accent handle.
function commerce() {
  const W = 12;
  const H = 14;
  const D = 6;
  const g = 0.13;
  const out = [];
  const add = (x, y, z, a = 0) =>
    out.push({ p: [(x - W / 2 + 0.5) * g, (y - H / 2 + 0.5) * g - 0.3, (z - D / 2 + 0.5) * g], s: g * 0.84, a });
  for (let x = 0; x < W; x++)
    for (let y = 0; y < H; y++)
      for (let z = 0; z < D; z++)
        if (x === 0 || x === W - 1 || z === 0 || z === D - 1 || y === 0) add(x, y, z);
  for (const z of [1, D - 2]) {
    const seen = new Set();
    for (let t = 0; t <= Math.PI; t += 0.04) {
      const x = Math.round(W / 2 - 0.5 + Math.cos(t) * 3.2);
      const y = Math.round(H - 0.5 + Math.sin(t) * 3.6);
      const key = `${x}:${y}`;
      if (!seen.has(key)) {
        seen.add(key);
        add(x, y, z, 1);
      }
    }
  }
  return rotate(out, 0.22, 0.6);
}

// Brand: the Zerror submark, extruded on its construction grid.
function brand() {
  const cell = 4;
  const k = 3 / SUBMARK.height;
  const out = [];
  for (const [x, y] of rasterize([SUBMARK.path], SUBMARK.width, SUBMARK.height, cell)) {
    for (let layer = 0; layer < 3; layer++) {
      out.push({
        p: [(x - SUBMARK.width / 2) * k, -(y - SUBMARK.height / 2) * k, (layer - 1) * cell * k],
        s: cell * k * 0.86,
        a: 0,
      });
    }
  }
  return out;
}

// Brand pixel elements: small random-walk clusters around the edges of a 16:9 frame.
function pixels(rand) {
  const fw = 5.4;
  const fh = 2.9;
  const g = 0.17;
  const out = [];
  // Weighted to the top and right: page titles and copy sit bottom-left.
  const anchors = [
    [-0.86, 0.66], [-0.52, 0.88], [-0.16, 0.66], [0.16, 0.9], [0.46, 0.62],
    [0.82, 0.86], [0.93, 0.38], [0.66, 0.16], [0.9, -0.14], [-0.92, 0.18],
  ];
  anchors.forEach(([ax, ay], i) => {
    const accent = i % 4 === 1 ? 1 : 0;
    const cells = new Set(['0:0']);
    let cx = 0;
    let cy = 0;
    const count = 7 + Math.floor(rand() * 8);
    while (cells.size < count) {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      const [dx, dy] = dirs[Math.floor(rand() * 4)];
      cx = Math.max(-3, Math.min(3, cx + dx));
      cy = Math.max(-3, Math.min(3, cy + dy));
      cells.add(`${cx}:${cy}`);
    }
    for (const key of cells) {
      const [x, y] = key.split(':').map(Number);
      out.push({ p: [ax * fw + x * g, ay * fh + y * g, -0.4], s: g * 0.86, a: accent });
    }
  });
  return out;
}

// ── Packing ─────────────────────────────────────────────────────────────────

function centre(list) {
  const visible = list.filter((v) => v.s > 0);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const { p } of visible) {
    minX = Math.min(minX, p[0]);
    maxX = Math.max(maxX, p[0]);
    minY = Math.min(minY, p[1]);
    maxY = Math.max(maxY, p[1]);
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  for (const v of list) {
    v.p[0] -= cx;
    v.p[1] -= cy;
  }
  return { w: maxX - minX, h: maxY - minY };
}

// Pad (with hidden voxels) or subsample to exactly n, then order spatially so
// morphs read as one coherent movement instead of noise.
function fit(list, n, rand) {
  let out = list.slice();
  if (out.length > n) out = shuffle(out, rand).slice(0, n);
  while (out.length < n) {
    const src = list[Math.floor(rand() * list.length)];
    out.push({ p: src.p.slice(), s: 0, a: 0 });
  }
  const key = out.map((v) => v.p[0] + (rand() - 0.5) * 0.6);
  return out.map((v, i) => [v, key[i]]).sort((a, b) => a[1] - b[1]).map(([v]) => v);
}

export function buildFormations() {
  const rand = mulberry32(2022);
  const base = logo();
  const n = base.length;
  const lists = [
    base,
    split(n, rand),
    unified(n),
    field(n, rand),
    web(),
    software(),
    commerce(),
    brand(),
    pixels(rand),
  ];
  const count = lists.length;
  const data = new Float32Array(count * n * 4);
  const accent = new Float32Array(count * n);
  const bounds = [];
  lists.forEach((list, f) => {
    const screen = SCREEN_FORMATIONS.has(f);
    bounds[f] = screen ? { w: 2, h: 2 } : centre(list);
    fit(list, n, rand).forEach((v, i) => {
      const o = (f * n + i) * 4;
      data[o] = v.p[0];
      data[o + 1] = v.p[1];
      data[o + 2] = v.p[2];
      data[o + 3] = v.s;
      accent[f * n + i] = v.a;
    });
  });
  return { n, count, data, accent, bounds };
}
