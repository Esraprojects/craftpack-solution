'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, PerspectiveCamera, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ──────────────────────────────────────────────────────────
   Shared material factory (memoised per color)
────────────────────────────────────────────────────────── */
function useMat(color: string, roughness = 0.35, metalness = 0.05) {
  return useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness, metalness }),
    [color, roughness, metalness],
  );
}

/* ──────────────────────────────────────────────────────────
   Paper Bag
────────────────────────────────────────────────────────── */
interface ObjectProps {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  isDark: boolean;
}

function PaperBag({ pos, rot, scale, speed, phase, isDark }: ObjectProps) {
  const ref = useRef<THREE.Group>(null!);
  const bodyColor   = isDark ? '#e8e8e8' : '#1e1e1e';
  const foldColor   = isDark ? '#c8c8c8' : '#303030';
  const handleColor = isDark ? '#b0b0b0' : '#404040';

  const bodyMat   = useMat(bodyColor, 0.4);
  const foldMat   = useMat(foldColor, 0.3);
  const handleMat = useMat(handleColor, 0.5);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase;
    ref.current.rotation.y = rot[1] + t * 0.18;
    ref.current.rotation.x = rot[0] + Math.sin(t * 0.6) * 0.12;
    ref.current.position.y = pos[1] + Math.sin(t * 0.7) * 0.22;
    ref.current.position.x = pos[0] + Math.sin(t * 0.4) * 0.08;
  });

  return (
    <group ref={ref} position={pos} scale={scale}>
      {/* Body */}
      <RoundedBox args={[1.0, 1.45, 0.48]} radius={0.04} smoothness={4}>
        <primitive object={bodyMat} attach="material" />
      </RoundedBox>
      {/* Top fold */}
      <RoundedBox args={[1.0, 0.13, 0.50]} radius={0.025} smoothness={4} position={[0, 0.79, 0]}>
        <primitive object={foldMat} attach="material" />
      </RoundedBox>
      {/* Handles */}
      <mesh position={[-0.21, 1.02, 0]} rotation={[Math.PI / 2, 0, 0.28]}>
        <torusGeometry args={[0.17, 0.022, 8, 24, Math.PI]} />
        <primitive object={handleMat} attach="material" />
      </mesh>
      <mesh position={[0.21, 1.02, 0]} rotation={[Math.PI / 2, 0, -0.28]}>
        <torusGeometry args={[0.17, 0.022, 8, 24, Math.PI]} />
        <primitive object={handleMat} attach="material" />
      </mesh>
      {/* Brand stripe */}
      <mesh position={[0, 0.05, 0.255]}>
        <planeGeometry args={[0.55, 0.1]} />
        <meshStandardMaterial
          color={isDark ? '#ffffff' : '#000000'}
          roughness={0.1}
          transparent opacity={isDark ? 0.25 : 0.18}
        />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
   Cake Box
────────────────────────────────────────────────────────── */
function CakeBox({ pos, rot, scale, speed, phase, isDark }: ObjectProps) {
  const ref = useRef<THREE.Group>(null!);
  const boxColor = isDark ? '#f0f0f0' : '#1a1a1a';
  const lidColor = isDark ? '#d0d0d0' : '#2e2e2e';

  const boxMat  = useMat(boxColor, 0.45);
  const lidMat  = useMat(lidColor, 0.35);
  const knobMat = useMat(lidColor, 0.3, 0.1);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase;
    ref.current.rotation.y = rot[1] + t * 0.14;
    ref.current.rotation.x = rot[0] + Math.sin(t * 0.5) * 0.1;
    ref.current.rotation.z = Math.sin(t * 0.35) * 0.06;
    ref.current.position.y = pos[1] + Math.sin(t * 0.65) * 0.18;
    ref.current.position.x = pos[0] + Math.cos(t * 0.38) * 0.1;
  });

  return (
    <group ref={ref} position={pos} rotation={rot} scale={scale}>
      {/* Base */}
      <mesh>
        <boxGeometry args={[1.15, 0.9, 1.15]} />
        <primitive object={boxMat} attach="material" />
      </mesh>
      {/* Lid (slightly oversized) */}
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[1.25, 0.22, 1.25]} />
        <primitive object={lidMat} attach="material" />
      </mesh>
      {/* Lid handle knob */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.14, 12]} />
        <primitive object={knobMat} attach="material" />
      </mesh>
      {/* Side seam lines (thin boxes) */}
      <mesh position={[0, 0, 0.585]}>
        <boxGeometry args={[1.15, 0.9, 0.01]} />
        <meshStandardMaterial color={isDark ? '#b8b8b8' : '#3d3d3d'} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
   Gift Box
