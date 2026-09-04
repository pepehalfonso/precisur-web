"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useInView } from "framer-motion";
import * as THREE from "three";
import SectionReveal from "@/components/SectionReveal";

function DroneModel() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.x = Math.sin(t * 0.3) * 2;
    group.current.position.y = 3 + Math.sin(t * 0.5) * 0.3;
    group.current.position.z = Math.cos(t * 0.3) * 2;
    group.current.rotation.y = t * 0.3;
  });

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[0.8, 0.15, 0.3]} />
        <meshStandardMaterial color="#1f3b33" />
      </mesh>
      {[[-0.5, 0.05, -0.3], [0.5, 0.05, -0.3], [-0.5, 0.05, 0.3], [0.5, 0.05, 0.3]].map(
        (pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
            <meshStandardMaterial color="#22c55e" transparent opacity={0.5} />
          </mesh>
        )
      )}
    </group>
  );
}

function FieldGrid() {
  const grid = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    for (let i = -5; i <= 5; i++) {
      lines.push({
        start: new THREE.Vector3(i, -0.5, -5),
        end: new THREE.Vector3(i, -0.5, 5),
      });
      lines.push({
        start: new THREE.Vector3(-5, -0.5, i),
        end: new THREE.Vector3(5, -0.5, i),
      });
    }
    return lines;
  }, []);

  return (
    <group>
      {grid.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  line.start.x, line.start.y, line.start.z,
                  line.end.x, line.end.y, line.end.z,
                ]),
                3,
              ]}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#142520" transparent opacity={0.4} />
        </line>
      ))}
    </group>
  );
}

function DriftParticles() {
  const mesh = useRef<THREE.Points>(null);
  const count = 100;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 1] = Math.random() * 3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const arr = mesh.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      arr[i * 3] += 0.005;
      arr[i * 3 + 1] -= 0.003;
      arr[i * 3 + 2] += Math.sin(t + i) * 0.001;
      if (arr[i * 3 + 1] < -0.5) {
        arr[i * 3] = (Math.random() - 0.5) * 4;
        arr[i * 3 + 1] = 2 + Math.random();
        arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#22c55e" transparent opacity={0.5} />
    </points>
  );
}

function SensitiveArea() {
  return (
    <mesh position={[3, -0.48, 2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial color="#ef4444" transparent opacity={0.15} />
    </mesh>
  );
}

export default function Simulacion() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
              Simulación en Acción
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight">
              OBSERVAR ANTES
              <br />
              <span className="text-precisur-green">DE OPERAR</span>
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-lg mb-8">
              Un motor de simulación de partículas reproduce el comportamiento
              de gotas bajo condiciones ambientales variables. El operador
              puede evaluar escenarios antes de salir al campo.
            </p>

            <div className="space-y-3">
              {[
                "Lote con geometría real",
                "Drone con trayectoria de aplicación",
                "Nube de partículas con viento",
                "Zonas sensibles identificadas",
                "Mapa de concentración espacial",
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
                camera={{ position: [6, 5, 6], fov: 40 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={0.5} />
                <FieldGrid />
                <DroneModel />
                <DriftParticles />
                <SensitiveArea />
              </Canvas>
            )}

            <div className="absolute bottom-4 left-4 text-xs font-mono text-foreground/30">
              Visualización conceptual de escenario de simulación
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
