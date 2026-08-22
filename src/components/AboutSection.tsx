"use client";

import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Compass,
  Cpu,
  Code,
  CheckCircle2,
  Zap,
  ChevronDown,
  Flame,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CAMP_INFO } from "@/lib/constants";
import AnimatedContent from "./ui/AnimatedContent";

export default function AboutSection() {
  const [openScopeIndex, setOpenScopeIndex] = useState<number | null>(0);
  const [openMissionIndex, setOpenMissionIndex] = useState<number | null>(null);

  const toggleScope = (index: number) => {
    setOpenScopeIndex(openScopeIndex === index ? null : index);
  };

  const toggleMission = (index: number) => {
    setOpenMissionIndex(openMissionIndex === index ? null : index);
  };

  const staffObjectives = [
    {
      icon: Compass,
      title: "ส่งเสริมจิตอาสา & จิตวิญญาณความเป็นครู",
      subtitle: "Mission 01",
      description:
        "ปลูกฝังจิตสำนึกจิตอาสา ส่งเสริมจิตวิญญาณความเป็นครู ถ่ายทอดความรู้ และลงพื้นที่ชุมชนเพื่อสนับสนุนการศึกษา ณ โรงเรียนโนนสูงพิทยาคาร",
      cardBg: "bg-cc-blue text-white",
      iconBg: "bg-white text-cc-blue",
      badge: "VOLUNTEER SPIRIT",
    },
    {
      icon: Cpu,
      title: "Comclick Innovation Pitching",
      subtitle: "Mission 02",
      description:
        "ร่วมเป็นพี่เลี้ยงจัดกิจกรรม Comclick Innovation Pitching พาน้องๆ ฝึกคิดสร้างสรรค์โครงงานนวัตกรรมดิจิทัล และนำเสนอผลงานอย่างมั่นใจ",
      cardBg: "bg-cc-bronze text-white",
      iconBg: "bg-white text-cc-bronze",
      badge: "INNOVATION & PITCHING",
    },
    {
      icon: GraduationCap,
      title: "วิชาการแนะแนวสายอาชีพ & คณะใน มข.",
      subtitle: "Mission 03",
      description:
        "ถ่ายทอดประสบการณ์ตรง แนะแนวทางศึกษาต่อระดับอุดมศึกษา และสายอาชีพดิจิทัลตามคณะต่าง ๆ ในมหาวิทยาลัยขอนแก่น",
      cardBg: "bg-cc-coral text-white",
      iconBg: "bg-white text-cc-coral",
      badge: "CAREER GUIDANCE",
    },
  ];

  const staffLearningScopes = [
    {
      icon: GraduationCap,
      title: "วิชาการแนะแนวสายอาชีพ & คณะใน มข.",
      tag: "CAREER & EDUCATION GUIDANCE",
      shortDesc: "จัดเวทีย่อยและบูธ ถ่ายทอดประสบการณ์จริง เปิดมุมมองการเรียนต่อในมหาวิทยาลัยขอนแก่นและสายอาชีพเทคโนโลยี",
      details: [
        "🎤 จัดเวทีย่อยและบูธแนะแนวคณะ/สาขาวิชาต่าง ๆ ในมหาวิทยาลัยขอนแก่นอย่างใกล้ชิด",
        "💼 แชร์ประสบการณ์การเรียน ชีวิตในรั้วมหาวิทยาลัย และเส้นทางสายอาชีพด้านดิจิทัล & เทคโนโลยี",
        "🧭 เปิดโอกาสให้น้องมัธยมได้ซักถามข้อสงสัย ไขข้อข้องใจเรื่องระบบ TCAS และการเตรียม Portfolio",
      ],
      color: "border-cc-blue bg-blue-50/40",
      accentBg: "bg-cc-blue text-white",
      iconColor: "text-cc-blue bg-blue-100",
    },
    {
      icon: Code,
      title: "Comclick Innovation Pitching Workshop",
      tag: "INNOVATION & PITCHING",
      shortDesc: "ร่วมเป็นโค้ชประจำกลุ่ม ดูแลกิจกรรมเวิร์กช็อปนวัตกรรม ฝึกทักษะการแก้ปัญหา และเตรียมความพร้อมในการ Pitching บนเวที",
      details: [
        "💡 ร่วมเป็นพี่เลี้ยง (Mentor/Coach) ประจำกลุ่ม ช่วยน้องๆ พัฒนาแนวคิดโครงงานผ่านกระบวนการ Design Thinking",
        "💻 ให้คำแนะนำการประยุกต์ใช้เทคโนโลยี, AI และเครื่องมือดิจิทัลในการสร้างสรรค์ชิ้นงาน",
        "🚀 ฝึกฝนทักษะการนำเสนอผลงาน (Pitching) เทคนิคการพูดบนเวที และการตอบคำถามกรรมการอย่างมั่นใจ",
      ],
      color: "border-cc-coral bg-rose-50/40",
      accentBg: "bg-cc-coral text-white",
      iconColor: "text-cc-coral bg-rose-100",
    },
    {
      icon: Sparkles,
      title: "นันทนาการฐาน Wild Game, รอบกองไฟ & Big Cleaning",
      tag: "RECREATION & VOLUNTEER",
      shortDesc: "คุมกิจกรรมฐาน Wild Game สุดเร้าใจ กิจกรรมรอบกองไฟอันแสนอบอุ่น และร่วมจิตอาสา Big Cleaning ทำความสะอาดโรงเรียน",
      details: [
        "🎯 วางแผนและดำเนินกิจกรรมฐานเกมสันทนาการ (Wild Game) ที่สนุกสนาน ปลอดภัย และละลายพฤติกรรม",
        "🔥 ร่วมสร้างบรรยากาศแห่งความประทับใจในคืนรอบกองไฟ (Campfire Night) และกิจกรรมผูกข้อมือรับน้อง",
        "🧹 ลงแรงร่วมกิจกรรมจิตอาสา Big Cleaning Day ทำความสะอาดและปรับปรุงภูมิทัศน์โรงเรียนเป้าหมาย",
      ],
      color: "border-cc-yellow bg-amber-50/40",
      accentBg: "bg-cc-yellow text-cc-navy",
      iconColor: "text-amber-700 bg-amber-100",
    },
  ];

  const staffBenefits = [
    {
      icon: Award,
      title: "เกียรติบัตรคณะทำงาน & ชั่วโมงกิจกรรม (Official Staff Certificate)",
      description:
        "ผู้เข้าร่วมเป็นทีมงานพี่ค่ายที่ผ่านการเตรียมงานและจัดกิจกรรม จะได้รับเกียรติบัตรรับรองการเป็นคณะทำงานจากคณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น พร้อมทั้งสามารถนำไปยื่นสะสมชั่วโมงกิจกรรมนักศึกษา และสะสมผลงาน (Portfolio) ได้",
      highlight: "เกียรติบัตรรับรองจากคณะศึกษาศาสตร์ มข. & ชั่วโมงกิจกรรม",
    },
    {
      icon: HeartHandshake,
      title: "ประสบการณ์ทำงานจริง & มิตรภาพพี่น้องสตาฟ",
      description:
        "ได้ฝึกทักษะการทำงานเป็นทีม การบริหารจัดการ การแก้ปัญหาหน้างานจริง พร้อมสร้างเครือข่ายมิตรภาพอันเหนียวแน่นระหว่างเพื่อนสตาฟหลากคณะและครูในชุมชน",
      highlight: "ประสบการณ์ทำงานจริง & มิตรภาพเหนียวแน่น",
    },
  ];

  return (
    <section id="about" className="py-24 bg-cc-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cc-navy text-white text-xs font-mono font-bold uppercase tracking-wider shadow-solid-sm">
            <Zap className="w-4 h-4 text-cc-yellow" />
            <span>STAFF MISSION & CAMP OVERVIEW</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-cc-navy tracking-tight leading-tight">
            ทำความรู้จัก <span className="text-cc-blue">ComClick 20</span> <br className="hidden sm:inline" />
            & ภารกิจสำหรับพี่ค่าย
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed">
            มาร่วมเป็นส่วนหนึ่งของทีมงานสตาฟ ในโครงการบริการวิชาการสัญจร ส่งต่อทักษะดิจิทัลและความสุขให้น้องๆ มัธยมศึกษาตอนปลาย ณ โรงเรียนโนนสูงพิทยาคาร
          </p>
        </div>

        {/* 1. Target Audience & Organizer Overview Block */}
        <AnimatedContent distance={40} duration={0.6}>
          <div className="p-7 sm:p-10 rounded-3xl bg-white border-3 border-cc-navy shadow-solid-lg space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-cc-navy/15">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cc-cream text-cc-navy font-mono text-xs font-bold border border-cc-navy">
                  <Users className="w-4 h-4 text-cc-coral" />
                  <span>TARGET SCHOOL & STAFF COMMUNITY</span>
                </div>
                <h3 className="font-display font-black text-2xl text-cc-navy">
                  เป้าหมายค่าย & การทำงานของทีมพี่ค่าย
                </h3>
              </div>
              <a
                href={CAMP_INFO.organizerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cc-cream hover:bg-cc-yellow/30 text-cc-navy text-xs font-bold border-2 border-cc-navy shadow-solid-sm transition-all self-start lg:self-auto"
              >
                <span>คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น</span>
                <ExternalLink className="w-3.5 h-3.5 text-cc-blue" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destination School */}
              <div className="p-5 rounded-2xl bg-cc-cream/60 border-2 border-cc-navy space-y-2">
                <div className="flex items-center gap-2 font-display font-black text-cc-navy text-base">
                  <CheckCircle2 className="w-5 h-5 text-cc-coral flex-shrink-0" />
                  <span>โรงเรียนเป้าหมายที่พวกเราจะไปจัดค่าย</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-7">
                  น้องๆ ระดับชั้น<strong>มัธยมศึกษาตอนปลาย</strong> ณ{" "}
                  <a
                    href={CAMP_INFO.locationMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cc-coral font-bold underline hover:text-cc-blue inline-flex items-center gap-1"
                  >
                    <span>{CAMP_INFO.targetSchool}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  โรงเรียนในพื้นที่ส่วนภูมิภาคที่ต้องการการสนับสนุนและเติมเต็มทักษะดิจิทัล
                </p>
              </div>

              {/* Staff Team */}
              <div className="p-5 rounded-2xl bg-cc-cream/60 border-2 border-cc-navy space-y-2">
                <div className="flex items-center gap-2 font-display font-black text-cc-navy text-base">
                  <GraduationCap className="w-5 h-5 text-cc-blue flex-shrink-0" />
                  <span>ทีมผู้จัดทำ & เปิดรับสตาฟทุกคณะ</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-7">
                  จัดทำโดยนักศึกษาสาขาวิชาคอมพิวเตอร์ศึกษา ชั้นปีที่ 1 - 4{" "}
                  <a
                    href={CAMP_INFO.organizerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cc-blue font-bold underline hover:text-cc-coral"
                  >
                    คณะศึกษาศาสตร์ มข.
                  </a>{" "}
                  และ<strong>เปิดรับสมัครนักศึกษาชั้นปีที่ 1 - 3 ทุกสาขาวิชาใน มข.</strong> มาร่วมเป็นทีมงานพี่ค่าย Comclick ครั้งที่ 20
                </p>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* 2. Objectives / Staff Mission (3 Cards) */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-display font-black text-2xl sm:text-4xl text-cc-navy">
              ภารกิจและเป้าหมายของทีมพี่ค่าย <span className="text-cc-coral">(Staff Mission)</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-normal">
              3 ภารกิจหลักที่ทีมสตาฟจะร่วมกันขับเคลื่อนเพื่อสร้างการเรียนรู้และรอยยิ้มให้น้องค่าย
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staffObjectives.map((obj, idx) => {
              const Icon = obj.icon;
              return (
                <AnimatedContent
                  key={idx}
                  distance={40}
                  direction="vertical"
                  duration={0.6}
                  delay={idx * 0.1}
                >
                  <div
                    className={`h-full p-6 sm:p-7 rounded-3xl border-3 border-cc-navy shadow-solid hover:translate-x-0.5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 ${obj.cardBg}`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border-2 border-cc-navy shadow-sm ${obj.iconBg}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/15 border border-black/20">
                          {obj.badge}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-80 block mb-1">
                          {obj.subtitle}
                        </span>
                        <h4 className="font-display font-black text-xl tracking-tight leading-snug">
                          {obj.title}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm leading-relaxed font-normal opacity-95">
                        {obj.description}
                      </p>
                    </div>
                  </div>
                </AnimatedContent>
              );
            })}
          </div>
        </div>

        {/* 3. Scope of Activity Design (Drop Box / Accordion Dropdown) */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cc-yellow text-cc-navy border-2 border-cc-navy text-xs font-mono font-black uppercase shadow-solid-sm">
              <BookOpen className="w-3.5 h-3.5 text-cc-navy" />
              <span>ACTIVITY SCOPE & RESPONSIBILITIES</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-4xl text-cc-navy">
              ขอบเขตกิจกรรมที่พวกเราสตาฟจะร่วมจัด <span className="text-cc-blue">(Scope of Activities)</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-normal">
              คลิกเปิดดูรายละเอียดขอบเขตงานแต่ละกิจกรรมที่พี่ค่ายจะได้ร่วมลงมือทำจริง
            </p>
          </div>

          {/* Interactive Drop Box List */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {staffLearningScopes.map((scope, idx) => {
              const Icon = scope.icon;
              const isOpen = openScopeIndex === idx;

              return (
                <AnimatedContent key={idx} distance={20} duration={0.4} delay={idx * 0.05}>
                  <div
                    className={`rounded-3xl border-3 border-cc-navy shadow-solid transition-all overflow-hidden bg-white ${
                      isOpen ? "ring-2 ring-cc-navy/10" : ""
                    }`}
                  >
                    {/* Header Button / Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleScope(idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-cc-cream/40 transition-colors focus:outline-none cursor-pointer"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-2xl border-2 border-cc-navy shadow-solid-sm flex items-center justify-center flex-shrink-0 transition-transform ${
                            isOpen ? "scale-105" : ""
                          } ${scope.iconColor}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-cc-navy ${scope.accentBg}`}
                            >
                              {scope.tag}
                            </span>
                          </div>
                          <h4 className="font-display font-black text-base sm:text-lg text-cc-navy leading-snug mt-1 truncate sm:whitespace-normal">
                            {scope.title}
                          </h4>
                        </div>
                      </div>

                      {/* Animated Chevron Indicator */}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className={`w-9 h-9 rounded-xl border-2 border-cc-navy flex items-center justify-center font-bold flex-shrink-0 transition-colors ${
                          isOpen ? "bg-cc-coral text-white" : "bg-cc-cream text-cc-navy"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    {/* Expandable Drop Box Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="scope-content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="px-5 sm:px-6 pb-6 pt-1 border-t-2 border-cc-navy/10 space-y-4 font-normal"
                          >
                            {/* Summary Paragraph */}
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-cc-cream/60 p-3.5 rounded-2xl border border-cc-navy/15">
                              {scope.shortDesc}
                            </p>

                            {/* Detailed Bullet Points */}
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-cc-navy block">
                                รายละเอียดและบทบาทหน้าที่ของพี่ค่ายในส่วนนี้:
                              </span>
                              <div className="space-y-2">
                                {scope.details.map((detail, dIdx) => (
                                  <div
                                    key={dIdx}
                                    className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 bg-gray-50/80 p-3 rounded-xl border border-gray-200"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-cc-coral mt-2 flex-shrink-0" />
                                    <span className="leading-relaxed">{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedContent>
              );
            })}
          </div>
        </div>

        {/* 4. Staff Benefits & Deliverables (สิ่งที่พี่ค่ายจะได้รับ) */}
        <div className="p-8 sm:p-10 rounded-3xl bg-cc-navy text-white border-3 border-cc-navy shadow-solid-lg space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cc-coral text-white text-xs font-mono font-bold uppercase tracking-wider border border-white/20">
              <Award className="w-4 h-4 text-cc-yellow" />
              <span>WHAT STAFF GETS</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-4xl text-white">
              สิ่งที่พี่ค่าย / สตาฟ จะได้รับจากการสมัครเข้าร่วม
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-light">
              นอกจากรอยยิ้มและความภูมิใจแล้ว นี่คือผลลัพธ์ที่คุณจะได้รับกลับไปตลอดการเป็นส่วนหนึ่งของ ComClick 20
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staffBenefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/10 border-2 border-white/20 space-y-3 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cc-yellow text-cc-navy font-bold flex items-center justify-center border border-white/30 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-black text-lg text-white">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light">
                    {item.description}
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 rounded-lg bg-cc-coral/80 text-white text-xs font-bold border border-white/20">
                      ✓ {item.highlight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
