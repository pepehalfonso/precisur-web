"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useInView } from "framer-motion";
import * as THREE from "three";
import SectionReveal from "@/components/SectionReveal";

// ─── Types ────────────────────────────────────────────────
interface SimState {
  windSpeed: number;
  windDir: number;
  droneSpeed: number;
  droneHeight: number;
  isPlaying: boolean;
  cameraPreset: "orbital" | "topdown" | "side" | "follow";
}

// ─── Helpers ──────────────────────────────────────────────
function ThreeLine({
  points,
  color,
  opacity = 1,
}: {
  points: THREE.Vector3[];
  color: string;
  opacity?: number;
}) {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color, transparent: true, opacity })
        )
      }
    />
  );
}

function noise3D(x: number, y: number, z: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

// ─── Camera controller ───────────────────────────────────
function CameraController({
  isPlaying,
  preset,
  dronePos,
}: {
  isPlaying: boolean;
  preset: string;
  dronePos: THREE.Vector3;
}) {
  const { camera, gl } = useThree();
  const angleRef = useRef(0);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const dragAngle = useRef({ x: 0, y: 0.3 });
  const zoomRef = useRef(9);

  useEffect(() => {
    const el = gl.domElement;
    const onDown = (e: PointerEvent) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { isDragging.current = false; };
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = (e.clientX - prevMouse.current.x) * 0.005;
      const dy = (e.clientY - prevMouse.current.y) * 0.005;
      dragAngle.current.x += dx;
      dragAngle.current.y = Math.max(0.1, Math.min(1.2, dragAngle.current.y + dy));
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onWheel = (e: WheelEvent) => {
      zoomRef.current = Math.max(4, Math.min(16, zoomRef.current + e.deltaY * 0.01));
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("wheel", onWheel);
    };
  }, [gl]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    let targetPos: THREE.Vector3;
    const center = new THREE.Vector3(0, 1.5, 1);

    if (preset === "topdown") {
      targetPos = new THREE.Vector3(0, 14, 1);
    } else if (preset === "side") {
      targetPos = new THREE.Vector3(10, 3, 1);
    } else if (preset === "follow") {
      targetPos = dronePos.clone().add(new THREE.Vector3(-3, 2, -3));
    } else {
      // orbital + drag
      if (isPlaying && !isDragging.current) angleRef.current = t * 0.06;
      const a = angleRef.current + dragAngle.current.x;
      const r = zoomRef.current;
      targetPos = new THREE.Vector3(
        Math.sin(a) * r,
        4 + dragAngle.current.y * 6,
        Math.cos(a) * r
      );
    }
    camera.position.lerp(targetPos, 0.03);
    camera.lookAt(center);
  });

  return null;
}

