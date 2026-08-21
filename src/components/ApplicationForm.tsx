"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CAMP_INFO, DEPARTMENTS, EDUCATION_MAJORS } from "@/lib/constants";
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
  // Title prefix state
  const [titlePrefix, setTitlePrefix] = useState<string>("นาย");
  const [nameInput, setNameInput] = useState<string>("");

  // Food Allergy / Dietary Drop box State
  const [dietChoice, setDietChoice] = useState<string>("ทานได้ทุกอย่าง (ไม่แพ้อาหาร)");
  const [otherAllergyNote, setOtherAllergyNote] = useState<string>("");

  // Faculty & Major State
  const [facultyType, setFacultyType] = useState<"edu" | "other">("edu");
  const [customFacultyName, setCustomFacultyName] = useState<string>("");
  const [educationMajorChoice, setEducationMajorChoice] = useState<string>("สาขาวิชาคอมพิวเตอร์ศึกษา");
  const [customMajorName, setCustomMajorName] = useState<string>("");

  // Form State: Core Fields
  const [formData, setFormData] = useState({
    studentId: "",
    phone: "",
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

  const getCleanFullName = () => {
    let clean = nameInput.trim();
    // Strip redundant typed prefixes if already typed
    clean = clean.replace(/^(นาย|นางสาว|นาง|น\.ส\.)\s*/, "");
    return `${titlePrefix}${clean}`;
  };

  const getFinalFacultyString = (): string => {
    if (facultyType === "edu") {
      return "คณะศึกษาศาสตร์";
    }
    return customFacultyName.trim() || "คณะอื่นๆ (มข.)";
  };

  const getFinalMajorString = (): string => {
    if (facultyType === "edu") {
      if (educationMajorChoice === "สาขาอื่นๆ ในคณะศึกษาศาสตร์ (ระบุเอง)") {
        return customMajorName.trim() || "สาขาอื่นๆ ในคณะศึกษาศาสตร์";
      }
      return educationMajorChoice;
    }
    return customMajorName.trim() || "ไม่ระบุสาขา";
  };

  const getFinalDietString = () => {
    if (dietChoice === "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)") {
      if (otherAllergyNote.trim()) {
        return `ทานได้ทุกอย่าง (หมายเหตุ: ${otherAllergyNote.trim()})`;
      }
      return "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)";
    }
    if (dietChoice === "แพ้อื่นๆ / มีข้อจำกัดเฉพาะ") {
      return otherAllergyNote.trim()
        ? `แพ้อื่นๆ (${otherAllergyNote.trim()})`
        : "แพ้อื่นๆ (มีข้อจำกัดเฉพาะ)";
    }
    if (otherAllergyNote.trim()) {
      return `${dietChoice} (ระบุเพิ่มเติม: ${otherAllergyNote.trim()})`;
    }
    return dietChoice;
  };

  // Helper to format student ID as 9 digits + '-' + 1 digit (Total 10 digits)
  const formatStudentIdInput = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length > 9) {
      return `${digits.slice(0, 9)}-${digits.slice(9, 10)}`;
    }
    return digits;
  };

  // Helper to format phone number as digits only (Max 10 digits)
  const formatPhoneInput = (value: string): string => {
    return value.replace(/\D/g, "").slice(0, 10);
  };

  const validateForm = (): boolean => {
    const cleanName = nameInput.trim().replace(/^(นาย|นางสาว|นาง|น\.ส\.)\s*/, "");
    if (!cleanName) {
      setErrorMessage("กรุณากรอก 1. ชื่อ - นามสกุล");
      return false;
    }

    if (cleanName.length < 3 || !cleanName.includes(" ") || cleanName.split(" ").filter(Boolean).length < 2) {
      setErrorMessage("กรุณากรอกทั้งชื่อและนามสกุลให้ครบถ้วน (คั่นด้วยการเว้นวรรค เช่น สมชาย ใจดี)");
      return false;
    }

    const studentDigits = formData.studentId.replace(/\D/g, "");
    if (studentDigits.length !== 10) {
      setErrorMessage("รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก (รูปแบบ 663050123-4)");
      return false;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10 || !phoneDigits.startsWith("0")) {
      setErrorMessage("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักที่ถูกต้อง (เริ่มต้นด้วย 0 เช่น 0812345678)");
      return false;
    }

    if (facultyType === "other") {
      if (!customFacultyName.trim()) {
        setErrorMessage("กรุณากรอกชื่อคณะของคุณ (เช่น คณะวิทยาศาสตร์, คณะวิศวกรรมศาสตร์)");
        return false;
      }
      if (!customMajorName.trim()) {
        setErrorMessage("กรุณากรอกชื่อสาขาวิชาของคุณ");
        return false;
      }
    } else {
      if (educationMajorChoice === "สาขาอื่นๆ ในคณะศึกษาศาสตร์ (ระบุเอง)" && !customMajorName.trim()) {
        setErrorMessage("กรุณาระบุชื่อสาขาวิชาในคณะศึกษาศาสตร์ของคุณ");
        return false;
      }
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
      const finalFaculty = getFinalFacultyString();
      const finalMajor = getFinalMajorString();

      const payload = {
        fullNameTh: finalFullName,
        studentId: formData.studentId.trim(),
        phone: formData.phone.trim().replace(/-/g, ""),
        faculty: finalFaculty,
        major: finalMajor,
        diet: finalDiet,
        firstChoiceDeptId: formData.firstChoiceDeptId,
        secondChoiceDeptId: formData.secondChoiceDeptId,
        fallbackDeptChoice: formData.fallbackDeptChoice,
      };

      // 1. Sync with Server API & Neon PostgreSQL Database
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
      }

      const serverAppId = result.id || (result.data && result.data.id) || undefined;

      // 2. Save locally for instantaneous receipt
      const created = addApplication({
        ...payload,
        ...(serverAppId ? { id: serverAppId } : {}),
      } as any);
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
      console.error("Submission error:", err);
      setErrorMessage(err.message || "เกิดข้อผิดพลาดในการส่งใบสมัคร กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

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

              {/* 2. รหัสนักศึกษา (10 หลัก มีขีดก่อนตัวสุดท้าย) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy flex items-center justify-between">
                  <span>2. รหัสนักศึกษา (10 หลัก) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] font-mono text-gray-500 font-normal">รูปแบบ: XXXXXXXXX-X</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="เช่น 663050123-4"
                    value={formData.studentId}
                    onChange={(e) => updateField("studentId", formatStudentIdInput(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-mono text-gray-800 placeholder-gray-400 focus:bg-cc-cream-50 focus:border-cc-blue outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* 3. เบอร์โทร (เฉพาะตัวเลข 10 หลัก) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy flex items-center justify-between">
                  <span>3. เบอร์โทรศัพท์ (10 หลัก) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] font-mono text-gray-500 font-normal">เฉพาะตัวเลข 0-9</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="เช่น 0891234567"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", formatPhoneInput(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-mono text-gray-800 placeholder-gray-400 focus:bg-cc-cream-50 focus:border-cc-blue outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* 4. คณะ & 5. สาขาวิชา */}
              <div className="sm:col-span-2 space-y-4 pt-3 border-t border-gray-200">
                {/* 4. คณะที่สังกัด */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-cc-navy flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-cc-blue" />
                    <span>4. คณะที่สังกัดในมหาวิทยาลัยขอนแก่น <span className="text-red-500">*</span></span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setFacultyType("edu");
                        setErrorMessage(null);
                      }}
                      className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                        facultyType === "edu"
                          ? "bg-cc-navy text-white border-cc-navy shadow-solid-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:border-cc-navy hover:bg-cc-cream/30"
                      }`}
                    >
                      คณะศึกษาศาสตร์
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFacultyType("other");
                        setErrorMessage(null);
                      }}
                      className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                        facultyType === "other"
                          ? "bg-cc-navy text-white border-cc-navy shadow-solid-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:border-cc-navy hover:bg-cc-cream/30"
                      }`}
                    >
                      คณะอื่นๆ (มข.)
                    </button>
                  </div>

                  {facultyType === "other" && (
                    <div className="pt-1.5 animate-fadeIn">
                      <input
                        type="text"
                        required
                        placeholder="กรอกชื่อคณะของคุณ เช่น คณะวิทยาศาสตร์, คณะวิศวกรรมศาสตร์, คณะมนุษยศาสตร์ฯ"
                        value={customFacultyName}
                        onChange={(e) => {
                          setCustomFacultyName(e.target.value);
                          setErrorMessage(null);
                        }}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:bg-cc-cream-50 focus:border-cc-blue outline-none transition-all shadow-sm font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* 5. สาขาวิชา */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-cc-navy flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cc-coral" />
                    <span>5. สาขาวิชา <span className="text-red-500">*</span></span>
                  </label>

                  {facultyType === "edu" ? (
                    <div className="space-y-2">
                      <select
                        value={educationMajorChoice}
                        onChange={(e) => {
                          setEducationMajorChoice(e.target.value);
                          setErrorMessage(null);
                        }}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer shadow-sm focus:border-cc-blue focus:bg-cc-cream-50"
                      >
                        {EDUCATION_MAJORS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>

                      {educationMajorChoice === "สาขาอื่นๆ ในคณะศึกษาศาสตร์ (ระบุเอง)" && (
                        <div className="animate-fadeIn pt-1">
                          <input
                            type="text"
                            required
                            placeholder="พิมพ์ระบุชื่อสาขาวิชาของคุณในคณะศึกษาศาสตร์"
                            value={customMajorName}
                            onChange={(e) => {
                              setCustomMajorName(e.target.value);
                              setErrorMessage(null);
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:bg-cc-cream-50 focus:border-cc-blue outline-none transition-all shadow-sm font-medium"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="animate-fadeIn">
                      <input
                        type="text"
                        required
                        placeholder="กรอกชื่อสาขาวิชาของคุณ เช่น วิทยาการคอมพิวเตอร์, เทคโนโลยีสารสนเทศ, การตลาด ฯลฯ"
                        value={customMajorName}
                        onChange={(e) => {
                          setCustomMajorName(e.target.value);
                          setErrorMessage(null);
                        }}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:bg-cc-cream-50 focus:border-cc-blue outline-none transition-all shadow-sm font-medium"
                      />
                    </div>
                  )}

                  <p className="text-[11px] text-gray-500 pt-0.5">
                    สังกัดที่จะบันทึก: <strong className="text-cc-navy">{getFinalFacultyString()}</strong> • <strong className="text-cc-blue">{getFinalMajorString()}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Section 2: ข้อมูลอาหาร & การแพ้อาหาร (Dietary Drop box)    */}
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
                  เลือกประเภทอาหารหรืออาหารที่แพ้ เพื่อให้ฝ่ายสวัสดิการและอาหารเตรียมอาหารได้อย่างถูกต้อง
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-300 space-y-4">
              {/* Drop box (Select Dropdown) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-emerald-700" />
                  <span>ประเภทอาหาร / ข้อจำกัดด้านอาหาร <span className="text-red-500">*</span></span>
                </label>
                <select
                  value={dietChoice}
                  onChange={(e) => setDietChoice(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer shadow-sm focus:border-cc-blue focus:bg-cc-cream-50"
                >
                  <option value="ทานได้ทุกอย่าง (ไม่แพ้อาหาร)">
                    ทานได้ทุกอย่าง (ไม่แพ้อาหาร) — อาหารทั่วไปปกติ
                  </option>
                  <optgroup label="อาหารตามหลักศาสนา / มังสวิรัติ">
                    <option value="อาหารฮาลาล (อิสลาม)">อาหารฮาลาล (อิสลาม) — ตามหลักศาสนาอิสลาม</option>
                    <option value="มังสวิรัติ (ไม่ทานเนื้อสัตว์)">มังสวิรัติ (ไม่ทานเนื้อสัตว์)</option>
                    <option value="อาหารเจ / วีแกน">อาหารเจ / วีแกน — งดเนื้อสัตว์และผักฉุน</option>
                  </optgroup>
                  <optgroup label="แพ้อาหารเฉพาะ / ข้อจำกัดพิเศษ">
                    <option value="แพ้อาหารทะเล (กุ้ง, ปู, หอย, หมึก)">แพ้อาหารทะเล (กุ้ง, ปู, หอย, หมึก)</option>
                    <option value="แพ้ถั่วลิสง / ถั่วเปลือกแข็ง">แพ้ถั่วลิสง / ถั่วเปลือกแข็ง</option>
                    <option value="แพ้นมวัว / ผลิตภัณฑ์จากนม">แพ้นมวัว / ผลิตภัณฑ์จากนม (แลคโตส)</option>
                    <option value="แพ้ไข่">แพ้ไข่ (ไข่ไก่ / เมนูที่มีไข่)</option>
                    <option value="แพ้แป้งสาลี / กลูเตน">แพ้แป้งสาลี / กลูเตน</option>
                    <option value="ไม่ทานเนื้อวัว">ไม่ทานเนื้อวัว</option>
                    <option value="แพ้อื่นๆ / มีข้อจำกัดเฉพาะ">แพ้อื่นๆ / มีข้อจำกัดเฉพาะ (โปรดระบุด้านล่าง)</option>
                  </optgroup>
                </select>
              </div>

              {/* Specific Allergy / Dietary Note Input */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-cc-navy flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ระบุรายละเอียดอาหารที่แพ้ หรือข้อจำกัดเพิ่มเติม (ถ้ามี):</span>
                </label>
                <input
                  type="text"
                  placeholder="เช่น แพ้กุ้งอย่างรุนแรง (ห้ามมีส่วนผสมเด็ดขาด), ไม่ทานผักชี, ทานมังสวิรัติแบบดื่มนมได้ เป็นต้น"
                  value={otherAllergyNote}
                  onChange={(e) => setOtherAllergyNote(e.target.value)}
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
                <span className="text-gray-500">คณะ / สาขาวิชา:</span>
                <span className="font-bold text-gray-800 text-right truncate max-w-[210px]" title={`${createdApplication.faculty} • ${createdApplication.major}`}>
                  {createdApplication.faculty || "คณะศึกษาศาสตร์"} • {createdApplication.major}
                </span>
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
                  setDietChoice("ทานได้ทุกอย่าง (ไม่แพ้อาหาร)");
                  setOtherAllergyNote("");
                  setFacultyType("edu");
                  setCustomFacultyName("");
                  setEducationMajorChoice("สาขาวิชาคอมพิวเตอร์ศึกษา");
                  setCustomMajorName("");
                  setFormData({
                    studentId: "",
                    phone: "",
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
