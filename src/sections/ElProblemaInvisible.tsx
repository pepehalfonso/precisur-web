"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SectionReveal from "@/components/SectionReveal";

const SimulationCanvas = dynamic(
  () => import("@/components/SimulationCanvas"),
  { ssr: false }
);

function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  unit,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-foreground/50 uppercase tracking-wider">
          {label}
        </span>
        <span className={`font-mono text-sm font-semibold ${color}`}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full h-1 bg-precisur-dark-600 rounded-full appearance-none cursor-pointer accent-precisur-green"
      />
    </div>
  );
}

function CanvasFallback() {
  return (
    <div className="w-full h-full bg-precisur-dark-800 rounded-lg flex items-center justify-center">
      <div className="text-foreground/30 font-mono text-sm">Cargando simulación...</div>
    </div>
  );
}

export default function ElProblemaInvisible() {
  const [windSpeed, setWindSpeed] = useState(10);
  const [height, setHeight] = useState(3);
  const [dropSize, setDropSize] = useState(200);

  return (
    <section
      id="problema"
      className="relative min-h-screen py-24 bg-precisur-dark-800"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <SectionReveal>
            <div className="lg:sticky lg:top-24">
              <span className="text-xs font-mono text-precisur-red uppercase tracking-widest mb-4 block">
                El Problema Invisible
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                PEQUEÑAS DECISIONES
                <br />
                <span className="text-foreground/50">PRODUCEN</span>
                <br />
                <span className="text-precisur-red">
                  GRANDES DIFERENCIAS ESPACIALES
                </span>
              </h2>
              <p className="text-foreground/60 text-lg leading-relaxed max-w-lg mb-8">
                Modificar la velocidad del viento, la altura de aplicación o el
                tamaño de gota cambia completamente el comportamiento de la
                nube de partículas. Arrastrar producto fuera del área objetivo
                tiene consecuencias reales.
              </p>

              <div className="space-y-5 bg-precisur-dark-900/50 p-6 rounded-lg border border-precisur-dark-600/30">
                <SliderControl
                  label="Velocidad del viento"
                  value={windSpeed}
                  onChange={setWindSpeed}
                  min={0}
                  max={40}
                  unit=" km/h"
                  color="text-precisur-cyan"
                />
                <SliderControl
                  label="Altura de aplicación"
                  value={height}
                  onChange={setHeight}
                  min={1}
                  max={8}
                  unit=" m"
                  color="text-precisur-yellow"
                />
                <SliderControl
                  label="Tamaño de gota (VMD)"
                  value={dropSize}
                  onChange={setDropSize}
                  min={100}
                  max={500}
                  unit=" μm"
                  color="text-precisur-green"
                />
              </div>

              <p className="mt-4 text-xs text-foreground/30 font-mono">
                * Simulación educativa. Valores representativos, no constituyen
                precisión experimental.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="relative aspect-square max-w-lg mx-auto lg:sticky lg:top-24">
              <Suspense fallback={<CanvasFallback />}>
                <SimulationCanvas
                  windSpeed={windSpeed}
                  height={height}
                  dropSize={dropSize}
                />
              </Suspense>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-mono text-foreground/30">
                <span>● Verde: en área objetivo</span>
                <span>● Amarillo: riesgo</span>
                <span>● Rojo: fuera de área</span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
