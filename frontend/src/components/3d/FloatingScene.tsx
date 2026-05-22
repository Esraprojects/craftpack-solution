'use client';

import { useRef, useMemo, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, PerspectiveCamera, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ──────────────────────────────────────────────────────────────
   Colour palette — adapts to theme
────────────────────────────────────────────────────────────── */
function palette(isDark: boolean) {
  return {
    bagBody:    isDark ? '#d6c9b6' : '#3d2e1e',   // warm craft-paper tan
    bagFold:    isDark ? '#b8a893' : '#5a4534',
    bagHandle:  isDark ? '#9e8f7e' : '#6b5040',
    bagStripe:  isDark ? '#52c48a' : '#228b55',   // forest-green brand stripe
    boxBase:    isDark ? '#e8ddd0' : '#2a1f14',
    boxLid:     isDark ? '#c8b9a8' : '#3d2e1e',
    boxKnob:    isDark ? '#a89580' : '#5a4534',
    giftBody:   isDark ? '#ddd0c0' : '#2d2215',
    ribbon:     isDark ? '#52c48a' : '#1a6e44',   // green ribbon — brand color
    ribbonBow:  isDark ? '#30a96a' : '#228b55',
    envLight:   isDark ? '#6ee7b7' : '#34d399',   // green-tinted fill
  };
}

/* ──────────────────────────────────────────────────────────────
   Shared material helper
────────────────────────────────────────────────────────────── */
function mat(color: string, roughness = 0.38, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

/* ──────────────────────────────────────────────────────────────
   Orbital math helper: elliptical orbit
────────────────────────────────────────────────────────────── */
function orbitPos(
  t: number,
  phase: number,
  speed: number,
  rx: number,    // X radius (horizontal spread)
  rz: number,    // Z radius (depth spread)
  tiltX: number, // orbit plane tilt around X axis
  tiltZ: number, // orbit plane tilt around Z axis
  baseZ: number, // push whole orbit backwards
): THREE.Vector3 {
  const a = phase + t * speed;
  const lx = Math.cos(a) * rx;
  const ly_raw = Math.sin(a) * rz;
  // Apply tilt
  const ly = ly_raw * Math.sin(tiltX) + lx * Math.sin(tiltZ) * 0.3;
  const lz = ly_raw * Math.cos(tiltX) + baseZ;
  return new THREE.Vector3(lx, ly, lz);
}

/* ──────────────────────────────────────────────────────────────
   Paper Bag — 3-piece body + gusset hint + arched handles + stripe
────────────────────────────────────────────────────────────── */
interface ObjProps {
  orbitRx: number; orbitRz: number; orbitTiltX: number; orbitTiltZ: number;
  orbitPhase: number; orbitSpeed: number; orbitBaseZ: number;
  selfScale: number; selfPhase: number; isDark: boolean;
}

function PaperBag(p: ObjProps) {
  const ref = useRef<THREE.Group>(null!);
  const c = palette(p.isDark);

  const mats = useMemo(() => ({
    body:   mat(c.bagBody,   0.42),
    fold:   mat(c.bagFold,   0.32),
    handle: mat(c.bagHandle, 0.55),
    stripe: new THREE.MeshStandardMaterial({
      color: c.bagStripe, roughness: 0.2, transparent: true, opacity: 0.75,
    }),
    gusset: mat(c.bagFold, 0.5),
  }), [p.isDark]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pos = orbitPos(t, p.orbitPhase, p.orbitSpeed, p.orbitRx, p.orbitRz,
                          p.orbitTiltX, p.orbitTiltZ, p.orbitBaseZ);
    ref.current.position.copy(pos);
    ref.current.rotation.y = p.orbitPhase + t * p.orbitSpeed * 1.2;
    ref.current.rotation.x = Math.sin(t * 0.6 + p.selfPhase) * 0.12;
    // depth-based scale for perspective feel
    const depth = (pos.z + 8) / 12;
    const s = p.selfScale * (0.7 + depth * 0.3);
    ref.current.scale.setScalar(Math.max(0.3, s));
  });

  return (
    <group ref={ref}>
      {/* Body */}
      <RoundedBox args={[1.0, 1.45, 0.45]} radius={0.04} smoothness={4}>
        <primitive object={mats.body} attach="material" />
      </RoundedBox>
      {/* Side gussets */}
      <mesh position={[0.5, 0, 0]}>
        <boxGeometry args={[0.02, 1.4, 0.45]} />
        <primitive object={mats.gusset} attach="material" />
      </mesh>
      <mesh position={[-0.5, 0, 0]}>
        <boxGeometry args={[0.02, 1.4, 0.45]} />
        <primitive object={mats.gusset} attach="material" />
      </mesh>
      {/* Top fold */}
      <RoundedBox args={[1.02, 0.14, 0.47]} radius={0.025} smoothness={4} position={[0, 0.79, 0]}>
        <primitive object={mats.fold} attach="material" />
      </RoundedBox>
      {/* Handles — arched torus */}
      <mesh position={[-0.21, 1.02, 0]} rotation={[Math.PI / 2, 0, 0.28]}>
        <torusGeometry args={[0.18, 0.022, 8, 24, Math.PI]} />
        <primitive object={mats.handle} attach="material" />
      </mesh>
      <mesh position={[0.21, 1.02, 0]} rotation={[Math.PI / 2, 0, -0.28]}>
        <torusGeometry args={[0.18, 0.022, 8, 24, Math.PI]} />
        <primitive object={mats.handle} attach="material" />
      </mesh>
      {/* Brand stripe (green) */}
      <mesh position={[0, 0.04, 0.228]}>
        <planeGeometry args={[0.55, 0.095]} />
        <primitive object={mats.stripe} attach="material" />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Cake Box — open-top box + tight-fitting lid + knob
────────────────────────────────────────────────────────────── */
function CakeBox(p: ObjProps) {
  const ref = useRef<THREE.Group>(null!);
  const c = palette(p.isDark);

  const mats = useMemo(() => ({
    box:   mat(c.boxBase, 0.45),
    lid:   mat(c.boxLid,  0.35),
    knob:  mat(c.boxKnob, 0.25, 0.1),
    seam:  mat(c.bagFold, 0.2),
  }), [p.isDark]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pos = orbitPos(t, p.orbitPhase, p.orbitSpeed, p.orbitRx, p.orbitRz,
                          p.orbitTiltX, p.orbitTiltZ, p.orbitBaseZ);
    ref.current.position.copy(pos);
    ref.current.rotation.y = p.orbitPhase + t * p.orbitSpeed * 0.9;
    ref.current.rotation.z = Math.sin(t * 0.4 + p.selfPhase) * 0.07;
    ref.current.rotation.x = Math.sin(t * 0.5 + p.selfPhase) * 0.08;
    const depth = (pos.z + 8) / 12;
    ref.current.scale.setScalar(p.selfScale * (0.7 + depth * 0.3));
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1.15, 0.88, 1.15]} />
        <primitive object={mats.box} attach="material" />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[1.25, 0.22, 1.25]} />
        <primitive object={mats.lid} attach="material" />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.14, 12]} />
        <primitive object={mats.knob} attach="material" />
      </mesh>
      {/* corner seams */}
      {[[-0.575, 0, 0], [0.575, 0, 0], [0, 0, -0.575], [0, 0, 0.575]].map(([x,y,z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[Math.abs(x) > 0 ? 0.01 : 1.15, 0.88, Math.abs(z) > 0 ? 0.01 : 1.15]} />
          <primitive object={mats.seam} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Gift Box — wrapped box + cross ribbon + looped bow (BRAND GREEN)
────────────────────────────────────────────────────────────── */
function GiftBox(p: ObjProps) {
  const ref = useRef<THREE.Group>(null!);
  const c = palette(p.isDark);

  const mats = useMemo(() => ({
    box:    mat(c.giftBody,  0.42),
    ribbon: mat(c.ribbon,    0.22, 0.08),
    bow:    mat(c.ribbonBow, 0.18, 0.12),
  }), [p.isDark]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pos = orbitPos(t, p.orbitPhase, p.orbitSpeed, p.orbitRx, p.orbitRz,
                          p.orbitTiltX, p.orbitTiltZ, p.orbitBaseZ);
    ref.current.position.copy(pos);
    ref.current.rotation.y = p.orbitPhase + t * p.orbitSpeed * 1.4;
    ref.current.rotation.x = Math.sin(t * 0.55 + p.selfPhase) * 0.14;
    const depth = (pos.z + 8) / 12;
    ref.current.scale.setScalar(p.selfScale * (0.7 + depth * 0.3));
  });

  return (
    <group ref={ref}>
      {/* Box */}
      <mesh>
        <boxGeometry args={[1.05, 0.82, 1.05]} />
        <primitive object={mats.box} attach="material" />
      </mesh>
      {/* Lid hint */}
      <mesh position={[0, 0.43, 0]}>
        <boxGeometry args={[1.07, 0.04, 1.07]} />
        <primitive object={mats.ribbon} attach="material" />
      </mesh>
      {/* Ribbon cross on top */}
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[1.07, 0.065, 0.12]} />
        <primitive object={mats.ribbon} attach="material" />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[0.12, 0.065, 1.07]} />
        <primitive object={mats.ribbon} attach="material" />
      </mesh>
      {/* Ribbon sides */}
      <mesh>
        <boxGeometry args={[1.07, 0.065, 0.1]} />
        <primitive object={mats.ribbon} attach="material" />
      </mesh>
      <mesh>
        <boxGeometry args={[0.1, 0.065, 1.07]} />
        <primitive object={mats.ribbon} attach="material" />
      </mesh>
      {/* Bow loops */}
      <mesh position={[-0.14, 0.58, 0]} rotation={[0, 0, Math.PI / 5]}>
        <torusGeometry args={[0.145, 0.032, 8, 20, Math.PI]} />
        <primitive object={mats.bow} attach="material" />
      </mesh>
      <mesh position={[0.14, 0.58, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <torusGeometry args={[0.145, 0.032, 8, 20, Math.PI]} />
        <primitive object={mats.bow} attach="material" />
      </mesh>
      {/* Bow knot */}
      <mesh position={[0, 0.60, 0]}>
        <sphereGeometry args={[0.058, 10, 10]} />
        <primitive object={mats.bow} attach="material" />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Paper Fragment Confetti — flat planes tumbling through space
────────────────────────────────────────────────────────────── */
function PaperFragments({ isDark }: { isDark: boolean }) {
  const count = 40;
  const refs  = useRef<THREE.Mesh[]>([]);
  const color = isDark ? '#c8b89a' : '#4a3520';

  const configs = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x:  (Math.random() - 0.5) * 22,
      y:  (Math.random() - 0.5) * 12,
      z:  (Math.random() - 0.5) * 8 - 2,
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      rz: Math.random() * Math.PI,
      sx: 0.08 + Math.random() * 0.22,
      sy: 0.05 + Math.random() * 0.15,
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    })), []);

  const fragMat = useMemo(() => new THREE.MeshStandardMaterial({
    color, roughness: 0.5, transparent: true, opacity: isDark ? 0.45 : 0.3, side: THREE.DoubleSide,
  }), [isDark, color]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const cfg = configs[i];
      mesh.rotation.x = cfg.rx + t * cfg.speed * 0.4;
      mesh.rotation.y = cfg.ry + t * cfg.speed * 0.3;
      mesh.rotation.z = cfg.rz + t * cfg.speed * 0.2;
      mesh.position.y = cfg.y + Math.sin(t * cfg.speed * 0.5 + cfg.phase) * 0.6;
    });
  });

  return (
    <>
      {configs.map((cfg, i) => (
        <mesh
          key={i}
          ref={el => { if (el) refs.current[i] = el; }}
          position={[cfg.x, cfg.y, cfg.z]}
        >
          <planeGeometry args={[cfg.sx, cfg.sy]} />
          <primitive object={fragMat} attach="material" />
        </mesh>
      ))}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   Floating dust particles — two layers
────────────────────────────────────────────────────────────── */
function Particles({ isDark }: { isDark: boolean }) {
  const countA = 180, countB = 80;
  const posA = useMemo(() => {
    const a = new Float32Array(countA * 3);
    for (let i = 0; i < countA; i++) {
      a[i*3]   = (Math.random() - 0.5) * 28;
      a[i*3+1] = (Math.random() - 0.5) * 16;
      a[i*3+2] = (Math.random() - 0.5) * 12;
    }
    return a;
  }, []);
  const posB = useMemo(() => {
    const a = new Float32Array(countB * 3);
    for (let i = 0; i < countB; i++) {
      a[i*3]   = (Math.random() - 0.5) * 14;
      a[i*3+1] = (Math.random() - 0.5) * 8;
      a[i*3+2] = (Math.random() - 0.5) * 5;
    }
    return a;
  }, []);

  const refA = useRef<THREE.Points>(null!);
  const refB = useRef<THREE.Points>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refA.current.rotation.y = t * 0.012;
    refA.current.rotation.x = Math.sin(t * 0.009) * 0.05;
    refB.current.rotation.y = -t * 0.02;
    refB.current.rotation.z =  Math.sin(t * 0.015) * 0.04;
  });

  return (
    <>
      <points ref={refA}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={countA} array={posA} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.025} color={isDark ? '#d6c9b6' : '#6b5040'}
          transparent opacity={isDark ? 0.3 : 0.18} sizeAttenuation />
      </points>
      {/* Inner layer — green tinted */}
      <points ref={refB}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={countB} array={posB} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color={isDark ? '#86d9b0' : '#228b55'}
          transparent opacity={isDark ? 0.22 : 0.14} sizeAttenuation />
      </points>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   Orbital ring halos (decorative)
