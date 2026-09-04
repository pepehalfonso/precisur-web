"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface CounterProps {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export default function Counter({
  end,
  suffix = "",
  label,
  duration = 2,
}: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-precisur-green mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-foreground/50 uppercase tracking-wider font-medium">
        {label}
      </div>
    </motion.div>
  );
}
