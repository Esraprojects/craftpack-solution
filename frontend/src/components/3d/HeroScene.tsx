'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  MeshTransmissionMaterial, Environment, Float, Sparkles,
  PerspectiveCamera, useGLTF, Preload, RoundedBox, Torus
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { BlendFunction } from 'postprocessing';

/* ── Paper Bag Geometry (programmatic) ─────────────────────── */
function PaperBag({ position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number], color = '#0ea5e9', scale = 1 }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3 + rotation[1];
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
  });

  const bagColor   = new THREE.Color(color);
  const handleMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.8 }), []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Bag body */}
      <RoundedBox args={[1.2, 1.6, 0.6]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={bagColor} roughness={0.3} metalness={0.05} />
      </RoundedBox>

      {/* Bag top fold */}
      <RoundedBox args={[1.2, 0.15, 0.62]} radius={0.03} smoothness={4} position={[0, 0.87, 0]}>
        <meshStandardMaterial color={bagColor} roughness={0.2} metalness={0.1} />
      </RoundedBox>

      {/* Handles */}
      <mesh position={[-0.25, 1.15, 0]} rotation={[Math.PI / 2, 0, 0.3]}>
        <torusGeometry args={[0.22, 0.025, 8, 24, Math.PI]} />
        <primitive object={handleMat} attach="material" />
      </mesh>
      <mesh position={[0.25, 1.15, 0]} rotation={[Math.PI / 2, 0, -0.3]}>
        <torusGeometry args={[0.22, 0.025, 8, 24, Math.PI]} />
        <primitive object={handleMat} attach="material" />
      </mesh>

      {/* Logo placeholder */}
      <mesh position={[0, 0.1, 0.32]}>
        <planeGeometry args={[0.5, 0.3]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

/* ── Floating Particles ─────────────────────────────────────── */
function FloatingParticles() {
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  const meshRef = useRef<THREE.Points>(null);
  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#38bdf8" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ── Animated Ring ──────────────────────────────────────────── */
function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(state => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.15;
      ref.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <torusGeometry args={[3.5, 0.015, 4, 128]} />
      <meshBasicMaterial color="#0ea5e9" transparent opacity={0.2} />
    </mesh>
  );
}

/* ── Camera Rig (mouse parallax) ────────────────────────────── */
function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Ground Grid ─────────────────────────────────────────────── */
function GroundGrid() {
  const ref = useRef<THREE.Mesh>(null);
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 256; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }, []);

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial map={gridTexture} transparent opacity={0.3} />
    </mesh>
  );
}

/* ── Scene Content ───────────────────────────────────────────── */
function SceneContent() {
  return (
    <>
      <PerspectiveCamera makeDefault fov={60} position={[0, 0.5, 6]} />
      <CameraRig />

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" castShadow />
      <directionalLight position={[-5, 3, -2]} intensity={0.8} color="#0ea5e9" />
      <pointLight position={[0, 4, 0]} intensity={1} color="#f59e0b" distance={10} />
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#0ea5e9" distance={8} />

      <Environment preset="city" />

      {/* Main hero bag */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <PaperBag position={[0, 0, 0]} scale={1.3} color="#0ea5e9" />
      </Float>

      {/* Secondary bags */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <PaperBag position={[-2.8, -0.3, -1]} scale={0.85} color="#f59e0b" rotation={[0, 0.8, 0]} />
      </Float>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <PaperBag position={[2.8, 0.2, -1.5]} scale={0.75} color="#6366f1" rotation={[0, -0.6, 0]} />
      </Float>
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.7}>
        <PaperBag position={[-1.8, 1.5, -2]} scale={0.55} color="#10b981" rotation={[0, 1.2, 0]} />
      </Float>

      {/* Decorative elements */}
      <OrbitRing />
      <FloatingParticles />
      <GroundGrid />

      <Sparkles count={40} scale={8} size={1.5} speed={0.3} opacity={0.4} color="#38bdf8" />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} height={300} intensity={0.4} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.001, 0.001)} />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
      </EffectComposer>
    </>
  );
}

/* ── Exported Canvas ─────────────────────────────────────────── */
export default function HeroScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <SceneContent />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
