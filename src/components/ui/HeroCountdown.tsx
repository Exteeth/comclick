"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  phase: "before_start" | "active" | "expired";
}

export default function HeroCountdown({
  startDate = "2026-08-24T09:00:00+07:00",
  targetDate = "2026-08-29T23:59:59+07:00",
  showTitle = true,
}: {
  startDate?: string;
  targetDate?: string;
  showTitle?: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    phase: "before_start",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = (): TimeLeft => {
      const now = +new Date();
      const start = +new Date(startDate);
      const end = +new Date(targetDate);

      // Phase 1: Before Registration Opens (Countdown to Start Time: 24 ส.ค. 09:00 น.)
      if (now < start) {
        const diff = start - now;
        return {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          phase: "before_start",
        };
      }

      // Phase 2: Active Registration (Countdown to Deadline: 29 ส.ค. 23:59 น.)
      if (now >= start && now < end) {
        const diff = end - now;
        return {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          phase: "active",
        };
      }

      // Phase 3: Registration Closed
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        phase: "expired",
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, targetDate]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 py-1 opacity-50">
        <Clock className="w-3.5 h-3.5 text-cc-coral animate-spin" />
        <span className="text-[11px] text-white/60">กำลังคำนวณเวลา...</span>
      </div>
    );
  }

  if (timeLeft.phase === "expired") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cc-coral/20 border border-cc-coral text-cc-coral text-xs font-bold">
        <span>ปิดรับสมัครเรียบร้อยแล้ว</span>
      </div>
    );
  }

  const timeUnits = [
    { label: "วัน", value: timeLeft.days },
    { label: "ชม.", value: timeLeft.hours },
    { label: "นาที", value: timeLeft.minutes },
    { label: "วิ.", value: timeLeft.seconds },
  ];

  const isBeforeStart = timeLeft.phase === "before_start";

  return (
    <div className="flex flex-col items-center lg:items-start gap-1.5 w-full">
      {showTitle && (
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/80 tracking-wider uppercase">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isBeforeStart ? "bg-cc-yellow" : "bg-cc-coral"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isBeforeStart ? "bg-cc-yellow" : "bg-cc-coral"
              }`}
            ></span>
          </span>
          <Clock className={`w-3 h-3 ${isBeforeStart ? "text-cc-yellow" : "text-cc-coral"}`} />
          <span>
            {isBeforeStart
              ? "นับถอยหลังเปิดรับสมัครพี่ค่าย"
              : "ระบบเปิดรับสมัครอยู่ • นับถอยหลังปิดรับสมัคร"}
          </span>
        </div>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2">
        {timeUnits.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className="flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] px-2 py-1 rounded-xl bg-white/[0.08] border border-white/15 backdrop-blur-md">
              <span className="font-mono font-black text-sm sm:text-lg text-cc-yellow leading-none">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[8px] sm:text-[9px] text-white/60 font-semibold mt-0.5">
                {unit.label}
              </span>
            </div>
            {index < timeUnits.length - 1 && (
              <span className="text-white/30 font-mono font-bold text-xs pb-2">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
