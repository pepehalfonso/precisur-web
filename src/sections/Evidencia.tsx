"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";

// ─── Data ─────────────────────────────────────────────────
const maturityLevels = [
  {
    num: "01",
    title: "IMPLEMENTADO",
    symbol: "●",
    colorClass: "text-precisur-green",
    borderColor: "border-precisur-green/30",
    bgColor: "bg-precisur-green/5",
    dotColor: "bg-precisur-green",
    description: "Componentes funcionales integrados dentro de la arquitectura actual del sistema.",
    meaning: "Existe código funcional dentro del sistema.",
    guarantees: "Disponibilidad funcional dentro de la arquitectura.",
    doesNotGuarantee: "Correspondencia experimental automática con el fenómeno real.",
    examples: [
      "Motor de simulación de partículas",
      "Integración de fuerzas (viento, gravedad, evaporación)",
      "Sistema de escenarios configurables",
      "Representación espacial de lotes",
      "Arquitectura modular del software",
    ],
  },
  {
    num: "02",
    title: "VERIFICADO COMPUTACIONALMENTE",
    symbol: "◈",
    colorClass: "text-precisur-cyan",
    borderColor: "border-precisur-cyan/30",
    bgColor: "bg-precisur-cyan/5",
    dotColor: "bg-precisur-cyan",
    description: "Comportamientos evaluados mediante pruebas, invariantes, análisis de regresión o validaciones internas del software.",
    meaning: "El comportamiento computacional fue sometido a mecanismos de verificación.",
    guarantees: "Consistencia interna, reproducibilidad computacional y estabilidad del modelo.",
    doesNotGuarantee: "Correspondencia con mediciones experimentales del mundo real.",
    examples: [
      "Pruebas de regresión automatizadas",
      "Verificación de causalidad física",
      "Invariantes de conservación",
      "Análisis de estabilidad numérica",
      "Consistencia entre módulos",
    ],
  },
  {
    num: "03",
    title: "EN INVESTIGACIÓN",
    symbol: "◌",
    colorClass: "text-precisur-orange",
    borderColor: "border-precisur-orange/30",
    bgColor: "bg-precisur-orange/5",
    dotColor: "bg-precisur-orange",
    description: "Modelos, hipótesis o mecanismos que continúan siendo desarrollados, analizados o refinados.",
    meaning: "Existe investigación activa y el comportamiento todavía puede evolucionar.",
    guarantees: "Exploración activa de alternativas y mejora continua del modelo.",
    doesNotGuarantee: "Estabilidad ni validez del modelo resultante.",
    examples: [
      "Modelos avanzados de turbulencia",
      "Interacciones ambientales complejas",
      "Calibración de parámetros del modelo",
      "Optimización de configuraciones de escenario",
      "Nuevos modelos físicos en desarrollo",
    ],
  },
  {
    num: "04",
    title: "REQUIERE VALIDACIÓN EXPERIMENTAL",
    symbol: "△",
    colorClass: "text-precisur-red",
    borderColor: "border-precisur-red/30",
    bgColor: "bg-precisur-red/5",
    dotColor: "bg-precisur-red",
    description: "Comportamientos que necesitan comparación con mediciones reales para determinar su correspondencia con el fenómeno físico.",
    meaning: "El software puede estar implementado y verificado, pero todavía requiere evidencia experimental.",
    guarantees: "Transparencia sobre el estado real del desarrollo.",
    doesNotGuarantee: "Que los resultados del modelo coincidan con observaciones de campo.",
    examples: [
      "Ensayos de campo con instrumentación",
      "Mediciones de deriva en condiciones reales",
      "Comparación con deposición efectiva",
      "Calibración experimental con datos instrumentales",
      "Repetibilidad bajo condiciones ambientales variables",
    ],
  },
];

