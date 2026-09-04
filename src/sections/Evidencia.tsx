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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <Counter end={934} label="Pruebas Automatizadas" />
            <Counter end={0} label="Errores de Análisis" />
            <Counter end={1} label="Motor Físico Canónico" duration={1} />
            <Counter end={8} label="Correcciones Críticas" duration={1.5} />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mb-16">
            <h3 className="font-heading text-xl font-semibold text-foreground/70 mb-6 text-center uppercase tracking-wider">
              Proceso de Ingeniería
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-3">
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
