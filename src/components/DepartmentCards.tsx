"use client";

import React, { useState, useEffect } from "react";
import { DEPARTMENTS } from "@/lib/constants";
import { Department } from "@/lib/types";
import {
  Code2,
  Sparkles,
  Camera,
  HeartHandshake,
  ClipboardCheck,
  Hammer,
  ShieldAlert,
  ShieldCheck,
  Coins,
  Award,
  Utensils,
  CheckCircle,
  Users,
  ArrowUpRight,
  Info,
  Layers,
  X,
  Check,
} from "lucide-react";
import AnimatedContent from "./ui/AnimatedContent";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Sparkles,
  Camera,
  HeartHandshake,
  ClipboardCheck,
  Hammer,
  ShieldAlert,
  ShieldCheck,
  Coins,
  Award,
  Utensils,
};

export default function DepartmentCards({
  showAll = false,
}: {
  showAll?: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalDept, setActiveModalDept] = useState<Department | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModalDept) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModalDept]);

  const categories = [
    { id: "all", label: "ทั้งหมด (11 ฝ่าย)" },
    { id: "tech", label: "วิชาการ & เทคโนโลยี" },
    { id: "activity", label: "กิจกรรม & สันทนาการ" },
    { id: "support", label: "บริหาร ประสานงาน & สวัสดิการ" },
  ];

  const filteredDepts = DEPARTMENTS.filter((dept) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "tech") return ["academic", "tech-pr"].includes(dept.id);
    if (selectedCategory === "activity") return ["recreation", "protocol"].includes(dept.id);
    if (selectedCategory === "support")
      return [
        "fundraising",
        "discipline",
        "registration",
        "coordination",
        "medical",
        "venue",
        "catering-welfare",
      ].includes(dept.id);
    return true;
  });

  return (
    <section id="departments" className="py-24 bg-cc-cream border-t-2 border-cc-navy relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cc-coral text-white text-xs font-mono font-bold uppercase tracking-wider border-2 border-cc-navy shadow-solid-sm">
            <Users className="w-3.5 h-3.5" />
            <span>11 SPECIALIZED DEPARTMENTS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-cc-navy tracking-tight">
            ร่วมเป็นส่วนหนึ่งใน <span className="text-cc-blue">11 ฝ่ายหลัก</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-normal max-w-2xl mx-auto">
            เลือกฝ่ายที่ตรงกับความชอบและความถนัด คุณสามารถเลือกได้ทั้ง{" "}
            <strong className="text-cc-navy">อันดับที่ 1 (หลัก)</strong> และ{" "}
            <strong className="text-cc-navy">อันดับที่ 2 (สำรอง)</strong>
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold transition-all border-2 border-cc-navy touch-manipulation ${
                  selectedCategory === cat.id
                    ? "bg-cc-navy text-white shadow-solid-sm scale-105"
                    : "bg-white text-cc-navy hover:bg-cc-cream-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDepts.map((dept, idx) => {
            const IconComponent = iconMap[dept.icon] || Code2;
            return (
              <AnimatedContent
                key={dept.id}
                distance={30}
                direction="vertical"
                duration={0.5}
                delay={idx * 0.03}
              >
                <div className="h-full bg-white rounded-3xl border-3 border-cc-navy shadow-solid hover:translate-x-1 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 space-y-4 group">
                  <div className="space-y-4">
                    {/* Top Bar inside Card */}
                    <div className="flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white border-2 border-cc-navy shadow-solid-sm"
                        style={{ backgroundColor: dept.color }}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cc-cream text-cc-navy border-2 border-cc-navy">
                        รับ {dept.openSlots} คน
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 block">
                        {dept.badge}
                      </span>
                      <h3 className="font-display font-black text-lg text-cc-navy leading-snug group-hover:text-cc-blue transition-colors">
                        {dept.nameTh}
                      </h3>
                      <div className="text-[11px] text-gray-500 font-medium truncate">
                        {dept.nameEn}
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-normal line-clamp-3">
                      {dept.shortDesc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dept.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-cc-cream text-[10px] font-bold text-cc-navy border border-cc-navy/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-3 space-y-2 border-t-2 border-cc-navy/10">
                    <button
                      type="button"
                      onClick={() => setActiveModalDept(dept)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-cc-navy hover:text-cc-coral bg-cc-cream/60 hover:bg-cc-cream border-2 border-cc-navy/30 transition-all flex items-center justify-center gap-1.5 touch-manipulation active:scale-95 shadow-2xs"
                    >
                      <Info className="w-4 h-4 text-cc-coral flex-shrink-0" />
                      <span>ดูหน้าที่และคุณสมบัติเต็ม</span>
                    </button>

                    <a
                      href={`/apply?dept=${dept.id}`}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-cc-navy hover:bg-cc-coral transition-colors flex items-center justify-center gap-2 border-2 border-cc-navy shadow-solid-sm touch-manipulation active:translate-y-0.5"
                    >
                      <span>สมัครฝ่ายนี้</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </AnimatedContent>
            );
          })}
        </div>

        {/* View All Departments Link */}
        {!showAll && (
          <div className="mt-14 text-center">
            <a
              href="/departments"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white border-3 border-cc-navy text-cc-navy font-bold text-xs sm:text-sm shadow-solid hover:translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <Layers className="w-4 h-4 text-cc-coral" />
              <span>ดูข้อมูลเจาะลึก 11 ฝ่ายอย่างละเอียดในหน้าแยก →</span>
            </a>
          </div>
        )}
      </div>

      {/* Modal for Department Details (Mobile-First & Rock Solid) */}
      {activeModalDept && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalDept(null);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto"
          style={{ overscrollBehavior: "contain" }}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 max-h-[90dvh] overflow-y-auto border-3 border-cc-navy shadow-solid-lg relative my-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalDept(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 border-2 border-cc-navy flex items-center justify-center text-cc-navy font-bold transition-all shadow-solid-sm active:scale-90 z-20"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-5">
              {/* Header Info */}
              <div className="flex items-start sm:items-center gap-3.5 pr-8">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white text-2xl border-2 border-cc-navy shadow-solid-sm flex-shrink-0"
                  style={{ backgroundColor: activeModalDept.color }}
                >
                  {React.createElement(iconMap[activeModalDept.icon] || Code2, {
                    className: "w-6 h-6 sm:w-7 sm:h-7",
                  })}
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cc-cream text-cc-navy border border-cc-navy inline-block">
                    เปิดรับ {activeModalDept.openSlots} คน
                  </span>
                  <h3 className="font-display font-black text-lg sm:text-2xl text-cc-navy mt-1 leading-tight">
                    {activeModalDept.nameTh}
                  </h3>
                  <div className="text-[11px] sm:text-xs text-gray-500 font-medium">
                    {activeModalDept.nameEn}
                  </div>
                </div>
              </div>

              {/* Description Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-cc-cream border-2 border-cc-navy">
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
                  {activeModalDept.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2.5">
                <h4 className="font-display font-black text-xs sm:text-sm text-cc-navy flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cc-blue" />
                  ภาระหน้าที่และความรับผิดชอบ
                </h4>
                <ul className="space-y-2 bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-200">
                  {activeModalDept.responsibilities.map((r, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-gray-800 flex items-start gap-2.5 font-normal"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qualifications */}
              <div className="space-y-2.5">
                <h4 className="font-display font-black text-xs sm:text-sm text-cc-navy flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cc-coral" />
                  คุณสมบัติที่มองหา
                </h4>
                <ul className="space-y-2 bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-200">
                  {activeModalDept.qualifications.map((q, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-gray-800 flex items-start gap-2.5 font-normal"
                    >
                      <div className="w-2 h-2 rounded-full bg-cc-coral mt-1.5 flex-shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t-2 border-cc-navy/10 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`/apply?dept=${activeModalDept.id}`}
                  className="flex-1 py-3 px-5 rounded-xl bg-cc-coral text-white font-display font-bold text-xs sm:text-sm text-center border-2 border-cc-navy shadow-solid-sm hover:bg-cc-coral-dark transition-all touch-manipulation active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>เลือกสมัครฝ่ายนี้ (อันดับ 1)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveModalDept(null)}
                  className="py-2.5 sm:py-3 px-5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm hover:bg-gray-200 border-2 border-cc-navy/20 transition-colors touch-manipulation active:scale-95"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
