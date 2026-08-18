import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] bg-cc-navy flex flex-col items-center justify-center text-white select-none">
      {/* Background Ambient Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-cc-blue/20 blur-[90px] animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4">
        {/* Logo Container */}
        <div className="w-16 h-16 rounded-2xl bg-cc-cream p-2.5 flex items-center justify-center border-2 border-cc-yellow shadow-solid animate-bounce">
          <img
            src="/img/logo.webp"
            alt="ComClick 20 Loading"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <div className="font-display font-black text-xl text-white tracking-wider">
            COMCLICK <span className="text-cc-yellow">20</span>
          </div>
          <div className="text-[11px] text-white/70 font-mono tracking-widest uppercase">
            Loading Staff Portal...
          </div>
        </div>

        {/* Sleek Line Indicator */}
        <div className="w-44 h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-cc-coral via-cc-yellow to-cc-blue rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  );
}
