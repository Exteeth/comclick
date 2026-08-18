"use client";

import React, { useState } from "react";
import { TIMELINE, CAMP_INFO } from "@/lib/constants";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import AnimatedContent from "./ui/AnimatedContent";

export default function ScheduleTimeline() {
  const [activeDayTab, setActiveDayTab] = useState<number>(1);

  const campScheduleDays = [
    {
      day: 1,
      date: "17 ตุลาคม 2569",
      title: "Day 1: จุดประกายก้าวแรก (Ignite the Spark)",
      items: [
        { time: "07:30 - 08:30", event: "ลงทะเบียนน้องค่าย รับป้ายชื่อ เสื้อค่าย และเอกสาร" },
        { time: "08:30 - 09:30", event: "พิธีเปิดค่าย Comclick 20 และแนะนำพี่ค่ายทุกฝ่าย" },
        { time: "09:30 - 11:30", event: "กิจกรรมสันทนาการ ละลายพฤติกรรม และแบ่งบ้านค่าย" },
        { time: "11:30 - 12:30", event: "รับประทานอาหารกลางวันร่วมกัน" },
        { time: "12:30 - 16:30", event: "Workshop 1: Fundamentals of Programming & Micro:bit IoT" },
        { time: "16:30 - 18:00", event: "กิจกรรม Walk Rally กระชับมิตรพิชิตภารกิจ" },
        { time: "18:00 - 19:30", event: "มื้อเย็น & อาบน้ำเตรียมตัวเข้าสู่กิจกรรมค่ำ" },
        { time: "19:30 - 21:00", event: "กิจกรรมสานสัมพันธ์และสรุปการเรียนรู้ประจำวัน" },
      ],
    },
    {
      day: 2,
      date: "18 ตุลาคม 2569",
      title: "Day 2: นวัตกรรม AI & ComClick Night",
      items: [
        { time: "07:00 - 08:00", event: "กายบริหารยามเช้า และอาหารเช้าเติมพลัง" },
        { time: "08:30 - 11:30", event: "Workshop 2: Artificial Intelligence & Generative Tools for Future" },
        { time: "11:30 - 12:30", event: "รับประทานอาหารกลางวัน" },
        { time: "12:30 - 16:30", event: "Mini Hackathon: สร้างสรรค์โครงงานนวัตกรรมดิจิทัลประจำกลุ่ม" },
        { time: "16:30 - 18:00", event: "เตรียมความพร้อมการแสดงค่ำคืนพิเศษ" },
        { time: "18:00 - 19:00", event: "อาหารเย็นสไตล์บุฟเฟต์ปาร์ตี้" },
        { time: "19:00 - 22:00", event: "ComClick Night 2026: การแสดงรอบกองไฟ ดนตรีสด และความทรงจำ" },
      ],
    },
    {
      day: 3,
      date: "19 ตุลาคม 2569",
      title: "Day 3: Pitching & ปัจฉิมนิเทศส่งต่อแรงบันดาลใจ",
      items: [
        { time: "07:30 - 08:30", event: "อาหารเช้าและเก็บสัมภาระ" },
        { time: "08:30 - 11:30", event: "Project Showcase & Pitching: นำเสนอโครงงานต่อน้องๆ และคณะกรรมการ" },
        { time: "11:30 - 12:30", event: "อาหารกลางวัน" },
        { time: "12:30 - 14:30", event: "พิธีมอบเกียรติบัตร และมอบรางวัลโครงงานยอดเยี่ยม" },
        { time: "14:30 - 16:00", event: "พิธีบายศรีสู่ขวัญ ผูกข้อมือ สรุปความประทับใจ และพิธีปิดค่าย" },
        { time: "16:00 เป็นต้นไป", event: "ถ่ายภาพรวมร่วมกันและส่งน้องค่ายเดินทางกลับโดยสวัสดิภาพ" },
      ],
    },
  ];

  return (
    <section id="schedule" className="py-24 bg-cc-navy text-white relative border-y-2 border-cc-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cc-yellow text-cc-navy text-xs font-mono font-bold uppercase tracking-wider border border-white/20 shadow-solid-sm">
            <Calendar className="w-3.5 h-3.5" />
            <span>ROADMAP & EVENT TIMELINE</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            กำหนดการสำคัญ <span className="text-cc-yellow">ComClick 20</span>
          </h2>
          <p className="text-sm sm:text-base text-white/70 font-light">
            ติดตามทุกก้าวสำคัญตั้งแต่ขั้นตอนการเปิดรับสมัคร สัมภาษณ์ จนถึงวันจัดค่ายจริง
          </p>
        </div>

        {/* 6-Step Recruitment Timeline Grid */}
        <div className="mb-20">
          <h3 className="font-display font-black text-xl text-cc-yellow mb-8 text-center">
            กระบวนการรับสมัครและคัดเลือกพี่ค่าย
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TIMELINE.map((item, idx) => (
              <AnimatedContent
                key={idx}
                distance={30}
                direction="vertical"
                duration={0.6}
                delay={idx * 0.05}
              >
                <div
                  className={`h-full p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    item.highlight
                      ? "bg-cc-coral text-white border-white shadow-solid"
                      : "bg-white/10 text-white border-white/20 hover:border-white/40"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-3xl font-mono">
                        {item.phase}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${
                          item.status === "active"
                            ? "bg-cc-yellow text-cc-navy border-cc-navy"
                            : "bg-white/15 text-white/80 border-white/20"
                        }`}
                      >
                        {item.status === "active" ? "กำลังเปิดรับ" : "เร็วๆ นี้"}
                      </span>
                    </div>

                    <div className="text-xs font-bold flex items-center gap-1.5 opacity-90">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>

                    <h4 className="font-display font-black text-lg">
                      {item.title}
                    </h4>

                    <p className="text-xs leading-relaxed font-light opacity-85">
                      {item.description}
                    </p>
                  </div>

                  {item.highlight && (
                    <div className="pt-3 border-t border-white/30 flex items-center gap-1.5 text-xs font-bold text-cc-yellow">
                      <CheckCircle2 className="w-4 h-4 text-cc-yellow" />
                      <span>จุดเน้นสำคัญ อย่าลืมเตรียมพร้อม!</span>
                    </div>
                  )}
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>

        {/* 3-Day Camp Schedule Preview */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white text-cc-navy border-3 border-cc-navy shadow-solid-lg">
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-mono font-bold text-cc-coral uppercase tracking-widest block">
              EVENT ITINERARY PREVIEW
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-cc-navy">
              กำหนดการ 3 วัน 2 คืน ในค่าย Comclick 20
            </h3>
            <p className="text-xs text-gray-500">
              สถานที่: {CAMP_INFO.locationTh}
            </p>
          </div>

          {/* Day Tabs */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {campScheduleDays.map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDayTab(d.day)}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 border-cc-navy transition-all ${
                  activeDayTab === d.day
                    ? "bg-cc-coral text-white shadow-solid-sm scale-105"
                    : "bg-cc-cream text-cc-navy hover:bg-white"
                }`}
              >
                <span>วันที่ {d.day} ({d.date.split(" ")[0]} ต.ค.)</span>
              </button>
            ))}
          </div>

          {/* Active Day Content */}
          {campScheduleDays
            .filter((d) => d.day === activeDayTab)
            .map((dayData) => (
              <div key={dayData.day} className="space-y-3 max-w-3xl mx-auto">
                <div className="text-center pb-3 border-b-2 border-cc-navy/10">
                  <h4 className="font-display font-black text-lg text-cc-navy">
                    {dayData.title}
                  </h4>
                  <div className="text-xs text-gray-500 font-mono">{dayData.date}</div>
                </div>

                <div className="space-y-2">
                  {dayData.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-cc-cream border-2 border-cc-navy flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 hover:bg-white transition-colors"
                    >
                      <div className="font-mono font-bold text-xs sm:text-sm text-cc-blue sm:w-36 flex-shrink-0 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cc-blue" />
                        <span>{item.time}</span>
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-cc-navy">
                        {item.event}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