// ─── Drone realista ───────────────────────────────────────
function DroneModel({
  pathOffset,
  height,
  dronePosRef,
}: {
  pathOffset: number;
  height: number;
  dronePosRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const group = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Group>(null);
  const ledL = useRef<THREE.PointLight>(null);
  const ledR = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const lane = Math.floor(pathOffset * 4);
    const laneZ = -3 + lane * 2;
    const progress = (pathOffset * 4) % 1;
    const x = -4 + progress * 8;
    const baseY = height + Math.sin(t * 2) * 0.05;
    const tiltX = Math.sin(t * 1.7) * 0.015;
    const tiltZ = Math.cos(t * 1.3) * 0.012;
    group.current.position.set(x, baseY, laneZ);
    group.current.rotation.set(tiltX, progress < 0.5 ? 0 : Math.PI, tiltZ);
    dronePosRef.current.set(x, baseY, laneZ);
    if (rotors.current) rotors.current.rotation.y = t * 50;
    if (ledL.current) ledL.current.intensity = 0.6 + Math.sin(t * 8) * 0.4;
    if (ledR.current) ledR.current.intensity = 0.6 + Math.cos(t * 8) * 0.4;
  });

  const arms: [number, number, number][] = [
    [-0.5, 0, -0.35],
    [0.5, 0, -0.35],
    [-0.5, 0, 0.35],
    [0.5, 0, 0.35],
  ];

  return (
    <group ref={group}>
      {/* Cuerpo principal */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.13, 0.26]} />
        <meshPhysicalMaterial color="#1a1a2e" metalness={0.88} roughness={0.12} clearcoat={0.5} clearcoatRoughness={0.15} />
      </mesh>
      {/* Tapa */}
      <mesh position={[0, 0.085, 0]}>
        <boxGeometry args={[0.48, 0.035, 0.17]} />
        <meshPhysicalMaterial color="#16213e" metalness={0.75} roughness={0.18} clearcoat={0.35} />
      </mesh>
      {/* GPS */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.1, 0.025, 0.07]} />
        <meshStandardMaterial color="#333" metalness={0.6} />
      </mesh>
      {/* Antena */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
        <meshStandardMaterial color="#777" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
      </mesh>
      {/* LEDs laterales */}
      {[-0.14, 0.14].map((z, i) => (
        <mesh key={`led${i}`} position={[0, 0.02, z]}>
          <boxGeometry args={[0.6, 0.02, 0.005]} />
          <meshStandardMaterial color={i === 0 ? "#22c55e" : "#06b6d4"} emissive={i === 0 ? "#22c55e" : "#06b6d4"} emissiveIntensity={0.8} />
        </mesh>
      ))}
      {/* Payload cámara */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.12, 0.06, 0.08]} />
        <meshStandardMaterial color="#222" metalness={0.7} />
      </mesh>
      <mesh position={[0, -0.14, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.14, 0.055]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.3} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Brazos taperados + cables + motores */}
      {arms.map((pos, i) => {
        const mPos: [number, number, number] = [pos[0], pos[1] - 0.02, pos[2] + (pos[2] > 0 ? 0.22 : -0.22)];
        return (
          <group key={i}>
            <mesh position={[(pos[0] + mPos[0]) / 2, pos[1], (pos[2] + mPos[2]) / 2]}>
              <boxGeometry args={[0.035, 0.035, 0.5]} />
              <meshPhysicalMaterial color="#1a1a2e" metalness={0.75} roughness={0.18} />
            </mesh>
            <mesh position={[(pos[0] + mPos[0]) / 2, pos[1] - 0.04, (pos[2] + mPos[2]) / 2]}
              rotation={[0, 0, pos[0] > 0 ? -0.12 : 0.12]}>
              <cylinderGeometry args={[0.003, 0.003, 0.35, 6]} />
              <meshStandardMaterial color="#555" />
            </mesh>
            <mesh position={mPos} castShadow>
              <cylinderGeometry args={[0.065, 0.045, 0.065, 14]} />
              <meshPhysicalMaterial color="#2d2d44" metalness={0.88} roughness={0.08} />
            </mesh>
            {/* Cooling vents */}
            {[0, 1, 2].map((v) => (
              <mesh key={v} position={[mPos[0], mPos[1] + 0.01, mPos[2] + (v - 1) * 0.02]}>
                <boxGeometry args={[0.08, 0.003, 0.008]} />
                <meshStandardMaterial color="#1a1a2e" />
              </mesh>
            ))}
            {/* LED motor */}
            <pointLight ref={i === 0 ? ledL : i === 1 ? ledR : undefined}
              position={[mPos[0], mPos[1] - 0.04, mPos[2]]}
              color={i < 2 ? "#ef4444" : "#22c55e"} intensity={0.6} distance={1.8} />
            <mesh position={[mPos[0], mPos[1] - 0.04, mPos[2]]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial color={i < 2 ? "#ef4444" : "#22c55e"}
                emissive={i < 2 ? "#ef4444" : "#22c55e"} emissiveIntensity={2} />
            </mesh>
          </group>
        );
      })}

      {/* Rotores blur (3 discos superpuestos) */}
      <group ref={rotors}>
        {arms.map((pos, i) => {
          const rz = pos[2] + (pos[2] > 0 ? 0.22 : -0.22);
          return (
            <group key={i} position={[pos[0], pos[1] + 0.02, rz]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.24, 0.24, 0.003, 32]} />
                <meshStandardMaterial color="#22c55e" transparent opacity={0.18} side={THREE.DoubleSide} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.2, 0.2, 0.003, 32]} />
                <meshStandardMaterial color="#22c55e" transparent opacity={0.1} side={THREE.DoubleSide} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, Math.PI / 3]}>
                <cylinderGeometry args={[0.16, 0.16, 0.003, 32]} />
                <meshStandardMaterial color="#22c55e" transparent opacity={0.06} side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Patines */}
      {[-0.15, 0.15].map((z, i) => (
        <group key={i}>
          <mesh position={[-0.25, -0.22, z]}>
            <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
            <meshStandardMaterial color="#555" metalness={0.65} />
          </mesh>
          <mesh position={[0.25, -0.22, z]}>
            <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
            <meshStandardMaterial color="#555" metalness={0.65} />
          </mesh>
          <mesh position={[0, -0.36, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.007, 0.007, 0.54, 8]} />
            <meshStandardMaterial color="#444" metalness={0.55} />
          </mesh>
        </group>
      ))}

      {/* 3 Boquillas */}
      {[-0.12, 0, 0.12].map((z, i) => (
        <group key={i}>
          <mesh position={[0, -0.18, z]}>
            <coneGeometry args={[0.015, 0.05, 8]} />
            <meshStandardMaterial color="#06b6d4" metalness={0.5} />
          </mesh>
          <pointLight position={[0, -0.26, z]} color="#22c55e" intensity={0.15} distance={0.8} />
        </group>
      ))}

      {/* Luz inferior */}
      <pointLight position={[0, -0.4, 0]} color="#22c55e" intensity={0.25} distance={2.5} />
    </group>
  );
}

