"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CAMP_INFO, DEPARTMENTS } from "@/lib/constants";
import { addApplication } from "@/lib/storage";
import { Application } from "@/lib/types";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Send,
  User,
  GraduationCap,
  Phone,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Search,
  Clock,
  Layers,
  ShieldAlert,
  Utensils,
  Check,
  HeartHandshake,
} from "lucide-react";

// Preset food allergy & dietary restriction options
const FOOD_ALLERGY_OPTIONS = [
  { id: "none", label: "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)", desc: "อาหารทั่วไปปกติ ไม่มีข้อจำกัด" },
  { id: "halal", label: "อาหารฮาลาล (อิสลาม)", desc: "ต้องการอาหารตามหลักศาสนาอิสลาม" },
  { id: "veg", label: "มังสวิรัติ (ไม่ทานเนื้อสัตว์)", desc: "ทานผัก/ไข่/นม หรือตามระบุ" },
  { id: "vegan", label: "อาหารเจ / วีแกน", desc: "งดเนื้อสัตว์และผักฉุน" },
  { id: "seafood", label: "แพ้อาหารทะเล", desc: "กุ้ง, ปู, หอย, หมึก ฯลฯ" },
  { id: "peanuts", label: "แพ้ถั่วลิสง / ถั่วเปลือกแข็ง", desc: "ถั่วลิสง, เม็ดมะม่วงฯ" },
  { id: "dairy", label: "แพ้นมวัว / แลคโตส", desc: "นม, เนย, ชีส" },
  { id: "egg", label: "แพ้ไข่", desc: "ไข่ไก่ / เมนูที่มีไข่" },
  { id: "gluten", label: "แพ้แป้งสาลี / กลูเตน", desc: "ขนมปัง, เบเกอรี่, เส้นบะหมี่" },
  { id: "no_beef", label: "ไม่ทานเนื้อวัว", desc: "งดเนื้อวัวทุกเมนู" },
];

