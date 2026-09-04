"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const capabilities = [
  {
    title: "SIMULACIÓN DE DERIVA",
    desc: "Motor de partículas con gravedad, arrastre, evaporación, turbulencia y deposición.",
    color: "text-precisur-green",
    border: "border-precisur-green/20",
    bg: "bg-precisur-green/5",
  },
  {
    title: "METEOROLOGÍA",
    desc: "Integración de datos de viento, temperatura, humedad y condiciones atmosféricas.",
    color: "text-precisur-cyan",
    border: "border-precisur-cyan/20",
    bg: "bg-precisur-cyan/5",
  },
  {
    title: "SISTEMAS GEOESPACIALES",
    desc: "Geometría de lotes, polígonos, rutas, proyecciones y análisis espacial.",
    color: "text-precisur-yellow",
    border: "border-precisur-yellow/20",
    bg: "bg-precisur-yellow/5",
  },
  {
    title: "OPTIMIZACIÓN",
    desc: "Análisis de escenarios, comparación de configuraciones y candidatos de operación.",
    color: "text-precisur-violet",
    border: "border-precisur-violet/20",
    bg: "bg-precisur-violet/5",
  },
];

export default function Precisur() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="tecnologia"
      ref={ref}
      className="relative min-h-screen flex items-center py-24 bg-precisur-dark-800"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-precisur-green uppercase tracking-widest mb-4 block">
              Precisur
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              UNA BASE TECNOLÓGICA
              <br />
              <span className="text-precisur-green">CONSTRUIDA EN URUGUAY</span>
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Precisur no es una idea en una servilleta. Es un sistema con
              arquitectura modular, motor físico propio y evidencia de
              ingeniería verificable.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap, i) => (
            <SectionReveal key={cap.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`p-8 rounded-lg border ${cap.border} ${cap.bg} backdrop-blur-sm transition-colors duration-300`}
              >
                <div className={`text-xs font-mono ${cap.color} uppercase tracking-widest mb-3`}>
                  {cap.title}
                </div>
                <p className="text-foreground/70 leading-relaxed">
                  {cap.desc}
                </p>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
