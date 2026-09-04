"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

export default function LlamadoColaboracion() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="colaboracion"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center py-24 bg-precisur-dark-900 overflow-hidden"
    >
      <div className="absolute inset-0">
        <motion.div
          animate={isInView ? { opacity: [0.05, 0.15, 0.05] } : {}}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-precisur-green/5"
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <SectionReveal>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span className="text-xs font-mono text-precisur-green uppercase tracking-widest mb-8 block">
              Llamado a Colaboración
            </span>

            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8">
              <span className="text-foreground">
                LA TECNOLOGÍA AGRÍCOLA
              </span>
              <br />
              <span className="text-foreground">DEL FUTURO</span>
              <br />
              <span className="text-foreground/50">
                NO SE IMPORTA ÚNICAMENTE.
              </span>
              <br />
              <span className="text-precisur-green">
                TAMBIÉN SE INVESTIGA.
              </span>
              <br />
              <span className="text-precisur-green">SE PRUEBA.</span>
              <br />
              <span className="text-precisur-green">SE CONSTRUYE.</span>
              <br />
              <span className="text-foreground/40">EN URUGUAY.</span>
            </h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-foreground/50 text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Los proyectos tecnológicos complejos necesitan algo más que una
              idea. Necesitan conocimiento, infraestructura, validación y
              colaboración. Precisur ya comenzó a construir la base. El
              siguiente paso requiere un ecosistema dispuesto a impulsarla.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="mailto:info@precisur.uy"
                className="px-6 py-4 md:px-10 md:py-5 bg-precisur-green text-precisur-dark-900 font-heading font-bold text-base md:text-lg rounded hover:bg-precisur-green-dark transition-colors duration-300"
              >
                EXPLORAR UNA POSIBLE COLABORACIÓN
              </a>
            </motion.div>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}