export default function ApplicationForm() {
  const searchParams = useSearchParams();
  const preselectedDept = searchParams ? searchParams.get("dept") : null;
  const isPreviewMode = searchParams ? searchParams.get("preview") === "true" : false;

  const [regStatus, setRegStatus] = useState<"upcoming" | "open" | "closed">("upcoming");
  const [countdownTime, setCountdownTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  const [createdApplication, setCreatedApplication] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Title prefix state
  const [titlePrefix, setTitlePrefix] = useState<string>("นาย");
  const [nameInput, setNameInput] = useState<string>("");

  // Food Allergy / Dietary State
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([
    "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)",
  ]);
  const [otherAllergyNote, setOtherAllergyNote] = useState<string>("");

  // Form State: Core Fields
  const [formData, setFormData] = useState({
    studentId: "",
    phone: "",
    major: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    firstChoiceDeptId: preselectedDept || (DEPARTMENTS[0]?.id ?? "protocol"),
    secondChoiceDeptId: DEPARTMENTS[1]?.id ?? "fundraising",
    fallbackDeptChoice: "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร",
  });

  useEffect(() => {
    setMounted(true);

    const updateGateStatus = () => {
      const now = +new Date();
      const start = +new Date(CAMP_INFO.registrationStartDate);
      const end = +new Date(CAMP_INFO.registrationEndDate);

      if (now < start) {
        setRegStatus("upcoming");
        const diff = start - now;
        setCountdownTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else if (now >= start && now < end) {
        setRegStatus("open");
      } else {
        setRegStatus("closed");
      }
    };

    updateGateStatus();
    const interval = setInterval(updateGateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (preselectedDept && DEPARTMENTS.some((d) => d.id === preselectedDept)) {
      setFormData((prev) => ({ ...prev, firstChoiceDeptId: preselectedDept }));
    }
  }, [preselectedDept]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const toggleAllergy = (label: string) => {
    if (label === "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)") {
      setSelectedAllergies(["ทานได้ทุกอย่าง (ไม่แพ้อาหาร)"]);
      setOtherAllergyNote("");
      return;
    }

    // When selecting specific allergies, remove "ทานได้ทุกอย่าง"
    let updated = selectedAllergies.filter((item) => item !== "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)");
    if (updated.includes(label)) {
      updated = updated.filter((item) => item !== label);
    } else {
      updated.push(label);
    }

    if (updated.length === 0 && !otherAllergyNote.trim()) {
      updated = ["ทานได้ทุกอย่าง (ไม่แพ้อาหาร)"];
    }
    setSelectedAllergies(updated);
  };

  const getCleanFullName = () => {
    let clean = nameInput.trim();
    // Strip redundant typed prefixes if already typed
    clean = clean.replace(/^(นาย|นางสาว|นาง|น\.ส\.)\s*/, "");
    return `${titlePrefix}${clean}`;
  };

  const getFinalDietString = () => {
    if (selectedAllergies.includes("ทานได้ทุกอย่าง (ไม่แพ้อาหาร)")) {
      if (otherAllergyNote.trim()) {
        return `ทานได้ทุกอย่าง (หมายเหตุ: ${otherAllergyNote.trim()})`;
      }
      return "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)";
    }
    const items = [...selectedAllergies];
    if (otherAllergyNote.trim()) {
      items.push(`ระบุเพิ่มเติม: ${otherAllergyNote.trim()}`);
    }
    return items.length > 0 ? items.join(", ") : "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)";
  };

  const validateForm = (): boolean => {
    const cleanName = nameInput.trim().replace(/^(นาย|นางสาว|นาง|น\.ส\.)\s*/, "");
    if (!cleanName) {
      setErrorMessage("กรุณากรอก 1. ชื่อ - นามสกุล");
      return false;
    }
    if (!formData.studentId.trim()) {
      setErrorMessage("กรุณากรอก 2. รหัสนักศึกษา");
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      setErrorMessage("กรุณากรอก 3. เบอร์โทรศัพท์ที่ติดต่อได้ (เช่น 0891234567)");
      return false;
    }
    if (!formData.major.trim()) {
      setErrorMessage("กรุณากรอก 4. สาขาวิชา");
      return false;
    }
    if (formData.firstChoiceDeptId === formData.secondChoiceDeptId) {
      setErrorMessage("กรุณาเลือกฝ่ายอันดับที่ 1 และอันดับที่ 2 ไม่ซ้ำกัน");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const finalFullName = getCleanFullName();
      const finalDiet = getFinalDietString();

      const payload = {
        fullNameTh: finalFullName,
        studentId: formData.studentId.trim(),
        phone: formData.phone.trim().replace(/-/g, ""),
        major: formData.major.trim(),
        diet: finalDiet,
        firstChoiceDeptId: formData.firstChoiceDeptId,
        secondChoiceDeptId: formData.secondChoiceDeptId,
        fallbackDeptChoice: formData.fallbackDeptChoice,
        faculty: "คณะศึกษาศาสตร์",
      };

      // 1. Sync with Server API & Neon PostgreSQL Database
      try {
        await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (apiErr) {
        console.warn("API sync error, continuing with local store:", apiErr);
      }

      // 2. Save locally for instantaneous offline receipt
      const created = addApplication(payload as any);
      setCreatedApplication(created);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF5E36", "#FFC700", "#1B3B6F", "#2A9D8F"],
        });
      } catch (_) {}
    } catch (err: any) {
      setErrorMessage(err.message || "เกิดข้อผิดพลาดในการส่งใบสมัคร กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Gate: Registration is Upcoming
  if (mounted && regStatus === "upcoming" && !isPreviewMode) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-12 text-center space-y-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cc-yellow text-cc-navy border-2 border-cc-navy text-xs font-mono font-bold uppercase shadow-solid-sm">
            <Clock className="w-4 h-4 text-cc-coral" />
            <span>REGISTRATION STARTS SOON</span>
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <h1 className="font-display font-black text-2xl sm:text-4xl text-cc-navy tracking-tight">
              ระบบรับสมัครพี่ค่าย <br />
              <span className="text-cc-coral">{CAMP_INFO.nameEn}</span> กำลังจะเปิดรับสมัคร!
            </h1>
            <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed">
              เปิดรับสมัครพร้อมกันในวันที่ <strong>{CAMP_INFO.registrationPeriod}</strong>
            </p>
          </div>

          {/* Countdown Display */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto pt-2">
            <div className="bg-cc-cream p-3 sm:p-4 rounded-2xl border-2 border-cc-navy text-center shadow-solid-sm">
              <div className="font-display font-black text-2xl sm:text-4xl text-cc-navy">
                {String(countdownTime.days).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs font-mono font-bold text-gray-500 uppercase mt-1">วัน (Days)</div>
            </div>
            <div className="bg-cc-cream p-3 sm:p-4 rounded-2xl border-2 border-cc-navy text-center shadow-solid-sm">
              <div className="font-display font-black text-2xl sm:text-4xl text-cc-coral">
                {String(countdownTime.hours).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs font-mono font-bold text-gray-500 uppercase mt-1">ชม. (Hours)</div>
            </div>
            <div className="bg-cc-cream p-3 sm:p-4 rounded-2xl border-2 border-cc-navy text-center shadow-solid-sm">
              <div className="font-display font-black text-2xl sm:text-4xl text-cc-blue">
                {String(countdownTime.minutes).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs font-mono font-bold text-gray-500 uppercase mt-1">นาที (Mins)</div>
            </div>
            <div className="bg-cc-cream p-3 sm:p-4 rounded-2xl border-2 border-cc-navy text-center shadow-solid-sm">
              <div className="font-display font-black text-2xl sm:text-4xl text-emerald-600">
                {String(countdownTime.seconds).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs font-mono font-bold text-gray-500 uppercase mt-1">วินาที (Secs)</div>
            </div>
          </div>

          {/* Preparation Recommendation */}
          <div className="p-4 sm:p-5 rounded-2xl bg-cc-cream border-2 border-cc-navy text-left space-y-2 max-w-xl mx-auto">
            <div className="flex items-center gap-2 font-display font-black text-sm sm:text-base text-cc-navy">
              <Sparkles className="w-4 h-4 text-cc-coral" />
              <span>เตรียมตัวให้พร้อมก่อนเปิดรับสมัคร</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              ผู้สมัครสามารถศึกษารายละเอียดหน้าที่ คุณสมบัติ และแนวทางการทำงานของ <strong>11 ฝ่ายหลัก</strong> ล่วงหน้า เพื่อเตรียมเลือกฝ่ายอันดับ 1 และอันดับ 2 ได้ที่หน้าฝ่ายงาน
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="/departments"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cc-blue hover:bg-cc-navy text-white font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-cc-yellow" />
              <span>ดูข้อมูลเจาะลึก 11 ฝ่าย</span>
            </a>

            <a
              href="/committee"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-cc-cream text-cc-navy font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2"
            >
              <span>ดูทำเนียบพี่ค่าย</span>
            </a>

            <a
              href="/"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm transition-colors"
            >
              กลับหน้าหลัก
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. Gate: Registration is Closed
  if (mounted && regStatus === "closed" && !isPreviewMode) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-12 text-center space-y-6 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 border-2 border-red-500 text-xs font-mono font-bold uppercase shadow-solid-sm">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>REGISTRATION CLOSED</span>
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <h1 className="font-display font-black text-2xl sm:text-4xl text-cc-navy tracking-tight">
              ปิดรับสมัครพี่ค่ายเรียบร้อยแล้ว
            </h1>
            <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed">
              โครงการค่าย {CAMP_INFO.nameEn} สิ้นสุดระยะเวลาการเปิดรับสมัครเมื่อ <br />
              <strong className="text-cc-coral">{CAMP_INFO.registrationDeadline}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href="/status"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cc-coral text-white font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-cc-yellow" />
              <span>ตรวจสอบรายชื่อและสถานะการสมัคร</span>
            </a>

            <a
              href="/"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-cc-navy font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all"
            >
              กลับหน้าหลัก
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Form Card */}
      <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 border-b-2 border-cc-navy/15 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cc-yellow text-cc-navy border-2 border-cc-navy text-xs font-mono font-bold uppercase shadow-solid-sm">
            <Sparkles className="w-3.5 h-3.5 text-cc-coral" />
            <span>STAFF REGISTRATION FORM</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-cc-navy tracking-tight">
            แบบฟอร์มรับสมัครพี่ค่าย <span className="text-cc-blue">{CAMP_INFO.nameEn}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-normal">
            กรุณากรอกข้อมูลให้ครบถ้วนเพื่อใช้ในการคัดเลือกและติดต่อประสานงานทีมสตาฟ
          </p>
          <div className="pt-2 flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cc-cream border border-cc-navy/20 text-xs font-semibold text-cc-navy">
              <Clock className="w-3.5 h-3.5 text-cc-coral" />
              <span>เปิดระบบรับสมัคร: <strong>{CAMP_INFO.registrationPeriod}</strong></span>
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-500 text-red-700 flex items-center gap-3 text-xs sm:text-sm font-bold animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ========================================================= */}
          {/* Section 1: ข้อมูลส่วนตัว (1 - 4) */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-cc-blue text-white flex items-center justify-center font-bold text-xs border border-cc-navy">
                01
              </div>
              <h3 className="font-display font-black text-lg text-cc-navy">
                ข้อมูลส่วนตัวผู้สมัคร
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. ชื่อ - นามสกุล (Single Line Dropdown + Input) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  1. ชื่อ - นามสกุล <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-2">
                  {/* Prefix Dropdown */}
                  <select
                    value={titlePrefix}
                    onChange={(e) => {
                      setTitlePrefix(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-24 sm:w-28 px-3 py-3 rounded-xl border-2 border-cc-navy bg-cc-cream/40 text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer focus:bg-white focus:border-cc-blue shadow-sm flex-shrink-0"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>

                  {/* Name & Surname Input */}
                  <div className="relative flex-1">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="กรอกชื่อและนามสกุล เช่น สมชาย ใจดี"
                      value={nameInput}
                      onChange={(e) => {
                        setNameInput(e.target.value);
                        setErrorMessage(null);
                      }}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:bg-cc-cream-50 focus:border-cc-blue outline-none transition-all shadow-sm font-medium"
                    />
                  </div>
                </div>

                {nameInput.trim() && (
                  <p className="text-[11px] text-gray-500">
                    ชื่อเต็มที่จะบันทึก: <strong className="text-cc-navy">{getCleanFullName()}</strong>
                  </p>
                )}
              </div>

              {/* 2. รหัสนักศึกษา */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  2. รหัสนักศึกษา <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="เช่น 663050123-4"
                    value={formData.studentId}
                    onChange={(e) => updateField("studentId", e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-mono text-gray-800 placeholder-gray-400 focus:bg-cc-cream-50 focus:border-cc-blue outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* 3. เบอร์โทร (No dash placeholder) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  3. เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="เช่น 0891234567"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-mono text-gray-800 placeholder-gray-400 focus:bg-cc-cream-50 focus:border-cc-blue outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* 4. สาขา */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  4. สาขาวิชา <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="เช่น สาขาวิชาคอมพิวเตอร์ศึกษา, วิทยาการคอมพิวเตอร์ หรือสาขาอื่นๆ"
                    value={formData.major}
                    onChange={(e) => updateField("major", e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:bg-cc-cream-50 focus:border-cc-blue outline-none transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Section 2: ข้อมูลอาหาร & การแพ้อาหาร (Dietary Preferences) */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs border border-cc-navy">
                02
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-cc-navy flex items-center gap-2">
                  <span>ข้อมูลอาหาร & การแพ้อาหาร</span>
                  <Utensils className="w-4 h-4 text-emerald-600" />
                </h3>
                <p className="text-xs text-gray-500">
                  เลือกข้อจำกัดด้านอาหารหรืออาหารที่แพ้ เพื่อให้ฝ่ายสวัสดิการและอาหารเตรียมอาหารได้อย่างถูกต้อง
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-300 space-y-4">
              {/* Allergy Preset Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FOOD_ALLERGY_OPTIONS.map((opt) => {
                  const isChecked = selectedAllergies.includes(opt.label);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleAllergy(opt.label)}
                      className={`p-3 rounded-xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isChecked
                          ? opt.id === "none"
                            ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                            : "bg-cc-navy text-white border-cc-navy shadow-sm"
                          : "bg-white text-gray-800 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? "bg-white text-cc-navy border-white"
                            : "bg-gray-100 border-gray-300"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-snug">{opt.label}</div>
                        <div
                          className={`text-[11px] mt-0.5 leading-tight ${
                            isChecked ? "text-white/80" : "text-gray-500"
                          }`}
                        >
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Specific Allergy / Dietary Note Input */}
              <div className="space-y-1.5 pt-2 border-t border-emerald-200">
                <label className="block text-xs font-bold text-cc-navy flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ระบุอาหารที่แพ้ หรือข้อจำกัดเพิ่มเติม (ถ้ามี):</span>
                </label>
                <input
                  type="text"
                  placeholder="เช่น แพ้กุ้งอย่างรุนแรง (ผื่น/หายใจไม่ออก), แพ้ผงชูรส, ทานมังสวิรัติแบบดื่มนมได้ เป็นต้น"
                  value={otherAllergyNote}
                  onChange={(e) => {
                    setOtherAllergyNote(e.target.value);
                    if (e.target.value.trim() && selectedAllergies.includes("ทานได้ทุกอย่าง (ไม่แพ้อาหาร)")) {
                      setSelectedAllergies([]);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-emerald-300 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:border-cc-navy outline-none shadow-sm font-medium"
                />
              </div>

              {/* Summary Preview */}
              <div className="p-3 rounded-xl bg-white border border-emerald-300/80 text-[11px] text-gray-700 flex items-center gap-2">
                <span className="font-bold text-emerald-800 flex-shrink-0">🍽️ ข้อมูลอาหารที่จะบันทึก:</span>
                <span className="font-medium text-cc-navy truncate">
                  {getFinalDietString()}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Section 3: ฝ่ายที่ต้องการลงสมัคร (5 & 6) */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-cc-coral text-white flex items-center justify-center font-bold text-xs border border-cc-navy">
                03
              </div>
              <h3 className="font-display font-black text-lg text-cc-navy">
                5. ฝ่ายที่ต้องการลงสมัคร (2 อันดับ)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Choice 1 */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-blue-50/60 border-2 border-cc-blue">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  ฝ่ายที่ต้องการลง ฝ่ายที่ 1 (อันดับ 1) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.firstChoiceDeptId}
                  onChange={(e) => updateField("firstChoiceDeptId", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nameTh}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500">
                  {DEPARTMENTS.find((d) => d.id === formData.firstChoiceDeptId)?.shortDesc}
                </p>
              </div>

              {/* Choice 2 */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-orange-50/60 border-2 border-cc-coral">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  ฝ่ายที่ต้องการลง ฝ่ายที่ 2 (อันดับ 2) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.secondChoiceDeptId}
                  onChange={(e) => updateField("secondChoiceDeptId", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nameTh}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500">
                  {DEPARTMENTS.find((d) => d.id === formData.secondChoiceDeptId)?.shortDesc}
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Section 4: ถ้าไม่ติดอยากลงฝ่ายไหน (ข้อ 6) */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-cc-yellow text-cc-navy flex items-center justify-center font-bold text-xs border border-cc-navy">
                04
              </div>
              <h3 className="font-display font-black text-lg text-cc-navy">
                6. ถ้าไม่ติดอันดับที่ 1 และ 2 อยากลงฝ่ายไหน?
              </h3>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-cc-cream border-2 border-cc-navy space-y-2">
              <select
                value={formData.fallbackDeptChoice}
                onChange={(e) => updateField("fallbackDeptChoice", e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer shadow-sm"
              >
                <option value="ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร">
                  ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร (แนะนำ)
                </option>
                <optgroup label="หรือระบุเลือกฝ่ายสำรองเฉพาะเจาะจง">
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.nameTh}>
                      {dept.nameTh}
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="text-[11px] text-gray-600">
                💡 หากฝ่ายที่คุณเลือกทั้ง 2 อันดับมีผู้สมัครเต็ม คณะกรรมการจะพิจารณาจัดสรรตามตัวเลือกนี้
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-display font-black text-base sm:text-lg text-white bg-cc-navy hover:bg-cc-blue border-3 border-cc-navy shadow-solid transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังส่งใบสมัคร...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 text-cc-yellow" />
                  <span>ยืนยันและส่งใบสมัครพี่ค่าย Comclick 20</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal / Slip */}
      {createdApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-3 border-cc-navy shadow-solid-lg text-center space-y-6 animate-scaleUp">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto border-2 border-cc-navy shadow-solid-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
                APPLICATION SUBMITTED SUCCESSFULLY!
              </span>
              <h2 className="font-display font-black text-2xl text-cc-navy">
                ส่งใบสมัครพี่ค่ายเรียบร้อยแล้ว
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                ข้อมูลของคุณถูกบันทึกเข้าสู่ระบบเรียบร้อยแล้ว กรุณาเก็บรหัสใบสมัครนี้ไว้
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-2xl bg-cc-cream border-2 border-cc-navy text-left space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b border-cc-navy/10 pb-2 font-bold">
                <span className="text-gray-500">รหัสใบสมัคร:</span>
                <span className="text-cc-navy">{createdApplication.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ชื่อ - นามสกุล:</span>
                <span className="font-bold text-gray-800">{createdApplication.fullNameTh}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">รหัสนักศึกษา:</span>
                <span className="font-bold text-gray-800">{createdApplication.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">เบอร์โทรศัพท์:</span>
                <span className="font-bold text-gray-800">{createdApplication.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ข้อมูลอาหาร/แพ้อาหาร:</span>
                <span className="font-bold text-emerald-700">
                  {createdApplication.diet || "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ฝ่ายอันดับ 1:</span>
                <span className="font-bold text-cc-blue">
                  {DEPARTMENTS.find((d) => d.id === createdApplication.firstChoiceDeptId)?.nameTh}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ฝ่ายอันดับ 2:</span>
                <span className="font-bold text-cc-coral">
                  {DEPARTMENTS.find((d) => d.id === createdApplication.secondChoiceDeptId)?.nameTh}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="/status"
                className="flex-1 py-3 rounded-xl bg-cc-navy hover:bg-cc-blue text-white font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-cc-yellow" />
                <span>ไปที่หน้าตรวจสอบสถานะ</span>
              </a>
              <button
                onClick={() => {
                  setCreatedApplication(null);
                  setNameInput("");
                  setSelectedAllergies(["ทานได้ทุกอย่าง (ไม่แพ้อาหาร)"]);
                  setOtherAllergyNote("");
                  setFormData({
                    studentId: "",
                    phone: "",
                    major: "สาขาวิชาคอมพิวเตอร์ศึกษา",
                    firstChoiceDeptId: DEPARTMENTS[0]?.id ?? "protocol",
                    secondChoiceDeptId: DEPARTMENTS[1]?.id ?? "fundraising",
                    fallbackDeptChoice: "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร",
                  });
                }}
                className="py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-cc-navy font-bold text-xs sm:text-sm border-2 border-cc-navy/20 transition-all cursor-pointer"
              >
                สมัครเพิ่มอีกคน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
