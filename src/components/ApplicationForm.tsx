"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { DEPARTMENTS, CAMP_INFO } from "@/lib/constants";
import { addApplication } from "@/lib/storage";
import { Application, YearLevel, ShirtSize, DietRequirement } from "@/lib/types";
import ApplicationSlipModal from "./ApplicationSlipModal";
import {
  User,
  GraduationCap,
  Shirt,
  HeartPulse,
  Layers,
  HelpCircle,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Send,
  Lock,
  ArrowUpRight,
} from "lucide-react";

export default function ApplicationForm() {
  const searchParams = useSearchParams();
  const preselectedDept = searchParams ? searchParams.get("dept") : null;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [createdApplication, setCreatedApplication] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    titleTh: "นาย" as "นาย" | "นางสาว" | "นาง" | "อื่นๆ",
    fullNameTh: "",
    nicknameTh: "",
    fullNameEn: "",
    studentId: "",
    faculty: "คณะศึกษาศาสตร์",
    major: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    year: "ปี 2" as YearLevel,
    phone: "",
    lineId: "",
    facebookOrIg: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",

    shirtSize: "L" as ShirtSize,
    diet: "ทั่วไป (อาหารปกติ)" as DietRequirement,
    dietNote: "",
    medicalConditions: "",
    canJoinPreparation: true,
    canJoinCampDates: true,

    firstChoiceDeptId: preselectedDept || "academic",
    secondChoiceDeptId: "recreation",

    reasonToApply: "",
    pastExperience: "",
    skillsAndStrengths: "",
    problemSolvingScenario: "",
    portfolioUrl: "",
  });

  useEffect(() => {
    if (preselectedDept && DEPARTMENTS.some((d) => d.id === preselectedDept)) {
      setFormData((prev) => ({ ...prev, firstChoiceDeptId: preselectedDept }));
    }
  }, [preselectedDept]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.fullNameTh.trim()) {
        setErrorMessage("กรุณากรอกชื่อ-นามสกุลภาษาไทย");
        return false;
      }
      if (!formData.nicknameTh.trim()) {
        setErrorMessage("กรุณากรอกชื่อเล่น");
        return false;
      }
      if (!formData.studentId.trim()) {
        setErrorMessage("กรุณากรอกรหัสนักศึกษา");
        return false;
      }
      if (!formData.faculty.trim()) {
        setErrorMessage("กรุณาระบุคณะ");
        return false;
      }
      if (!formData.major.trim()) {
        setErrorMessage("กรุณาระบุสาขาวิชา");
        return false;
      }
      if (!formData.phone.trim() || formData.phone.length < 9) {
        setErrorMessage("กรุณากรอกเบอร์โทรศัพท์ที่ติดต่อได้");
        return false;
      }
      if (!formData.lineId.trim()) {
        setErrorMessage("กรุณากรอก Line ID สำหรับการติดต่อด่วน");
        return false;
      }
      if (!formData.emergencyName.trim() || !formData.emergencyPhone.trim()) {
        setErrorMessage("กรุณากรอกชื่อและเบอร์โทรของผู้ติดต่อฉุกเฉิน");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.canJoinPreparation || !formData.canJoinCampDates) {
        setErrorMessage("ต้องสามารถเข้าร่วมการเตรียมงานและวันจัดค่ายจริงได้");
        return false;
      }
    }

    if (step === 3) {
      if (formData.firstChoiceDeptId === formData.secondChoiceDeptId) {
        setErrorMessage("กรุณาเลือกฝ่ายอันดับที่ 1 และอันดับที่ 2 ไม่ซ้ำกัน");
        return false;
      }
    }

    if (step === 4) {
      if (!formData.reasonToApply.trim() || formData.reasonToApply.length < 15) {
        setErrorMessage("กรุณากรอกเหตุผลที่อยากมาเป็นพี่ค่าย Comclick 20 (อย่างน้อย 15 ตัวอักษร)");
        return false;
      }
      if (!formData.skillsAndStrengths.trim()) {
        setErrorMessage("กรุณาระบุทักษะหรือจุดเด่นของตนเอง");
        return false;
      }
      if (!formData.problemSolvingScenario.trim()) {
        setErrorMessage("กรุณากรอกแนวทางการแก้ปัญหาเฉพาะหน้าในการทำงานเป็นทีม");
        return false;
      }
    }

    setErrorMessage(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrorMessage(null);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const newApp = addApplication({
          titleTh: formData.titleTh,
          fullNameTh: formData.fullNameTh,
          nicknameTh: formData.nicknameTh,
          fullNameEn: formData.fullNameEn,
          studentId: formData.studentId,
          faculty: formData.faculty,
          major: formData.major,
          year: formData.year,
          phone: formData.phone,
          lineId: formData.lineId,
          facebookOrIg: formData.facebookOrIg,
          emergencyContact: {
            name: formData.emergencyName,
            relation: formData.emergencyRelation || "ผู้ปกครอง",
            phone: formData.emergencyPhone,
          },
          shirtSize: formData.shirtSize,
          diet: formData.diet,
          dietNote: formData.dietNote,
          medicalConditions: formData.medicalConditions,
          canJoinPreparation: formData.canJoinPreparation,
          canJoinCampDates: formData.canJoinCampDates,
          firstChoiceDeptId: formData.firstChoiceDeptId,
          secondChoiceDeptId: formData.secondChoiceDeptId,
          reasonToApply: formData.reasonToApply,
          pastExperience: formData.pastExperience,
          skillsAndStrengths: formData.skillsAndStrengths,
          problemSolvingScenario: formData.problemSolvingScenario,
          portfolioUrl: formData.portfolioUrl,
        });

        setIsSubmitting(false);
        setCreatedApplication(newApp);

        // Confetti celebration
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#5e97d3", "#d98e89", "#eccb7d", "#b08b5f"],
        });
      } catch (err) {
        setIsSubmitting(false);
        setErrorMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
      }
    }, 500);
  };

  const stepTitles = [
    { num: 1, label: "ข้อมูลส่วนตัว", icon: User },
    { num: 2, label: "เสื้อ & สุขภาพ", icon: Shirt },
    { num: 3, label: "เลือกฝ่ายที่ต้องการ", icon: Layers },
    { num: 4, label: "คำถามคัดเลือก & ยืนยัน", icon: FileCheck2 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Form Container with Solid Border and Shadow */}
      <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-10">
        {/* Step Progress Header */}
        <div className="mb-10">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {stepTitles.map((step) => {
              const Icon = step.icon;
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div
                  key={step.num}
                  className={`flex flex-col items-center text-center transition-all ${
                    isCurrent
                      ? "opacity-100 scale-105"
                      : isPassed
                      ? "opacity-90"
                      : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-display font-black text-xs sm:text-sm mb-2 border-2 border-cc-navy transition-all ${
                      isCurrent
                        ? "bg-cc-coral text-white shadow-solid-sm"
                        : isPassed
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isPassed ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-cc-navy truncate w-full">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-2.5 rounded-full mt-4 border border-cc-navy overflow-hidden">
            <div
              className="h-full bg-cc-coral transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-500 text-red-700 text-xs sm:text-sm flex items-center gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span className="font-bold">{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Personal & Academic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-3 border-b-2 border-cc-navy/10">
                <h3 className="font-display font-black text-xl text-cc-navy flex items-center gap-2">
                  <User className="w-5 h-5 text-cc-blue" />
                  <span>ขั้นตอนที่ 1: ข้อมูลส่วนตัวและการศึกษา</span>
                </h3>
                <p className="text-xs text-gray-500 font-normal">กรอกข้อมูลผู้สมัครให้ครบถ้วนและถูกต้อง</p>
              </div>

              {/* Title & Names */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    คำนำหน้า <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.titleTh}
                    onChange={(e) => updateField("titleTh", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm font-medium outline-none"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="นาง">นาง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    ชื่อ-นามสกุล (ภาษาไทย) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น นายสมชาย ใจดี"
                    value={formData.fullNameTh}
                    onChange={(e) => updateField("fullNameTh", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm font-medium outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    ชื่อเล่น <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น โจ้"
                    value={formData.nicknameTh}
                    onChange={(e) => updateField("nicknameTh", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm font-medium outline-none"
                    required
                  />
                </div>
              </div>

              {/* Student ID, Faculty, Major, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    รหัสนักศึกษา <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 663050123-4"
                    value={formData.studentId}
                    onChange={(e) => updateField("studentId", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm font-mono font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    คณะ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น คณะศึกษาศาสตร์"
                    value={formData.faculty}
                    onChange={(e) => updateField("faculty", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    สาขาวิชา <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น คอมพิวเตอร์ศึกษา"
                    value={formData.major}
                    onChange={(e) => updateField("major", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    ชั้นปี <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => updateField("year", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm outline-none"
                  >
                    <option value="ปี 1">ปี 1 (Freshman)</option>
                    <option value="ปี 2">ปี 2 (Sophomore)</option>
                    <option value="ปี 3">ปี 3 (Junior)</option>
                    <option value="ปี 4">ปี 4 (Senior)</option>
                    <option value="อื่นๆ / บัณฑิตศึกษา">อื่นๆ / บัณฑิตศึกษา</option>
                  </select>
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="เช่น 089-123-4567"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Line ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น mark_kku"
                    value={formData.lineId}
                    onChange={(e) => updateField("lineId", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Facebook / Instagram (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น fb.com/name หรือ IG handle"
                    value={formData.facebookOrIg}
                    onChange={(e) => updateField("facebookOrIg", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-2xl bg-cc-cream border-2 border-cc-navy space-y-3">
                <div className="text-xs font-bold text-cc-navy flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cc-coral" />
                  ข้อมูลผู้ติดต่อกรณีฉุกเฉิน
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="ชื่อ-สกุล ผู้ติดต่อฉุกเฉิน *"
                      value={formData.emergencyName}
                      onChange={(e) => updateField("emergencyName", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-cc-navy/30 text-xs bg-white outline-none"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="ความสัมพันธ์ (เช่น บิดา, มารดา)"
                      value={formData.emergencyRelation}
                      onChange={(e) => updateField("emergencyRelation", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-cc-navy/30 text-xs bg-white outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="เบอร์โทรฉุกเฉิน *"
                      value={formData.emergencyPhone}
                      onChange={(e) => updateField("emergencyPhone", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-cc-navy/30 text-xs bg-white outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Shirt, Diet & Logistics */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-3 border-b-2 border-cc-navy/10">
                <h3 className="font-display font-black text-xl text-cc-navy flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-cc-coral" />
                  <span>ขั้นตอนที่ 2: เสื้อสตาฟ อาหาร และข้อมูลสุขภาพ</span>
                </h3>
                <p className="text-xs text-gray-500 font-normal">สำหรับจัดเตรียมเสบียงและเสื้อค่าย Comclick 20 ลิมิเต็ด</p>
              </div>

              {/* Shirt Size Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3">
                  ขนาดเสื้อสตาฟ (Shirt Size) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                  {(["S", "M", "L", "XL", "2XL", "3XL", "4XL"] as ShirtSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateField("shirtSize", size)}
                      className={`py-3 px-2 rounded-xl font-mono font-bold text-xs sm:text-sm border-2 border-cc-navy transition-all ${
                        formData.shirtSize === size
                          ? "bg-cc-coral text-white shadow-solid-sm scale-105"
                          : "bg-gray-50 text-cc-navy hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  รอบอกโดยประมาณ: S (36"), M (38"), L (40"), XL (42"), 2XL (44"), 3XL (48"), 4XL (52")
                </p>
              </div>

              {/* Food & Diet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    ข้อจำกัดด้านอาหาร (Diet) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.diet}
                    onChange={(e) => updateField("diet", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm outline-none font-medium"
                  >
                    <option value="ทั่วไป (อาหารปกติ)">ทั่วไป (อาหารปกติ)</option>
                    <option value="ฮาลาล (อิสลาม)">ฮาลาล (อิสลาม)</option>
                    <option value="มังสวิรัติ">มังสวิรัติ (Vegetarian)</option>
                    <option value="เจ">เจ (Vegan)</option>
                    <option value="แพ้อาหารเฉพาะ">แพ้อาหารเฉพาะ (ระบุด้านล่าง)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    แพ้อาหาร หรืออาหารที่ไม่รับประทาน
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น แพ้อาหารทะเล, ไม่ทานเนื้อวัว"
                    value={formData.dietNote}
                    onChange={(e) => updateField("dietNote", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 bg-gray-50 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  โรคประจำตัว ยาที่แพ้ หรือข้อควรระวังทางการแพทย์ (ถ้ามี)
                </label>
                <input
                  type="text"
                  placeholder="เช่น โรคหอบหืด, แพ้ยาพาราเซตามอล (หากไม่มีให้เว้นว่างหรือพิมพ์ 'ไม่มี')"
                  value={formData.medicalConditions}
                  onChange={(e) => updateField("medicalConditions", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 bg-gray-50 text-xs sm:text-sm outline-none"
                />
              </div>

              {/* Availability Checks */}
              <div className="p-4 rounded-2xl bg-cc-cream border-2 border-cc-navy space-y-3">
                <div className="text-xs font-bold text-cc-navy">การยืนยันเวลาเข้าร่วมกิจกรรม</div>
                <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.canJoinPreparation}
                    onChange={(e) => updateField("canJoinPreparation", e.target.checked)}
                    className="w-4 h-4 rounded text-cc-navy border-gray-300 focus:ring-cc-navy"
                  />
                  <span className="font-medium">สามารถเข้าร่วมการซ้อมและเตรียมงานช่วง 10 - 16 ตุลาคม 2569 ได้</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.canJoinCampDates}
                    onChange={(e) => updateField("canJoinCampDates", e.target.checked)}
                    className="w-4 h-4 rounded text-cc-navy border-gray-300 focus:ring-cc-navy"
                  />
                  <span className="font-medium">สามารถอยู่ร่วมค่ายตลอดระยะเวลา 3 วัน 2 คืน (17 - 19 ตุลาคม 2569) ได้</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Department Choices */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-3 border-b-2 border-cc-navy/10">
                <h3 className="font-display font-black text-xl text-cc-navy flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cc-yellow" />
                  <span>ขั้นตอนที่ 3: เลือกฝ่ายที่ต้องการสมัคร</span>
                </h3>
                <p className="text-xs text-gray-500 font-normal">เลือกฝ่ายอันดับที่ 1 (หลัก) และอันดับที่ 2 (สำรอง)</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1st Choice */}
                <div className="space-y-3 p-5 rounded-2xl bg-cc-cream border-3 border-cc-blue shadow-solid-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-sm text-cc-blue flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cc-blue" />
                      ฝ่ายที่ต้องการสมัคร อันดับที่ 1 (หลัก) *
                    </span>
                  </div>

                  <select
                    value={formData.firstChoiceDeptId}
                    onChange={(e) => updateField("firstChoiceDeptId", e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.nameTh} (รับ {dept.openSlots} คน)
                      </option>
                    ))}
                  </select>

                  {/* Preview Selected Dept 1 */}
                  {(() => {
                    const d = DEPARTMENTS.find((x) => x.id === formData.firstChoiceDeptId);
                    return d ? (
                      <div className="text-xs text-gray-700 space-y-1.5 pt-2">
                        <p className="font-bold text-cc-navy">{d.shortDesc}</p>
                        <div className="flex flex-wrap gap-1">
                          {d.tags.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white border border-cc-navy text-[10px] font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 2nd Choice */}
                <div className="space-y-3 p-5 rounded-2xl bg-white border-3 border-cc-coral shadow-solid-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-sm text-cc-coral flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cc-coral" />
                      ฝ่ายที่ต้องการสมัคร อันดับที่ 2 (สำรอง) *
                    </span>
                  </div>

                  <select
                    value={formData.secondChoiceDeptId}
                    onChange={(e) => updateField("secondChoiceDeptId", e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-medium text-gray-800 outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.nameTh} (รับ {dept.openSlots} คน)
                      </option>
                    ))}
                  </select>

                  {/* Preview Selected Dept 2 */}
                  {(() => {
                    const d = DEPARTMENTS.find((x) => x.id === formData.secondChoiceDeptId);
                    return d ? (
                      <div className="text-xs text-gray-700 space-y-1.5 pt-2">
                        <p className="font-bold text-cc-navy">{d.shortDesc}</p>
                        <div className="flex flex-wrap gap-1">
                          {d.tags.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-cc-cream border border-cc-navy text-[10px] font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Screening Questions & Portfolio */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-3 border-b-2 border-cc-navy/10">
                <h3 className="font-display font-black text-xl text-cc-navy flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cc-coral" />
                  <span>ขั้นตอนที่ 4: ตอบคำถามคัดเลือกและแนบผลงาน</span>
                </h3>
                <p className="text-xs text-gray-500 font-normal">ตอบคำถามด้วยความเป็นตัวของตัวเอง เพื่อให้คณะกรรมการได้รู้จักคุณมากขึ้น</p>
              </div>

              {/* Q1 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  1. เหตุผลที่อยากมาเป็นพี่ค่าย Comclick 20 ในปีนี้คืออะไร? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="เล่าแรงบันดาลใจ หรือสิ่งที่อยากทำให้สำเร็จในค่ายนี้..."
                  value={formData.reasonToApply}
                  onChange={(e) => updateField("reasonToApply", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 focus:border-cc-navy bg-gray-50 text-xs sm:text-sm outline-none"
                  required
                />
              </div>

              {/* Q2 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  2. ประสบการณ์ทำงานค่าย งานสโมสรนักศึกษา หรือกิจกรรมที่เคยทำที่ผ่านมา
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น เคยช่วยงานสัปดาห์วิทย์, ค่ายอาสา, กิจกรรมโรงเรียน (หากไม่มีสามารถระบุความตั้งใจที่จะเรียนรู้ได้)"
                  value={formData.pastExperience}
                  onChange={(e) => updateField("pastExperience", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 bg-gray-50 text-xs sm:text-sm outline-none"
                />
              </div>

              {/* Q3 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  3. จุดเด่น ทักษะ หรือความถนัดของตนเองที่จะนำมาช่วยฝ่ายที่เลือก <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น เขียนโค้ด Python ได้, พูดเก่ง, ถ่ายรูปสวย, ทำงานไว, ใจเย็นและรับฟังคนอื่น..."
                  value={formData.skillsAndStrengths}
                  onChange={(e) => updateField("skillsAndStrengths", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 bg-gray-50 text-xs sm:text-sm outline-none"
                  required
                />
              </div>

              {/* Q4 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  4. หากเกิดเหตุการณ์ไม่คาดฝันหรือความเห็นไม่ตรงกันในทีม คุณมีวิธีจัดการอย่างไร? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="อธิบายทัศนคติและวิธีการแก้ปัญหาเฉพาะหน้าในการทำงานร่วมกับผู้อื่น..."
                  value={formData.problemSolvingScenario}
                  onChange={(e) => updateField("problemSolvingScenario", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 bg-gray-50 text-xs sm:text-sm outline-none"
                  required
                />
              </div>

              {/* Portfolio Link */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  ลิงก์ผลงาน / Portfolio / Google Drive / GitHub / ช่องทางแสดงผลงาน (ถ้ามี)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... หรือ https://github.com/..."
                  value={formData.portfolioUrl}
                  onChange={(e) => updateField("portfolioUrl", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/25 bg-gray-50 text-xs sm:text-sm outline-none"
                />
              </div>

              {/* Summary Consent */}
              <div className="p-4 rounded-2xl bg-cc-cream border-2 border-cc-navy text-xs text-gray-700 space-y-2">
                <div className="font-bold text-cc-navy flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cc-coral" />
                  <span>การยินยอมและตรวจสอบข้อมูล</span>
                </div>
                <p>
                  ข้าพเจ้าขอรับรองว่าข้อมูลทั้งหมดข้างต้นเป็นความจริง และยินดีให้ความร่วมมือกับโครงการค่าย ComClick 20
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 border-t-2 border-cc-navy/10 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-cc-navy font-bold text-xs sm:text-sm flex items-center gap-2 border border-gray-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-cc-navy hover:bg-cc-blue text-white font-bold text-xs sm:text-sm flex items-center gap-2 border-2 border-cc-navy shadow-solid-sm transition-all"
              >
                <span>ถัดไป</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 rounded-xl bg-cc-coral hover:bg-cc-coral-dark text-white font-display font-black text-sm sm:text-base border-2 border-cc-navy shadow-solid hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>กำลังบันทึกใบสมัคร...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ยืนยันและส่งใบสมัครพี่ค่าย</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Slip Modal Upon Submission */}
      {createdApplication && (
        <ApplicationSlipModal
          application={createdApplication}
          onClose={() => setCreatedApplication(null)}
        />
      )}
    </div>
  );
}