// ─── Maturity Level Component ─────────────────────────────
function MaturityLevel({
  level,
  index,
  isActive,
  onToggle,
  isDimmed,
}: {
  level: (typeof maturityLevels)[number];
  index: number;
  isActive: boolean;
  onToggle: () => void;
  isDimmed: boolean;
}) {
  return (
    <motion.div
      layout
      className="relative"
      animate={{ opacity: isDimmed ? 0.35 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-[60px_1fr] gap-4 items-start">
        {/* Left: number + line */}
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded border ${level.borderColor} ${level.bgColor} flex items-center justify-center ${level.colorClass}`}
          >
            <span className="font-mono text-sm font-bold">{level.num}</span>
          </div>
          {index < maturityLevels.length - 1 && (
            <div className="w-px h-full min-h-[40px] bg-foreground/8" />
          )}
        </div>

        {/* Right: content */}
        <div className="pb-8">
          <button
            onClick={onToggle}
            className="text-left w-full group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm ${level.colorClass}`}>{level.symbol}</span>
              <span className={`font-mono text-xs font-semibold tracking-wider ${level.colorClass}`}>
                {level.title}
              </span>
            </div>
            <p className="text-sm text-foreground/50 leading-relaxed max-w-xl">
              {level.description}
            </p>
          </button>

          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 rounded border border-precisur-dark-600/30 bg-precisur-dark-800/40">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <div className="text-foreground/30 uppercase tracking-wider mb-1">Significado</div>
                      <div className="text-foreground/60 leading-relaxed">{level.meaning}</div>
                    </div>
                    <div>
                      <div className="text-foreground/30 uppercase tracking-wider mb-1">Garantiza</div>
                      <div className="text-precisur-green/70 leading-relaxed">{level.guarantees}</div>
                    </div>
                    <div>
                      <div className="text-foreground/30 uppercase tracking-wider mb-1">No garantiza</div>
                      <div className="text-precisur-red/60 leading-relaxed">{level.doesNotGuarantee}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-precisur-dark-600/20">
                    <div className="text-foreground/30 uppercase tracking-wider mb-2 text-[10px]">Ejemplos</div>
                    <div className="flex flex-wrap gap-2">
                      {level.examples.map((ex, j) => (
                        <span
                          key={j}
                          className={`px-2 py-1 rounded border ${level.borderColor} ${level.bgColor} ${level.colorClass} text-[10px]`}
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <button
          onClick={onToggle}
          className="text-left w-full"
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`w-9 h-9 rounded border ${level.borderColor} ${level.bgColor} flex items-center justify-center flex-shrink-0 ${level.colorClass}`}
            >
              <span className="font-mono text-xs font-bold">{level.num}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${level.colorClass}`}>{level.symbol}</span>
              <span className={`font-mono text-[11px] font-semibold tracking-wider ${level.colorClass}`}>
                {level.title}
              </span>
            </div>
          </div>
          <p className="text-xs text-foreground/50 leading-relaxed ml-12">
            {level.description}
          </p>
        </button>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 ml-12 p-3 rounded border border-precisur-dark-600/30 bg-precisur-dark-800/40 text-xs font-mono space-y-2">
                <div>
                  <span className="text-foreground/30 uppercase tracking-wider">Significado: </span>
                  <span className="text-foreground/60">{level.meaning}</span>
                </div>
                <div>
                  <span className="text-foreground/30 uppercase tracking-wider">Garantiza: </span>
                  <span className="text-precisur-green/70">{level.guarantees}</span>
                </div>
                <div>
                  <span className="text-foreground/30 uppercase tracking-wider">No garantiza: </span>
                  <span className="text-precisur-red/60">{level.doesNotGuarantee}</span>
                </div>
                <div className="pt-2 border-t border-precisur-dark-600/20">
                  <div className="text-foreground/30 uppercase tracking-wider mb-1 text-[10px]">Ejemplos</div>
                  <div className="flex flex-wrap gap-1.5">
                    {level.examples.map((ex, j) => (
                      <span
                        key={j}
                        className={`px-1.5 py-0.5 rounded border ${level.borderColor} ${level.bgColor} ${level.colorClass} text-[9px]`}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Verification vs Validation Callout ────────────────────
function VerificationCallout() {
  return (
    <SectionReveal delay={0.15}>
      <div className="my-10 md:my-14 mx-auto max-w-2xl">
        <div className="relative p-5 md:p-6 rounded border border-precisur-cyan/20 bg-precisur-cyan/[0.03]">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-precisur-cyan/40" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-precisur-cyan/40" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-precisur-cyan/40" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-precisur-cyan/40" />

          <div className="text-center">
            <div className="text-[10px] font-mono text-precisur-cyan/50 uppercase tracking-[0.2em] mb-3">
              Diferencia Fundamental
            </div>
            <div className="font-mono text-lg md:text-xl font-bold text-foreground/80 mb-4">
              VERIFICAR <span className="text-precisur-cyan">≠</span> VALIDAR
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="text-left p-3 rounded bg-precisur-dark-800/50 border border-precisur-dark-600/20">
                <div className="text-precisur-cyan/70 uppercase tracking-wider mb-1">Verificación</div>
                <div className="text-foreground/50 leading-relaxed">
                  ¿El sistema computacional se comporta de acuerdo con sus especificaciones y reglas internas?
                </div>
              </div>
              <div className="text-left p-3 rounded bg-precisur-dark-800/50 border border-precisur-dark-600/20">
                <div className="text-precisur-green/70 uppercase tracking-wider mb-1">Validación</div>
                <div className="text-foreground/50 leading-relaxed">
                  ¿El modelo representa adecuadamente el fenómeno físico observado en el mundo real?
                </div>
              </div>
            </div>
            <div className="mt-4 text-[10px] font-mono text-foreground/25 uppercase tracking-wider">
              Software correcto <span className="text-precisur-cyan/40">≠</span> Modelo validado
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

// ─── Final Reflection ─────────────────────────────────────
function FinalReflection() {
  const flowSteps = [
    { label: "IMPLEMENTAR", color: "text-precisur-green", border: "border-precisur-green/40", bg: "bg-precisur-green/10" },
    { label: "VERIFICAR", color: "text-precisur-cyan", border: "border-precisur-cyan/40", bg: "bg-precisur-cyan/10" },
    { label: "INVESTIGAR", color: "text-precisur-orange", border: "border-precisur-orange/40", bg: "bg-precisur-orange/10" },
    { label: "MEDIR", color: "text-precisur-yellow", border: "border-precisur-yellow/40", bg: "bg-precisur-yellow/10" },
    { label: "VALIDAR", color: "text-precisur-green", border: "border-precisur-green/40", bg: "bg-precisur-green/10" },
  ];

  return (
    <SectionReveal delay={0.1}>
      <div className="mt-16 md:mt-20">
        <div className="text-center mb-10">
          <h3 className="font-heading text-xl font-semibold text-foreground/70 uppercase tracking-wider mb-5">
            Estado del Desarrollo
          </h3>
          <div className="max-w-2xl mx-auto">
            <p className="text-foreground/50 text-sm leading-relaxed mb-4">
              Precisur no considera la simulación como una sustitución automática de la experimentación.
              El objetivo es construir modelos computacionales útiles, verificar rigurosamente su comportamiento
              y avanzar progresivamente hacia su comparación con fenómenos medidos en condiciones reales.
            </p>
            <p className="text-foreground/50 text-sm leading-relaxed">
              La validación experimental no es un detalle pendiente. Cada componente
              del sistema requiere su propio nivel de validación.
            </p>
          </div>
        </div>

        {/* Flow pipeline — Desktop */}
        <div className="hidden md:block">
          <div className="relative flex items-center justify-center">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-precisur-green/20 via-precisur-cyan/20 to-precisur-green/20 -translate-y-1/2" />

            {/* Steps */}
            <div className="relative flex items-center justify-between w-full max-w-3xl">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className={`relative px-5 py-3 rounded border ${step.border} ${step.bg} backdrop-blur-sm`}>
                    <span className={`font-mono text-xs font-semibold tracking-wider ${step.color}`}>
                      {step.label}
                    </span>
                    {/* Node dot */}
                    <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${step.color.replace("text-", "bg-")} opacity-60`} />
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div className="w-8 flex items-center justify-center">
                      <div className="w-full h-px bg-foreground/10" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flow pipeline — Mobile */}
        <div className="md:hidden">
          <div className="relative flex flex-col items-center">
            {/* Connecting line */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-precisur-green/20 via-precisur-cyan/20 to-precisur-green/20" />

            {/* Steps */}
            <div className="relative flex flex-col items-center gap-1">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="flex flex-col items-center">
                  <div className={`relative px-4 py-2 rounded border ${step.border} ${step.bg}`}>
                    <span className={`font-mono text-[11px] font-semibold tracking-wider ${step.color}`}>
                      {step.label}
                    </span>
                    {/* Node dot */}
                    <div className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${step.color.replace("text-", "bg-")} opacity-60`} />
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div className="h-4 flex items-center justify-center">
                      <div className="w-px h-full bg-foreground/10" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function Evidencia() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveLevel((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="evidencia"
      className="relative min-h-screen py-24 bg-precisur-dark-900"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-precisur-cyan uppercase tracking-widest mb-4 block">
              Evidencia de Ingeniería
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              ESTADO DE MADUREZ
              <br />
              <span className="text-precisur-green">TECNOLÓGICA</span>
            </h2>
            <p className="text-foreground/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              El desarrollo de tecnología científica no es binario.
              Un sistema puede estar implementado, verificado computacionalmente
              y aún así requerir validación experimental.
            </p>
          </div>
        </SectionReveal>

        {/* Maturity Levels */}
        <SectionReveal delay={0.1}>
          <div className="mb-10">
            {maturityLevels.map((level, i) => (
              <div key={level.num}>
                <MaturityLevel
                  level={level}
                  index={i}
                  isActive={activeLevel === i}
                  onToggle={() => handleToggle(i)}
                  isDimmed={activeLevel !== null && activeLevel !== i}
                />
                {/* Insert callout between level 02 and 04 (after index 1) */}
                {i === 1 && <VerificationCallout />}
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Final Reflection */}
        <FinalReflection />
      </div>
    </section>
  );
}
