'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';
import { store, on, THEMES } from '@/lib/store';
import {
  buildFormations,
  FORMATION_INDEX,
  FORMATION_MOTION,
  SCREEN_FORMATIONS,
  FILL_FORMATIONS,
} from './formations';
import vertexShader from './shaders/voxel.vert.glsl';
import fragmentShader from './shaders/voxel.frag.glsl';

const STAGGER = 0.6; // seconds over which voxels depart for a new formation
const STEP = 1 / 60;
const MAX_SUBSTEPS = 15;
const FIELD = FORMATION_INDEX.field;
const ORIGIN = new THREE.Vector3();
const DEFAULT_OPTS = { fx: 0, fy: 0, fs: 1, mfx: 0, mfy: 0, mfs: 1 };

function createSimulation(n) {
  const sim = {
    pos: new Float32Array(n * 3),
    vel: new Float32Array(n * 3),
    size: new Float32Array(n),
    accent: new Float32Array(n),
    angle: new Float32Array(n),
    assigned: new Int16Array(n).fill(-1),
    delay: new Float32Array(n),
    stiffness: new Float32Array(n),
    lift: new Float32Array(n),
    jitter: new Float32Array(n),
    target: -1,
    changedAt: 0,
    opts: [],
  };
  for (let i = 0; i < n; i++) {
    // Start scattered in a loose shell around the camera's view.
    const th = Math.random() * Math.PI * 2;
    const r = 6 + Math.random() * 5;
    sim.pos[i * 3] = Math.cos(th) * r;
    sim.pos[i * 3 + 1] = Math.sin(th) * r * 0.6;
    sim.pos[i * 3 + 2] = -4 + Math.random() * 6;
    sim.delay[i] = Math.random();
    sim.stiffness[i] = 22 + Math.random() * 18;
    sim.lift[i] = Math.random() * 1.6 - 0.5;
    sim.jitter[i] = Math.random() * 2 - 1;
  }
  return sim;
}

