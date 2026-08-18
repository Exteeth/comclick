"use client";

import React from "react";
import {
  Code2,
  Users2,
  Award,
  Sparkles,
  Smile,
  Cpu,
  BookmarkCheck,
  Zap,
} from "lucide-react";
import { CAMP_INFO } from "@/lib/constants";
import AnimatedContent from "./ui/AnimatedContent";

export default function AboutSection() {
  const pillars = [
    {
      icon: Cpu,
      title: "เทคโนโลยี & นวัตกรรมยุคใหม่",
      description:
        "หลักสูตรการสอนที่ครอบคลุมทั้งการเขียนโปรแกรม, การประยุกต์ใช้ AI, หุ่นยนต์ และไอทีสำหรับเยาวชน",
      cardBg: "bg-cc-blue text-white",
      iconBg: "bg-white text-cc-blue",
      tag: "CORE ACADEMIC",
    },
    {
      icon: Smile,
      title: "สร้างรอยยิ้ม & สันทนาการอบอุ่น",
      description:
        "กิจกรรมเชื่อมสัมพันธ์ บรรยากาศเป็นกันเอง น้องๆ และพี่ๆ เติบโตและสร้างมิตรภาพร่วมกัน",
      cardBg: "bg-cc-yellow text-cc-navy",
      iconBg: "bg-white text-amber-600",
      tag: "HIGH ENERGY",
    },
    {
      icon: Users2,
      title: "การทำงานเป็นทีมหลากคณะ",
      description:
        "เปิดกว้างสำหรับนักศึกษาทุกคณะ ทุกชั้นปี ร่วมวางแผน บริหารจัดการ และแก้ปัญหาหน้างานจริง",
      cardBg: "bg-cc-coral text-white",
      iconBg: "bg-white text-cc-coral",
      tag: "COMMUNITY",
    },
    {
      icon: Award,
      title: "ทักษะชีวิต & พอร์ตโฟลิโอ",
      description:
        "สะสมประสบการณ์จริง เกียรติบัตรการเป็นคณะทำงานระดับมหาวิทยาลัย พัฒนาภาวะผู้นำ (Soft Skills)",
      cardBg: "bg-cc-bronze text-white",
      iconBg: "bg-white text-cc-bronze",
      tag: "PORTFOLIO",
    },
  ];

  return (
    <section id="about" className="py-24 bg-cc-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cc-navy text-white text-xs font-mono font-bold uppercase tracking-wider shadow-solid-sm">
            <Zap className="w-3.5 h-3.5 text-cc-yellow" />
            <span>CAMP STORY & CORE PILLARS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-cc-navy tracking-tight">
            ทำความรู้จัก <span className="text-cc-blue">ComClick 20</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed">
            {CAMP_INFO.nameTh} จัดขึ้นต่อเนื่องเป็นปีที่ 20 โดย
            {CAMP_INFO.organizerTh} เพื่อถ่ายทอดความรู้ด้านเทคโนโลยีสู่นักเรียนระดับมัธยมศึกษา
          </p>
        </div>

        {/* 2-Column Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left: Camp Narrative Block */}
          <AnimatedContent
            distance={50}
            direction="horizontal"
            duration={0.7}
            delay={0.1}
            className="lg:col-span-5"
          >
            <div className="h-full p-8 rounded-3xl bg-white border-3 border-cc-navy shadow-solid space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cc-cream text-cc-navy font-mono text-xs font-bold border border-cc-navy">
                  <BookmarkCheck className="w-4 h-4 text-cc-coral" />
                  <span>20 YEARS OF EXCELLENCE</span>
                </div>
                <h3 className="font-display font-black text-2xl text-cc-navy">
                  จุดเริ่มต้นสู่ทศวรรษที่ 2 สานฝันเทคโนโลยี
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-normal">
                  ตลอด 19 ปีที่ผ่านมา ค่าย Comclick ได้จุดประกายเยาวชนหลายพันคนให้ก้าวเข้าสู่วงการคอมพิวเตอร์และเทคโนโลยี ในครั้งที่ 20 นี้ เรามุ่งมั่นที่จะยกระดับรูปแบบค่ายให้ทันสมัยยิ่งขึ้น ทั้งด้านปัญญาประดิษฐ์ (AI), IoT, โค้ดดิ้ง และกิจกรรมกลุ่มที่ตอบโจทย์เด็กยุค Gen Alpha
                </p>
                <p className="text-sm text-gray-700 leading-relaxed font-normal">
                  การสมัครเป็นพี่ค่าย ไม่ใช่แค่การมาช่วยงาน แต่คือโอกาสในการทดลองลงมือทำจริง ไม่ว่าจะเป็นการออกแบบเวิร์กช็อป การเป็นพิธีกร การถ่ายทำสื่อมีเดีย หรือการดูแลจัดการระบบหลังบ้านแบบมืออาชีพ
                </p>
              </div>

              {/* Solid Tags Ribbon */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-lg bg-cc-blue text-white text-xs font-bold border border-cc-navy">
                  #DigitalLiteracy
                </span>
                <span className="px-3 py-1 rounded-lg bg-cc-coral text-white text-xs font-bold border border-cc-navy">
                  #QualityEducation
                </span>
                <span className="px-3 py-1 rounded-lg bg-cc-yellow text-cc-navy text-xs font-bold border border-cc-navy">
                  #TeamSynergy
                </span>
                <span className="px-3 py-1 rounded-lg bg-cc-bronze text-white text-xs font-bold border border-cc-navy">
                  #ComClickLegacy
                </span>
              </div>
            </div>
          </AnimatedContent>

          {/* Right: Solid 4-Pillars Bento Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <AnimatedContent
                  key={idx}
                  distance={40}
                  direction="vertical"
                  duration={0.6}
                  delay={idx * 0.08}
                >
                  <div
                    className={`h-full p-6 rounded-3xl border-3 border-cc-navy shadow-solid hover:translate-x-0.5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 ${pillar.cardBg}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border-2 border-cc-navy shadow-sm ${pillar.iconBg}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/10 border border-black/15">
                          {pillar.tag}
                        </span>
                      </div>

                      <h4 className="font-display font-black text-lg tracking-tight">
                        {pillar.title}
                      </h4>
                    </div>

                    <p className="text-xs leading-relaxed font-normal opacity-90">
                      {pillar.description}
                    </p>
                  </div>
                </AnimatedContent>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