────────────────────────────────────────────────────────── */
function GiftBox({ pos, rot, scale, speed, phase, isDark }: ObjectProps) {
  const ref = useRef<THREE.Group>(null!);
  const boxColor    = isDark ? '#ebebeb' : '#1c1c1c';
  const ribbonColor = isDark ? '#ffffff' : '#000000';

  const boxMat    = useMat(boxColor, 0.4);
  const ribbonMat = useMat(ribbonColor, 0.25, 0.05);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase;
    ref.current.rotation.y = rot[1] + t * 0.2;
    ref.current.rotation.x = rot[0] + Math.sin(t * 0.55) * 0.14;
    ref.current.position.y = pos[1] + Math.sin(t * 0.72) * 0.2;
    ref.current.position.z = pos[2] + Math.sin(t * 0.3) * 0.08;
  });

  return (
    <group ref={ref} position={pos} scale={scale}>
      {/* Box body */}
      <mesh>
        <boxGeometry args={[1.05, 0.85, 1.05]} />
        <primitive object={boxMat} attach="material" />
      </mesh>
      {/* Ribbon – horizontal strip */}
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[1.07, 0.08, 0.1]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[0.1, 0.08, 1.07]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      {/* Ribbon – side strips */}
      <mesh>
        <boxGeometry args={[1.07, 0.08, 0.08]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      <mesh>
        <boxGeometry args={[0.08, 0.08, 1.07]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      {/* Bow loops */}
      <mesh position={[-0.13, 0.56, 0]} rotation={[0, 0, Math.PI / 5]}>
        <torusGeometry args={[0.13, 0.028, 8, 18, Math.PI]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      <mesh position={[0.13, 0.56, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <torusGeometry args={[0.13, 0.028, 8, 18, Math.PI]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      {/* Bow centre knot */}
      <mesh position={[0, 0.58, 0]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────
   Floating dust particles
────────────────────────────────────────────────────────── */
function Particles({ isDark }: { isDark: boolean }) {
  const count = 120;
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3]     = (Math.random() - 0.5) * 24;
      a[i * 3 + 1] = (Math.random() - 0.5) * 14;
      a[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return a;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.015;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.012) * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={isDark ? '#ffffff' : '#000000'}
        transparent
        opacity={isDark ? 0.35 : 0.2}
        sizeAttenuation
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────────
   Camera – mouse parallax
────────────────────────────────────────────────────────── */
function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.35 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ──────────────────────────────────────────────────────────
   Scene content
────────────────────────────────────────────────────────── */
function SceneContent({ isDark }: { isDark: boolean }) {
  const ambientIntensity  = isDark ? 0.55 : 0.9;
  const dirIntensity      = isDark ? 1.8  : 2.2;
  const fillIntensity     = isDark ? 0.6  : 1.0;

  return (
    <>
      <PerspectiveCamera makeDefault fov={55} position={[0, 0, 10]} />
      <CameraRig />

      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[6, 8, 5]}  intensity={dirIntensity}  color={isDark ? '#ffffff' : '#ffffff'} castShadow />
      <directionalLight position={[-6, 4, -3]} intensity={fillIntensity} color={isDark ? '#e0e0e0' : '#aaaaaa'} />
      <pointLight       position={[0, 6, 2]}  intensity={isDark ? 0.8 : 1.2} color="#ffffff" distance={18} />

      {/* ── Paper bags ── */}
      <PaperBag pos={[-5.5,  1.2, -2]}   rot={[0.1,  0.4, 0.05]} scale={0.95} speed={0.9}  phase={0}    isDark={isDark} />
      <PaperBag pos={[ 4.8, -0.8, -3]}   rot={[0,   -0.6, 0.1]}  scale={1.05} speed={0.75} phase={1.2}  isDark={isDark} />
      <PaperBag pos={[-1.2,  2.8, -4.5]} rot={[0.2,  1.1, 0]}    scale={0.7}  speed={1.1}  phase={2.4}  isDark={isDark} />
      <PaperBag pos={[ 2.0, -2.5, -1.5]} rot={[0,   -0.3, 0.08]} scale={0.85} speed={0.85} phase={3.6}  isDark={isDark} />
      <PaperBag pos={[-3.8, -1.6, -3.5]} rot={[0.15, 0.8, 0]}    scale={0.65} speed={1.0}  phase={0.8}  isDark={isDark} />
      <PaperBag pos={[ 6.5,  2.4, -5]}   rot={[0,   -1.2, 0.12]} scale={0.55} speed={0.7}  phase={4.2}  isDark={isDark} />

      {/* ── Cake boxes ── */}
      <CakeBox pos={[ 3.5,  2.0, -2.5]}  rot={[0.05, 0.3,  0]}    scale={0.9}  speed={0.8}  phase={0.5}  isDark={isDark} />
      <CakeBox pos={[-4.5, -0.5, -4]}    rot={[0,   -0.5,  0.06]} scale={1.0}  speed={0.65} phase={1.8}  isDark={isDark} />
      <CakeBox pos={[ 0.5,  3.2, -5.5]}  rot={[0.1,  1.0,  0]}    scale={0.75} speed={0.95} phase={3.1}  isDark={isDark} />
      <CakeBox pos={[-6.0,  1.5, -2.5]}  rot={[0,   -0.8,  0.08]} scale={0.6}  speed={0.72} phase={5.0}  isDark={isDark} />

      {/* ── Gift boxes ── */}
      <GiftBox pos={[-2.5,  0.8, -1.5]}  rot={[0.08, 0.5,  0.04]} scale={0.9}  speed={1.05} phase={0.3}  isDark={isDark} />
      <GiftBox pos={[ 5.2, -1.5, -3.5]}  rot={[0,   -0.7,  0.1]}  scale={0.8}  speed={0.78} phase={2.0}  isDark={isDark} />
      <GiftBox pos={[-0.5, -2.8, -4]}    rot={[0.12, 1.3,  0]}    scale={0.65} speed={0.9}  phase={4.5}  isDark={isDark} />
      <GiftBox pos={[ 1.8,  3.5, -6]}    rot={[0,    0.2, -0.06]} scale={0.55} speed={0.68} phase={1.6}  isDark={isDark} />

      {/* ── Particles ── */}
      <Particles isDark={isDark} />

      {/* ── Post-processing ── */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={isDark ? 0.7 : 0.85}
          luminanceSmoothing={0.9}
          intensity={isDark ? 0.35 : 0.2}
          height={300}
        />
        <Vignette eskil={false} offset={0.1} darkness={isDark ? 0.55 : 0.25} />
      </EffectComposer>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Exported canvas
────────────────────────────────────────────────────────── */
interface FloatingSceneProps {
  isDark?: boolean;
}

export default function FloatingScene({ isDark = true }: FloatingSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <SceneContent isDark={isDark} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
