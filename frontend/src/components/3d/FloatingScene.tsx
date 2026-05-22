'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, PerspectiveCamera, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ── Orbital math ─────────────────────────────────────────── */
function orbitPos(t: number, phase: number, speed: number, rx: number, rz: number, tiltX: number, tiltZ: number, baseZ: number): THREE.Vector3 {
  const a   = phase + t * speed;
  const lx  = Math.cos(a) * rx;
  const raw = Math.sin(a) * rz;
  const ly  = raw * Math.sin(tiltX) + lx * Math.sin(tiltZ) * 0.3;
  const lz  = raw * Math.cos(tiltX) + baseZ;
  return new THREE.Vector3(lx, ly, lz);
}

/* ── Shared physical material ─────────────────────────────── */
function phyMat(color: string, opts?: Partial<THREE.MeshPhysicalMaterialParameters>) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, metalness: 0.08, ...opts });
}

/* ── ObjProps ─────────────────────────────────────────────── */
interface ObjProps {
  orbitRx: number; orbitRz: number; orbitTiltX: number; orbitTiltZ: number;
  orbitPhase: number; orbitSpeed: number; orbitBaseZ: number;
  selfScale: number; selfPhase: number; isDark: boolean;
}

/* ─────────────────────────────────────────────────────────────
   FEATURED HERO BAG — centre stage, iridescent MeshPhysical
───────────────────────────────────────────────────────────── */
function HeroBag({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Group>(null!);

  const mats = useMemo(() => ({
    body: new THREE.MeshPhysicalMaterial({
      color: isDark ? '#d6c9b6' : '#8c7055',
      roughness: 0.25, metalness: 0.05,
      clearcoat: 0.8, clearcoatRoughness: 0.15,
      iridescence: isDark ? 0.4 : 0.2,
      iridescenceIOR: 1.4,
    }),
    fold: new THREE.MeshPhysicalMaterial({
      color: isDark ? '#b8a893' : '#7a5e41',
      roughness: 0.22, metalness: 0.04, clearcoat: 0.6,
    }),
    handle: new THREE.MeshPhysicalMaterial({
      color: '#10b981', roughness: 0.18, metalness: 0.12,
      emissive: new THREE.Color('#10b981'), emissiveIntensity: isDark ? 0.5 : 0.2,
    }),
    logo: new THREE.MeshPhysicalMaterial({
      color: '#f59e0b', roughness: 0.1, metalness: 0.9,
      emissive: new THREE.Color('#f59e0b'), emissiveIntensity: isDark ? 0.4 : 0.15,
    }),
    stripe: new THREE.MeshPhysicalMaterial({
      color: '#059669', roughness: 0.15, transparent: true, opacity: 0.85,
      emissive: new THREE.Color('#059669'), emissiveIntensity: isDark ? 0.3 : 0.1,
    }),
  }), [isDark]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.08;
    ref.current.position.y = Math.sin(t * 0.6) * 0.18;
  });

  return (
    <group ref={ref} position={[0, 0, 0]} scale={1.8}>
      <RoundedBox args={[1.0, 1.45, 0.45]} radius={0.04} smoothness={5}>
        <primitive object={mats.body} attach="material" />
      </RoundedBox>
      <RoundedBox args={[1.02, 0.14, 0.47]} radius={0.025} smoothness={4} position={[0, 0.79, 0]}>
        <primitive object={mats.fold} attach="material" />
      </RoundedBox>
      {/* Handles */}
      <mesh position={[-0.21, 1.02, 0]} rotation={[Math.PI/2, 0, 0.28]}>
        <torusGeometry args={[0.18, 0.024, 10, 28, Math.PI]} />
        <primitive object={mats.handle} attach="material" />
      </mesh>
      <mesh position={[0.21, 1.02, 0]} rotation={[Math.PI/2, 0, -0.28]}>
        <torusGeometry args={[0.18, 0.024, 10, 28, Math.PI]} />
        <primitive object={mats.handle} attach="material" />
      </mesh>
      {/* Brand stripe */}
      <mesh position={[0, 0.05, 0.228]}>
        <planeGeometry args={[0.6, 0.1]} />
        <primitive object={mats.stripe} attach="material" />
      </mesh>
      {/* Gold logo stamp */}
      <mesh position={[0, 0.05, 0.229]}>
        <planeGeometry args={[0.18, 0.06]} />
        <primitive object={mats.logo} attach="material" />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   ORBITING PAPER BAG — smaller, bright accents
───────────────────────────────────────────────────────────── */
function PaperBag(p: ObjProps) {
  const ref = useRef<THREE.Group>(null!);
  const mats = useMemo(() => ({
    body:   phyMat(p.isDark ? '#c8b89a' : '#9a7c5a', { clearcoat: 0.5 }),
    fold:   phyMat(p.isDark ? '#a89578' : '#7a5e3c', { clearcoat: 0.4 }),
    handle: new THREE.MeshPhysicalMaterial({
      color: '#10b981', roughness: 0.2, metalness: 0.1,
      emissive: new THREE.Color('#10b981'), emissiveIntensity: p.isDark ? 0.4 : 0.1,
    }),
    stripe: new THREE.MeshPhysicalMaterial({
      color: '#059669', roughness: 0.2, transparent: true, opacity: 0.8,
      emissive: new THREE.Color('#059669'), emissiveIntensity: p.isDark ? 0.25 : 0.05,
    }),
  }), [p.isDark]);

  useFrame(({ clock }) => {
    const t   = clock.elapsedTime;
    const pos = orbitPos(t, p.orbitPhase, p.orbitSpeed, p.orbitRx, p.orbitRz, p.orbitTiltX, p.orbitTiltZ, p.orbitBaseZ);
    ref.current.position.copy(pos);
    ref.current.rotation.y = p.orbitPhase + t * p.orbitSpeed * 1.2;
    ref.current.rotation.x = Math.sin(t * 0.6 + p.selfPhase) * 0.12;
    const depth = (pos.z + 8) / 12;
    ref.current.scale.setScalar(p.selfScale * (0.7 + depth * 0.3));
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[1.0, 1.45, 0.45]} radius={0.04} smoothness={4}>
        <primitive object={mats.body} attach="material" />
      </RoundedBox>
      <RoundedBox args={[1.02, 0.14, 0.47]} radius={0.025} smoothness={3} position={[0, 0.79, 0]}>
        <primitive object={mats.fold} attach="material" />
      </RoundedBox>
      <mesh position={[-0.21, 1.02, 0]} rotation={[Math.PI/2, 0, 0.28]}>
        <torusGeometry args={[0.18, 0.022, 8, 24, Math.PI]} />
        <primitive object={mats.handle} attach="material" />
      </mesh>
      <mesh position={[0.21, 1.02, 0]} rotation={[Math.PI/2, 0, -0.28]}>
        <torusGeometry args={[0.18, 0.022, 8, 24, Math.PI]} />
        <primitive object={mats.handle} attach="material" />
      </mesh>
      <mesh position={[0, 0.04, 0.228]}>
        <planeGeometry args={[0.55, 0.095]} />
        <primitive object={mats.stripe} attach="material" />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   CAKE BOX
───────────────────────────────────────────────────────────── */
function CakeBox(p: ObjProps) {
  const ref = useRef<THREE.Group>(null!);
  const mats = useMemo(() => ({
    box:  phyMat(p.isDark ? '#e0d0bc' : '#8a6e4e', { clearcoat: 0.6 }),
    lid:  phyMat(p.isDark ? '#c8b89a' : '#7a5e3c', { clearcoat: 0.5 }),
    knob: new THREE.MeshPhysicalMaterial({
      color: '#22d3ee', roughness: 0.1, metalness: 0.85,
      emissive: new THREE.Color('#22d3ee'), emissiveIntensity: p.isDark ? 0.6 : 0.2,
    }),
  }), [p.isDark]);

  useFrame(({ clock }) => {
    const t   = clock.elapsedTime;
    const pos = orbitPos(t, p.orbitPhase, p.orbitSpeed, p.orbitRx, p.orbitRz, p.orbitTiltX, p.orbitTiltZ, p.orbitBaseZ);
    ref.current.position.copy(pos);
    ref.current.rotation.y = p.orbitPhase + t * p.orbitSpeed * 0.9;
    ref.current.rotation.z = Math.sin(t * 0.4 + p.selfPhase) * 0.07;
    const depth = (pos.z + 8) / 12;
    ref.current.scale.setScalar(p.selfScale * (0.7 + depth * 0.3));
  });

  return (
    <group ref={ref}>
      <mesh><boxGeometry args={[1.15, 0.88, 1.15]} /><primitive object={mats.box} attach="material" /></mesh>
      <mesh position={[0, 0.56, 0]}><boxGeometry args={[1.25, 0.22, 1.25]} /><primitive object={mats.lid} attach="material" /></mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.14, 12]} />
        <primitive object={mats.knob} attach="material" />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   GIFT BOX — gold metallic bow
───────────────────────────────────────────────────────────── */
function GiftBox(p: ObjProps) {
  const ref = useRef<THREE.Group>(null!);
  const mats = useMemo(() => ({
    box:    phyMat(p.isDark ? '#d8c8b4' : '#8c6e4c', { clearcoat: 0.5 }),
    ribbon: new THREE.MeshPhysicalMaterial({
      color: '#10b981', roughness: 0.2, metalness: 0.15,
      emissive: new THREE.Color('#10b981'), emissiveIntensity: p.isDark ? 0.3 : 0.08,
    }),
    bow: new THREE.MeshPhysicalMaterial({
      color: '#f59e0b', roughness: 0.1, metalness: 0.9,
      emissive: new THREE.Color('#f59e0b'), emissiveIntensity: p.isDark ? 0.45 : 0.15,
    }),
  }), [p.isDark]);

  useFrame(({ clock }) => {
    const t   = clock.elapsedTime;
    const pos = orbitPos(t, p.orbitPhase, p.orbitSpeed, p.orbitRx, p.orbitRz, p.orbitTiltX, p.orbitTiltZ, p.orbitBaseZ);
    ref.current.position.copy(pos);
    ref.current.rotation.y = p.orbitPhase + t * p.orbitSpeed * 1.4;
    ref.current.rotation.x = Math.sin(t * 0.55 + p.selfPhase) * 0.14;
    const depth = (pos.z + 8) / 12;
    ref.current.scale.setScalar(p.selfScale * (0.7 + depth * 0.3));
  });

  return (
    <group ref={ref}>
      <mesh><boxGeometry args={[1.05, 0.82, 1.05]} /><primitive object={mats.box} attach="material" /></mesh>
      <mesh position={[0, 0.43, 0]}><boxGeometry args={[1.07, 0.04, 1.07]} /><primitive object={mats.ribbon} attach="material" /></mesh>
      <mesh position={[0, 0.46, 0]}><boxGeometry args={[1.07, 0.065, 0.12]} /><primitive object={mats.ribbon} attach="material" /></mesh>
      <mesh position={[0, 0.46, 0]}><boxGeometry args={[0.12, 0.065, 1.07]} /><primitive object={mats.ribbon} attach="material" /></mesh>
      <mesh><boxGeometry args={[1.07, 0.065, 0.1]} /><primitive object={mats.ribbon} attach="material" /></mesh>
      <mesh><boxGeometry args={[0.1, 0.065, 1.07]} /><primitive object={mats.ribbon} attach="material" /></mesh>
      <mesh position={[-0.14, 0.58, 0]} rotation={[0, 0, Math.PI/5]}>
        <torusGeometry args={[0.145, 0.032, 8, 20, Math.PI]} />
        <primitive object={mats.bow} attach="material" />
      </mesh>
      <mesh position={[0.14, 0.58, 0]} rotation={[0, 0, -Math.PI/5]}>
        <torusGeometry args={[0.145, 0.032, 8, 20, Math.PI]} />
        <primitive object={mats.bow} attach="material" />
      </mesh>
      <mesh position={[0, 0.60, 0]}>
        <sphereGeometry args={[0.058, 10, 10]} />
        <primitive object={mats.bow} attach="material" />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   NEON ORBITAL RINGS — strong emissive, caught by Bloom
───────────────────────────────────────────────────────────── */
function NeonRings({ isDark }: { isDark: boolean }) {
  const refs = [useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!)];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs[0].current.rotation.z = t * 0.04;
    refs[1].current.rotation.z = -t * 0.03;
    refs[2].current.rotation.z = t * 0.025;
    refs[0].current.rotation.x = Math.sin(t * 0.05) * 0.06;
    refs[1].current.rotation.x = Math.cos(t * 0.04) * 0.08;
  });

  const opacity = isDark ? 0.65 : 0.35;

  return (
    <>
      {/* Emerald ring */}
      <mesh ref={refs[0]} rotation={[Math.PI/2 * 0.3, 0.2, 0]}>
        <torusGeometry args={[7.2, 0.018, 4, 140]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={isDark ? 1.8 : 0.9} transparent opacity={opacity} />
      </mesh>
      {/* Cyan ring */}
      <mesh ref={refs[1]} rotation={[Math.PI/2 * 0.55, 0.6, 0]}>
        <torusGeometry args={[5.4, 0.012, 4, 110]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={isDark ? 1.6 : 0.8} transparent opacity={opacity * 0.8} />
      </mesh>
      {/* Gold ring */}
      <mesh ref={refs[2]} rotation={[Math.PI/2 * 0.7, -0.3, 0]}>
        <torusGeometry args={[9.8, 0.010, 4, 160]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={isDark ? 1.2 : 0.6} transparent opacity={opacity * 0.55} />
      </mesh>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   PARTICLE STREAMS — emerald, gold, cyan, ambient
───────────────────────────────────────────────────────────── */
function ParticleStreams({ isDark }: { isDark: boolean }) {
  const countA = 200, countB = 90, countC = 60, countD = 50;

  const posA = useMemo(() => {
    const a = new Float32Array(countA * 3);
    for (let i = 0; i < countA; i++) {
      a[i*3]   = (Math.random() - 0.5) * 30;
      a[i*3+1] = (Math.random() - 0.5) * 18;
      a[i*3+2] = (Math.random() - 0.5) * 14;
    }
    return a;
  }, []);

  const posB = useMemo(() => {
    const a = new Float32Array(countB * 3);
    for (let i = 0; i < countB; i++) {
      a[i*3]   = (Math.random() - 0.5) * 16;
      a[i*3+1] = (Math.random() - 0.5) * 10;
      a[i*3+2] = (Math.random() - 0.5) * 6;
    }
    return a;
  }, []);

  const posC = useMemo(() => {
    const a = new Float32Array(countC * 3);
    for (let i = 0; i < countC; i++) {
      a[i*3]   = (Math.random() - 0.5) * 18;
      a[i*3+1] = (Math.random() - 0.5) * 10;
      a[i*3+2] = (Math.random() - 0.5) * 8;
    }
    return a;
  }, []);

  const posD = useMemo(() => {
    const a = new Float32Array(countD * 3);
    for (let i = 0; i < countD; i++) {
      a[i*3]   = (Math.random() - 0.5) * 12;
      a[i*3+1] = (Math.random() - 0.5) * 8;
      a[i*3+2] = (Math.random() - 0.5) * 5;
    }
    return a;
  }, []);

  const refA = useRef<THREE.Points>(null!);
  const refB = useRef<THREE.Points>(null!);
  const refC = useRef<THREE.Points>(null!);
  const refD = useRef<THREE.Points>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refA.current.rotation.y = t * 0.01;
    refA.current.rotation.x = Math.sin(t * 0.008) * 0.04;
    refB.current.rotation.y = -t * 0.018;
    refB.current.rotation.z = Math.sin(t * 0.012) * 0.03;
    refC.current.rotation.y = t * 0.025;
    refC.current.rotation.x = -Math.sin(t * 0.015) * 0.05;
    refD.current.rotation.z = t * 0.02;
  });

  return (
    <>
      {/* Ambient cream */}
      <points ref={refA}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={countA} array={posA} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.022} color={isDark ? '#d6c9b6' : '#9a7c5a'} transparent opacity={isDark ? 0.25 : 0.18} sizeAttenuation />
      </points>
      {/* Emerald stream */}
      <points ref={refB}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={countB} array={posB} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#10b981" transparent opacity={isDark ? 0.65 : 0.4} sizeAttenuation />
      </points>
      {/* Cyan stream */}
      <points ref={refC}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={countC} array={posC} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#22d3ee" transparent opacity={isDark ? 0.5 : 0.3} sizeAttenuation />
      </points>
      {/* Gold sparkle */}
      <points ref={refD}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={countD} array={posD} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#f59e0b" transparent opacity={isDark ? 0.55 : 0.3} sizeAttenuation />
      </points>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   CAMERA RIG — mouse parallax + gentle auto-orbit
───────────────────────────────────────────────────────────── */
function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(({ clock }) => {
    const t  = clock.elapsedTime;
    const tx = pointer.x * 0.8 + Math.sin(t * 0.08) * 0.3;
    const ty = pointer.y * 0.45 + Math.cos(t * 0.06) * 0.15;
    camera.position.x += (tx - camera.position.x) * 0.032;
    camera.position.y += (ty - camera.position.y) * 0.032;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─────────────────────────────────────────────────────────────
   FULL SCENE
───────────────────────────────────────────────────────────── */
function SceneContent({ isDark }: { isDark: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault fov={52} position={[0, 0, 11]} />
      <CameraRig />
      <fog attach="fog" args={[isDark ? '#020617' : '#faf8f4', 16, 36]} />

      {/* ── Lighting — multi-coloured cinematic rig ── */}
      <ambientLight intensity={isDark ? 0.4 : 0.7} color={isDark ? '#b0c8ff' : '#ffffff'} />
      {/* White key */}
      <directionalLight position={[5, 8, 4]}   intensity={isDark ? 1.8 : 2.2} color="#ffffff" />
      {/* Emerald fill */}
      <directionalLight position={[-6, 3, -4]}  intensity={isDark ? 0.9 : 0.6} color="#10b981" />
      {/* Gold rim */}
      <directionalLight position={[4, -4, -2]}  intensity={isDark ? 0.6 : 0.4} color="#f59e0b" />
      {/* Cyan back */}
      <directionalLight position={[-4, 2, -6]}  intensity={isDark ? 0.5 : 0.3} color="#22d3ee" />
      <pointLight position={[0, 6, 3]}    intensity={isDark ? 0.8 : 1.2} color="#ffffff"  distance={22} />
      <pointLight position={[-3, -2, 1]}  intensity={isDark ? 0.5 : 0.3} color="#10b981"  distance={14} />
      <pointLight position={[3,   4, 2]}  intensity={isDark ? 0.35 : 0.2} color="#f59e0b" distance={16} />
      <pointLight position={[0,  -3, 2]}  intensity={isDark ? 0.3 : 0.2}  color="#22d3ee" distance={12} />

      {/* ── Neon rings ── */}
      <NeonRings isDark={isDark} />

      {/* ── Hero bag — centre ── */}
      <HeroBag isDark={isDark} />

      {/* ── Orbiting Paper Bags — outer ring ── */}
      <PaperBag orbitRx={8.5} orbitRz={2.8} orbitTiltX={0.3}  orbitTiltZ={0.1}  orbitPhase={0}    orbitSpeed={0.10} orbitBaseZ={-4}   selfScale={0.9}  selfPhase={0}    isDark={isDark} />
      <PaperBag orbitRx={8.5} orbitRz={2.8} orbitTiltX={0.3}  orbitTiltZ={0.1}  orbitPhase={2.09} orbitSpeed={0.10} orbitBaseZ={-4}   selfScale={0.85} selfPhase={1.2}  isDark={isDark} />
      <PaperBag orbitRx={8.5} orbitRz={2.8} orbitTiltX={0.3}  orbitTiltZ={0.1}  orbitPhase={4.18} orbitSpeed={0.10} orbitBaseZ={-4}   selfScale={0.80} selfPhase={2.4}  isDark={isDark} />
      {/* inner ring */}
      <PaperBag orbitRx={5.2} orbitRz={1.8} orbitTiltX={-0.4} orbitTiltZ={0.2}  orbitPhase={0.8}  orbitSpeed={0.17} orbitBaseZ={-2}   selfScale={0.70} selfPhase={0.5}  isDark={isDark} />
      <PaperBag orbitRx={5.2} orbitRz={1.8} orbitTiltX={-0.4} orbitTiltZ={0.2}  orbitPhase={3.94} orbitSpeed={0.17} orbitBaseZ={-2}   selfScale={0.65} selfPhase={3.0}  isDark={isDark} />

      {/* ── Cake Boxes ── */}
      <CakeBox orbitRx={6.8} orbitRz={2.2} orbitTiltX={0.5}  orbitTiltZ={-0.15} orbitPhase={0.5}  orbitSpeed={0.12} orbitBaseZ={-3.5} selfScale={0.90} selfPhase={0.3}  isDark={isDark} />
      <CakeBox orbitRx={6.8} orbitRz={2.2} orbitTiltX={0.5}  orbitTiltZ={-0.15} orbitPhase={2.59} orbitSpeed={0.12} orbitBaseZ={-3.5} selfScale={0.95} selfPhase={1.8}  isDark={isDark} />
      <CakeBox orbitRx={4.0} orbitRz={1.4} orbitTiltX={0.2}  orbitTiltZ={0.3}   orbitPhase={1.2}  orbitSpeed={0.20} orbitBaseZ={-1.5} selfScale={0.60} selfPhase={2.1}  isDark={isDark} />

      {/* ── Gift Boxes ── */}
      <GiftBox orbitRx={7.5} orbitRz={2.5} orbitTiltX={-0.25} orbitTiltZ={0.2}  orbitPhase={1.0}  orbitSpeed={0.11} orbitBaseZ={-4.5} selfScale={0.85} selfPhase={1.0}  isDark={isDark} />
      <GiftBox orbitRx={7.5} orbitRz={2.5} orbitTiltX={-0.25} orbitTiltZ={0.2}  orbitPhase={4.14} orbitSpeed={0.11} orbitBaseZ={-4.5} selfScale={0.80} selfPhase={2.5}  isDark={isDark} />
      <GiftBox orbitRx={5.5} orbitRz={1.6} orbitTiltX={0.6}   orbitTiltZ={-0.2} orbitPhase={2.5}  orbitSpeed={0.15} orbitBaseZ={-2.5} selfScale={0.70} selfPhase={0.8}  isDark={isDark} />
      <GiftBox orbitRx={3.5} orbitRz={1.1} orbitTiltX={-0.3}  orbitTiltZ={0.4}  orbitPhase={0.3}  orbitSpeed={0.26} orbitBaseZ={-0.8} selfScale={0.55} selfPhase={1.5}  isDark={isDark} />

      {/* ── Particle streams ── */}
      <ParticleStreams isDark={isDark} />

      {/* ── Post-processing ── */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={isDark ? 0.30 : 0.55}
          luminanceSmoothing={0.75}
          intensity={isDark ? 0.85 : 0.35}
          height={300}
        />
        <Vignette eskil={false} offset={0.08} darkness={isDark ? 0.65 : 0.28} />
      </EffectComposer>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   EXPORT
───────────────────────────────────────────────────────────── */
export default function FloatingScene({ isDark = true }: { isDark?: boolean }) {
  return (
    <Canvas
      shadows={false}
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
