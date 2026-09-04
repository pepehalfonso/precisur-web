"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useInView, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import SectionReveal from "@/components/SectionReveal";

// ─── Types ────────────────────────────────────────────────
interface SimState {
  windSpeed: number;
  windDir: number;
  droneSpeed: number;
  droneHeight: number;
  isPlaying: boolean;
}

// ─── Three.js Line helper ─────────────────────────────────
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

// ─── Perlin-ish noise ────────────────────────────────────
function noise3D(x: number, y: number, z: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

// ─── Camera controller ───────────────────────────────────
function CameraController({ isPlaying }: { isPlaying: boolean }) {
  const { camera } = useThree();
  const angleRef = useRef(0);
  const radius = 9;
  const target = useMemo(() => new THREE.Vector3(0, 1.5, 1), []);

  useFrame(({ clock }) => {
    if (!isPlaying) return;
    const t = clock.getElapsedTime();
    angleRef.current = t * 0.08;
    const a = angleRef.current;
    const targetPos = new THREE.Vector3(
      Math.sin(a) * radius,
      5 + Math.sin(t * 0.15) * 0.5,
      Math.cos(a) * radius
    );
    camera.position.lerp(targetPos, 0.02);
    camera.lookAt(target);
  });

  return null;
}

// ─── Drone realista ───────────────────────────────────────
function DroneModel({
  pathOffset,
  height,
}: {
  pathOffset: number;
  height: number;
}) {
  const group = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Group>(null);
  const ledLeft = useRef<THREE.PointLight>(null);
  const ledRight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const lane = Math.floor(pathOffset * 4);
    const laneZ = -3 + lane * 2;
    const progress = (pathOffset * 4) % 1;
    const x = -4 + progress * 8;
    const baseY = height + Math.sin(t * 2) * 0.06;
    const tiltX = Math.sin(t * 1.7) * 0.02;
    const tiltZ = Math.cos(t * 1.3) * 0.015;
    group.current.position.set(x, baseY, laneZ);
    group.current.rotation.set(tiltX, progress < 0.5 ? 0 : Math.PI, tiltZ);
    if (rotors.current) rotors.current.rotation.y = t * 45;

    // LED blink
    if (ledLeft.current) ledLeft.current.intensity = 0.5 + Math.sin(t * 8) * 0.3;
    if (ledRight.current) ledRight.current.intensity = 0.5 + Math.cos(t * 8) * 0.3;
  });

  const armPositions: [number, number, number][] = [
    [-0.5, 0, -0.35],
    [0.5, 0, -0.35],
    [-0.5, 0, 0.35],
    [0.5, 0, 0.35],
  ];

  return (
    <group ref={group}>
      {/* Cuerpo principal */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.12, 0.25]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          metalness={0.85}
          roughness={0.15}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
        />
      </mesh>
      {/* Tapa */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.18]} />
        <meshPhysicalMaterial color="#16213e" metalness={0.7} roughness={0.2} clearcoat={0.3} />
      </mesh>
      {/* GPS module */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.12, 0.03, 0.08]} />
        <meshStandardMaterial color="#333" metalness={0.5} />
      </mesh>
      {/* Antena */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.14, 6]} />
        <meshStandardMaterial color="#666" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
      </mesh>

      {/* Brazos + cables */}
      {armPositions.map((pos, i) => {
        const motorPos: [number, number, number] = [
          pos[0],
          pos[1] - 0.02,
          pos[2] + (pos[2] > 0 ? 0.22 : -0.22),
        ];
        return (
          <group key={i}>
            {/* Brazo */}
            <mesh position={pos}>
              <boxGeometry args={[0.04, 0.04, 0.55]} />
              <meshPhysicalMaterial color="#1a1a2e" metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Cable */}
            <mesh
              position={[
                (pos[0] + motorPos[0]) / 2,
                (pos[1] + motorPos[1]) / 2 - 0.04,
                (pos[2] + motorPos[2]) / 2,
              ]}
              rotation={[0, 0, pos[0] > 0 ? -0.15 : 0.15]}
            >
              <cylinderGeometry args={[0.004, 0.004, 0.4, 6]} />
              <meshStandardMaterial color="#444" />
            </mesh>
            {/* Pod de motor */}
            <mesh position={motorPos} castShadow>
              <cylinderGeometry args={[0.07, 0.05, 0.07, 12]} />
              <meshPhysicalMaterial color="#2d2d44" metalness={0.85} roughness={0.1} />
            </mesh>
            {/* LED izquierdo/derecho */}
            <pointLight
              ref={i === 0 ? ledLeft : i === 1 ? ledRight : undefined}
              position={[motorPos[0], motorPos[1] - 0.04, motorPos[2]]}
              color={i < 2 ? "#ef4444" : "#22c55e"}
              intensity={0.5}
              distance={1.5}
            />
            <mesh position={[motorPos[0], motorPos[1] - 0.04, motorPos[2]]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial
                color={i < 2 ? "#ef4444" : "#22c55e"}
                emissive={i < 2 ? "#ef4444" : "#22c55e"}
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        );
      })}

      {/* Rotores */}
      <group ref={rotors}>
        {armPositions.map((pos, i) => (
          <mesh
            key={i}
            position={[pos[0], pos[1] + 0.02, pos[2] + (pos[2] > 0 ? 0.22 : -0.22)]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.22, 0.22, 0.004, 32]} />
            <meshStandardMaterial
              color="#22c55e"
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Patines */}
      {[-0.15, 0.15].map((z, i) => (
        <group key={i}>
          <mesh position={[-0.25, -0.2, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
            <meshStandardMaterial color="#555" metalness={0.6} />
          </mesh>
          <mesh position={[0.25, -0.2, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
            <meshStandardMaterial color="#555" metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.34, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, 0.52, 8]} />
            <meshStandardMaterial color="#444" metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Boquillas */}
      {[-0.1, 0.1].map((z, i) => (
        <group key={i}>
          <mesh position={[0, -0.17, z]}>
            <coneGeometry args={[0.02, 0.06, 8]} />
            <meshStandardMaterial color="#06b6d4" metalness={0.5} />
          </mesh>
          {/* Luz del chorro */}
          <pointLight
            position={[0, -0.25, z]}
            color="#22c55e"
            intensity={0.2}
            distance={1}
          />
        </group>
      ))}

      {/* Luz orientación inferior */}
      <pointLight position={[0, -0.4, 0]} color="#22c55e" intensity={0.3} distance={2} />
    </group>
  );
}

// ─── Trayectoria de vuelo ────────────────────────────────
function FlightPath({ pathOffset }: { pathOffset: number }) {
  const fullPath = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let lane = 0; lane < 4; lane++) {
      const z = -3 + lane * 2;
      if (lane % 2 === 0) {
        points.push(new THREE.Vector3(-4, 2.8, z));
        points.push(new THREE.Vector3(4, 2.8, z));
      } else {
        points.push(new THREE.Vector3(4, 2.8, z));
        points.push(new THREE.Vector3(-4, 2.8, z));
      }
      if (lane < 3) {
        points.push(new THREE.Vector3(lane % 2 === 0 ? 4 : -4, 2.8, z + 2));
      }
    }
    return points;
  }, []);

  const traveledPoints = useMemo(() => {
    const totalPoints = 12;
    const count = Math.floor(pathOffset * totalPoints);
    if (count < 2) return null;
    return fullPath.slice(0, count + 1);
  }, [pathOffset, fullPath]);

  return (
    <group>
      <ThreeLine points={fullPath} color="#1f3b33" opacity={0.25} />
      {traveledPoints && <ThreeLine points={traveledPoints} color="#22c55e" opacity={0.6} />}
    </group>
  );
}

