"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";
import Counter from "@/components/Counter";

const bugs = [
  {
    title: "Gravedad invertida",
    desc: "Las partículas subían en lugar de caer.",
    fix: "Corrección del signo en la aceleración gravitacional.",
    color: "text-precisur-red",
  },
  {
    title: "Partículas fuera del mapa",
    desc: "Error de coordenadas geográficas enviaba datos al exterior del grid.",
    fix: "Conversión corregida entre coordenadas absolutas y relativas.",
    color: "text-precisur-orange",
  },
  {
    title: "Condición de carrera",
    desc: "El optimizador y el motor principal accedían al mismo estado simultáneamente.",
    fix: "Aislamiento de estado y sincronización explícita.",
    color: "text-precisur-yellow",
  },
];

const timeline = [
  { step: "BUG DETECTADO", color: "text-precisur-red" },
  { step: "CAUSA ENCONTRADA", color: "text-precisur-orange" },
  { step: "CORRECCIÓN", color: "text-precisur-yellow" },
  { step: "PRUEBA DE REGRESIÓN", color: "text-precisur-cyan" },
  { step: "VALIDACIÓN", color: "text-precisur-green" },
];

const counters = [
  { end: 934, label: "Pruebas Automatizadas", desc: "Convergencia, invariantes, causalidad y estrés" },
  { end: 0, label: "Errores de Análisis", desc: "Cero regresiones en el motor físico" },
  { end: 1, label: "Motor Físico Canónico", desc: "Una única fuente activa de simulación", duration: 1 },
  { end: 8, label: "Correcciones Críticas", desc: "Bugs detectados y corregidos en auditoría", duration: 1.5 },
];

export default function Evidencia() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="evidencia"
      ref={ref}
      className="relative min-h-screen py-24 bg-precisur-dark-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-precisur-cyan uppercase tracking-widest mb-4 block">
              Evidencia de Ingeniería
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              ANTES DE PEDIR CONFIANZA,
              <br />
              <span className="text-precisur-green">
                CONSTRUIMOS UNA BASE TÉCNICA
              </span>
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Que puede ser inspeccionada, cuestionada y mejorada.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20">
            {counters.map((c) => (
              <div key={c.label} className="flex flex-col items-center">
                <Counter
                  end={c.end}
                  label={c.label}
                  duration={c.duration}
                />
                <p className="mt-2 text-xs text-foreground/30 font-mono text-center max-w-[140px]">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mb-16">
            <h3 className="font-heading text-xl font-semibold text-foreground/70 mb-6 text-center uppercase tracking-wider">
              Proceso de Ingeniería
            </h3>
            {/* Mobile: vertical staircase */}
            <div className="md:hidden flex flex-col items-start ml-4">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`px-4 py-2 rounded border border-current/20 bg-current/5 ${item.color}`}
                    >
                      <span className="text-xs font-mono font-semibold">
                        {item.step}
                      </span>
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="flex flex-col items-center py-1">
                        <div className="w-px h-3 bg-foreground/10" />
                        <span className="text-foreground/20 text-xs">↓</span>
                        <div className="w-px h-3 bg-foreground/10" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop: horizontal row */}
            <div className="hidden md:flex flex-wrap justify-center items-center gap-3">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`px-4 py-2 rounded border border-current/20 bg-current/5 ${item.color}`}
                  >
                    <span className="text-xs font-mono font-semibold">
                      {item.step}
                    </span>
                  </div>
                  {i < timeline.length - 1 && (
                    <span className="text-foreground/20">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.3}>
          <div>
            <h3 className="font-heading text-xl font-semibold text-foreground/70 mb-8 text-center uppercase tracking-wider">
              Correcciones Reales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bugs.map((bug, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-lg border border-precisur-dark-600/30 bg-precisur-dark-800/50"
                >
                  <div className={`text-xs font-mono ${bug.color} uppercase tracking-wider mb-2`}>
                    {bug.title}
                  </div>
                  <p className="text-sm text-foreground/50 mb-3">{bug.desc}</p>
                  <div className="text-xs text-precisur-green/70 font-mono">
                    ✓ {bug.fix}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
