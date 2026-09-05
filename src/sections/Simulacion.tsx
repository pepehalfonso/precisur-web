"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";

// ─── Drone SVG ────────────────────────────────────────────
function DroneSVG() {
  return (
    <svg viewBox="0 0 120 50" className="w-full h-full" fill="none">
      {/* Body */}
      <rect x="35" y="18" width="50" height="10" rx="3" fill="#1a1a2e" stroke="#22c55e" strokeWidth="0.5" />
      {/* Arms */}
      <line x1="35" y1="23" x2="15" y2="15" stroke="#333" strokeWidth="2" />
      <line x1="85" y1="23" x2="105" y2="15" stroke="#333" strokeWidth="2" />
      {/* Motors */}
      <circle cx="15" cy="15" r="4" fill="#2d2d44" />
      <circle cx="105" cy="15" r="4" fill="#2d2d44" />
      {/* Propellers */}
      <g className="animate-spin" style={{ transformOrigin: "15px 15px", animationDuration: "0.15s" }}>
        <line x1="5" y1="15" x2="25" y2="15" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
        <line x1="15" y1="5" x2="15" y2="25" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
      </g>
      <g className="animate-spin" style={{ transformOrigin: "105px 15px", animationDuration: "0.15s" }}>
        <line x1="95" y1="15" x2="115" y2="15" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
        <line x1="105" y1="5" x2="105" y2="25" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
      </g>
      {/* LED */}
      <circle cx="60" cy="16" r="1.5" fill="#ef4444" className="animate-pulse" />
      {/* Camera */}
      <rect x="52" y="28" width="16" height="6" rx="2" fill="#222" />
      <circle cx="60" cy="34" r="3" fill="#1a3a5c" />
    </svg>
  );
}

// ─── Spray Particle ───────────────────────────────────────
function SprayDrop({ delay, x, wind }: { delay: number; x: number; wind: number }) {
  return (
    <div
      className="absolute rounded-full bg-precisur-green/40"
      style={{
        width: "3px",
        height: "3px",
        left: `${x}%`,
        top: "62%",
        animation: `sprayFall 1.8s ease-in ${delay}s infinite`,
        animationDelay: `${delay}s`,
        "--wind-drift": `${wind * 0.3}px`,
      } as React.CSSProperties}
    />
  );
}

// ─── Crop Row ─────────────────────────────────────────────
function Crop({ x, delay }: { x: number; delay: number }) {
  return (
    <div
      className="absolute bottom-0"
      style={{
        left: `${x}%`,
        animation: `cropSway 3s ease-in-out ${delay}s infinite`,
      }}
    >
      <div className="w-[3px] bg-precisur-green/30" style={{ height: `${8 + Math.random() * 6}px` }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function Simulacion() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [wind, setWind] = useState(12);

  const drops = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 0.09,
    x: 44 + (Math.random() - 0.5) * 12,
  }));

  const crops = Array.from({ length: 40 }, (_, i) => ({
    x: 2 + (i / 40) * 96,
    delay: i * 0.05,
  }));

  return (
    <>
      <style jsx global>{`
        @keyframes droneFly {
          0% { transform: translateX(-120%) translateY(0); }
          25% { transform: translateX(0%) translateY(-3px); }
          50% { transform: translateX(50%) translateY(2px); }
          75% { transform: translateX(100%) translateY(-1px); }
          100% { transform: translateX(220%) translateY(0); }
        }
        @keyframes sprayFall {
          0% { transform: translateY(0) translateX(0); opacity: 0.7; }
          100% { transform: translateY(60px) translateX(var(--wind-drift, 0px)); opacity: 0; }
        }
        @keyframes cropSway {
          0%, 100% { transform: skewX(0deg); }
          50% { transform: skewX(3deg); }
        }
        @keyframes windLine {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      <section id="simulacion" ref={ref} className="relative min-h-screen flex items-center py-24 bg-precisur-dark-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <SectionReveal>
            <div>
              <span className="text-xs font-mono text-precisur-green uppercase tracking-widest mb-4 block">
                Simulacion en Campo
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                PRUEBA ANTES<br />
                <span className="text-precisur-green">DE VOLAR</span>
              </h2>
              <p className="text-foreground/60 text-lg leading-relaxed max-w-lg mb-8">
                Visualiza como el drone distribuye el producto sobre el cultivo.
                Ajusta el viento y observa como las condiciones afectan la cobertura
                y la deriva del spray.
              </p>
              <div className="space-y-2.5">
                {[
                  "Vuelo automatico con trayectoria zigzag",
                  "Spray con particulas que responden al viento",
                  "Cultivos en filas con movimiento natural",
                  "Control de velocidad y direccion del viento",
                  "Zona sensible marcada para evitar",
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
            <div className="relative aspect-[4/3] max-w-lg mx-auto rounded-lg overflow-hidden border border-precisur-dark-600/30 bg-[#0a0f0d]">
              {/* Sky gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a14] via-[#0a1210] to-[#0d1510]" />

              {/* Stars */}
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={`s${i}`}
                  className="absolute rounded-full bg-white/20"
                  style={{
                    width: "2px", height: "2px",
                    left: `${10 + i * 11}%`,
                    top: `${5 + (i % 3) * 8}%`,
                    animation: `pulse-glow ${2 + i * 0.3}s ease-in-out infinite`,
                  }}
                />
              ))}

              {/* Wind lines */}
              {isInView && Array.from({ length: 5 }, (_, i) => (
                <div
                  key={`w${i}`}
                  className="absolute h-[1px] bg-precisur-cyan/20"
                  style={{
                    width: `${30 + wind}px`,
                    top: `${20 + i * 10}%`,
                    animation: `windLine ${3 + i * 0.5}s linear ${i * 0.6}s infinite`,
                  }}
                />
              ))}

              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-[#0d1510] to-transparent" />

              {/* Crop rows */}
              <div className="absolute bottom-0 left-0 right-0 h-[30%]">
                {crops.map((c, i) => (
                  <Crop key={i} x={c.x} delay={c.delay} />
                ))}
              </div>

              {/* Sensitive zone */}
              <div
                className="absolute bottom-0 right-[5%] w-[18%] h-[25%] border border-red-500/20 bg-red-500/5"
                style={{ borderRadius: "2px" }}
              >
                <span className="absolute top-1 left-1 text-[6px] font-mono text-red-400/50">SENSIBLE</span>
              </div>

              {/* Drone + Spray */}
              {isInView && (
                <div
                  className="absolute"
                  style={{
                    width: "120px",
                    height: "50px",
                    top: "30%",
                    animation: `droneFly 8s linear infinite`,
                  }}
                >
                  <DroneSVG />
                  {/* Spray drops */}
                  <div className="absolute" style={{ left: "40%", top: "70%", width: "40px" }}>
                    {drops.map((d, i) => (
                      <SprayDrop key={i} delay={d.delay} x={d.x - 44} wind={wind} />
                    ))}
                  </div>
                </div>
              )}

              {/* HUD overlay */}
              <div className="absolute top-3 left-3 text-[8px] font-mono text-foreground/30 space-y-1">
                <div>DRONE: EN VUELO</div>
                <div>VIENTO: {wind} km/h</div>
              </div>

              {/* Wind control */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
                <span className="text-[7px] font-mono text-foreground/30">VIENTO</span>
                <input
                  type="range" min={0} max={30} value={wind}
                  onChange={(e) => setWind(+e.target.value)}
                  className="flex-1 h-0.5 accent-precisur-cyan"
                />
                <span className="text-[7px] font-mono text-foreground/30">{wind}km/h</span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
