"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const workflow = [
  {
    step: "01",
    title: "Preparación",
    desc: "Registrar dron, cultivo y producto. Definir zonas sensibles alrededor del lote.",
    color: "text-precisur-green",
  },
  {
    step: "02",
    title: "Pre-Vuelo",
    desc: "El motor de reglas evalúa meteorología, configuración y entorno. Genera veredicto con 5 estados.",
    color: "text-precisur-cyan",
  },
  {
    step: "03",
    title: "Simulación",
    desc: "Mapa con polígono del lote, capas de concentración, deposición y partículas en tiempo real.",
    color: "text-precisur-yellow",
  },
  {
    step: "04",
    title: "Optimización",
    desc: "Smart Spray evalúa candidatos de ruta con física real y presenta Top 3 alternativas.",
    color: "text-precisur-violet",
  },
  {
    step: "05",
    title: "Monitoreo",
    desc: "ICA en vivo, alertas por umbrales, recomendaciones con prioridad y ventana operativa.",
    color: "text-precisur-orange",
  },
];

const verdicts = [
  { label: "FAVORABLE", color: "text-precisur-green", bg: "bg-precisur-green/10", border: "border-precisur-green/30", desc: "Condiciones óptimas" },
  { label: "CON PRECAUCIÓN", color: "text-precisur-yellow", bg: "bg-precisur-yellow/10", border: "border-precisur-yellow/30", desc: "Aplicable con ajustes" },
  { label: "REVISAR", color: "text-precisur-orange", bg: "bg-precisur-orange/10", border: "border-precisur-orange/30", desc: "Evaluación manual" },
  { label: "NO RECOMENDADO", color: "text-precisur-red", bg: "bg-precisur-red/10", border: "border-precisur-red/30", desc: "Riesgo alto, mitigable" },
  { label: "BLOQUEADO", color: "text-precisur-red", bg: "bg-precisur-red/10", border: "border-precisur-red/30", desc: "Regla HARD violada" },
];

const features = [
  { title: "6 reglas HARD", desc: "Lluvia > 0.5 mm, viento ≥ 25 km/h, ráfagas > 30 km/h, inversión térmica, zona sensible en trayectoria, lluvia pronosticada.", color: "text-precisur-red" },
  { title: "11 reglas SOFT", desc: "Viento, temperatura, humedad, VPD, punto de rocío, tamaño de gota, presión, caudal, altura, velocidad.", color: "text-precisur-yellow" },
  { title: "Índice ICA 0–100", desc: "Meteorología 30%, Deriva 25%, Configuración 20%, Calidad 15%, Entorno 10%. 7 niveles de veredicto.", color: "text-precisur-cyan" },
  { title: "Escenarios alternativos", desc: "Si el veredicto es NO RECOMENDADO, sugiere configuraciones con riesgo estimado.", color: "text-precisur-green" },
  { title: "Base de datos offline", desc: "Isar DB local. Drones, cultivos, productos e historial sin conexión.", color: "text-precisur-violet" },
  { title: "Mapa con zonas sensibles", desc: "Overpass API detecta escuelas, hospitales, cuerpos de agua y zonas protegidas.", color: "text-precisur-cyan" },
];

const specs = [
  { label: "Plataforma", value: "Flutter / Android 7.0+" },
  { label: "Tamaño APK", value: "~20 MB" },
  { label: "RAM", value: "~80 MB" },
  { label: "FPS objetivo", value: "60 fps" },
  { label: "Análisis local", value: "< 100 ms" },
  { label: "Startup", value: "< 3 s" },
  { label: "DB local", value: "Isar 3.1" },
  { label: "Backend", value: "FastAPI / Python 3.11+" },
];

export default function AplicacionMovil() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="aplicacion"
      ref={ref}
      className="relative min-h-screen py-24 bg-precisur-dark-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-precisur-violet uppercase tracking-widest mb-4 block">
              Aplicación Móvil
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              DE LA OFICINA
              <br />
              <span className="text-precisur-green">AL CAMPO</span>
            </h2>
            <p className="text-foreground/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Precisur es una app Flutter con motor de reglas embebido, simulación
              de deriva en mapa y conexión directa con estación meteorológica.
            </p>
          </div>
        </SectionReveal>

        {/* Workflow */}
        <SectionReveal>
          <div className="mb-16">
            <h3 className="font-mono text-xs text-precisur-cyan uppercase tracking-widest mb-6 text-center">
              Flujo de Trabajo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {workflow.map((w, i) => (
                <motion.div
                  key={w.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center p-4 rounded border border-precisur-dark-600/30 bg-precisur-dark-800/50"
                >
                  <div className={`font-mono text-lg font-bold mb-2 ${w.color}`}>
                    {w.step}
                  </div>
                  <div className="font-heading text-sm font-semibold text-foreground/70 mb-2">
                    {w.title}
                  </div>
                  <p className="text-xs text-foreground/40 leading-relaxed">{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Verdicts */}
        <SectionReveal delay={0.1}>
          <div className="mb-16">
            <h3 className="font-mono text-xs text-precisur-cyan uppercase tracking-widest mb-6 text-center">
              Sistema de Veredictos
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {verdicts.map((v) => (
                <div
                  key={v.label}
                  className={`px-4 py-2 rounded border ${v.border} ${v.bg} text-center`}
                >
                  <div className={`font-mono text-xs font-bold ${v.color}`}>{v.label}</div>
                  <div className="text-[10px] text-foreground/40">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Features + Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionReveal delay={0.1}>
            <div>
              <h3 className="font-mono text-xs text-precisur-cyan uppercase tracking-widest mb-4">
                Capacidades
              </h3>
              <div className="space-y-3">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="p-4 rounded border border-precisur-dark-600/30 bg-precisur-dark-800/50"
                  >
                    <div className={`font-mono text-xs font-semibold mb-1 ${f.color}`}>
                      {f.title}
                    </div>
                    <p className="text-xs text-foreground/50 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div>
              <h3 className="font-mono text-xs text-precisur-cyan uppercase tracking-widest mb-4">
                Especificaciones
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="p-4 rounded border border-precisur-dark-600/30 bg-precisur-dark-800/50"
                  >
                    <div className="text-[10px] text-foreground/30 uppercase tracking-wider mb-1">
                      {s.label}
                    </div>
                    <div className="font-mono text-sm text-precisur-green">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded border border-precisur-yellow/20 bg-precisur-yellow/5">
                <div className="text-[10px] font-mono text-precisur-yellow uppercase tracking-wider mb-2">
                  Verificación
                </div>
                <p className="text-xs text-foreground/50 leading-relaxed">
                  Motor de reglas embebido en Flutter. Paridad Python ↔ Flutter
                  verificada con 109 tests: los mismos casos calculados en Dart
                  y en Python deben dar idéntico ICA. El motor de calidad es
                  puramente determinista — mismos inputs, mismo resultado.
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
