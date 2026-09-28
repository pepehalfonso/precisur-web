"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const physicsModels = [
  {
    num: "01",
    title: "Velocidad Terminal",
    method: "Stokes + Schiller-Naumann",
    desc: "Solver iterativo con tres regímenes: Stokes (Re < 1), Schiller-Naumann (Re < 1000) y Newton (Re ≥ 1000, Cd = 0.44).",
    color: "text-precisur-green",
    border: "border-precisur-green/30",
    bg: "bg-precisur-green/5",
  },
  {
    num: "02",
    title: "Arrastre Aerodinámico",
    method: "Correlación Schiller-Naumann",
    desc: "Fd = -0.5 · ρ · Cd · A · |V_rel| · (V_rel / |V_rel|). Área de referencia A = π·d²/4. Estándar de la industria desde 1935.",
    color: "text-precisur-cyan",
    border: "border-precisur-cyan/30",
    bg: "bg-precisur-cyan/5",
  },
  {
    num: "03",
    title: "Evaporación",
    method: "Ley d² con corrección Ranz-Marshall",
    desc: "d(d²)/dt = -8 · D_c · (p_sat - p_v) / (ρ_L · L) · Nu. Correlación de Nusselt: Nu = 2.0 + 0.6 · Re^0.5 · Sc^0.33. Presión de saturación Tetens.",
    color: "text-precisur-yellow",
    border: "border-precisur-yellow/30",
    bg: "bg-precisur-yellow/5",
  },
  {
    num: "04",
    title: "Turbulencia",
    method: "Ruido coherente hash 4D",
    desc: "Interpolación trilineal con smoothstep sobre vértices de grilla. Intensidad 0.3, escala espacial 10 m, escala temporal 5 s. Proporcional al viento medio.",
    color: "text-precisur-violet",
    border: "border-precisur-violet/30",
    bg: "bg-precisur-violet/5",
  },
  {
    num: "05",
    title: "Deposición",
    method: "Capa límite estocástica",
    desc: "Contacto con el suelo (altura ≤ terreno). Bajo 0.1 m, velocidad hacia abajo con probabilidad de deposición basada en el gradiente.",
    color: "text-precisur-orange",
    border: "border-precisur-orange/30",
    bg: "bg-precisur-orange/5",
  },
  {
    num: "06",
    title: "Distribución de Gotas",
    method: "Log-normal parametrizada por VMD",
    desc: "σ = ln(span) / (2 × 1.28), μ = ln(VMD) + σ²/2, d = exp(μ + σ × Z) donde Z ~ N(0,1). Span típico 1.5–3.0.",
    color: "text-precisur-cyan",
    border: "border-precisur-cyan/30",
    bg: "bg-precisur-cyan/5",
  },
  {
    num: "07",
    title: "Perfil de Viento",
    method: "Perfil de potencia por paso",
    desc: "Aplicado en cada paso del loop físico. Convención meteorológica FROM (0° = N, 90° = E). Componentes internos U/Este-positivo, V/Norte-positivo.",
    color: "text-precisur-green",
    border: "border-precisur-green/30",
    bg: "bg-precisur-green/5",
  },
];

const metrics = [
  { value: "228", label: "Tests end-to-end", sub: "todos pasan" },
  { value: "35/35", label: "Auditoría conservación", sub: "de masa" },
  { value: "109", label: "Tests paridad ICA", sub: "Flutter ↔ Python" },
  { value: "90", label: "Tests golden", sub: "escenarios de referencia" },
];

const constants = [
  { sym: "g", value: "9.80665 m/s²", desc: "Gravedad" },
  { sym: "ρ_air", value: "1.204 kg/m³", desc: "Densidad del aire (20°C)" },
  { sym: "μ_air", value: "1.825×10⁻⁵ Pa·s", desc: "Viscosidad dinámica" },
  { sym: "ρ_liq", value: "998.0 kg/m³", desc: "Densidad del líquido" },
];

export default function MotorDeSimulacion() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="motor"
      ref={ref}
      className="relative min-h-screen py-24 bg-precisur-dark-800"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-precisur-cyan uppercase tracking-widest mb-4 block">
              Motor de Simulación
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              SIETE MODELOS
              <br />
              <span className="text-precisur-green">FÍSICOS IMPLEMENTADOS</span>
            </h2>
            <p className="text-foreground/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Cada gota se calcula con correlaciones científicas estándar, no con
              aproximaciones ad-hoc. El motor es determinista: misma semilla,
              mismos resultados.
            </p>
          </div>
        </SectionReveal>

        {/* Physics models grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {physicsModels.map((model, i) => (
            <SectionReveal key={model.num} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`p-5 rounded border ${model.border} ${model.bg} h-full`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-mono text-xs font-bold ${model.color}`}>
                    {model.num}
                  </span>
                  <span className={`font-mono text-xs font-semibold ${model.color}`}>
                    {model.title}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-foreground/30 uppercase tracking-wider mb-2">
                  {model.method}
                </div>
                <p className="text-xs text-foreground/50 leading-relaxed">
                  {model.desc}
                </p>
              </motion.div>
            </SectionReveal>
          ))}
        </div>

        {/* Metrics */}
        <SectionReveal delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="text-center p-5 rounded border border-precisur-dark-600/30 bg-precisur-dark-900/50"
              >
                <div className="font-mono text-2xl md:text-3xl font-bold text-precisur-green mb-1">
                  {m.value}
                </div>
                <div className="text-xs text-foreground/50">{m.label}</div>
                <div className="text-[10px] text-foreground/30 font-mono">{m.sub}</div>
              </motion.div>
            ))}
          </div>
        </SectionReveal>

        {/* Constants + honesty */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionReveal delay={0.1}>
            <div className="p-6 rounded border border-precisur-dark-600/30 bg-precisur-dark-900/50">
              <h3 className="font-mono text-xs text-precisur-cyan uppercase tracking-widest mb-4">
                Constantes Físicas
              </h3>
              <div className="space-y-3">
                {constants.map((c) => (
                  <div key={c.sym} className="flex items-center justify-between">
                    <span className="font-mono text-sm text-precisur-green">{c.sym}</span>
                    <span className="font-mono text-xs text-foreground/50">{c.value}</span>
                    <span className="text-xs text-foreground/30">{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="p-6 rounded border border-precisur-yellow/20 bg-precisur-yellow/5 h-full">
              <h3 className="font-mono text-xs text-precisur-yellow uppercase tracking-widest mb-4">
                Honestidad Técnica
              </h3>
              <ul className="space-y-2 text-xs text-foreground/60 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-precisur-yellow">·</span>
                  Conservación de masa verificada: 35/35 — pero es verificación
                  contable, no validación experimental.
                </li>
                <li className="flex gap-2">
                  <span className="text-precisur-yellow">·</span>
                  Sin datos de campo descargados. 0 de 43 ensayos UAV tienen VMD
                  medido.
                </li>
                <li className="flex gap-2">
                  <span className="text-precisur-yellow">·</span>
                  Sin calibración. El gate de calibración está formalmente
                  bloqueado (7/12 criterios cumplidos).
                </li>
                <li className="flex gap-2">
                  <span className="text-precisur-yellow">·</span>
                  Sin machine learning. Sin datos observados de deriva utilizados
                  como objetivo de optimización.
                </li>
                <li className="flex gap-2">
                  <span className="text-precisur-yellow">·</span>
                  Colisiones entre gotas deshabilitadas por defecto
                  (enable_collisions: False).
                </li>
              </ul>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
