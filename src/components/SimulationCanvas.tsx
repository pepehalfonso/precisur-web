"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SimulationProps {
  windSpeed: number;
  height: number;
  dropSize: number;
}

function checkWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("webgl2")
    );
  } catch {
    return false;
  }
}

function Droplets({ windSpeed, height, dropSize }: SimulationProps) {
  const mesh = useRef<THREE.Points>(null);
  const paramsRef = useRef({ windSpeed, height, dropSize });
  const count = 200;

  useEffect(() => {
    paramsRef.current = { windSpeed, height, dropSize };
  }, [windSpeed, height, dropSize]);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 1.5;
      arr[i * 3 + 1] = height * (0.6 + Math.random() * 0.4);
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return arr;
  }, [count, height]);

  const colors = useMemo(() => {
    return new Float32Array(count * 3).fill(0);
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    const { windSpeed: ws, height: h, dropSize: ds } = paramsRef.current;
    const pos = mesh.current.geometry.attributes.position;
    const col = mesh.current.geometry.attributes.color;
    const posArr = pos.array as Float32Array;
    const colArr = col.array as Float32Array;

    const windFactor = ws / 10;
    const sizeNorm = ds / 500;
    const fallSpeed = 0.005 + sizeNorm * 0.015;
    const dragSensitivity = 1.2 - sizeNorm;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      posArr[idx] += windFactor * 0.015 * dragSensitivity;
      posArr[idx + 1] -= fallSpeed;
      posArr[idx + 2] += (Math.random() - 0.5) * 0.003;

      if (posArr[idx + 1] < -0.3) {
        posArr[idx] = (Math.random() - 0.5) * 1.5;
        posArr[idx + 1] = h * (0.6 + Math.random() * 0.4);
        posArr[idx + 2] = (Math.random() - 0.5) * 2;
      }

      const drift = posArr[idx];
      if (drift > 2.5) {
        colArr[idx] = 0.937;
        colArr[idx + 1] = 0.267;
        colArr[idx + 2] = 0.267;
      } else if (drift > 1.0) {
        colArr[idx] = 0.937;
        colArr[idx + 1] = 0.698;
        colArr[idx + 2] = 0.031;
      } else {
        colArr[idx] = 0.133;
        colArr[idx + 1] = 0.773;
        colArr[idx + 2] = 0.369;
      }
    }

    pos.needsUpdate = true;
    col.needsUpdate = true;
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
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshBasicMaterial
        color="#142520"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function SensitiveZone() {
  return (
    <mesh position={[3.5, -0.45, 0]}>
      <boxGeometry args={[3, 0.02, 3]} />
      <meshBasicMaterial color="#ef4444" transparent opacity={0.15} />
    </mesh>
  );
}

function TargetZone() {
  return (
    <mesh position={[0, -0.48, 0]}>
      <boxGeometry args={[3, 0.01, 3]} />
      <meshBasicMaterial color="#22c55e" transparent opacity={0.1} />
    </mesh>
  );
}

function WebGLFallback() {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-precisur-dark-700 via-precisur-dark-800 to-precisur-dark-900" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-full max-w-xs h-32 relative">
          <div className="absolute bottom-0 left-1/4 w-16 h-20 bg-precisur-green/20 rounded-full blur-sm" />
          <div className="absolute bottom-0 left-1/2 w-12 h-16 bg-precisur-yellow/15 rounded-full blur-sm" />
          <div className="absolute bottom-0 right-1/4 w-8 h-12 bg-precisur-red/20 rounded-full blur-sm" />
          <div className="absolute top-0 left-1/3 w-1 h-24 bg-precisur-cyan/30 rotate-12 origin-bottom" />
          <div className="absolute top-2 left-1/2 w-1 h-20 bg-precisur-cyan/20 -rotate-6 origin-bottom" />
        </div>
        <p className="text-xs text-foreground/30 font-mono text-center">
          Simulación conceptual · Requiere WebGL
        </p>
      </div>
    </div>
  );
}

export default function SimulationCanvas({
  windSpeed,
  height,
  dropSize,
}: SimulationProps) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setHasWebGL(checkWebGL());
  }, []);

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  return (
    <Canvas
      camera={{ position: [5, 4, 5], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.4} />
      <GroundPlane />
      <TargetZone />
      <SensitiveZone />
      <Droplets windSpeed={windSpeed} height={height} dropSize={dropSize} />
    </Canvas>
  );
}
