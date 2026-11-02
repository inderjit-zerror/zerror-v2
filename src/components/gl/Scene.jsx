'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, View } from '@react-three/drei';
import Background from './Background';
import Voxels from './Voxels';

// drei Views render with autoClear off, so clear once per frame before any view draws.
function FrameClear() {
  useFrame(({ gl }) => {
    gl.setScissorTest(false);
    gl.clear(true, true, true);
  }, 0.5);
  return null;
}

// One persistent canvas for the whole site. The voxel scene is a full-screen View;
// case-study images register their own Views (see GLImage) and render into the same context.
export default function Scene() {
  return (
    <>
      <div className="gl" aria-hidden="true">
        <Canvas
          flat
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 10], fov: 35 }}
        >
          <FrameClear />
          <View.Port />
        </Canvas>
      </div>
      <View className="gl-track" index={1}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} near={0.1} far={60} />
        <Background />
        <Voxels />
      </View>
    </>
  );
}
