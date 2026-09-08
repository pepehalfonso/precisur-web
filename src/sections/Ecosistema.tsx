"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionReveal from "@/components/SectionReveal";

const nodes = [
  { label: "METEOROLOGÍA", x: 50, y: 8, color: "#06b6d4" },
  { label: "SENSORES", x: 18, y: 28, color: "#22c55e" },
  { label: "SATÉLITES", x: 82, y: 28, color: "#eab308" },
  { label: "PRECISUR", x: 50, y: 50, color: "#22c55e", main: true },
  { label: "SIMULAR", x: 22, y: 74, color: "#06b6d4" },
  { label: "ANALIZAR", x: 50, y: 74, color: "#8b5cf6" },
  { label: "OPTIMIZAR", x: 78, y: 74, color: "#f97316" },
  { label: "SUGERIR", x: 50, y: 94, color: "#22c55e" },
];

const connections: [number, number][] = [
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [4, 7],
  [5, 7],
  [6, 7],
];

function AnimatedLine({
  x1, y1, x2, y2, delay, inView,
}: {
  x1: number; y1: number; x2: number; y2: number; delay: number; inView: boolean;
}) {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return (
    <g>
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#1f3b33"
        strokeWidth="0.3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1, delay }}
      />
      <motion.circle
        r="0.8"
        fill="#22c55e"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }}
        transition={{
          duration: 2.5,
          delay: delay + 1,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        <animateMotion
          dur="2.5s"
          begin={`${delay + 1}s`}
          repeatCount="indefinite"
          path={`M${x1},${y1} L${x2},${y2}`}
        />
      </motion.circle>
    </g>
  );
}

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
              Meteorología, geometría de lotes, parámetros operativos y modelos
              físicos convergen en un entorno de análisis unificado.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="relative max-w-3xl mx-auto aspect-square md:aspect-[4/3]">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {connections.map(([from, to], i) => (
                <AnimatedLine
                  key={i}
                  x1={nodes[from].x}
                  y1={nodes[from].y}
                  x2={nodes[to].x}
                  y2={nodes[to].y}
                  delay={0.5 + i * 0.1}
                  inView={isInView}
                />
              ))}

              {nodes.map((node, i) => (
                <g key={i}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={node.main ? 3 : node.label === "SUGERIR" ? 2.5 : 2}
                    fill={node.color}
                    fillOpacity={0.2}
                    stroke={node.color}
                    strokeWidth={node.main ? 0.5 : 0.3}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  />
                  <motion.text
                    x={node.x}
                    y={node.y + (node.main ? 6 : node.label === "SUGERIR" ? 5.5 : 5)}
                    textAnchor="middle"
                    fill={node.color}
                    fontSize="3.5"
                    style={{ fontFamily: "var(--font-mono)" }}
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
