'use client';

import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';
import { store, on, THEMES } from '@/lib/store';
import vertexShader from './shaders/background.vert.glsl';
import fragmentShader from './shaders/background.frag.glsl';

const TRAIL = 16;

export default function Background() {
  // Imperative WebGL: Three.js objects are mutated every frame, so skip compiler memoisation.
  'use no memo';
  const material = useMemo(() => {
    const theme = THEMES[store.theme].gl;
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uBg: { value: new THREE.Color(theme.bg) },
        uCell: { value: new THREE.Color(theme.voxel) },
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uGrid: { value: 60 },
        uMouse: { value: new THREE.Vector2(-9999, -9999) },
        uMouseActive: { value: 0 },
        uTrail: { value: Array.from({ length: TRAIL }, () => new THREE.Vector3(-9999, -9999, 0)) },
      },
    });
  }, []);

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const apply = (name, immediate) => {
      const t = THEMES[name].gl;
      [['uBg', t.bg], ['uCell', t.voxel]].forEach(([key, hex]) => {
        const c = new THREE.Color(hex);
        gsap.to(material.uniforms[key].value, { r: c.r, g: c.g, b: c.b, duration: immediate ? 0 : 0.9, ease: 'zr.inOut', overwrite: true });
      });
    };
    apply(store.theme, true);
    return on('theme', (name) => apply(name));
  }, [material]);

  const trail = useMemo(() => ({ head: 0, lastX: -9999, lastY: -9999, active: 0 }), []);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const { width, height } = state.size;
    u.uRes.value.set(width, height);
    u.uTime.value = state.clock.elapsedTime;
    u.uGrid.value = THREE.MathUtils.clamp(Math.round(width / 24), 44, 84);

    const p = store.pointer;
    const mx = p.px;
    const my = height - p.py;
    const live = p.last && performance.now() - p.last < 2500 ? 1 : 0;
    trail.active += (live - trail.active) * Math.min(1, delta * 3);
    u.uMouse.value.set(mx, my);
    u.uMouseActive.value = trail.active;

    for (const point of u.uTrail.value) point.z = Math.max(0, point.z - delta * 1.1);
    if (live && Math.hypot(mx - trail.lastX, my - trail.lastY) > u.uGrid.value * 0.45) {
      u.uTrail.value[trail.head].set(mx, my, 1);
      trail.head = (trail.head + 1) % TRAIL;
      trail.lastX = mx;
      trail.lastY = my;
    }
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
