"use client";

import React from "react";
import { Sparkles, Code2, Heart, Award, Users, Terminal, Cpu, Lightbulb } from "lucide-react";

export default function MarqueeRibbon() {
  const items = [
    { label: "COMCLICK 20TH ANNIVERSARY", icon: Sparkles, bg: "bg-cc-navy text-white" },
    { label: "CODING & PYTHON LAB", icon: Code2, bg: "bg-cc-blue text-white" },
    { label: "AI & ROBOTICS WORKSHOP", icon: Cpu, bg: "bg-cc-yellow text-cc-navy" },
    { label: "RECREATION & MC MASTER", icon: Sparkles, bg: "bg-cc-coral text-white" },
    { label: "STUDENT MENTORSHIP", icon: Heart, bg: "bg-cc-navy text-white" },
    { label: "MINI HACKATHON 2026", icon: Terminal, bg: "bg-cc-blue text-white" },
    { label: "8 SPECIALIZED DEPARTMENTS", icon: Users, bg: "bg-cc-bronze text-white" },
    { label: "OFFICIAL CERTIFICATE", icon: Award, bg: "bg-cc-yellow text-cc-navy" },
  ];

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden py-3 bg-cc-navy border-y-2 border-cc-navy relative select-none">
      <div className="animate-marquee flex items-center gap-3">
        {repeated.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider border border-white/20 shadow-sm ${item.bg}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