────────────────────────────────────────────────────────────── */
function OrbitalRings({ isDark }: { isDark: boolean }) {
  const refs = [useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!)];
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs[0].current.rotation.z = t * 0.04;
    refs[1].current.rotation.z = -t * 0.03;
    refs[2].current.rotation.z = t * 0.025;
  });
  const ringColor = isDark ? '#52c48a' : '#1a6e44';
  const opacity   = isDark ? 0.07 : 0.05;

  return (
    <>
      <mesh ref={refs[0]} rotation={[Math.PI/2 * 0.3, 0.2, 0]}>
        <torusGeometry args={[7.2, 0.012, 4, 120]} />
        <meshStandardMaterial color={ringColor} transparent opacity={opacity} />
      </mesh>
      <mesh ref={refs[1]} rotation={[Math.PI/2 * 0.5, 0.6, 0]}>
        <torusGeometry args={[5.0, 0.009, 4, 100]} />
        <meshStandardMaterial color={ringColor} transparent opacity={opacity * 0.8} />
      </mesh>
      <mesh ref={refs[2]} rotation={[Math.PI/2 * 0.7, -0.3, 0]}>
        <torusGeometry args={[9.5, 0.007, 4, 140]} />
        <meshStandardMaterial color={ringColor} transparent opacity={opacity * 0.5} />
      </mesh>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   Camera rig — mouse parallax + gentle auto-orbit
────────────────────────────────────────────────────────────── */
function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const tx = mouse.x * 0.7 + Math.sin(t * 0.08) * 0.3;
    const ty = mouse.y * 0.4 + Math.cos(t * 0.06) * 0.15;
    camera.position.x += (tx - camera.position.x) * 0.035;
    camera.position.y += (ty - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ──────────────────────────────────────────────────────────────
   Full scene
────────────────────────────────────────────────────────────── */
function SceneContent({ isDark }: { isDark: boolean }) {
  const ai = isDark ? 0.5 : 0.8;
  const di = isDark ? 1.6 : 2.0;

  return (
    <>
      <PerspectiveCamera makeDefault fov={52} position={[0, 0, 11]} />
      <CameraRig />
      <fog attach="fog" args={[isDark ? '#111110' : '#faf8f4', 14, 32]} />

      {/* Lighting */}
      <ambientLight intensity={ai} color={isDark ? '#f0e8d8' : '#ffffff'} />
      <directionalLight position={[5, 8, 4]}   intensity={di}       color="#ffffff" />
      <directionalLight position={[-6, 3, -4]}  intensity={isDark ? 0.5 : 0.8} color={isDark ? '#d6ffe8' : '#c8f0d8'} />
      <pointLight       position={[0, 6, 3]}    intensity={isDark ? 0.7 : 1.0} color="#ffffff" distance={20} />
      {/* Green accent light */}
      <pointLight position={[-3, -2, 1]} intensity={isDark ? 0.35 : 0.2} color="#52c48a" distance={12} />
      <pointLight position={[3,   4, 2]} intensity={isDark ? 0.25 : 0.15} color="#30a96a" distance={15} />

      {/* ── Orbital rings ── */}
      <OrbitalRings isDark={isDark} />

      {/* ── Paper Bags — outer ring (slow, wide) ── */}
      <PaperBag orbitRx={8.5} orbitRz={2.8} orbitTiltX={0.3}  orbitTiltZ={0.1}  orbitPhase={0}    orbitSpeed={0.11} orbitBaseZ={-4}   selfScale={1.0} selfPhase={0}    isDark={isDark} />
      <PaperBag orbitRx={8.5} orbitRz={2.8} orbitTiltX={0.3}  orbitTiltZ={0.1}  orbitPhase={2.09} orbitSpeed={0.11} orbitBaseZ={-4}   selfScale={0.9} selfPhase={1.2}  isDark={isDark} />
      <PaperBag orbitRx={8.5} orbitRz={2.8} orbitTiltX={0.3}  orbitTiltZ={0.1}  orbitPhase={4.18} orbitSpeed={0.11} orbitBaseZ={-4}   selfScale={0.8} selfPhase={2.4}  isDark={isDark} />

      {/* ── Paper Bags — inner ring (faster, tilted) ── */}
      <PaperBag orbitRx={5.2} orbitRz={1.8} orbitTiltX={-0.4} orbitTiltZ={0.2}  orbitPhase={0.8}  orbitSpeed={0.18} orbitBaseZ={-2}   selfScale={0.75} selfPhase={0.5}  isDark={isDark} />
      <PaperBag orbitRx={5.2} orbitRz={1.8} orbitTiltX={-0.4} orbitTiltZ={0.2}  orbitPhase={3.94} orbitSpeed={0.18} orbitBaseZ={-2}   selfScale={0.7}  selfPhase={3.0}  isDark={isDark} />

      {/* ── Cake Boxes — tilted plane, medium orbit ── */}
      <CakeBox orbitRx={6.8} orbitRz={2.2} orbitTiltX={0.5}  orbitTiltZ={-0.15} orbitPhase={0.5}  orbitSpeed={0.13} orbitBaseZ={-3.5}  selfScale={0.95} selfPhase={0.3}  isDark={isDark} />
      <CakeBox orbitRx={6.8} orbitRz={2.2} orbitTiltX={0.5}  orbitTiltZ={-0.15} orbitPhase={2.59} orbitSpeed={0.13} orbitBaseZ={-3.5}  selfScale={1.0}  selfPhase={1.8}  isDark={isDark} />
      <CakeBox orbitRx={6.8} orbitRz={2.2} orbitTiltX={0.5}  orbitTiltZ={-0.15} orbitPhase={4.68} orbitSpeed={0.13} orbitBaseZ={-3.5}  selfScale={0.8}  selfPhase={3.6}  isDark={isDark} />
      <CakeBox orbitRx={4.0} orbitRz={1.4} orbitTiltX={0.2}  orbitTiltZ={0.3}   orbitPhase={1.2}  orbitSpeed={0.22} orbitBaseZ={-1.5}  selfScale={0.65} selfPhase={2.1}  isDark={isDark} />

      {/* ── Gift Boxes — scattered orbits, green ribbon ── */}
      <GiftBox orbitRx={7.5} orbitRz={2.5} orbitTiltX={-0.25} orbitTiltZ={0.2}  orbitPhase={1.0}  orbitSpeed={0.12} orbitBaseZ={-4.5}  selfScale={0.9}  selfPhase={1.0}  isDark={isDark} />
      <GiftBox orbitRx={7.5} orbitRz={2.5} orbitTiltX={-0.25} orbitTiltZ={0.2}  orbitPhase={4.14} orbitSpeed={0.12} orbitBaseZ={-4.5}  selfScale={0.85} selfPhase={2.5}  isDark={isDark} />
      <GiftBox orbitRx={5.5} orbitRz={1.6} orbitTiltX={0.6}   orbitTiltZ={-0.2} orbitPhase={2.5}  orbitSpeed={0.16} orbitBaseZ={-2.5}  selfScale={0.75} selfPhase={0.8}  isDark={isDark} />
      <GiftBox orbitRx={5.5} orbitRz={1.6} orbitTiltX={0.6}   orbitTiltZ={-0.2} orbitPhase={5.64} orbitSpeed={0.16} orbitBaseZ={-2.5}  selfScale={0.7}  selfPhase={4.2}  isDark={isDark} />
      <GiftBox orbitRx={3.5} orbitRz={1.1} orbitTiltX={-0.3}  orbitTiltZ={0.4}  orbitPhase={0.3}  orbitSpeed={0.28} orbitBaseZ={-0.8}  selfScale={0.6}  selfPhase={1.5}  isDark={isDark} />

      {/* ── Confetti + particles ── */}
      <PaperFragments isDark={isDark} />
      <Particles      isDark={isDark} />

      {/* ── Post-processing ── */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={isDark ? 0.65 : 0.80}
          luminanceSmoothing={0.85}
          intensity={isDark ? 0.45 : 0.22}
          height={300}
        />
        <Vignette eskil={false} offset={0.08} darkness={isDark ? 0.6 : 0.28} />
      </EffectComposer>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   Exported canvas
────────────────────────────────────────────────────────────── */
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
