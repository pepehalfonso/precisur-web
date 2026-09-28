"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";
import Counter from "@/components/Counter";

export default function Simulacion() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="simulacion" ref={ref} className="relative min-h-screen flex items-center py-24 bg-precisur-dark-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <SectionReveal>
          <div>
            <span className="text-xs font-mono text-precisur-green uppercase tracking-widest mb-4 block">
              Simulación Inteligente
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              PLANIFICAR ANTES<br />
              <span className="text-precisur-green">DE VOLAR</span>
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-lg mb-8">
              El motor calcula la trayectoria de cada gota con física real —
              arrastre, evaporación, turbulencia y deposición. Genera rutas de
              cobertura para el lote y evalúa alternativas antes de despegar.
            </p>
            <div className="space-y-2.5">
              {[
                "Simulación de hasta 8.000 gotas por escenario",
                "Paso de tiempo físico de 0.01 segundos",
                "Grilla de concentración y deposición 500×500",
                "Determinista: misma semilla, mismos resultados",
                "Compatible con Dart y Python (paridad verificada)",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-precisur-green shrink-0" />
                  <span className="text-sm text-foreground/50">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="grid grid-cols-2 gap-6">
            <Counter end={8000} label="Gotas máximas" />
            <Counter end={500} suffix="²" label="Resolución grilla" />
            <Counter end={7} label="Modelos físicos" />
            <Counter end={228} label="Tests end-to-end" />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
