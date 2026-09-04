"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const nodes = [
  { label: "METEOROLOGÍA", x: 50, y: 10, color: "#06b6d4" },
  { label: "SENSORES", x: 20, y: 30, color: "#22c55e" },
  { label: "SATÉLITES", x: 80, y: 30, color: "#eab308" },
  { label: "PRECISUR", x: 50, y: 55, color: "#22c55e", main: true },
  { label: "SIMULAR", x: 25, y: 80, color: "#06b6d4" },
  { label: "ANALIZAR", x: 50, y: 80, color: "#8b5cf6" },
  { label: "OPTIMIZAR", x: 75, y: 80, color: "#f97316" },
];

const connections: [number, number][] = [
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [3, 6],
];

export default function Ecosistema() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-24 bg-precisur-dark-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-precisur-cyan uppercase tracking-widest mb-4 block">
              Ecosistema
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              UN SISTEMA
              <br />
              <span className="text-precisur-cyan">CONECTADO</span>
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Múltiples fuentes de información convergen en una plataforma
              de análisis integrado.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="relative max-w-3xl mx-auto aspect-[4/3]">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {connections.map(([from, to], i) => (
                <motion.line
                  key={i}
                  x1={nodes[from].x}
                  y1={nodes[from].y}
                  x2={nodes[to].x}
                  y2={nodes[to].y}
                  stroke="#1f3b33"
                  strokeWidth="0.3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    isInView
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                />
              ))}

              {nodes.map((node, i) => (
                <g key={i}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={node.main ? 3 : 2}
                    fill={node.color}
                    fillOpacity={0.2}
                    stroke={node.color}
                    strokeWidth={node.main ? 0.5 : 0.3}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                      isInView
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  />
                  <motion.text
                    x={node.x}
                    y={node.y + (node.main ? 6 : 5)}
                    textAnchor="middle"
                    fill={node.color}
                    fontSize="2.2"
                    fontFamily="monospace"
                    opacity={0.8}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                  >
                    {node.label}
                  </motion.text>
                </g>
              ))}
            </svg>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