export default function Voxels() {
  // Imperative WebGL: Three.js objects are mutated every frame, so skip compiler memoisation.
  'use no memo';
  const group = useRef();
  const formations = useMemo(() => buildFormations(), []);
  const sim = useMemo(() => createSimulation(formations.n), [formations]);

  const { geometry, material } = useMemo(() => {
    const { n } = formations;
    const box = new THREE.BoxGeometry(1, 1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = box.index;
    geo.setAttribute('position', box.getAttribute('position'));
    geo.setAttribute('normal', box.getAttribute('normal'));
    geo.instanceCount = n;

    // Tumble around a principal axis so a quarter-turn lands the cube square again.
    const axes = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      axes[i * 3 + Math.floor(Math.random() * 3)] = Math.random() < 0.5 ? -1 : 1;
    }
    geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(n * 4), 4).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aState', new THREE.InstancedBufferAttribute(new Float32Array(n * 2), 2).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aAxis', new THREE.InstancedBufferAttribute(axes, 3));

    const theme = THEMES[store.theme].gl;
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(theme.voxel) },
        uAccent: { value: new THREE.Color(theme.accent) },
        uBg: { value: new THREE.Color(theme.bg) },
        uFogNear: { value: 11 },
        uFogFar: { value: 21 },
        uPointer: { value: new THREE.Vector3(99, 99, 0) },
        uPointerForce: { value: 0 },
        uPointerRadius: { value: 1 },
        uShock: { value: new THREE.Vector4(0, 0, 10, 0) },
      },
    });
    return { geometry: geo, material: mat };
  }, [formations]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  // Theme → colours.
  useEffect(() => {
    const apply = (name, immediate) => {
      const t = THEMES[name].gl;
      [['uColor', t.voxel], ['uAccent', t.accent], ['uBg', t.bg]].forEach(([key, hex]) => {
        const c = new THREE.Color(hex);
        gsap.to(material.uniforms[key].value, {
          r: c.r,
          g: c.g,
          b: c.b,
          duration: immediate ? 0 : 0.9,
          ease: 'zr.inOut',
          overwrite: true,
        });
      });
    };
    apply(store.theme, true);
    return on('theme', (name) => apply(name));
  }, [material]);

  // Section → formation. Nothing assembles until the preloader hands over.
  useEffect(() => {
    const apply = (f) => {
      const index = f.name in FORMATION_INDEX ? FORMATION_INDEX[f.name] : -1;
      if (index >= 0) sim.opts[index] = f;
      if (index === sim.target && index >= 0) return;
      sim.target = index;
      sim.changedAt = performance.now() / 1000;
    };
    if (store.ready) apply(store.formation);
    const offFormation = on('formation', (f) => store.ready && apply(f));
    const offReady = on('ready', () => apply(store.formation));
    return () => {
      offFormation();
      offReady();
    };
  }, [sim]);

  const layouts = useMemo(() => [], []);
  const smooth = useMemo(() => ({ force: 0, tiltX: 0, tiltY: 0 }), []);

  useFrame((state, delta) => {
    // Springs are integrated in fixed sub-steps so slow frames still converge in real time.
    const elapsed = Math.min(delta, 0.25);
    const steps = Math.min(MAX_SUBSTEPS, Math.max(1, Math.ceil(elapsed / STEP)));
    const h = elapsed / steps;
    const dt = elapsed;
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;
    const vp = state.viewport.getCurrentViewport(state.camera, ORIGIN, state.size);
    const portrait = vp.width / vp.height < 0.8;
    const { n, count, data, accent: accentData, bounds } = formations;

    for (let f = 0; f < count; f++) {
      const o = sim.opts[f] || DEFAULT_OPTS;
      const fx = portrait ? o.mfx : o.fx;
      const fy = portrait ? o.mfy : o.fy;
      const fs = portrait ? o.mfs : o.fs;
      const m = FORMATION_MOTION[f];
      const rot = m.spin * t + Math.sin(t * 0.45) * m.sway;
      let k;
      let sy;
      if (SCREEN_FORMATIONS.has(f)) {
        k = vp.width * 0.62 * fs;
        sy = 1;
      } else {
        const b = bounds[f];
        const fill = FILL_FORMATIONS.has(f);
        k = fs * Math.min((vp.width * (fill ? 0.98 : 0.8)) / b.w, (vp.height * (fill ? 0.94 : 0.58)) / b.h);
        sy = k;
      }
      const L = layouts[f] || (layouts[f] = {});
      L.cos = Math.cos(rot);
      L.sin = Math.sin(rot);
      L.k = k;
      L.sy = sy;
      L.sz = SCREEN_FORMATIONS.has(f) ? 1 : k;
      L.ox = fx * vp.width;
      L.oy = fy * vp.height;
    }

    const { pos, vel, size, accent, angle, assigned, delay, stiffness, lift, jitter } = sim;
    const offsets = geometry.attributes.aOffset.array;
    const states = geometry.attributes.aState.array;
    const since = now - sim.changedAt;
    const target = sim.target;
    const scroll = THREE.MathUtils.clamp(store.scroll.velocity, -60, 60) * 0.006;
    const quarter = Math.PI / 2;

    for (let i = 0; i < n; i++) {
      if (assigned[i] !== target && since >= delay[i] * STAGGER) assigned[i] = target;
      const f = assigned[i];
      const i3 = i * 3;
      let tx;
      let ty;
      let tz;
      let ts;
      let ta;
      if (f < 0) {
        tx = pos[i3];
        ty = pos[i3 + 1];
        tz = pos[i3 + 2];
        ts = 0;
        ta = accent[i];
      } else {
        const L = layouts[f];
        const o = (f * n + i) * 4;
        const x = data[o];
        let y = data[o + 1];
        const z = data[o + 2];
        if (f === FIELD) y += Math.sin(x * 9 + t * 1.1) * Math.cos(z * 0.7 + t * 0.8) * 0.22;
        const rx = x * L.cos + z * L.sin;
        const rz = -x * L.sin + z * L.cos;
        tx = rx * L.k + L.ox;
        ty = y * L.sy + L.oy;
        tz = rz * L.sz;
        ts = data[o + 3] * L.k;
        ta = accentData[f * n + i];
      }
      ty += scroll * jitter[i];

      const k = stiffness[i];
      const c = 2 * Math.sqrt(k) * 0.62;
      for (let s = 0; s < steps; s++) {
        const dx = tx - pos[i3];
        const dy = ty - pos[i3 + 1];
        let dz = tz - pos[i3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        dz += Math.min(dist, 1.5) * lift[i] * 0.8; // travel in an arc
        vel[i3] += (dx * k - vel[i3] * c) * h;
        vel[i3 + 1] += (dy * k - vel[i3 + 1] * c) * h;
        vel[i3 + 2] += (dz * k - vel[i3 + 2] * c) * h;
        pos[i3] += vel[i3] * h;
        pos[i3 + 1] += vel[i3 + 1] * h;
        pos[i3 + 2] += vel[i3 + 2] * h;
      }

      size[i] += (ts - size[i]) * Math.min(1, dt * (ts > size[i] ? 4 : 7));
      accent[i] += (ta - accent[i]) * Math.min(1, dt * 4);

      // Tumble while travelling, settle on a quarter turn when at rest.
      const speed = Math.sqrt(vel[i3] * vel[i3] + vel[i3 + 1] * vel[i3 + 1] + vel[i3 + 2] * vel[i3 + 2]);
      angle[i] += speed * dt * 1.3;
      const snap = Math.round(angle[i] / quarter) * quarter;
      angle[i] += (snap - angle[i]) * Math.min(1, dt * 4) * Math.max(0, 1 - speed);

      const o4 = i * 4;
      offsets[o4] = pos[i3];
      offsets[o4 + 1] = pos[i3 + 1];
      offsets[o4 + 2] = pos[i3 + 2];
      offsets[o4 + 3] = size[i];
      states[i * 2] = angle[i];
      states[i * 2 + 1] = accent[i];
    }
    geometry.attributes.aOffset.needsUpdate = true;
    geometry.attributes.aState.needsUpdate = true;

    // Pointer, shockwave and a gentle parallax tilt.
    const p = store.pointer;
    const active = p.last && performance.now() - p.last < 2500 ? 1 : 0;
    smooth.force += (active - smooth.force) * Math.min(1, dt * 3);
    const u = material.uniforms;
    u.uPointer.value.set((p.x * vp.width) / 2, (p.y * vp.height) / 2, 0);
    u.uPointerForce.value = smooth.force;
    u.uPointerRadius.value = Math.min(vp.width, vp.height) * 0.17;
    const shockAge = now - store.shock.time;
    u.uShock.value.set((store.shock.x * vp.width) / 2, (store.shock.y * vp.height) / 2, shockAge, shockAge < 1.6 ? 1 : 0);

    smooth.tiltX += (-p.y * 0.14 - smooth.tiltX) * Math.min(1, dt * 2.5);
    smooth.tiltY += (p.x * 0.22 - smooth.tiltY) * Math.min(1, dt * 2.5);
    if (group.current) {
      group.current.rotation.x = smooth.tiltX;
      group.current.rotation.y = smooth.tiltY;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
