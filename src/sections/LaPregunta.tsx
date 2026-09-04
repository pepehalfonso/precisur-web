"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const brechaSteps = [
  { label: "DATOS", color: "text-precisur-cyan" },
  { label: "INFORMACIÓN", color: "text-precisur-yellow" },
  { label: "DECISIÓN", color: "text-precisur-green" },
];

export default function LaPregunta() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-[70vh] flex items-center justify-center py-24 bg-precisur-dark-900 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-precisur-green/5 via-transparent to-precisur-cyan/5" />
        <motion.div
          animate={isInView ? { opacity: [0.1, 0.3, 0.1] } : {}}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-precisur-green/10"
        />
        <motion.div
          animate={isInView ? { opacity: [0.05, 0.2, 0.05] } : {}}
          transition={{ repeat: Infinity, duration: 5, delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-precisur-cyan/5"
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <SectionReveal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1.5 }}
          >
            <span className="text-xs font-mono text-precisur-cyan uppercase tracking-widest mb-8 block">
              La Pregunta
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              <span className="text-foreground/40">¿PODEMOS TOMAR</span>
              <br />
              <span className="text-foreground/40">MEJORES DECISIONES</span>
              <br />
              <span className="text-precisur-green">
                ANTES DE INTERVENIR
              </span>
              <br />
              <span className="text-precisur-green">
                SOBRE UN SISTEMA AGRÍCOLA?
              </span>
            </h2>
            <p className="text-foreground/50 text-lg max-w-2xl mx-auto mb-12">
              La respuesta no es reemplazar la experiencia del operador.
              Es complementarla con datos, modelos y análisis de escenarios.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
              {brechaSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + i * 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`px-5 py-3 rounded-lg border border-current/20 bg-current/5 ${step.color}`}>
                      <span className="font-mono text-sm font-bold">{step.label}</span>
                    </div>
                  </motion.div>
                  {i < brechaSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                      transition={{ duration: 0.5, delay: 1.0 + i * 0.2 }}
                      className="flex items-center gap-1 text-foreground/20"
                    >
                      <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-precisur-dark-600 to-foreground/20" />
                      <span className="text-xs font-mono whitespace-nowrap">brecha</span>
                      <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-foreground/20 to-precisur-dark-600" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.8 }}
              className="mt-8 text-sm text-foreground/30 font-mono"
            >
              Precisur explora cómo reducir esa brecha.
            </motion.p>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}
