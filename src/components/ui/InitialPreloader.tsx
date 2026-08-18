"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InitialPreloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only run on client
    const hasSeen = sessionStorage.getItem("cc20_preloaded");
    if (hasSeen) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("cc20_preloaded", "1");
          }, 350);
          return 100;
        }
        const increment = Math.floor(Math.random() * 25) + 15;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.65,
              ease: [0.76, 0, 0.24, 1], // Custom curtain slide curve
            },
          }}
          className="fixed inset-0 z-[99999] bg-cc-navy flex flex-col items-center justify-center text-white select-none overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute w-[480px] h-[480px] rounded-full bg-cc-blue/15 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-cc-coral/15 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-5 text-center px-4 max-w-sm">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-20 h-20 rounded-3xl bg-cc-cream p-3 flex items-center justify-center border-3 border-cc-navy shadow-solid"
            >
              <img
                src="/img/logo.webp"
                alt="ComClick 20 Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Titles */}
            <div className="space-y-1.5">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="font-display font-black text-2xl tracking-tight text-white"
              >
                COMCLICK <span className="text-cc-yellow">20</span>
              </motion.div>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="text-xs text-white/70 font-light"
              >
                ค่ายเทคโนโลยีวิชาการ จับมือน้องคลิก ครั้งที่ 20
              </motion.p>
            </div>

            {/* Progress Bar & Percentage */}
            <div className="w-56 space-y-2 pt-2">
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden border border-white/20 p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-cc-coral via-cc-yellow to-cc-blue rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                <span>INITIALIZING</span>
                <span className="font-bold text-cc-yellow">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
