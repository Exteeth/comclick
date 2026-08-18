"use client";

import React, { ReactNode, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AnimatedListProps {
  className?: string;
  children: ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ className = "", children, delay = 1000 }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    );

    useEffect(() => {
      if (index < childrenArray.length - 1) {
        const timeout = setTimeout(() => {
          setIndex((prevIndex) => prevIndex + 1);
        }, delay);

        return () => clearTimeout(timeout);
      }
    }, [index, delay, childrenArray.length]);

    const itemsToShow = useMemo(
      () => childrenArray.slice(0, index + 1).reverse(),
      [index, childrenArray]
    );

    return (
      <div className={`flex flex-col items-center gap-2.5 ${className}`}>
        <AnimatePresence>
          {itemsToShow.map((item, i) => (
            <motion.div
              key={(item as React.ReactElement).key || i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, originY: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full"
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";

export default AnimatedList;
