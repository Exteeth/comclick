"use client";

import React, { useState } from "react";
import { TIMELINE, CAMP_INFO } from "@/lib/constants";
import { Calendar, Clock, CheckCircle2, MapPin, ExternalLink } from "lucide-react";
import AnimatedContent from "./ui/AnimatedContent";

export default function ScheduleTimeline() {
  const [activeDayTab, setActiveDayTab] = useState<number>(0);

  const campScheduleDays = [
    {
      day: 0,
      label: "27 พ.ย. (วันเตรียมการ)",
      date: "27 พฤศจิกายน 2569",
      title: "วันเตรียมการ: เดินทางสู่พื้นที่ค่าย จัดเตรียมสถานที่ และประสานชุมชน",
      items: [
        { time: "08:00 – 14:30 น.", event: "เดินทางจากคณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น สู่โรงเรียนผาอินทร์แปลงวิทยา อำเภอเอราวัณ จังหวัดเลย" },
        { time: "14:30 – 15:00 น.", event: "ประชุมชี้แจงรายละเอียดในการทำกิจกรรม" },
        { time: "15:00 – 16:30 น.", event: "แต่ละฝ่ายจัดเตรียมสถานที่ในการทำกิจกรรม" },
        { time: "16:30 – 18:30 น.", event: "ลงพื้นที่ชุมชนเพื่อขอความอนุเคราะห์สนับสนุนกิจกรรม" },
        { time: "18:30 – 18:45 น.", event: "เดินทางกลับโรงเรียนผาอินทร์แปลงวิทยา" },
        { time: "18:45 – 19:45 น.", event: "รับประทานอาหารเย็น" },
        { time: "19:45 – 22:00 น.", event: "ประชุมเตรียมการจัดกิจกรรม" },
      ],
    },
    {
      day: 1,
      label: "28 พ.ย. (Day 1)",
      date: "28 พฤศจิกายน 2569",
      title: "Day 1: พิธีเปิดค่าย, กิจกรรมกลุ่มสัมพันธ์, แนะแนววิชาการ & นันทนาการฐาน Wild game",
      items: [
        { time: "07:00 – 08:30 น.", event: "รับประทานอาหารเช้า" },
        { time: "08:30 – 09:00 น.", event: "ลงทะเบียนน้องค่าย" },
        { time: "09:00 – 09:30 น.", event: "พิธีเปิดกิจกรรมค่าย Comclick 20" },
        { time: "09:30 – 11:00 น.", event: "กิจกรรมกลุ่มสัมพันธ์ และชี้แจงกฎค่าย" },
        { time: "11:00 – 12:00 น.", event: "ฝ่ายวิชาการนำเสนอวิชา / แบ่งกลุ่มวิชา" },
        { time: "12:00 – 13:00 น.", event: "รับประทานอาหารกลางวัน" },
        { time: "13:00 – 14:30 น.", event: "กิจกรรมวิชาการการแนะแนวตามสายอาชีพและคณะต่าง ๆ ภายในมหาวิทยาลัยขอนแก่น" },
        { time: "14:30 – 14:45 น.", event: "รับประทานอาหารว่าง" },
        { time: "14:45 – 16:00 น.", event: "กิจกรรมวิชาการการแนะแนวตามสายอาชีพและคณะต่าง ๆ ภายในมหาวิทยาลัยขอนแก่น (ต่อ)" },
        { time: "16:00 – 17:00 น.", event: "กิจกรรมกลุ่มสัมพันธ์" },
        { time: "17:00 – 18:00 น.", event: "พักผ่อนตามอัธยาศัย" },
        { time: "18:00 – 19:00 น.", event: "รับประทานอาหารเย็น" },
        { time: "19:00 – 21:00 น.", event: "กิจกรรมนันทนาการฐาน Wild game" },
        { time: "21:00 น. เป็นต้นไป", event: "ประชุมและสะท้อนผลการดำเนินกิจกรรม" },
      ],
    },
    {
      day: 2,
      label: "29 พ.ย. (Day 2)",
      date: "29 พฤศจิกายน 2569",
      title: "Day 2: กิจกรรม Comclick Innovation Pitching & กิจกรรมรอบกองไฟ",
      items: [
        { time: "07:00 – 07:30 น.", event: "ลงทะเบียน" },
        { time: "07:30 – 08:30 น.", event: "รับประทานอาหารเช้า" },
        { time: "08:30 – 09:00 น.", event: "กิจกรรมนันทนาการยามเช้า" },
        { time: "09:00 – 12:00 น.", event: "กิจกรรม “Comclick Innovation Pitching” (ช่วงเช้า)" },
        { time: "12:00 – 13:00 น.", event: "รับประทานอาหารกลางวัน" },
        { time: "13:00 – 14:45 น.", event: "กิจกรรม “Comclick Innovation Pitching” (ช่วงบ่าย Part 1)" },
        { time: "14:45 – 15:00 น.", event: "รับประทานอาหารว่าง" },
        { time: "15:00 – 16:30 น.", event: "กิจกรรม “Comclick Innovation Pitching” (ช่วงบ่าย Part 2)" },
        { time: "16:30 – 17:45 น.", event: "พักผ่อนตามอัธยาศัย" },
        { time: "17:45 – 19:00 น.", event: "รับประทานอาหารเย็น" },
        { time: "19:00 – 22:00 น.", event: "กิจกรรมรอบกองไฟ (Campfire & Comclick Night)" },
        { time: "22:00 น. เป็นต้นไป", event: "ประชุมและสะท้อนผลการดำเนินกิจกรรม" },
      ],
    },
    {
      day: 3,
      label: "30 พ.ย. (Day 3)",
      date: "30 พฤศจิกายน 2569",
      title: "Day 3: นำเสนอผลงาน, พิธีปิดค่าย, กิจกรรมอำลา & Big Cleaning",
      items: [
        { time: "07:00 – 07:30 น.", event: "ลงทะเบียน" },
        { time: "07:30 – 08:30 น.", event: "รับประทานอาหารเช้า" },
        { time: "08:30 – 10:15 น.", event: "กิจกรรมกลุ่มสัมพันธ์ และกิจกรรมนำเสนอผลงานจากการเข้าร่วมกิจกรรมวิชาการคอมพิวเตอร์" },
        { time: "10:15 – 10:30 น.", event: "รับประทานอาหารว่าง" },
        { time: "10:30 – 11:15 น.", event: "พิธีปิดกิจกรรมค่ายเทคโนโลยีวิชาการจับมือน้องคลิก" },
        { time: "11:15 – 12:00 น.", event: "กิจกรรมอำลาพี่ค่ายน้องค่าย" },
        { time: "12:00 – 13:00 น.", event: "รับประทานอาหารกลางวัน" },
        { time: "13:00 – 15:00 น.", event: "กิจกรรม Big Cleaning ทำความสะอาดพื้นที่ภายในบริเวณโรงเรียน" },
        { time: "15:00 น. เป็นต้นไป", event: "เดินทางกลับคณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น โดยสวัสดิภาพ" },
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

        {/* 4-Day Camp Schedule Preview */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white text-cc-navy border-3 border-cc-navy shadow-solid-lg">
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-mono font-bold text-cc-coral uppercase tracking-widest block">
              OFFICIAL EVENT ITINERARY
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-cc-navy">
              กำหนดการค่าย Comclick 20 (27 - 30 พ.ย. 2569)
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
              <span className="text-xs text-gray-600 font-medium inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cc-coral flex-shrink-0" />
                <span>สถานที่: <strong>{CAMP_INFO.locationTh}</strong></span>
              </span>
              <a
                href={CAMP_INFO.locationMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cc-cream hover:bg-cc-yellow/30 text-cc-navy text-[11px] font-bold border border-cc-navy transition-all"
              >
                <span>ดูแผนที่ Google Maps</span>
                <ExternalLink className="w-3 h-3 text-cc-blue" />
              </a>
            </div>
          </div>

          {/* Day Tabs */}
          <div className="flex justify-center gap-2.5 mb-8 flex-wrap">
            {campScheduleDays.map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDayTab(d.day)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 border-cc-navy transition-all cursor-pointer ${
                  activeDayTab === d.day
                    ? "bg-cc-coral text-white shadow-solid-sm scale-105"
                    : "bg-cc-cream text-cc-navy hover:bg-white"
                }`}
              >
                <span>{d.label}</span>
              </button>
            ))}
          </div>

          {/* Active Day Content */}
          {campScheduleDays
            .filter((d) => d.day === activeDayTab)
            .map((dayData) => (
              <div key={dayData.day} className="space-y-3 max-w-5xl mx-auto">
                <div className="text-center pb-4 border-b-2 border-cc-navy/10">
                  <h4 className="font-display font-black text-xl sm:text-2xl text-cc-navy">
                    {dayData.title}
                  </h4>
                  <div className="text-xs sm:text-sm text-gray-500 font-mono mt-1">{dayData.date}</div>
                </div>

                <div className="space-y-2.5 pt-2">
                  {dayData.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-3.5 sm:p-4 rounded-2xl bg-cc-cream border-2 border-cc-navy flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-5 hover:bg-white hover:border-cc-blue hover:shadow-solid-sm transition-all duration-200"
                    >
                      <div className="px-3 py-1.5 rounded-xl bg-white border border-cc-navy/20 font-mono font-bold text-xs sm:text-sm text-cc-blue flex-shrink-0 flex items-center gap-2 whitespace-nowrap shadow-sm sm:min-w-[175px]">
                        <Clock className="w-3.5 h-3.5 text-cc-blue flex-shrink-0" />
                        <span>{item.time}</span>
                      </div>
                      <div className="text-xs sm:text-sm sm:text-base font-semibold text-cc-navy leading-relaxed flex-1">
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
