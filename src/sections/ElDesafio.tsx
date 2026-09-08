"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const forces = [
  { name: "VIENTO", icon: "→", color: "text-precisur-cyan", desc: "Transporte y deriva" },
  { name: "GRAVEDAD", icon: "↓", color: "text-precisur-yellow", desc: "Caída vertical" },
  { name: "EVAPORACIÓN", icon: "≋", color: "text-precisur-orange", desc: "Reducción de diámetro" },
  { name: "TURBULENCIA", icon: "∿", color: "text-precisur-violet", desc: "Fluctuaciones del flujo de aire" },
];

export default function ElDesafio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="desafio"
      ref={ref}
      className="relative min-h-screen flex items-center py-24 bg-precisur-dark-900"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <SectionReveal>
          <div>
            <span className="text-xs font-mono text-precisur-cyan uppercase tracking-widest mb-4 block">
              El Desafío
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight">
              UNA APLICACIÓN AGRÍCOLA
              <br />
              <span className="text-foreground/50">
                OCURRE DENTRO DE UN
              </span>
              <br />
              <span className="text-precisur-green">SISTEMA DINÁMICO</span>
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-lg">
              Cada gota que se aplica sobre un cultivo interactúa con múltiples
              fuerzas simultáneas. No sigue una trayectoria trivial. Comprender
              estas interacciones es el primer paso para tomar mejores
              decisiones.
            </p>
          </div>
        </SectionReveal>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 rounded-full border border-precisur-dark-600/50" />
            <div className="absolute inset-4 rounded-full border border-precisur-dark-600/30" />
            <div className="absolute inset-8 rounded-full border border-precisur-dark-600/20" />

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-precisur-cyan/20 border-2 border-precisur-cyan/50 flex items-center justify-center"
              >
                <div className="w-6 h-6 rounded-full bg-precisur-cyan/40" />
              </motion.div>
            </div>

            {forces.map((force, i) => {
              const angle = (i * 90 - 45) * (Math.PI / 180);
              const radius = 42;
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              return (
                <motion.div
                  key={force.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div
                    className={`text-3xl mb-1 ${force.color} opacity-70`}
                  >
                    {force.icon}
                  </div>
                  <div className="text-xs font-mono text-foreground/60 font-semibold">
                    {force.name}
                  </div>
                  <div className="text-xs text-foreground/40">
                    {force.desc}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
