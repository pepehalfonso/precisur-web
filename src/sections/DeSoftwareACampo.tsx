"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const pipeline = [
  { label: "MODELO DIGITAL", color: "text-precisur-cyan" },
  { label: "DATOS REALES", color: "text-precisur-green" },
  { label: "ENSAYO", color: "text-precisur-yellow" },
  { label: "COMPARACIÓN", color: "text-precisur-orange" },
  { label: "CALIBRACIÓN", color: "text-precisur-violet" },
  { label: "VALIDACIÓN", color: "text-precisur-green" },
];

export default function DeSoftwareACampo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-24 bg-precisur-dark-900"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <SectionReveal>
          <div>
            <span className="text-xs font-mono text-precisur-yellow uppercase tracking-widest mb-4 block">
              La Frontera Actual
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight">
              EL SOFTWARE
              <br />
              <span className="text-foreground/50">NO TERMINA</span>
              <br />
              <span className="text-foreground/50">EN EL SOFTWARE.</span>
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-lg mb-8">
              El modelo puede ser verificado computacionalmente. Pero la
              validación experimental requiere colaboración, infraestructura
              y datos de campo. Esta es la etapa que necesita un ecosistema
              dispuesto a impulsarla.
            </p>

            <div className="p-6 rounded-lg border border-precisur-yellow/20 bg-precisur-yellow/5">
              <p className="text-sm text-foreground/70 leading-relaxed">
                <span className="text-precisur-yellow font-semibold">
                  Honestidad técnica:
                </span>{" "}
                Precisur no afirma que todos sus modelos están
                experimentalmente validados. La validación experimental
                constituye una etapa futura necesaria.
              </p>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="space-y-4">
            {pipeline.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center border border-current/20 bg-current/5 ${step.color}`}>
                  <span className="font-mono text-xs font-bold">{i + 1}</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-precisur-dark-600 to-transparent" />
                <span className={`font-mono text-sm font-semibold ${step.color}`}>
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
