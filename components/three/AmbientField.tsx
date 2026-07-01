'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Real-3D ambient luxe layer: a perspective field of golden dust motes and a
 * few brighter embers, drifting in true depth so the camera + parallax give
 * genuine dimensionality (not a flat 2D canvas trick). Driven by a custom
 * additive shader for soft glow; reacts to scroll (upward drift + brightness)
 * and pointer (gentle parallax). Pointer-events-none, meant to sit over dark
 * cinematic surfaces with screen/plus-lighter blending.
 */

const DUST = 520;
const EMBERS = 46;

function Field({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const dust = useRef<THREE.Points>(null);
  const embers = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const useParticleData = (count: number, spread: [number, number, number], sizeRange: [number, number]) =>
    useMemo(() => {
      const positions = new Float32Array(count * 3);
      const aSeed = new Float32Array(count);
      const aSize = new Float32Array(count);
      const aSpeed = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread[0];
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
        aSeed[i] = Math.random() * 100;
        aSize[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
        aSpeed[i] = 0.3 + Math.random() * 0.9;
      }
      return { positions, aSeed, aSize, aSpeed };
    }, [count]);

  const dustData = useParticleData(DUST, [26, 16, 10], [6, 20]);
  const emberData = useParticleData(EMBERS, [22, 14, 8], [26, 64]);

  const useGlowMaterial = (core: string, edge: string, intensity: number) =>
    useMemo(
      () =>
        new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uIntensity: { value: intensity },
            uCore: { value: new THREE.Color(core) },
            uEdge: { value: new THREE.Color(edge) },
          },
          vertexShader: /* glsl */ `
            attribute float aSeed;
            attribute float aSize;
            attribute float aSpeed;
            uniform float uTime;
            uniform float uScroll;
            varying float vTwinkle;
            void main() {
              vec3 p = position;
              // upward drift, looped; faster with scroll
              float t = uTime * aSpeed * 0.12 + uScroll * aSpeed * 2.2;
              p.y = mod(p.y + t + 8.0, 16.0) - 8.0;
              // lateral sway
              p.x += sin(uTime * 0.3 + aSeed) * 0.25;
              p.z += cos(uTime * 0.22 + aSeed * 1.3) * 0.2;
              vTwinkle = 0.55 + 0.45 * sin(uTime * 1.6 + aSeed * 6.2831);
              vec4 mv = modelViewMatrix * vec4(p, 1.0);
              gl_PointSize = aSize * (300.0 / -mv.z);
              gl_Position = projectionMatrix * mv;
            }
          `,
          fragmentShader: /* glsl */ `
            uniform vec3 uCore;
            uniform vec3 uEdge;
            uniform float uIntensity;
            uniform float uScroll;
            varying float vTwinkle;
            void main() {
              vec2 uv = gl_PointCoord - 0.5;
              float d = length(uv);
              if (d > 0.5) discard;
              float glow = smoothstep(0.5, 0.0, d);
              float core = smoothstep(0.28, 0.0, d);
              vec3 col = mix(uEdge, uCore, core);
              float alpha = glow * vTwinkle * uIntensity * (0.75 + uScroll * 0.5);
              gl_FragColor = vec4(col, alpha);
            }
          `,
        }),
      []
    );

  const dustMat = useGlowMaterial('#F4E3A8', '#C9A84C', 0.5);
  const emberMat = useGlowMaterial('#FFF0C4', '#E8961E', 0.9);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const s = scrollRef.current;
    [dustMat, emberMat].forEach((m) => {
      m.uniforms.uTime.value = t;
      m.uniforms.uScroll.value = s;
    });
    // smooth pointer parallax on the whole field
    pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.03;
    pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.03;
    if (group.current) {
      group.current.rotation.y = pointer.current.x * 0.12;
      group.current.rotation.x = -pointer.current.y * 0.08;
    }
  });

  return (
    <group ref={group}>
      <points ref={dust} material={dustMat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={DUST} array={dustData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-aSeed" count={DUST} array={dustData.aSeed} itemSize={1} />
          <bufferAttribute attach="attributes-aSize" count={DUST} array={dustData.aSize} itemSize={1} />
          <bufferAttribute attach="attributes-aSpeed" count={DUST} array={dustData.aSpeed} itemSize={1} />
        </bufferGeometry>
      </points>
      <points ref={embers} material={emberMat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={EMBERS} array={emberData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-aSeed" count={EMBERS} array={emberData.aSeed} itemSize={1} />
          <bufferAttribute attach="attributes-aSize" count={EMBERS} array={emberData.aSize} itemSize={1} />
          <bufferAttribute attach="attributes-aSpeed" count={EMBERS} array={emberData.aSpeed} itemSize={1} />
        </bufferGeometry>
      </points>
    </group>
  );
}

export function AmbientField({ className }: { className?: string }) {
  const scrollRef = useRef(0);
  // Starts false so the WebGL Canvas never renders during SSR; enabled after
  // mount unless the user prefers reduced motion.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!enabled) return null;

  return (
    <div className={className} aria-hidden style={{ pointerEvents: 'none' }}>
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 12], fov: 55 }}
        style={{ background: 'transparent' }}
      >
        <Field scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
