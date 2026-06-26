'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 320;

/** A slow-drifting field of warm golden motes — spice dust caught in light. */
function Motes() {
  const points = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const { positions, speeds, sizes } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.05 + Math.random() * 0.12;
      sizes[i] = 0.012 + Math.random() * 0.05;
    }
    return { positions, speeds, sizes };
  }, []);

  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,236,176,1)');
    g.addColorStop(0.3, 'rgba(232,201,109,0.7)');
    g.addColorStop(1, 'rgba(232,201,109,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    const pos = points.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * delta; // drift up
      pos[i * 3] += Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.0009; // sway
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5; // wrap
    }
    points.current.geometry.attributes.position.needsUpdate = true;

    // Mouse parallax — gentle group rotation toward the pointer.
    const tx = (state.pointer.x * viewport.width) / 40;
    const ty = (state.pointer.y * viewport.height) / 40;
    mouse.current.x += (tx - mouse.current.x) * 0.04;
    mouse.current.y += (ty - mouse.current.y) * 0.04;
    points.current.rotation.y = mouse.current.x * 0.15;
    points.current.rotation.x = -mouse.current.y * 0.15;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
        sizeAttenuation
        color="#E8C96D"
      />
    </points>
  );
}

export default function SpiceParticles() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <Motes />
    </Canvas>
  );
}
