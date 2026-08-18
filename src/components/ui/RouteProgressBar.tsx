"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Flash progress bar on route change
    setLoading(true);
    setProgress(30);

    const t1 = setTimeout(() => setProgress(75), 100);
    const t2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 280);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none overflow-hidden bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-cc-coral via-cc-yellow to-cc-blue transition-all duration-300 ease-out shadow-sm"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
