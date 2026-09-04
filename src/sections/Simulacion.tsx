"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useInView } from "framer-motion";
import * as THREE from "three";
import SectionReveal from "@/components/SectionReveal";

// ─── Helper: Three.js Line ───────────────────────────────
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
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }))} />
  );
}

// ─── Drone realista ───────────────────────────────────────
function DroneModel({ pathOffset }: { pathOffset: number }) {
  const group = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const lane = Math.floor(pathOffset * 4);
    const laneZ = -3 + lane * 2;
    const progress = (pathOffset * 4) % 1;
    const x = -4 + progress * 8;
    group.current.position.set(x, 2.8 + Math.sin(t * 2) * 0.08, laneZ);
    group.current.rotation.y = progress < 0.5 ? 0 : Math.PI;
    if (rotors.current) {
      rotors.current.rotation.y = t * 40;
    }
  });

  const armPositions: [number, number, number][] = [
    [-0.5, 0, -0.35],
    [0.5, 0, -0.35],
    [-0.5, 0, 0.35],
    [0.5, 0, 0.35],
  ];

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.12, 0.25]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.18]} />
        <meshStandardMaterial color="#16213e" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {armPositions.map((pos, i) => (
        <group key={i}>
          <mesh position={pos}>
            <boxGeometry args={[0.04, 0.04, 0.55]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[pos[0], pos[1] - 0.02, pos[2] + (pos[2] > 0 ? 0.22 : -0.22)]}>
            <cylinderGeometry args={[0.06, 0.04, 0.06, 12]} />
            <meshStandardMaterial color="#2d2d44" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      <group ref={rotors}>
        {armPositions.map((pos, i) => (
          <mesh
            key={i}
            position={[pos[0], pos[1] + 0.02, pos[2] + (pos[2] > 0 ? 0.22 : -0.22)]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.2, 0.2, 0.005, 24]} />
            <meshStandardMaterial color="#22c55e" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      {[-0.15, 0.15].map((z, i) => (
        <group key={i}>
          <mesh position={[-0.25, -0.2, z]}>
            <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
            <meshStandardMaterial color="#555" metalness={0.6} />
          </mesh>
          <mesh position={[0.25, -0.2, z]}>
            <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
            <meshStandardMaterial color="#555" metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.32, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />
            <meshStandardMaterial color="#444" metalness={0.5} />
          </mesh>
        </group>
      ))}
      {[-0.12, 0.12].map((z, i) => (
        <mesh key={i} position={[0, -0.15, z]}>
          <coneGeometry args={[0.02, 0.06, 8]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Trayectoria de vuelo ────────────────────────────────
function FlightPath({ pathOffset }: { pathOffset: number }) {
  const fullPath = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const lanes = 4;
    for (let lane = 0; lane < lanes; lane++) {
      const z = -3 + lane * 2;
      if (lane % 2 === 0) {
        points.push(new THREE.Vector3(-4, 2.8, z));
        points.push(new THREE.Vector3(4, 2.8, z));
      } else {
        points.push(new THREE.Vector3(4, 2.8, z));
        points.push(new THREE.Vector3(-4, 2.8, z));
      }
      if (lane < lanes - 1) {
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
      <ThreeLine points={fullPath} color="#1f3b33" opacity={0.3} />
      {traveledPoints && <ThreeLine points={traveledPoints} color="#22c55e" opacity={0.7} />}
    </group>
  );
}

// ─── Spray particles ─────────────────────────────────────
function SprayParticles({ pathOffset }: { pathOffset: number }) {
  const mesh = useRef<THREE.Points>(null);
  const count = 120;

  const { positions, colors, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      resetParticle(i, positions, velocities, colors, 0);
    }
    return { positions, colors, velocities };
  }, [count]);

  function resetParticle(
    i: number,
    pos: Float32Array,
    vel: Float32Array,
    col: Float32Array,
    offset: number
  ) {
    const lane = Math.floor(offset * 4);
    const laneZ = -3 + lane * 2;
    const progress = (offset * 4) % 1;
    const droneX = -4 + progress * 8;
    const spread = (Math.random() - 0.5) * 0.6;
    pos[i * 3] = droneX + spread * 0.3;
    pos[i * 3 + 1] = 2.5 - Math.random() * 0.3;
    pos[i * 3 + 2] = laneZ + spread;
    vel[i * 3] = (Math.random() - 0.5) * 0.002;
    vel[i * 3 + 1] = -0.008 - Math.random() * 0.006;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    col[i * 3] = 0.133;
    col[i * 3 + 1] = 0.773;
    col[i * 3 + 2] = 0.369;
  }

  useFrame(() => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position;
    const col = mesh.current.geometry.attributes.color;
    const posArr = pos.array as Float32Array;
    const colArr = col.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      posArr[idx] += velocities[idx];
      posArr[idx + 1] += velocities[idx + 1];
      posArr[idx + 2] += velocities[idx + 2];
      velocities[idx] += 0.0001;
      if (posArr[idx + 1] < -0.4) {
        resetParticle(i, posArr, velocities, colArr, pathOffset);
      }
      const distFromDrone = Math.abs(posArr[idx + 1] - 2.8);
      if (distFromDrone > 1.5) {
        colArr[idx] = 0.937; colArr[idx + 1] = 0.267; colArr[idx + 2] = 0.267;
      } else if (distFromDrone > 0.8) {
        colArr[idx] = 0.937; colArr[idx + 1] = 0.698; colArr[idx + 2] = 0.031;
      } else {
        colArr[idx] = 0.133; colArr[idx + 1] = 0.773; colArr[idx + 2] = 0.369;
      }
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// ─── Viento visual ───────────────────────────────────────
function WindFlow() {
  const group = useRef<THREE.Group>(null);
  const lines = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        y: 0.5 + Math.random() * 2.5,
        z: (Math.random() - 0.5) * 6,
        speed: 0.03 + Math.random() * 0.02,
        offset: Math.random() * 20,
        length: 0.8 + Math.random() * 1.2,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const l = lines[i];
      child.position.x = ((t * l.speed * 12 + l.offset) % 18) - 9;
      child.position.y = l.y;
      child.position.z = l.z;
    });
  });

  return (
    <group ref={group}>
      {lines.map((l, i) => (
        <mesh key={i}>
          <boxGeometry args={[l.length, 0.003, 0.003]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Campo con terreno y zonas ───────────────────────────
function FieldTerrain() {
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 10, 40, 40);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.5) * 0.05 + Math.cos(y * 0.3) * 0.03);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    for (let i = -5; i <= 5; i++) {
      lines.push([new THREE.Vector3(i, -0.48, -5), new THREE.Vector3(i, -0.48, 5)]);
      lines.push([new THREE.Vector3(-5, -0.48, i), new THREE.Vector3(5, -0.48, i)]);
    }
    return lines;
  }, []);

  const lotBorder = useMemo(
    () => [
      new THREE.Vector3(-4, -0.47, -3),
      new THREE.Vector3(4, -0.47, -3),
      new THREE.Vector3(4, -0.47, 5),
      new THREE.Vector3(-4, -0.47, 5),
      new THREE.Vector3(-4, -0.47, -3),
    ],
    []
  );

  const sensitiveBorder = useMemo(
    () => [
      new THREE.Vector3(3.25, -0.45, 2.75),
      new THREE.Vector3(5.75, -0.45, 2.75),
      new THREE.Vector3(5.75, -0.45, 5.25),
      new THREE.Vector3(3.25, -0.45, 5.25),
      new THREE.Vector3(3.25, -0.45, 2.75),
    ],
    []
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} geometry={terrainGeo}>
        <meshStandardMaterial color="#0f1a15" metalness={0.1} roughness={0.9} />
      </mesh>
      {gridLines.map((pts, i) => (
        <ThreeLine key={i} points={pts} color="#1a3029" opacity={0.35} />
      ))}
      <ThreeLine points={lotBorder} color="#22c55e" opacity={0.5} />
      <mesh position={[4.5, -0.46, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.12} />
      </mesh>
      <ThreeLine points={sensitiveBorder} color="#ef4444" opacity={0.4} />
      <mesh position={[0, -0.47, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

// ─── Depósito en suelo ───────────────────────────────────
function GroundDeposition({ pathOffset }: { pathOffset: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    const size = 128;
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
    const x = progress * size;
    const z = ((lane + 0.5) / 4) * size;
    const gradient = ctx.createRadialGradient(x, z, 0, x, z, 12);
    gradient.addColorStop(0, "rgba(34,197,94,0.15)");
    gradient.addColorStop(1, "rgba(34,197,94,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    tex.needsUpdate = true;
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshBasicMaterial).map = tex;
    }
  }, [pathOffset, texture]);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.46, 1]}>
      <planeGeometry args={[8, 8]} />
      <meshBasicMaterial map={texture.tex} transparent opacity={0.6} />
    </mesh>
  );
}

// ─── HUD overlay ─────────────────────────────────────────
function SceneHUD({ pathOffset }: { pathOffset: number }) {
  const lane = Math.floor(pathOffset * 4) + 1;
  const progress = Math.round((pathOffset % 0.25) * 400);
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between text-[10px] font-mono text-foreground/40 pointer-events-none">
      <span>PASADA {lane}/4</span>
      <span>PROGRESO {progress}%</span>
      <span>VIENTO 12 km/h NE</span>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────
export default function Simulacion() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [pathOffset, setPathOffset] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let raf: number;
    const animate = () => {
      setPathOffset((prev) => (prev + 0.0008) % 1);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView]);

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
                "Lote con geometria y elevacion real",
                "Drone con trayectoria de barrido",
                "Chorro de aspersion con deriva",
                "Viento con vectores de flujo",
                "Mapa de deposicion en tiempo real",
                "Zonas sensibles y objetivo identificadas",
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
                <fog attach="fog" args={["#0a0f0d", 12, 22]} />
                <ambientLight intensity={0.25} />
                <directionalLight
                  position={[5, 8, 3]}
                  intensity={0.7}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[0, 4, 0]} intensity={0.3} color="#22c55e" />
                <FieldTerrain />
                <GroundDeposition pathOffset={pathOffset} />
                <FlightPath pathOffset={pathOffset} />
                <DroneModel pathOffset={pathOffset} />
                <SprayParticles pathOffset={pathOffset} />
                <WindFlow />
              </Canvas>
            )}

            <SceneHUD pathOffset={pathOffset} />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] font-mono text-foreground/30 pointer-events-none">
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
