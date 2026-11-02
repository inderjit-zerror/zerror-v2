'use client';

// Tiny mutable store shared by the DOM layer and the WebGL layer.
// The GL side reads it every frame; the DOM side writes to it and emits events.

export const THEMES = {
  blue: {
    '--bg': '#0000ff',
    '--fg': '#f5f5f5',
    '--hl': '#f5f5f5',
    '--muted': 'rgba(245, 245, 245, 0.56)',
    '--line': 'rgba(245, 245, 245, 0.26)',
    '--surface': 'rgba(245, 245, 245, 0.08)',
    gl: { bg: '#0000ff', fg: '#f5f5f5', voxel: '#f5f5f5', accent: '#f5f5f5' },
  },
  ink: {
    '--bg': '#111111',
    '--fg': '#f5f5f5',
    '--hl': '#f5f5f5',
    '--muted': 'rgba(245, 245, 245, 0.5)',
    '--line': 'rgba(245, 245, 245, 0.16)',
    '--surface': '#1c1c1d',
    gl: { bg: '#111111', fg: '#f5f5f5', voxel: '#f5f5f5', accent: '#ea4f3d' },
  },
  light: {
    '--bg': '#f5f5f5',
    '--fg': '#302f32',
    '--hl': '#0000ff',
    '--muted': 'rgba(48, 47, 50, 0.6)',
    '--line': 'rgba(48, 47, 50, 0.16)',
    '--surface': '#ececec',
    gl: { bg: '#f5f5f5', fg: '#302f32', voxel: '#0000ff', accent: '#ea4f3d' },
  },
};

export const FORMATIONS = ['logo', 'split', 'unified', 'field', 'web', 'software', 'commerce', 'brand', 'pixels'];

const listeners = new Map();

export const store = {
  ready: false,
  transitioning: true, // true while the preloader or a page transition covers the screen
  lenis: null,
  theme: 'blue',
  pointer: { x: 0, y: 0, px: 0, py: 0, moved: false },
  scroll: { velocity: 0 },
  shock: { x: 0, y: 0, time: -10 },
  formation: { name: 'none', fx: 0, fy: 0, fs: 1, mfx: 0, mfy: 0, mfs: 1 },
  voxelsVisible: 1,
  section: { index: '', label: '' },
  glSupported: true,
};

export function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(fn);
  return () => listeners.get(event)?.delete(fn);
}

export function emit(event, payload) {
  listeners.get(event)?.forEach((fn) => fn(payload));
}

const num = (v, fallback) => (v === undefined || v === null || v === '' ? fallback : Number(v));

// Position is in viewport fractions from the centre (fx, fy) plus a scale (fs).
// Portrait screens use the m* variants, centred by default.
export function setFormation(name, opts = {}) {
  const fx = num(opts.fx, 0);
  const fy = num(opts.fy, 0);
  const fs = num(opts.fs, 1);
  const next = {
    name: name || 'none',
    fx,
    fy,
    fs,
    mfx: num(opts.mfx, 0),
    mfy: num(opts.mfy, fy),
    mfs: num(opts.mfs, fs),
  };
  if (JSON.stringify(next) === JSON.stringify(store.formation)) return;
  store.formation = next;
  emit('formation', next);
}

export function setTheme(name) {
  if (!THEMES[name] || store.theme === name) return;
  store.theme = name;
  emit('theme', name);
}

export function setSection(index, label) {
  if (store.section.label === label && store.section.index === index) return;
  store.section = { index, label };
  emit('section', store.section);
}

export function setReady() {
  store.ready = true;
  emit('ready');
}

export function onReady(fn) {
  if (store.ready) {
    fn();
    return () => {};
  }
  return on('ready', fn);
}

// Runs fn once the current page is uncovered (after the preloader or a page transition).
export function onEnter(fn) {
  if (!store.transitioning) {
    const id = requestAnimationFrame(fn);
    return () => cancelAnimationFrame(id);
  }
  const off = on('enter', () => {
    off();
    fn();
  });
  return off;
}

export function setEntered() {
  store.transitioning = false;
  emit('enter');
}