// ─── Spray cloud (volumen semitransparente) ───────────────
function SprayCloud({ pathOffset, height }: { pathOffset: number; height: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!mesh.current) return;
    const lane = Math.floor(pathOffset * 4);
    const laneZ = -3 + lane * 2;
    const progress = (pathOffset * 4) % 1;
    mesh.current.position.set(-4 + progress * 8, height - 0.6, laneZ);
  });
  return (
    <mesh ref={mesh} rotation={[0, 0, 0]}>
      <coneGeometry args={[0.5, 1.2, 16, 1, true]} />
      <meshBasicMaterial color="#22c55e" transparent opacity={0.04} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

// ─── Spray particles ─────────────────────────────────────
function SprayParticles({
  pathOffset, windSpeed, windDir, height,
}: {
  pathOffset: number; windSpeed: number; windDir: number; height: number;
}) {
  const mesh = useRef<THREE.Points>(null);
  const count = 150;

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifetimes = new Float32Array(count);
    const nozzles = new Float32Array(count); // which nozzle
    for (let i = 0; i < count; i++) {
      nozzles[i] = Math.floor(Math.random() * 3);
      resetP(i, positions, velocities, colors, sizes, lifetimes, nozzles, 0, height);
    }
    return { positions, colors, velocities, sizes, lifetimes, nozzles };
  }, [count, height]);

  function resetP(i: number, pos: Float32Array, vel: Float32Array, col: Float32Array,
    sz: Float32Array, life: Float32Array, nz: Float32Array, offset: number, h: number) {
    const lane = Math.floor(offset * 4);
    const laneZ = -3 + lane * 2;
    const progress = (offset * 4) % 1;
    const droneX = -4 + progress * 8;
    const nzIdx = nz[i];
    const nozzleZ = -0.12 + nzIdx * 0.12;
    const angle = (nzIdx - 1) * 0.26; // ~15° spread

    const dropSize = 0.02 + Math.random() * 0.06;
    pos[i * 3] = droneX + Math.sin(angle) * 0.1;
    pos[i * 3 + 1] = h - 0.3;
    pos[i * 3 + 2] = laneZ + nozzleZ + (Math.random() - 0.5) * 0.08;
    vel[i * 3] = Math.sin(angle) * 0.004 + (Math.random() - 0.5) * 0.001;
    vel[i * 3 + 1] = -(0.004 + dropSize * 0.15) - Math.random() * 0.003;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    sz[i] = dropSize;
    life[i] = 0.8 + Math.random() * 0.4;
    col[i * 3] = 0.82; col[i * 3 + 1] = 0.94; col[i * 3 + 2] = 0.82;
  }

  useFrame(() => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position;
    const col = mesh.current.geometry.attributes.color;
    const sz = mesh.current.geometry.attributes.size;
    const pA = pos.array as Float32Array;
    const cA = col.array as Float32Array;
    const sA = sz.array as Float32Array;
    const windAngle = (windDir * Math.PI) / 180;
    const wx = Math.cos(windAngle) * windSpeed * 0.0003;
    const wz = Math.sin(windAngle) * windSpeed * 0.0003;
    const t = Date.now() * 0.001;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const turbX = noise3D(pA[idx] * 2, pA[idx + 1] * 2, t) * 0.0008;
      const turbZ = noise3D(pA[idx + 2] * 2, pA[idx + 1] * 2, t + 99) * 0.0008;
      pA[idx] += data.velocities[idx] + wx + turbX;
      pA[idx + 1] += data.velocities[idx + 1];
      pA[idx + 2] += data.velocities[idx + 2] + wz + turbZ;
      data.lifetimes[i] -= 0.003;
      data.velocities[idx + 1] -= 0.00004;

      const evap = Math.max(0, data.lifetimes[i]);
      sA[i] = data.sizes[i] * evap * 1.2;

      if (pA[idx + 1] < -0.4 || data.lifetimes[i] <= 0) {
        resetP(i, pA, data.velocities, cA, sA, data.lifetimes, data.nozzles, pathOffset, height);
      }

      const d = Math.abs(pA[idx + 1] - height);
      if (d > 1.8 || data.lifetimes[i] < 0.25) {
        cA[idx] = 0.9; cA[idx + 1] = 0.2; cA[idx + 2] = 0.2;
      } else if (d > 1.0) {
        cA[idx] = 0.95; cA[idx + 1] = 0.85; cA[idx + 2] = 0.1;
      } else {
        cA[idx] = 0.82; cA[idx + 1] = 0.94; cA[idx + 2] = 0.82;
      }
    }
    pos.needsUpdate = true; col.needsUpdate = true; sz.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[data.sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.8} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ─── Ground splash ────────────────────────────────────────
