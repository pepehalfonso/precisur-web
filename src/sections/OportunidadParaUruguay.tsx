"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const assets = [
  { icon: "🗺", label: "Territorio", desc: "Superficie apta para agricultura" },
  { icon: "🌾", label: "Producción", desc: "Sector agropecuario relevante" },
  { icon: "🏛", label: "Instituciones", desc: "Universidades y centros de investigación" },
  { icon: "🎓", label: "Talento", desc: "Capital humano formado" },
  { icon: "📡", label: "Infraestructura", desc: "Tecnología emergente" },
];

export default function OportunidadParaUruguay() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-24 bg-precisur-dark-800"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-precisur-green uppercase tracking-widest mb-4 block">
              Oportunidad
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              ¿QUÉ OCURRIRÍA SI ESTAS
              <br />
              <span className="text-precisur-green">
                CAPACIDADES COMENZARAN
              </span>
              <br />
              <span className="text-precisur-green">A TRABAJAR JUNTAS?</span>
            </h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {assets.map((asset, i) => (
            <SectionReveal key={asset.label} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 rounded-lg border border-precisur-dark-600/30 bg-precisur-dark-900/50 text-center"
              >
                <div className="text-3xl mb-3">{asset.icon}</div>
                <div className="font-heading text-sm font-semibold text-foreground/70 mb-1">
                  {asset.label}
                </div>
                <div className="text-xs text-foreground/40">{asset.desc}</div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.3}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-foreground/60 text-lg leading-relaxed mb-8">
              Uruguay tiene un sector agropecuario altamente relevante para
              su economía. El desarrollo de tecnologías propias de agricultura
              de precisión representa una oportunidad para fortalecer
              capacidades nacionales, formar talento tecnológico y generar
              conocimiento local.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                "Reducir dependencia tecnológica",
                "Integrar universidades y productores",
                "Desarrollar herramientas adaptadas al territorio",
                "Impulsar innovación agropecuaria",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-precisur-green flex-shrink-0" />
                  <span className="text-sm text-foreground/60">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
