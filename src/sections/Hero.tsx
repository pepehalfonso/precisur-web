"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const HeroParticles = dynamic(
  () => import("@/components/HeroParticles"),
  { ssr: false }
);

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-precisur-dark-900 via-precisur-dark-800 to-precisur-dark-900" />

      <HeroParticles />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-precisur-green/10 border border-precisur-green/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-precisur-green animate-pulse" />
            <span className="text-xs font-mono text-precisur-green uppercase tracking-widest">
              Agricultura de Precisión · Uruguay
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-heading text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-foreground">TECNOLOGÍA PARA</span>
          <br />
          <span className="text-precisur-green">ENTENDER</span>
          <br />
          <span className="text-foreground/70">LO QUE OCURRE</span>
          <br />
          <span className="text-foreground/70">ANTES DE APLICAR.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-foreground/50 max-w-2xl mx-auto mb-10 font-light"
        >
          Simulación. Meteorología. Geografía. Ingeniería.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#simulacion"
            className="px-8 py-4 bg-precisur-green text-precisur-dark-900 font-semibold rounded hover:bg-precisur-green-dark transition-colors duration-300"
          >
            Explorar Simulación
          </a>
          <a
            href="#colaboracion"
            className="px-8 py-4 border border-foreground/20 text-foreground/70 font-semibold rounded hover:border-precisur-green/50 hover:text-precisur-green transition-colors duration-300"
          >
            Colaborar
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-foreground/20 rounded-full flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 bg-precisur-green rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
