"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Tecnología", href: "#tecnologia" },
    { label: "Simulación", href: "#simulacion" },
    { label: "Evidencia", href: "#evidencia" },
    { label: "Smart Spray", href: "#smart-spray" },
    { label: "Colaboración", href: "#colaboracion" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-precisur-dark-900/90 backdrop-blur-md border-b border-precisur-dark-600/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-precisur-green/20 border border-precisur-green/40 flex items-center justify-center">
            <span className="text-precisur-green font-mono text-sm font-bold">
              P
            </span>
          </div>
          <span className="font-heading text-lg font-semibold tracking-tight">
            PRECISUR
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/60 hover:text-precisur-green transition-colors duration-300 font-medium"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#colaboracion"
            className="px-4 py-2 text-sm font-semibold bg-precisur-green/10 border border-precisur-green/30 text-precisur-green rounded hover:bg-precisur-green/20 transition-colors duration-300"
          >
            Colaborar
          </a>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          aria-label="Menú"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-foreground block"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-foreground block"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-foreground block"
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-precisur-dark-900/95 backdrop-blur-md border-b border-precisur-dark-600/50 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-foreground/70 hover:text-precisur-green transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#colaboracion"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 text-sm font-semibold bg-precisur-green/10 border border-precisur-green/30 text-precisur-green rounded text-center"
              >
                Colaborar
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
