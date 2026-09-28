"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const sensors = [
  {
    name: "DHT22",
    measures: "Temperatura / Humedad",
    specs: [
      "−40 a 80 °C, ±0.5 °C",
      "0–100% RH, ±2%",
      "Muestreo: cada 2 s",
    ],
    color: "text-precisur-cyan",
    border: "border-precisur-cyan/30",
    bg: "bg-precisur-cyan/5",
  },
  {
    name: "BMP280",
    measures: "Presión Atmosférica",
    specs: [
      "300–1100 hPa, ±1 hPa",
      "−40 a +85 °C, ±1.0 °C",
      "I2C, filtro ×16",
    ],
    color: "text-precisur-green",
    border: "border-precisur-green/30",
    bg: "bg-precisur-green/5",
  },
  {
    name: "BH1750",
    measures: "Luz Ambiental",
    specs: [
      "0–65535 lux, ±1 lux",
      "Muestreo: cada 2 s",
      "Sensor fotodiódico",
    ],
    color: "text-precisur-yellow",
    border: "border-precisur-yellow/30",
    bg: "bg-precisur-yellow/5",
  },
  {
    name: "Anemómetro",
    measures: "Viento (velocidad / dirección)",
    specs: [
      "0–60 km/h, ±0.5 m/s",
      "0–360°, ±5°",
      "Muestreo: cada 1 s",
    ],
    color: "text-precisur-orange",
    border: "border-precisur-orange/30",
    bg: "bg-precisur-orange/5",
  },
];

const connectivity = [
  { label: "BLE", desc: "Bluetooth Low Energy", detail: "PIN 1234 · rango ~10 m · heartbeat 5 s", color: "text-precisur-cyan" },
  { label: "WiFi", desc: "Access Point propio", detail: "SSID PrecisurV1 · IP 192.168.4.1 · rango ~30 m", color: "text-precisur-green" },
  { label: "Open-Meteo", desc: "Fallback automático", detail: "Sin estación: datos por GPS · 10.000 req/día", color: "text-precisur-yellow" },
];

const derivedMetrics = [
  { label: "VPD", desc: "Déficit de presión de vapor", formula: "0.6108 · e^(17.27·T/(T+237.3)) · (1 − RH/100)", optimal: "Óptimo: 0.4–1.2 kPa" },
  { label: "Punto de Rocío", desc: "Temperatura de condensación", formula: "Td ≈ T − ((100 − RH)/5)", optimal: "Spread > 2°C = favorable" },
  { label: "Estabilidad", desc: "Clase atmosférica Pasquill-Gifford", formula: "5 clases: muy estable → muy inestable", optimal: "Inversión = veto HARD" },
  { label: "Precipitación", desc: "Ventana operativa", formula: "minutesUntilRain vs duración estimada", optimal: "Lluvia > 0.5 mm = veto" },
];

const hardware = [
  { label: "Procesador", value: "ESP32 dual-core 240 MHz" },
  { label: "Conectividad", value: "WiFi 802.11 b/g/n + BT 4.2" },
  { label: "Memoria", value: "520 KB SRAM, 4 MB Flash" },
  { label: "GPIO", value: "34 pines disponibles" },
  { label: "LEDs estado", value: "Verde (WiFi) / Amarillo / Rojo" },
  { label: "Alarma", value: "Buzzer + botón físico" },
];

export default function EstacionMeteorologica() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="estacion"
      ref={ref}
      className="relative min-h-screen py-24 bg-precisur-dark-800"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-precisur-yellow uppercase tracking-widest mb-4 block">
              Estación Meteorológica
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              DATOS REALES
              <br />
              <span className="text-precisur-green">DESDE EL CAMPO</span>
            </h2>
            <p className="text-foreground/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Hardware propio basado en ESP32. Cuatro sensores, dos modos de
              conexión y datos derivados calculados en tiempo real.
            </p>
          </div>
        </SectionReveal>

        {/* Sensors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {sensors.map((s, i) => (
            <SectionReveal key={s.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`p-5 rounded border ${s.border} ${s.bg} h-full`}
              >
                <div className={`font-mono text-sm font-bold ${s.color} mb-1`}>
                  {s.name}
                </div>
                <div className="text-xs text-foreground/50 mb-3">{s.measures}</div>
                <ul className="space-y-1">
                  {s.specs.map((spec) => (
                    <li key={spec} className="text-[10px] font-mono text-foreground/40">
                      {spec}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </SectionReveal>
          ))}
        </div>

        {/* Connectivity */}
        <SectionReveal delay={0.1}>
          <div className="mb-16">
            <h3 className="font-mono text-xs text-precisur-cyan uppercase tracking-widest mb-6 text-center">
              Conectividad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {connectivity.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="text-center p-5 rounded border border-precisur-dark-600/30 bg-precisur-dark-900/50"
                >
                  <div className={`font-mono text-lg font-bold ${c.color} mb-1`}>
                    {c.label}
                  </div>
                  <div className="text-xs text-foreground/50 mb-2">{c.desc}</div>
                  <div className="text-[10px] font-mono text-foreground/30">{c.detail}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Derived metrics + Hardware */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionReveal delay={0.1}>
            <div>
              <h3 className="font-mono text-xs text-precisur-cyan uppercase tracking-widest mb-4">
                Métricas Derivadas
              </h3>
              <div className="space-y-3">
                {derivedMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-4 rounded border border-precisur-dark-600/30 bg-precisur-dark-900/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-semibold text-precisur-green">
                        {m.label}
                      </span>
                      <span className="text-[10px] text-foreground/30">{m.desc}</span>
                    </div>
                    <div className="font-mono text-[10px] text-foreground/40 mb-1">
                      {m.formula}
                    </div>
                    <div className="font-mono text-[10px] text-precisur-cyan">{m.optimal}</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div>
              <h3 className="font-mono text-xs text-precisur-cyan uppercase tracking-widest mb-4">
                Hardware
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {hardware.map((h) => (
                  <div
                    key={h.label}
                    className="p-4 rounded border border-precisur-dark-600/30 bg-precisur-dark-900/50"
                  >
                    <div className="text-[10px] text-foreground/30 uppercase tracking-wider mb-1">
                      {h.label}
                    </div>
                    <div className="font-mono text-xs text-precisur-green">{h.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded border border-precisur-yellow/20 bg-precisur-yellow/5">
                <div className="text-[10px] font-mono text-precisur-yellow uppercase tracking-wider mb-2">
                  Dato Importante
                </div>
                <p className="text-xs text-foreground/50 leading-relaxed">
                  Sin estación, la app usa Open-Meteo automáticamente. Los datos se
                  marcan por fuente: verde = estación, azul = Open-Meteo, amarillo =
                  híbrido. El operador siempre sabe de dónde viene cada valor.
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