function GroundSplash({ pathOffset, height }: { pathOffset: number; height: number }) {
  const mesh = useRef<THREE.Points>(null);
  const count = 30;
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      resetSplash(i, pos, vel, life);
    }
    return { pos, vel, life };
  }, [count]);

  function resetSplash(i: number, pos: Float32Array, vel: Float32Array, life: Float32Array) {
    const lane = Math.floor(Math.random() * 4);
    const laneZ = -3 + lane * 2;
    pos[i * 3] = (Math.random() - 0.5) * 8;
    pos[i * 3 + 1] = -0.45;
    pos[i * 3 + 2] = laneZ + (Math.random() - 0.5) * 1.5;
    vel[i * 3] = (Math.random() - 0.5) * 0.008;
    vel[i * 3 + 1] = 0.005 + Math.random() * 0.01;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    life[i] = 0.3 + Math.random() * 0.3;
  }

  useFrame(() => {
    if (!mesh.current) return;
    const p = mesh.current.geometry.attributes.position;
    const arr = p.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      arr[idx] += data.vel[idx];
      arr[idx + 1] += data.vel[idx + 1];
      arr[idx + 2] += data.vel[idx + 2];
      data.vel[idx + 1] -= 0.0003;
      data.life[i] -= 0.015;
      if (data.life[i] <= 0 || arr[idx + 1] < -0.5) {
        resetSplash(i, arr, data.vel, data.life);
      }
    }
    p.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#6b8f71" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ─── Dust ─────────────────────────────────────────────────
function DustParticles({ pathOffset }: { pathOffset: number }) {
  const mesh = useRef<THREE.Points>(null);
  const count = 35;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = Math.random() * 0.2 - 0.48;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const p = mesh.current.geometry.attributes.position;
    const arr = p.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.4 + i) * 0.0008;
      arr[i * 3] += Math.cos(t * 0.25 + i * 0.4) * 0.0004;
      if (arr[i * 3 + 1] > 0.4) arr[i * 3 + 1] = -0.48;
    }
    p.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#7a6b52" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

