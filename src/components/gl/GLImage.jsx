'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrthographicCamera, useTexture, View } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';
import { store } from '@/lib/store';
import { useWebGLSupport } from '@/lib/webgl';
import vertexShader from './shaders/image.vert.glsl';
import fragmentShader from './shaders/image.frag.glsl';

function ImagePlane({ src, fx, el }) {
  // Imperative WebGL: Three.js objects are mutated every frame, so skip compiler memoisation.
  'use no memo';
  const texture = useTexture(src);
  const mesh = useRef();

  const material = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTexture: { value: texture },
        uPlane: { value: new THREE.Vector2(1, 1) },
        uImage: { value: new THREE.Vector2(texture.image.width, texture.image.height) },
        uReveal: { value: 0 },
        uHover: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uVelocity: { value: 0 },
        uBlue: { value: new THREE.Color('#0000ff') },
        uLight: { value: new THREE.Color('#f5f5f5') },
      },
    });
  }, [texture]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    const rect = el.current?.getBoundingClientRect();
    if (!rect || !mesh.current) return;
    mesh.current.scale.set(rect.width, rect.height, 1);
    const u = material.uniforms;
    const s = fx.current;
    const ease = Math.min(1, delta * 6);
    s.hoverNow += (s.hover - s.hoverNow) * ease;
    s.mxNow += (s.mx - s.mxNow) * ease * 1.5;
    s.myNow += (s.my - s.myNow) * ease * 1.5;
    const v = THREE.MathUtils.clamp(store.scroll.velocity / 90, -1, 1);
    s.velocity += (v - s.velocity) * ease;
    u.uPlane.value.set(rect.width, rect.height);
    u.uReveal.value = s.reveal;
    u.uHover.value = s.hoverNow;
    u.uMouse.value.set(s.mxNow, s.myNow);
    u.uVelocity.value = s.velocity;
  });

  return (
    <mesh ref={mesh} material={material}>
      <planeGeometry args={[1, 1, 32, 1]} />
    </mesh>
  );
}

// An image rendered through WebGL: pixel-grid reveal on enter, duotone pixel lens on hover.
// Hover is driven by the closest [data-hover-root] ancestor, so whole cards activate the lens.
export default function GLImage({ src, alt, className = '' }) {
  'use no memo';
  const wrap = useRef();
  const fx = useRef({ reveal: 0, hover: 0, hoverNow: 0, mx: 0.5, my: 0.5, mxNow: 0.5, myNow: 0.5, velocity: 0 });
  const gl = useWebGLSupport(true);

  useEffect(() => {
    const el = wrap.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(fx.current, { reveal: 1, duration: 1.8, ease: 'power2.out', delay: 0.1 });
        io.disconnect();
      },
      { threshold: 0.15 },
    );
    io.observe(el);

    const root = el.closest('[data-hover-root]') || el;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      fx.current.mx = (e.clientX - r.left) / r.width;
      fx.current.my = 1 - (e.clientY - r.top) / r.height;
    };
    const enter = () => {
      fx.current.hover = 1;
    };
    const leave = () => {
      fx.current.hover = 0;
    };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerenter', enter);
    root.addEventListener('pointerleave', leave);
    return () => {
      io.disconnect();
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerenter', enter);
      root.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={wrap} className={`glimg ${className}`} role="img" aria-label={alt}>
      {gl ? (
        <View className="glimg__view" index={2}>
          <OrthographicCamera makeDefault position={[0, 0, 10]} near={0.1} far={100} />
          <Suspense fallback={null}>
            <ImagePlane src={src} fx={fx} el={wrap} />
          </Suspense>
        </View>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="glimg__fallback" src={src} alt="" loading="lazy" />
      )}
    </div>
  );
}
