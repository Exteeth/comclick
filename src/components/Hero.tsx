"use client";

import React from "react";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  Flame,
  Sparkles,
} from "lucide-react";
import { CAMP_INFO } from "@/lib/constants";
import CardSwap, { Card } from "./ui/CardSwap";
import RotatingText from "./ui/RotatingText";
import HeroCountdown from "./ui/HeroCountdown";

export default function Hero() {
  const swapCards = [
    {
      id: 1,
      tag: "CAREER & ACADEMIC",
      tagColor: "bg-cc-blue text-white",
      title: "แนะแนวสายอาชีพ & คณะใน มข.",
      desc: "กิจกรรมวิชาการแนะแนวการศึกษาต่อระดับอุดมศึกษา และสายอาชีพดิจิทัล",
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
      badge: "DAY 1",
    },
    {
      id: 2,
      tag: "WILD GAME & RECREATION",
      tagColor: "bg-cc-yellow text-cc-navy",
      title: "นันทนาการฐาน Wild Game",
      desc: "ระเบิดความมันส์ ละลายพฤติกรรม และกระชับมิตรภาพแบบจัดเต็ม",
      img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
      badge: "HIGH ENERGY",
    },
    {
      id: 3,
      tag: "INNOVATION PITCHING",
      tagColor: "bg-cc-coral text-white",
      title: "Comclick Innovation Pitching",
      desc: "เวิร์กช็อปพัฒนาและ Pitching ผลงานนวัตกรรมดิจิทัลแห่งอนาคต",
      img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
      badge: "DAY 2",
    },
    {
      id: 4,
      tag: "CAMPFIRE & VOLUNTEER",
      tagColor: "bg-cc-bronze text-white",
      title: "กิจกรรมรอบกองไฟ & Big Cleaning",
      desc: "ค่ำคืนรอบกองไฟสุดอบอุ่น และร่วมจิตอาสาทำความสะอาดโรงเรียนส่งท้าย",
      img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop",
      badge: "NIGHT & FINAL",
    },
  ];

  return (
    <section className="relative min-h-[100dvh] min-h-screen flex items-center justify-center pt-28 pb-16 sm:pt-32 sm:pb-20 bg-cc-navy text-white overflow-hidden border-b-2 border-cc-navy w-full">
      {/* Background 1: Lightweight Ambient Glow Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-cc-blue/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] rounded-full bg-cc-coral/15 blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-[380px] h-[380px] rounded-full bg-cc-yellow/10 blur-[90px]" />
      </div>

      {/* Background 2: Watermark Camp Logo (Blurred, Tilted 14deg & Fit Within Screen on the Right) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-end overflow-hidden z-1 select-none pr-4 sm:pr-12 lg:pr-20">
        <div className="w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] lg:w-[620px] lg:h-[620px] max-h-[80vh] flex items-center justify-center relative rotate-[14deg] opacity-[0.24] lg:opacity-[0.28] filter blur-[4px] lg:blur-[6px] transition-all">
          <img
            src="/img/logo.webp"
            alt="ComClick 20 Background Logo Watermark"
            className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(94,151,211,0.3)]"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Narrative */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            
            {/* 20th Edition Eyebrow Badge with Integrated RotatingText */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cc-yellow flex-shrink-0" />
              <span>20TH ANNIVERSARY • </span>
              <RotatingText
                texts={["INNOVATION PITCHING", "WILD GAME", "CAMPFIRE NIGHT", "CAREER GUIDANCE"]}
                mainClassName="text-cc-yellow font-bold inline-block"
                staggerFrom="last"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-120%", opacity: 0 }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2400}
              />
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              ก้าวสู่ทศวรรษที่ 2 <br />
              <span className="text-cc-yellow">COMCLICK </span>
              <span className="text-cc-blue">20</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-white/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              {CAMP_INFO.sloganTh} มาร่วมเป็นพลังสำคัญในการแนะแนวสายอาชีพ จัดเวิร์กช็อป Innovation Pitching และเปิดประสบการณ์ค่ายจริง ณ โรงเรียนโนนสูงพิทยาคาร จ.อุดรธานี
            </p>

            {/* High-Impact Primary CTA Buttons (Top Prominence) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              <a
                href="/apply"
                className="w-full sm:w-auto px-8 py-4 sm:py-4.5 rounded-2xl bg-cc-coral hover:bg-[#e84e3d] text-white font-display font-black text-base sm:text-lg border-2 border-white shadow-[4px_4px_0px_#eccb7d] sm:shadow-[5px_5px_0px_#eccb7d] hover:shadow-[2px_2px_0px_#eccb7d] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
                <span className="relative z-10">กรอกใบสมัครเป็นพี่ค่าย</span>
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-45 group-hover:scale-110 transition-all text-cc-yellow relative z-10 flex-shrink-0" />
              </a>

              <a
                href="#gallery"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/25 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 hover:translate-x-0.5 hover:-translate-y-0.5"
              >
                <Flame className="w-4 h-4 text-cc-yellow flex-shrink-0" />
                <span>ดูภาพบรรยากาศค่าย</span>
              </a>
            </div>

            {/* Streamlined Schedule & Live Countdown Pill Card (Compact & Balanced) */}
            <div className="p-3.5 sm:p-4 rounded-3xl bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-solid-sm space-y-3 max-w-xl mx-auto lg:mx-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Camp Dates */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-left">
                  <div className="w-8 h-8 rounded-xl bg-cc-blue text-white flex items-center justify-center flex-shrink-0 border border-white/20 shadow-sm">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">วันจัดค่ายจริง</div>
                    <div className="text-xs sm:text-sm font-bold text-white truncate">{CAMP_INFO.campDates}</div>
                  </div>
                </div>

                {/* Registration Period & Deadline */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-left">
                  <div className="w-8 h-8 rounded-xl bg-cc-coral text-white flex items-center justify-center flex-shrink-0 border border-white/20 shadow-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">เปิด - ปิดรับสมัคร</div>
                    <div className="text-xs sm:text-sm font-bold text-cc-yellow">
                      {CAMP_INFO.registrationPeriod}
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Countdown Timer */}
              <div className="pt-2 border-t border-white/10">
                <HeroCountdown
                  startDate={CAMP_INFO.registrationStartDate}
                  targetDate={CAMP_INFO.registrationEndDate}
                  showTitle={true}
                />
              </div>
            </div>
          </div>

          {/* Right Column: React Bits CardSwap */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[340px] sm:min-h-[440px] w-full overflow-hidden max-w-full">
            <div className="w-full h-full min-h-[340px] sm:min-h-[420px] relative flex items-center justify-center scale-[0.82] sm:scale-95 lg:scale-100 origin-center">
              <CardSwap
                width={420}
                height={300}
                cardDistance={40}
                verticalDistance={30}
                delay={2400}
                duration={0.65}
                pauseOnHover={true}
                skewAmount={3}
                easing="elastic"
              >
                {swapCards.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-cc-navy text-white rounded-3xl border-3 border-cc-navy overflow-hidden cursor-pointer flex flex-col justify-between"
                  >
                    {/* Card Image Area */}
                    <div className="relative h-44 w-full bg-cc-navy overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase border border-cc-navy shadow-sm ${item.tagColor}`}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-0.5 rounded-md bg-cc-navy/80 text-white text-[9px] font-mono font-bold border border-white/30">
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Area */}
                    <div className="p-4 bg-white text-cc-navy flex-1 flex flex-col justify-between border-t-2 border-cc-navy">
                      <div>
                        <h3 className="font-display font-black text-sm sm:text-base leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-600 mt-1 line-clamp-2 font-normal">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-cc-blue">
                        <span>คลิกเพื่อดูรายละเอียดเพิ่มเติม</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