// ─── Spray particles ─────────────────────────────────────
function SprayParticles({
  pathOffset,
  windSpeed,
  windDir,
  height,
}: {
  pathOffset: number;
  windSpeed: number;
  windDir: number;
  height: number;
}) {
  const mesh = useRef<THREE.Points>(null);
  const count = 150;

  const { positions, colors, velocities, sizes, lifetimes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifetimes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      resetParticle(i, positions, velocities, colors, sizes, lifetimes, 0, height);
    }
    return { positions, colors, velocities, sizes, lifetimes };
  }, [count, height]);

  function resetParticle(
    i: number,
    pos: Float32Array,
    vel: Float32Array,
    col: Float32Array,
    sz: Float32Array,
    life: Float32Array,
    offset: number,
    h: number
  ) {
    const lane = Math.floor(offset * 4);
    const laneZ = -3 + lane * 2;
    const progress = (offset * 4) % 1;
    const droneX = -4 + progress * 8;
    const spread = (Math.random() - 0.5) * 0.5;

    pos[i * 3] = droneX + (Math.random() - 0.5) * 0.15;
    pos[i * 3 + 1] = h - 0.3 - Math.random() * 0.2;
    pos[i * 3 + 2] = laneZ + spread;

    vel[i * 3] = (Math.random() - 0.5) * 0.003;
    vel[i * 3 + 1] = -0.006 - Math.random() * 0.008;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

    sz[i] = 0.03 + Math.random() * 0.04;
    life[i] = 1.0;

    col[i * 3] = 0.85;
    col[i * 3 + 1] = 0.95;
    col[i * 3 + 2] = 0.85;
  }

  useFrame(() => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position;
    const col = mesh.current.geometry.attributes.color;
    const sz = mesh.current.geometry.attributes.size;
    const posArr = pos.array as Float32Array;
    const colArr = col.array as Float32Array;
    const szArr = sz.array as Float32Array;

    const windAngle = (windDir * Math.PI) / 180;
    const wx = Math.cos(windAngle) * windSpeed * 0.0003;
    const wz = Math.sin(windAngle) * windSpeed * 0.0003;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const t = Date.now() * 0.001;

      // Turbulencia
      const turbX = noise3D(posArr[idx] * 2, posArr[idx + 1] * 2, t) * 0.001;
      const turbZ = noise3D(posArr[idx + 2] * 2, posArr[idx + 1] * 2, t + 100) * 0.001;

      posArr[idx] += velocities[idx] + wx + turbX;
      posArr[idx + 1] += velocities[idx + 1];
      posArr[idx + 2] += velocities[idx + 2] + wz + turbZ;

      lifetimes[i] -= 0.004;
      velocities[idx + 1] -= 0.00005; // gravedad extra

      // Evaporación: gota se achica y transparente
      const evap = Math.max(0, lifetimes[i]);
      szArr[i] = (0.03 + Math.random() * 0.01) * evap;

      if (posArr[idx + 1] < -0.4 || lifetimes[i] <= 0) {
        resetParticle(i, posArr, velocities, colArr, szArr, lifetimes, pathOffset, height);
      }

      // Color por distancia
      const distFromDrone = Math.abs(posArr[idx + 1] - height);
      if (distFromDrone > 1.8 || lifetimes[i] < 0.3) {
        // Deriva lejana: rojo
        colArr[idx] = 0.9; colArr[idx + 1] = 0.2; colArr[idx + 2] = 0.2;
      } else if (distFromDrone > 1.0) {
        // Borde: amarillo
        colArr[idx] = 0.95; colArr[idx + 1] = 0.85; colArr[idx + 2] = 0.1;
      } else {
        // Chorro principal: verde claro/blanco
        colArr[idx] = 0.85; colArr[idx + 1] = 0.95; colArr[idx + 2] = 0.85;
      }
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    sz.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Dust particles (polvo del drone) ────────────────────
function DustParticles({ pathOffset, height }: { pathOffset: number; height: number }) {
  const mesh = useRef<THREE.Points>(null);
  const count = 40;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = Math.random() * 0.3 - 0.45;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const pos = mesh.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.001;
      arr[i * 3] += Math.cos(t * 0.3 + i * 0.5) * 0.0005;
      if (arr[i * 3 + 1] > 0.5) arr[i * 3 + 1] = -0.45;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#8b7355" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

// ─── Wind flow lines ─────────────────────────────────────
function WindFlow({ windSpeed, windDir }: { windSpeed: number; windDir: number }) {
  const group = useRef<THREE.Group>(null);
  const lines = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        y: 0.3 + Math.random() * 3,
        z: (Math.random() - 0.5) * 7,
        offset: Math.random() * 20,
        length: 0.6 + Math.random() * 1.5,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const windAngle = (windDir * Math.PI) / 180;
    group.current.children.forEach((child, i) => {
      const l = lines[i];
      const speed = windSpeed * 0.008;
      child.position.x = ((t * Math.cos(windAngle) * speed * 12 + l.offset) % 18) - 9;
      child.position.z = l.z + Math.sin(windAngle) * speed * t * 2;
      child.position.y = l.y;
      child.rotation.y = windAngle;
    });
  });

  return (
    <group ref={group}>
      {lines.map((l, i) => (
        <mesh key={i}>
          <boxGeometry args={[l.length, 0.002, 0.002]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.15 + windSpeed * 0.005} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Field terrain ───────────────────────────────────────
function FieldTerrain() {
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(12, 12, 50, 50);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.4) * 0.04 + Math.cos(y * 0.3) * 0.03 + noise3D(x, y, 0) * 0.01);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Surcos de cultivo
  const furrows = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    for (let i = -4; i <= 4; i += 0.5) {
      lines.push([
        new THREE.Vector3(-5, -0.47, i),
        new THREE.Vector3(5, -0.47, i),
      ]);
    }
    return lines;
  }, []);

  const lotBorder = useMemo(
    () => [
      new THREE.Vector3(-4, -0.46, -3),
      new THREE.Vector3(4, -0.46, -3),
      new THREE.Vector3(4, -0.46, 5),
      new THREE.Vector3(-4, -0.46, 5),
      new THREE.Vector3(-4, -0.46, -3),
    ],
    []
  );

  const sensitiveBorder = useMemo(
    () => [
      new THREE.Vector3(3.25, -0.44, 2.75),
      new THREE.Vector3(5.75, -0.44, 2.75),
      new THREE.Vector3(5.75, -0.44, 5.25),
      new THREE.Vector3(3.25, -0.44, 5.25),
      new THREE.Vector3(3.25, -0.44, 2.75),
    ],
    []
  );

  // Vegetación perimetral
  const vegetation = useMemo(() => {
    const items: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 30; i++) {
      const edge = Math.floor(Math.random() * 4);
      let x: number, z: number;
      if (edge === 0) { x = -4.5 + Math.random() * 0.5; z = -3.5 + Math.random() * 9; }
      else if (edge === 1) { x = 4 + Math.random() * 0.5; z = -3.5 + Math.random() * 9; }
      else if (edge === 2) { x = -4.5 + Math.random() * 9; z = -3.5 + Math.random() * 0.5; }
      else { x = -4.5 + Math.random() * 9; z = 4.5 + Math.random() * 0.5; }
      items.push({ pos: [x, -0.35, z], scale: 0.08 + Math.random() * 0.12 });
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
        <ThreeLine key={`f${i}`} points={pts} color="#152218" opacity={0.3} />
      ))}

      {/* Borde lote */}
      <ThreeLine points={lotBorder} color="#22c55e" opacity={0.5} />

      {/* Zona sensible */}
      <mesh position={[4.5, -0.45, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.1} />
      </mesh>
      <ThreeLine points={sensitiveBorder} color="#ef4444" opacity={0.35} />
      {/* Warning stripes */}
      {[3.5, 4, 4.5, 5, 5.5].map((x, i) => (
        <ThreeLine
          key={`w${i}`}
          points={[new THREE.Vector3(x, -0.43, 2.8), new THREE.Vector3(x, -0.43, 5.2)]}
          color="#ef4444"
          opacity={0.15}
        />
      ))}

      {/* Zona objetivo */}
      <mesh position={[0, -0.46, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.04} />
      </mesh>

      {/* Vegetación */}
      {vegetation.map((v, i) => (
        <mesh key={i} position={v.pos}>
          <coneGeometry args={[v.scale * 0.3, v.scale, 6]} />
          <meshStandardMaterial color="#1a4025" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Ground deposition ───────────────────────────────────
function GroundDeposition({ pathOffset }: { pathOffset: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    const size = 200;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0a0f0d";
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return { canvas, ctx, tex, size };
  }, []);

  useEffect(() => {
    const { ctx, tex, size } = texture;
    const lane = Math.floor(pathOffset * 4);
    const progress = (pathOffset * 4) % 1;
    // Mapear coordenadas 3D a canvas
    const x = ((progress * 8 - 4 + 5) / 10) * size;
    const z = ((-3 + lane * 2 + 3 + 5) / 10) * size;
    const gradient = ctx.createRadialGradient(x, z, 0, x, z, 18);
    gradient.addColorStop(0, "rgba(34,197,94,0.12)");
    gradient.addColorStop(0.5, "rgba(34,197,94,0.06)");
    gradient.addColorStop(1, "rgba(34,197,94,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    tex.needsUpdate = true;
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshBasicMaterial).map = tex;
    }
  }, [pathOffset, texture]);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 1]}>
      <planeGeometry args={[8, 8]} />
      <meshBasicMaterial map={texture.tex} transparent opacity={0.5} depthWrite={false} />
    </mesh>
  );
}

// ─── HUD overlay ─────────────────────────────────────────
function SceneHUD({
  pathOffset,
  windSpeed,
  windDir,
  droneSpeed,
}: {
  pathOffset: number;
  windSpeed: number;
  windDir: number;
  droneSpeed: number;
}) {
  const lane = Math.floor(pathOffset * 4) + 1;
  const progress = Math.round((pathOffset % 0.25) * 400);
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const dirLabel = dirs[Math.round(windDir / 45) % 8];

  return (
    <div className="absolute top-3 left-3 right-3 flex justify-between text-[9px] font-mono text-foreground/40 pointer-events-none">
      <span>PASADA {lane}/4</span>
      <span>{progress}%</span>
      <span>VIENTO {windSpeed} km/h {dirLabel}</span>
      <span>{droneSpeed} m/s</span>
    </div>
  );
}

// ─── Controls panel ──────────────────────────────────────
function Controls({
  state,
  onChange,
}: {
  state: SimState;
  onChange: (s: Partial<SimState>) => void;
}) {
  return (
    <div className="absolute bottom-12 left-3 right-3 hidden md:flex gap-3 pointer-events-auto">
      <div className="flex-1 bg-precisur-dark-900/80 backdrop-blur-sm rounded-md p-2.5 border border-precisur-dark-600/30">
        <label className="text-[9px] font-mono text-foreground/40 block mb-1">
          VIENTO {state.windSpeed} km/h
        </label>
        <input
          type="range"
          min={0}
          max={30}
          value={state.windSpeed}
          onChange={(e) => onChange({ windSpeed: Number(e.target.value) })}
          className="w-full h-1 accent-precisur-cyan"
        />
      </div>
      <div className="flex-1 bg-precisur-dark-900/80 backdrop-blur-sm rounded-md p-2.5 border border-precisur-dark-600/30">
        <label className="text-[9px] font-mono text-foreground/40 block mb-1">
          DIRECCION {state.windDir}°
        </label>
        <input
          type="range"
          min={0}
          max={360}
          value={state.windDir}
          onChange={(e) => onChange({ windDir: Number(e.target.value) })}
          className="w-full h-1 accent-precisur-cyan"
        />
      </div>
      <div className="flex-1 bg-precisur-dark-900/80 backdrop-blur-sm rounded-md p-2.5 border border-precisur-dark-600/30">
        <label className="text-[9px] font-mono text-foreground/40 block mb-1">
          ALTURA {state.droneHeight.toFixed(1)}m
        </label>
        <input
          type="range"
          min={2}
          max={5}
          step={0.1}
          value={state.droneHeight}
          onChange={(e) => onChange({ droneHeight: Number(e.target.value) })}
          className="w-full h-1 accent-precisur-green"
        />
      </div>
      <div className="flex-1 bg-precisur-dark-900/80 backdrop-blur-sm rounded-md p-2.5 border border-precisur-dark-600/30">
        <label className="text-[9px] font-mono text-foreground/40 block mb-1">
          VELOCIDAD {state.droneSpeed} m/s
        </label>
        <input
          type="range"
          min={1}
          max={8}
          value={state.droneSpeed}
          onChange={(e) => onChange({ droneSpeed: Number(e.target.value) })}
          className="w-full h-1 accent-precisur-green"
        />
      </div>
      <button
        onClick={() => onChange({ isPlaying: !state.isPlaying })}
        className="px-3 bg-precisur-green/20 hover:bg-precisur-green/30 text-precisur-green text-[10px] font-mono rounded-md border border-precisur-green/30 transition-colors"
      >
        {state.isPlaying ? "PAUSA" : "PLAY"}
      </button>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────
export default function Simulacion() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [pathOffset, setPathOffset] = useState(0);
  const [state, setState] = useState<SimState>({
    windSpeed: 12,
    windDir: 45,
    droneSpeed: 4,
    droneHeight: 2.8,
    isPlaying: true,
  });

  const handleChange = useCallback((partial: Partial<SimState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  useEffect(() => {
    if (!isInView || !state.isPlaying) return;
    let raf: number;
    const speed = state.droneSpeed * 0.0002;
    const animate = () => {
      setPathOffset((prev) => (prev + speed) % 1);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, state.isPlaying, state.droneSpeed]);

  return (
    <section
      id="simulacion"
      ref={ref}
      className="relative min-h-screen flex items-center py-24 bg-precisur-dark-800"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <SectionReveal>
          <div>
            <span className="text-xs font-mono text-precisur-green uppercase tracking-widest mb-4 block">
              Simulacion en Accion
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              OBSERVAR ANTES
              <br />
              <span className="text-precisur-green">DE OPERAR</span>
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-lg mb-8">
              Un motor de simulacion de particulas reproduce el comportamiento
              de gotas bajo condiciones ambientales variables. El operador
              puede evaluar escenarios antes de salir al campo.
            </p>

            <div className="space-y-3">
              {[
                "Drone con LEDs, cables y movimiento realista",
                "Chorro de aspersion con gotas variables",
                "Turbulencia y evaporacion de gotas",
                "Viento configurable con vectores de flujo",
                "Surcos de cultivo y vegetacion perimetral",
                "Mapa de deposicion en tiempo real",
                "Zonas sensibles con patrón de advertencia",
                "Controles interactivos (viento, altura, velocidad)",
                "Camara orbital cinematografica",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-precisur-green" />
                  <span className="text-sm text-foreground/60">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="relative aspect-square max-w-lg mx-auto rounded-lg overflow-hidden border border-precisur-dark-600/30">
            {isInView && (
              <Canvas
                camera={{ position: [7, 5, 7], fov: 35 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: false }}
                shadows
              >
                <color attach="background" args={["#0a0f0d"]} />
                <fog attach="fog" args={["#0a0f0d", 14, 24]} />
                <ambientLight intensity={0.2} />
                <directionalLight
                  position={[5, 10, 3]}
                  intensity={0.8}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[0, 5, 0]} intensity={0.15} color="#22c55e" />

                <CameraController isPlaying={state.isPlaying} />
                <FieldTerrain />
                <GroundDeposition pathOffset={pathOffset} />
                <FlightPath pathOffset={pathOffset} />
                <DroneModel pathOffset={pathOffset} height={state.droneHeight} />
                <SprayParticles
                  pathOffset={pathOffset}
                  windSpeed={state.windSpeed}
                  windDir={state.windDir}
                  height={state.droneHeight}
                />
                <DustParticles pathOffset={pathOffset} height={state.droneHeight} />
                <WindFlow windSpeed={state.windSpeed} windDir={state.windDir} />
              </Canvas>
            )}

            <SceneHUD
              pathOffset={pathOffset}
              windSpeed={state.windSpeed}
              windDir={state.windDir}
              droneSpeed={state.droneSpeed}
            />
            <Controls state={state} onChange={handleChange} />
            <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[8px] font-mono text-foreground/25 pointer-events-none md:bottom-14">
              <span>Verde: en lote</span>
              <span>Amarillo: borde</span>
              <span>Rojo: fuera</span>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
