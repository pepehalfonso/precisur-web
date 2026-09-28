"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const steps = [
  {
    num: "01",
    title: "LOTE",
    desc: "Geometría del lote en mapa con polígono editable. Zonas sensibles definidas por selección de bordes con prioridad (crítica 1.0 / alta 0.75 / media 0.5 / baja 0.25).",
    color: "text-precisur-green",
  },
  {
    num: "02",
    title: "CANDIDATOS",
    desc: "Hasta 50 candidatos de (ángulo × espaciamiento). Cada uno ejecuta 300 pasos de simulación física real, no heurísticas.",
    color: "text-precisur-cyan",
  },
  {
    num: "03",
    title: "SIMULACIÓN",
    desc: "Cada candidato corre el CanonicalDriftEngine completo: emisión, arrastre, evaporación, turbulencia y deposición sobre grilla 500×500.",
    color: "text-precisur-yellow",
  },
  {
    num: "04",
    title: "SCORING",
    desc: "Score 0–100% ponderado: cobertura 25%, exposición sensible 25%, deriva 15%, área descubierta 15%, solape 10%, tiempo 5%, incertidumbre 5%.",
    color: "text-precisur-violet",
  },
  {
    num: "05",
    title: "TOP 3",
    desc: "Presenta las 3 mejores alternativas con orientación, espaciamiento, cobertura, deriva y exposición. El operador selecciona y aplica.",
    color: "text-precisur-orange",
  },
];

export default function SmartSpray() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="smart-spray"
      ref={ref}
      className="relative min-h-screen flex items-center py-24 bg-precisur-dark-800"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-precisur-violet uppercase tracking-widest mb-4 block">
              Smart Spray
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              ANÁLISIS DE ESCENARIOS
              <br />
              <span className="text-foreground/50">PARA TOMAR MEJORES</span>
              <br />
              <span className="text-precisur-violet">DECISIONES OPERATIVAS</span>
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Smart Spray optimiza rutas de aplicación evaluando candidatos con
              simulación física real. No es un sistema autónomo. Es una
              herramienta de análisis y apoyo a la decisión, actualmente en
              desarrollo.
            </p>
          </div>
        </SectionReveal>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-precisur-green/30 via-precisur-violet/30 to-precisur-orange/30 hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <SectionReveal key={step.num} delay={i * 0.1}>
                <motion.div
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-8 md:gap-10"
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-14 h-14 rounded-lg border border-current/20 bg-current/5 flex items-center justify-center ${step.color}`}
                    >
                      <span className="font-mono text-lg font-bold">
                        {step.num}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 min-w-0">
                    <h3 className={`font-heading text-xl font-bold mb-2 ${step.color}`}>
                      {step.title}
                    </h3>
                    <p className="text-foreground/60 leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