// ─── Wind flow ────────────────────────────────────────────
function WindFlow({ windSpeed, windDir }: { windSpeed: number; windDir: number }) {
  const group = useRef<THREE.Group>(null);
  const lines = useMemo(() =>
    Array.from({ length: 14 }, () => ({
      y: 0.2 + Math.random() * 3.2,
      z: (Math.random() - 0.5) * 7,
      offset: Math.random() * 20,
      length: 0.5 + Math.random() * 1.8,
    })), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const a = (windDir * Math.PI) / 180;
    const spd = windSpeed * 0.008;
    group.current.children.forEach((ch, i) => {
      const l = lines[i];
      ch.position.x = ((t * Math.cos(a) * spd * 12 + l.offset) % 18) - 9;
      ch.position.z = l.z + Math.sin(a) * spd * t * 2;
      ch.position.y = l.y;
      ch.rotation.y = a;
    });
  });

  return (
    <group ref={group}>
      {lines.map((l, i) => (
        <mesh key={i}>
          <boxGeometry args={[l.length, 0.002, 0.002]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.12 + windSpeed * 0.006} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Field terrain ────────────────────────────────────────
function FieldTerrain() {
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(12, 12, 50, 50);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.4) * 0.035 + Math.cos(y * 0.3) * 0.025 + noise3D(x, y, 0) * 0.008);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const furrows = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    for (let i = -4; i <= 4; i += 0.5) {
      lines.push([new THREE.Vector3(-5, -0.47, i), new THREE.Vector3(5, -0.47, i)]);
    }
    return lines;
  }, []);

  // Cultivos 3D
  const crops = useMemo(() => {
    const items: { pos: [number, number, number]; h: number }[] = [];
    for (let z = -3.5; z <= 4.5; z += 0.5) {
      for (let x = -3.8; x <= 3.8; x += 0.4) {
        if (Math.abs(x - 4.5) < 1.5 && Math.abs(z - 4) < 1.5) continue; // skip sensitive zone
        items.push({ pos: [x + (Math.random() - 0.5) * 0.1, -0.42, z + (Math.random() - 0.5) * 0.1], h: 0.08 + Math.random() * 0.06 });
      }
    }
    return items;
  }, []);

  const lotBorder = useMemo(() => [
    new THREE.Vector3(-4, -0.46, -3), new THREE.Vector3(4, -0.46, -3),
    new THREE.Vector3(4, -0.46, 5), new THREE.Vector3(-4, -0.46, 5),
    new THREE.Vector3(-4, -0.46, -3),
  ], []);

  const sensitiveBorder = useMemo(() => [
    new THREE.Vector3(3.25, -0.44, 2.75), new THREE.Vector3(5.75, -0.44, 2.75),
    new THREE.Vector3(5.75, -0.44, 5.25), new THREE.Vector3(3.25, -0.44, 5.25),
    new THREE.Vector3(3.25, -0.44, 2.75),
  ], []);

  // Camino de tierra
  const road = useMemo(() => [
    new THREE.Vector3(-5, -0.46, -3.3), new THREE.Vector3(5, -0.46, -3.3),
    new THREE.Vector3(5, -0.46, -3.8), new THREE.Vector3(-5, -0.46, -3.8),
    new THREE.Vector3(-5, -0.46, -3.3),
  ], []);

  // Árboles
  const trees = useMemo(() => {
    const items: { pos: [number, number, number]; s: number }[] = [];
    for (let i = 0; i < 12; i++) {
      items.push({
        pos: [-5 + Math.random() * 0.4, -0.2, -4 + Math.random() * 10],
        s: 0.2 + Math.random() * 0.25,
      });
    }
    return items;
  }, []);

  // Vegetación perimetral
  const veg = useMemo(() => {
    const items: { pos: [number, number, number]; s: number }[] = [];
    for (let i = 0; i < 25; i++) {
      const edge = Math.floor(Math.random() * 4);
      let x: number, z: number;
      if (edge === 0) { x = -4.4 + Math.random() * 0.3; z = -3.5 + Math.random() * 9; }
      else if (edge === 1) { x = 4.1 + Math.random() * 0.3; z = -3.5 + Math.random() * 9; }
      else if (edge === 2) { x = -4.5 + Math.random() * 9; z = -3.4 + Math.random() * 0.3; }
      else { x = -4.5 + Math.random() * 9; z = 4.6 + Math.random() * 0.3; }
      items.push({ pos: [x, -0.38, z], s: 0.06 + Math.random() * 0.1 });
    }
    return items;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} geometry={terrainGeo} receiveShadow>
        <meshStandardMaterial color="#0d1510" metalness={0.05} roughness={0.95} />
      </mesh>

      {/* Surcos */}
      {furrows.map((pts, i) => (
        <ThreeLine key={`f${i}`} points={pts} color="#152218" opacity={0.25} />
      ))}

      {/* Cultivos */}
      {crops.map((c, i) => (
        <mesh key={`c${i}`} position={c.pos}>
          <boxGeometry args={[0.06, c.h, 0.06]} />
          <meshStandardMaterial color="#1e5c2e" roughness={0.85} />
        </mesh>
      ))}

      {/* Camino */}
      <ThreeLine points={road} color="#3d2e1a" opacity={0.4} />
      <mesh position={[0, -0.465, -3.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 0.5]} />
        <meshStandardMaterial color="#2a1f12" roughness={0.95} />
      </mesh>

      {/* Borde lote */}
      <ThreeLine points={lotBorder} color="#22c55e" opacity={0.45} />

      {/* Zona sensible */}
      <mesh position={[4.5, -0.45, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.08} />
      </mesh>
      <ThreeLine points={sensitiveBorder} color="#ef4444" opacity={0.3} />
      {[3.5, 4, 4.5, 5, 5.5].map((x, i) => (
        <ThreeLine key={`w${i}`}
          points={[new THREE.Vector3(x, -0.43, 2.8), new THREE.Vector3(x, -0.43, 5.2)]}
          color="#ef4444" opacity={0.12} />
      ))}

      {/* Zona objetivo */}
      <mesh position={[0, -0.46, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.035} />
      </mesh>

      {/* Árboles */}
      {trees.map((t, i) => (
        <group key={`t${i}`} position={t.pos}>
          <mesh position={[0, t.s * 1.2, 0]}>
            <coneGeometry args={[t.s * 0.8, t.s * 2.5, 7]} />
            <meshStandardMaterial color="#1a4025" roughness={0.9} />
          </mesh>
          <mesh position={[0, t.s * 0.3, 0]}>
            <cylinderGeometry args={[t.s * 0.12, t.s * 0.15, t.s * 0.6, 6]} />
            <meshStandardMaterial color="#3d2e1a" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Vegetación */}
      {veg.map((v, i) => (
        <mesh key={`v${i}`} position={v.pos}>
          <coneGeometry args={[v.s * 0.25, v.s, 5]} />
          <meshStandardMaterial color="#1a4025" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Flight path ──────────────────────────────────────────
function FlightPath({ pathOffset }: { pathOffset: number }) {
  const fullPath = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let lane = 0; lane < 4; lane++) {
      const z = -3 + lane * 2;
      if (lane % 2 === 0) { pts.push(new THREE.Vector3(-4, 2.8, z)); pts.push(new THREE.Vector3(4, 2.8, z)); }
      else { pts.push(new THREE.Vector3(4, 2.8, z)); pts.push(new THREE.Vector3(-4, 2.8, z)); }
      if (lane < 3) pts.push(new THREE.Vector3(lane % 2 === 0 ? 4 : -4, 2.8, z + 2));
    }
    return pts;
  }, []);

  const traveled = useMemo(() => {
    const count = Math.floor(pathOffset * 12);
    return count >= 2 ? fullPath.slice(0, count + 1) : null;
  }, [pathOffset, fullPath]);

  return (
    <group>
      <ThreeLine points={fullPath} color="#1f3b33" opacity={0.2} />
      {traveled && <ThreeLine points={traveled} color="#22c55e" opacity={0.55} />}
    </group>
  );
}

// ─── HUD ──────────────────────────────────────────────────
function SceneHUD({ pathOffset, windSpeed, windDir, droneSpeed, coverage }: {
  pathOffset: number; windSpeed: number; windDir: number; droneSpeed: number; coverage: number;
}) {
  const lane = Math.floor(pathOffset * 4) + 1;
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const dirLabel = dirs[Math.round(windDir / 45) % 8];
  return (
    <div className="absolute top-2 left-2 right-2 flex flex-wrap justify-between text-[8px] font-mono text-foreground/40 pointer-events-none gap-x-2 gap-y-0.5">
      <span>PASADA {lane}/4</span>
      <span>COBERTURA {coverage}%</span>
      <span>VIENTO {windSpeed}km/h {dirLabel}</span>
      <span>{droneSpeed}m/s</span>
    </div>
  );
}

// ─── Controls ─────────────────────────────────────────────
function Controls({ state, onChange }: { state: SimState; onChange: (s: Partial<SimState>) => void }) {
  return (
    <div className="absolute bottom-10 left-2 right-2 hidden md:block pointer-events-auto">
      <div className="flex gap-2 mb-1.5">
        {(["orbital", "topdown", "side", "follow"] as const).map((p) => (
          <button key={p} onClick={() => onChange({ cameraPreset: p })}
            className={`px-2 py-0.5 text-[8px] font-mono rounded border transition-colors ${
              state.cameraPreset === p
                ? "bg-precisur-green/25 border-precisur-green/50 text-precisur-green"
                : "bg-precisur-dark-900/60 border-precisur-dark-600/30 text-foreground/30 hover:text-foreground/50"
            }`}>
            {p === "orbital" ? "ORBITAL" : p === "topdown" ? "TOP" : p === "side" ? "LATERAL" : "SEGUIR"}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        <div className="flex-1 bg-precisur-dark-900/75 backdrop-blur-sm rounded p-1.5 border border-precisur-dark-600/25">
          <label className="text-[8px] font-mono text-foreground/35 block">VIENTO {state.windSpeed}km/h</label>
          <input type="range" min={0} max={30} value={state.windSpeed}
            onChange={(e) => onChange({ windSpeed: +e.target.value })} className="w-full h-0.5 accent-precisur-cyan" />
        </div>
        <div className="flex-1 bg-precisur-dark-900/75 backdrop-blur-sm rounded p-1.5 border border-precisur-dark-600/25">
          <label className="text-[8px] font-mono text-foreground/35 block">DIR {state.windDir}°</label>
          <input type="range" min={0} max={360} value={state.windDir}
            onChange={(e) => onChange({ windDir: +e.target.value })} className="w-full h-0.5 accent-precisur-cyan" />
        </div>
        <div className="flex-1 bg-precisur-dark-900/75 backdrop-blur-sm rounded p-1.5 border border-precisur-dark-600/25">
          <label className="text-[8px] font-mono text-foreground/35 block">ALT {state.droneHeight.toFixed(1)}m</label>
          <input type="range" min={2} max={5} step={0.1} value={state.droneHeight}
            onChange={(e) => onChange({ droneHeight: +e.target.value })} className="w-full h-0.5 accent-precisur-green" />
        </div>
        <div className="flex-1 bg-precisur-dark-900/75 backdrop-blur-sm rounded p-1.5 border border-precisur-dark-600/25">
          <label className="text-[8px] font-mono text-foreground/35 block">VEL {state.droneSpeed}m/s</label>
          <input type="range" min={1} max={8} value={state.droneSpeed}
            onChange={(e) => onChange({ droneSpeed: +e.target.value })} className="w-full h-0.5 accent-precisur-green" />
        </div>
        <button onClick={() => onChange({ isPlaying: !state.isPlaying })}
          className="px-2 bg-precisur-green/20 hover:bg-precisur-green/30 text-precisur-green text-[9px] font-mono rounded border border-precisur-green/30 transition-colors">
          {state.isPlaying ? "||" : "▶"}
        </button>
      </div>
      {/* Presets */}
      <div className="flex gap-1.5 mt-1.5">
        {[
          { label: "CALMO", wind: 3, dir: 0 },
          { label: "MODERADO", wind: 12, dir: 45 },
          { label: "FUERTE", wind: 25, dir: 90 },
          { label: "EXTREMO", wind: 30, dir: 135 },
        ].map((p) => (
          <button key={p.label} onClick={() => onChange({ windSpeed: p.wind, windDir: p.dir })}
            className="flex-1 px-1 py-0.5 text-[7px] font-mono bg-precisur-dark-900/60 hover:bg-precisur-dark-700/60 text-foreground/30 hover:text-foreground/50 rounded border border-precisur-dark-600/20 transition-colors">
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Minimap ──────────────────────────────────────────────
function Minimap({ pathOffset, coverage }: { pathOffset: number; coverage: number }) {
  const lane = Math.floor(pathOffset * 4);
  const progress = (pathOffset * 4) % 1;
  const droneX = 10 + ((progress * 80) / 8) * 80;
  const droneY = 5 + (lane / 4) * 80;

  return (
    <div className="absolute top-8 right-2 w-16 h-16 md:w-20 md:h-20 bg-precisur-dark-900/80 border border-precisur-dark-600/30 rounded pointer-events-none overflow-hidden">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Lote */}
        <rect x="10" y="5" width="80" height="80" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
        {/* Zona sensible */}
        <rect x="80" y="70" width="20" height="20" fill="#ef4444" opacity="0.2" />
        {/* Cobertura */}
        <rect x="10" y="5" width="80" height={(coverage / 100) * 80} fill="#22c55e" opacity="0.15" />
        {/* Trayectoria */}
        {[0, 1, 2, 3].map((l) => (
          <line key={l}
            x1={l % 2 === 0 ? 10 : 90} y1={5 + l * 20 + 10}
            x2={l % 2 === 0 ? 90 : 10} y2={5 + l * 20 + 10}
            stroke="#22c55e" strokeWidth="0.5" opacity="0.3" />
        ))}
        {/* Drone */}
        <circle cx={droneX} cy={droneY} r="3" fill="#22c55e" opacity="0.9" />
        <circle cx={droneX} cy={droneY} r="5" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function Simulacion() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [pathOffset, setPathOffset] = useState(0);
  const dronePosRef = useRef(new THREE.Vector3());
  const [state, setState] = useState<SimState>({
    windSpeed: 12, windDir: 45, droneSpeed: 4, droneHeight: 2.8,
    isPlaying: true, cameraPreset: "orbital",
  });

  const coverage = Math.min(100, Math.round(pathOffset * 100));

  const handleChange = useCallback((partial: Partial<SimState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  useEffect(() => {
    if (!isInView || !state.isPlaying) return;
    let raf: number;
    const speed = state.droneSpeed * 0.00018;
    const animate = () => {
      setPathOffset((prev) => (prev + speed) % 1);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, state.isPlaying, state.droneSpeed]);

  return (
    <section id="simulacion" ref={ref} className="relative min-h-screen flex items-center py-24 bg-precisur-dark-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <SectionReveal>
          <div>
            <span className="text-xs font-mono text-precisur-green uppercase tracking-widest mb-4 block">
              Simulacion en Accion
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              OBSERVAR ANTES<br />
              <span className="text-precisur-green">DE OPERAR</span>
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-lg mb-8">
              Un motor de simulacion de particulas reproduce el comportamiento
              de gotas bajo condiciones ambientales variables. El operador
              puede evaluar escenarios antes de salir al campo.
            </p>
            <div className="space-y-2.5">
              {[
                "Drone con propeller blur, payload camara, LEDs, brazos taperados",
                "3 boquillas con angulo variable y abanico de spray",
                "Gotas con distribucion de tamano y evaporacion",
                "Cultivos 3D en filas y camino de tierra",
                "Camara orbital con drag, zoom y presets",
                "Presets de escenario (calmo, moderado, fuerte, extremo)",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-precisur-green shrink-0" />
                  <span className="text-sm text-foreground/55">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="relative aspect-square max-w-lg mx-auto rounded-lg overflow-hidden border border-precisur-dark-600/30">
            {isInView && (
              <Canvas camera={{ position: [7, 5, 7], fov: 35 }} dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: false }} shadows>
                <color attach="background" args={["#0a0f0d"]} />
                <fog attach="fog" args={["#0a0f0d", 14, 24]} />
                <ambientLight intensity={0.2} />
                <directionalLight position={[5, 10, 3]} intensity={0.8} castShadow shadow-mapSize={[1024, 1024]} />
                <pointLight position={[0, 5, 0]} intensity={0.12} color="#22c55e" />

                <CameraController isPlaying={state.isPlaying} preset={state.cameraPreset} dronePos={dronePosRef.current} />
                <FieldTerrain />
                <FlightPath pathOffset={pathOffset} />
                <DroneModel pathOffset={pathOffset} height={state.droneHeight} dronePosRef={dronePosRef} />
                <SprayCloud pathOffset={pathOffset} height={state.droneHeight} />
                <SprayParticles pathOffset={pathOffset} windSpeed={state.windSpeed} windDir={state.windDir} height={state.droneHeight} />
                <GroundSplash pathOffset={pathOffset} height={state.droneHeight} />
                <DustParticles pathOffset={pathOffset} />
                <WindFlow windSpeed={state.windSpeed} windDir={state.windDir} />
              </Canvas>
            )}

            <SceneHUD pathOffset={pathOffset} windSpeed={state.windSpeed} windDir={state.windDir} droneSpeed={state.droneSpeed} coverage={coverage} />
            <Minimap pathOffset={pathOffset} coverage={coverage} />
            <Controls state={state} onChange={handleChange} />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
