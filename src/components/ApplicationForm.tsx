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
  FileCheck,
  Search,
} from "lucide-react";

export default function ApplicationForm() {
  const searchParams = useSearchParams();
  const preselectedDept = searchParams ? searchParams.get("dept") : null;

  const [createdApplication, setCreatedApplication] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Title prefix state
  const [titlePrefix, setTitlePrefix] = useState<string>("นาย");
  const [nameInput, setNameInput] = useState<string>("");

  // Form State: 6 Core Required Fields
  const [formData, setFormData] = useState({
    studentId: "",
    phone: "",
    major: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    firstChoiceDeptId: preselectedDept || "academic",
    secondChoiceDeptId: "recreation",
    fallbackDeptChoice: "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร",
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

  const getCleanFullName = () => {
    let clean = nameInput.trim();
    // Strip redundant typed prefixes if already typed
    clean = clean.replace(/^(นาย|นางสาว|นาง|น\.ส\.)\s*/, "");
    return `${titlePrefix}${clean}`;
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
      const payload = {
        fullNameTh: finalFullName,
        studentId: formData.studentId.trim(),
        phone: formData.phone.trim().replace(/-/g, ""),
        major: formData.major.trim(),
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

      // 2. Save locally for instant UI update & receipt slip
      const newApp = addApplication(payload as any);

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
          {/* Section 2: ฝ่ายที่ต้องการลงสมัคร (5 & 6) */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-cc-coral text-white flex items-center justify-center font-bold text-xs border border-cc-navy">
                02
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
          {/* Section 3: ถ้าไม่ติดอยากลงฝ่ายไหน (ข้อ 6) */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-cc-yellow text-cc-navy flex items-center justify-center font-bold text-xs border border-cc-navy">
                03
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
                  setFormData({
                    studentId: "",
                    phone: "",
                    major: "สาขาวิชาคอมพิวเตอร์ศึกษา",
                    firstChoiceDeptId: "academic",
                    secondChoiceDeptId: "recreation",
                    fallbackDeptChoice: "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร",
                  });
                }}
                className="py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-cc-navy font-bold text-xs sm:text-sm border-2 border-cc-navy/20 transition-all"
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
