"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";

// ─── Animated counter ─────────────────────────────────────
function StatCard({ value, unit, label, delay }: {
  value: number; unit: string; label: string; delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="bg-precisur-dark-900/80 border border-precisur-dark-600/30 rounded px-3 py-2 text-center"
    >
      <div className="text-xl font-bold font-mono text-precisur-green">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
        >
          {value}
        </motion.span>
        <span className="text-xs text-foreground/40 ml-0.5">{unit}</span>
      </div>
      <div className="text-[8px] font-mono text-foreground/35 uppercase tracking-wider mt-0.5">{label}</div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function Simulacion() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const zigzagPath = "M 60 280 L 340 280 L 340 240 L 60 240 L 60 200 L 340 200 L 340 160 L 60 160 L 60 120 L 340 120";
  const traveledPath = "M 60 280 L 340 280 L 340 240 L 60 240 L 60 200 L 200 200";

  return (
    <section id="simulacion" ref={ref} className="relative min-h-screen flex items-center py-24 bg-precisur-dark-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <SectionReveal>
          <div>
            <span className="text-xs font-mono text-precisur-green uppercase tracking-widest mb-4 block">
              Simulacion Inteligente
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              PLANIFICAR ANTES<br />
              <span className="text-precisur-green">DE VOLAR</span>
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed max-w-lg mb-8">
              El software calcula la ruta optima para cubrir el lote
              minimizando pasadas innecesarias y evitando zonas sensibles.
              Cada vuelo esta planificado antes de despegar.
            </p>
            <div className="space-y-2.5">
              {[
                "Ruta zigzag automatica adaptada a la forma del lote",
                "Evitacion de zonas sensibles y obstaculos",
                "Calculo de dosis por superficie en tiempo real",
                "Registro de cobertura para auditoria",
                "Exportacion de datos para gestión agricola",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-precisur-green shrink-0" />
                  <span className="text-sm text-foreground/55">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="relative max-w-lg mx-auto">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard value={98} unit="%" label="Cobertura" delay={0.3} />
              <StatCard value={3} unit="cm" label="Precision GPS" delay={0.4} />
              <StatCard value={4} unit="ha/h" label="Productividad" delay={0.5} />
              <StatCard value={30} unit="%" label="Ahorro vs manual" delay={0.6} />
            </div>

            {/* SVG infographic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative rounded-lg overflow-hidden border border-precisur-dark-600/30 bg-precisur-dark-900/50"
            >
              <svg viewBox="0 0 400 320" className="w-full h-auto">
                <defs>
                  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d1a14" />
                    <stop offset="100%" stopColor="#0a1210" />
                  </linearGradient>
                  <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d1510" />
                    <stop offset="100%" stopColor="#0a0f0d" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Sky */}
                <rect width="400" height="320" fill="url(#sky)" />

                {/* Ground */}
                <rect y="290" width="400" height="30" fill="url(#ground)" />

                {/* Crop rows */}
                {Array.from({ length: 12 }, (_, i) => (
                  <g key={`crop${i}`}>
                    <line x1={40} y1={300 - i * 2} x2={360} y2={300 - i * 2}
                      stroke="#1a3029" strokeWidth="0.5" opacity="0.4" />
                    {Array.from({ length: 18 }, (_, j) => (
                      <rect key={j} x={50 + j * 17} y={294 - i * 2} width="2" height={4 + (j % 3) * 2}
                        fill="#1e5c2e" opacity={0.3 + (j % 4) * 0.1} rx="0.5" />
                    ))}
                  </g>
                ))}

                {/* Lot border */}
                <rect x="40" y="100" width="320" height="195" fill="none"
                  stroke="#22c55e" strokeWidth="1" opacity="0.25" rx="2" />

                {/* Sensitive zone */}
                <rect x="300" y="230" width="55" height="55" fill="#ef4444" opacity="0.08" rx="2" />
                <rect x="300" y="230" width="55" height="55" fill="none"
                  stroke="#ef4444" strokeWidth="0.8" opacity="0.3" rx="2" />
                <text x="327" y="260" textAnchor="middle" fill="#ef4444" fontSize="7"
                  fontFamily="JetBrains Mono, monospace" opacity="0.5">SENSIBLE</text>

                {/* Flight path (full) */}
                <path d={zigzagPath} fill="none" stroke="#1a3029" strokeWidth="1"
                  strokeDasharray="4 4" opacity="0.5" />

                {/* Flight path (traveled) */}
                <motion.path
                  d={traveledPath}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  opacity="0.7"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
                />

                {/* Spray cone */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <polygon points="195,85 175,150 215,150" fill="#22c55e" opacity="0.06" />
                  <polygon points="195,85 180,140 210,140" fill="#22c55e" opacity="0.08" />
                  {/* Spray droplets */}
                  {Array.from({ length: 8 }, (_, i) => (
                    <circle key={i}
                      cx={182 + Math.random() * 26}
                      cy={100 + i * 6}
                      r={0.8 + Math.random() * 0.8}
                      fill="#22c55e"
                      opacity={0.3 - i * 0.03}
                    />
                  ))}
                </motion.g>

                {/* Drone */}
                <motion.g
                  initial={{ x: -60, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                >
                  {/* Arms */}
                  <line x1="175" y1="82" x2="155" y2="75" stroke="#333" strokeWidth="2" />
                  <line x1="215" y1="82" x2="235" y2="75" stroke="#333" strokeWidth="2" />
                  {/* Body */}
                  <rect x="177" y="74" width="36" height="14" rx="3"
                    fill="#1a1a2e" stroke="#22c55e" strokeWidth="0.5" />
                  {/* GPS dome */}
                  <ellipse cx="195" cy="74" rx="6" ry="3" fill="#16213e" />
                  {/* Antenna */}
                  <line x1="195" y1="71" x2="195" y2="64" stroke="#555" strokeWidth="1" />
                  <circle cx="195" cy="63" r="1.5" fill="#ef4444" filter="url(#glow)" />
                  {/* Motors */}
                  <circle cx="155" cy="75" r="4" fill="#2d2d44" stroke="#333" strokeWidth="0.5" />
                  <circle cx="235" cy="75" r="4" fill="#2d2d44" stroke="#333" strokeWidth="0.5" />
                  {/* Propeller blur */}
                  <ellipse cx="155" cy="75" rx="12" ry="2" fill="#22c55e" opacity="0.15" />
                  <ellipse cx="235" cy="75" rx="12" ry="2" fill="#22c55e" opacity="0.15" />
                  {/* Camera */}
                  <rect x="189" y="88" width="12" height="5" rx="1" fill="#222" />
                  <circle cx="195" cy="93" r="2.5" fill="#1a3a5c" stroke="#333" strokeWidth="0.3" />
                  {/* LEDs */}
                  <circle cx="155" cy="75" r="1.2" fill="#ef4444" filter="url(#glow)" opacity="0.8" />
                  <circle cx="235" cy="75" r="1.2" fill="#22c55e" filter="url(#glow)" opacity="0.8" />
                </motion.g>

                {/* Data callouts */}
                <motion.g
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  {/* Callout 1: Route */}
                  <line x1="340" y1="160" x2="370" y2="140" stroke="#22c55e" strokeWidth="0.5" opacity="0.4" />
                  <rect x="350" y="128" width="45" height="18" rx="2"
                    fill="#0a0f0d" stroke="#22c55e" strokeWidth="0.5" opacity="0.8" />
                  <text x="372" y="139" textAnchor="middle" fill="#22c55e"
                    fontSize="6" fontFamily="JetBrains Mono, monospace" opacity="0.7">RUTA</text>
                  <text x="372" y="145" textAnchor="middle" fill="#22c55e"
                    fontSize="5" fontFamily="JetBrains Mono, monospace" opacity="0.5">OPTIMA</text>

                  {/* Callout 2: Zone */}
                  <line x1="40" y1="120" x2="15" y2="105" stroke="#ef4444" strokeWidth="0.5" opacity="0.4" />
                  <rect x="2" y="90" width="40" height="18" rx="2"
                    fill="#0a0f0d" stroke="#ef4444" strokeWidth="0.5" opacity="0.8" />
                  <text x="22" y="101" textAnchor="middle" fill="#ef4444"
                    fontSize="6" fontFamily="JetBrains Mono, monospace" opacity="0.7">EVITAR</text>
                  <text x="22" y="107" textAnchor="middle" fill="#ef4444"
                    fontSize="5" fontFamily="JetBrains Mono, monospace" opacity="0.5">ZONA ROJA</text>
                </motion.g>
              </svg>
            </motion.div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
