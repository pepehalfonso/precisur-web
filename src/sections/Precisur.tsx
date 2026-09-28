"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const capabilities = [
  {
    title: "MOTOR DE SIMULACIÓN",
    desc: "7 modelos físicos: velocidad terminal, arrastre Schiller-Naumann, evaporación ley d², turbulencia hash 4D, deposición estocástica, distribución log-normal y perfil de viento. Versión 3.0.0.",
    color: "text-precisur-green",
    border: "border-precisur-green/20",
    bg: "bg-precisur-green/5",
  },
  {
    title: "MOTOR DE CALIDAD (ICA)",
    desc: "Índice 0–100 con 5 grupos ponderados: meteorología 30%, deriva 25%, configuración 20%, calidad 15%, entorno 10%. 6 vetos absolutos.",
    color: "text-precisur-cyan",
    border: "border-precisur-cyan/20",
    bg: "bg-precisur-cyan/5",
  },
  {
    title: "APLICACIÓN FLUTTER",
    desc: "App Android con análisis pre-vuelo, simulación de deriva en mapa, Smart Spray optimizador, monitoreo en vivo y base de datos offline.",
    color: "text-precisur-yellow",
    border: "border-precisur-yellow/20",
    bg: "bg-precisur-yellow/5",
  },
  {
    title: "ESTACIÓN ESP32",
    desc: "Hardware propio: DHT22, BMP280, BH1750 y anemómetro. Conexión BLE/WiFi con fallback automático a Open-Meteo.",
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
              Precisur no es un prototipo conceptual. Es un sistema con
              arquitectura funcional, motor de simulación basado en modelos
              físicos y evidencia de ingeniería verificable.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap, i) => (
            <SectionReveal key={cap.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`p-5 md:p-8 rounded-lg border ${cap.border} ${cap.bg} backdrop-blur-sm transition-colors duration-300`}
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
