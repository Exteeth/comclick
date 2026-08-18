"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1], // Apple / Linear deceleration curve
          },
        }}
        exit={{
          opacity: 0,
          y: -10,
          filter: "blur(2px)",
          transition: {
            duration: 0.2,
            ease: [0.32, 0, 0.67, 0],
          },
        }}
        className="w-full flex-grow flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
