"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import {
  CAMP_INFO,
  DEPARTMENTS,
  OPEN_DEPARTMENTS,
  KKU_FACULTIES,
  EDUCATION_MAJORS,
  STAFF_YEAR_OPTIONS,
  DIET_OPTIONS,
  TECH_PR_DRIVE_URL,
} from "@/lib/constants";
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
  Copy,
  CheckCheck,
  ExternalLink,
  Facebook,
  Car,
  FolderUp,
  Heart,
  Utensils,
} from "lucide-react";

export default function ApplicationForm() {
  const searchParams = useSearchParams();
  const rawDept = searchParams ? searchParams.get("dept") : null;
  const preselectedDept = rawDept && rawDept !== "directorate" ? rawDept : null;
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [duplicateInfo, setDuplicateInfo] = useState<{ studentId: string; appId?: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Helper to trigger red error border and smoothly scroll into view
  const triggerFieldError = (fieldId: string, errorMsg: string) => {
    setErrorMessage(errorMsg);
    setFieldErrors({ [fieldId]: true });
    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if (
          el.tagName === "INPUT" ||
          el.tagName === "SELECT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "BUTTON"
        ) {
          (el as HTMLElement).focus();
        }
      }
    }, 50);
  };

  const clearFieldError = (fieldId?: string) => {
    setErrorMessage(null);
    if (fieldId) {
      setFieldErrors((prev) => ({ ...prev, [fieldId]: false }));
    } else {
      setFieldErrors({});
    }
  };

  // ==========================================
  // Section 1: ข้อมูลทั่วไป
  // ==========================================
  const [titlePrefix, setTitlePrefix] = useState<string>("นาย");
  const [nameInput, setNameInput] = useState<string>("");
  const [nicknameInput, setNicknameInput] = useState<string>("");
  const [studentIdInput, setStudentIdInput] = useState<string>("");
  const [facultyChoice, setFacultyChoice] = useState<string>("คณะศึกษาศาสตร์");
  const [customFacultyInput, setCustomFacultyInput] = useState<string>("");
  const [educationMajorChoice, setEducationMajorChoice] = useState<string>("สาขาวิชาคอมพิวเตอร์ศึกษา");
  const [customMajorInput, setCustomMajorInput] = useState<string>("");
  const [yearLevel, setYearLevel] = useState<string>("ชั้นปีที่ 1");
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [facebookNameInput, setFacebookNameInput] = useState<string>("");
  const [facebookUrlInput, setFacebookUrlInput] = useState<string>("");
  const [dietChoice, setDietChoice] = useState<string>("ทานได้ทุกอย่าง (ไม่แพ้อาหาร)");
  const [dietCustomInput, setDietCustomInput] = useState<string>("");

  // ==========================================
  // Section 2: คำถามแสดงทัศนคติ
  // ==========================================
  const [reasonToApply, setReasonToApply] = useState<string>("");
  const [strengths, setStrengths] = useState<string>("");
  const [weaknesses, setWeaknesses] = useState<string>("");

  // ==========================================
  // Section 3: ฝ่ายที่ต้องการลงสมัคร & คำถามพิเศษ
  // ==========================================
  const [firstChoiceDeptId, setFirstChoiceDeptId] = useState<string>(preselectedDept || OPEN_DEPARTMENTS[0]?.id || "protocol");
  const [secondChoiceDeptId, setSecondChoiceDeptId] = useState<string>("-");
  const [fallbackDeptChoice, setFallbackDeptChoice] = useState<string>("ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร");

  // Special Question: Tech & PR
  const [techPortfolioUrl, setTechPortfolioUrl] = useState<string>("");

  // Special Question: Fast Response
  const [hasCar, setHasCar] = useState<"ใช่" | "ไม่" | "">("");
  const [carType, setCarType] = useState<"รถเก๋ง" | "รถกระบะ" | "อื่นๆ" | "">("");
  const [carTypeOther, setCarTypeOther] = useState<string>("");

  // Check if Tech & PR or Fast Response is selected in Choice 1 or Choice 2
  const isTechPRSelected =
    firstChoiceDeptId === "tech-pr" ||
    (secondChoiceDeptId !== "-" && secondChoiceDeptId !== "none" && secondChoiceDeptId === "tech-pr");
  const isFastResponseSelected =
    firstChoiceDeptId === "fast-response" ||
    (secondChoiceDeptId !== "-" && secondChoiceDeptId !== "none" && secondChoiceDeptId === "fast-response");

  useEffect(() => {
    if (createdApplication || duplicateInfo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [createdApplication, duplicateInfo]);

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

  // Prevent accidental unload while filling form
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasUnsavedData =
        nameInput.trim().length > 0 ||
        studentIdInput.trim().length > 0 ||
        phoneInput.trim().length > 0 ||
        reasonToApply.trim().length > 0;

      if (hasUnsavedData && !createdApplication) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [nameInput, studentIdInput, phoneInput, reasonToApply, createdApplication]);

  useEffect(() => {
    if (preselectedDept && OPEN_DEPARTMENTS.some((d) => d.id === preselectedDept)) {
      setFirstChoiceDeptId(preselectedDept);
    }
  }, [preselectedDept]);

  const handleFirstChoiceChange = (newFirstId: string) => {
    let newSecondId = secondChoiceDeptId;
    if (newSecondId === newFirstId) {
      const alt = OPEN_DEPARTMENTS.find((d) => d.id !== newFirstId);
      newSecondId = alt ? alt.id : "";
    }
    setFirstChoiceDeptId(newFirstId);
    setSecondChoiceDeptId(newSecondId);
    setErrorMessage(null);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Helper formatters
  const formatStudentId = (value: string, prevValue: string = ""): string => {
    // If user is deleting from "123456789-", allow deleting back to 8 digits
    if (prevValue.endsWith("-") && !value.endsWith("-") && value.length === 9) {
      return value.slice(0, 8);
    }
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 9) {
      return `${digits}-`;
    }
    if (digits.length === 10) {
      return `${digits.slice(0, 9)}-${digits.slice(9, 10)}`;
    }
    return digits;
  };

  const formatPhone = (value: string): string => {
    return value.replace(/\D/g, "").slice(0, 10);
  };

  const getCleanFullName = () => {
    let clean = nameInput.trim();
    clean = clean.replace(/^(นาย|นางสาว|นาง|น\.ส\.)\s*/, "");
    return `${titlePrefix}${clean}`;
  };

  const getFinalFacultyString = (): string => {
    if (facultyChoice === "อื่นๆ (โปรดระบุ)") {
      return customFacultyInput.trim() || "อื่นๆ (มข.)";
    }
    return facultyChoice;
  };

  const getFinalMajorString = (): string => {
    if (facultyChoice === "คณะศึกษาศาสตร์") {
      if (educationMajorChoice === "อื่นๆ (โปรดระบุ)") {
        return customMajorInput.trim() || "สาขาอื่นๆ (คณะศึกษาศาสตร์)";
      }
      return educationMajorChoice;
    }
    return customMajorInput.trim() || "ไม่ระบุสาขา";
  };

  const validateForm = (): boolean => {
    // 1. Full name validation
    const cleanName = nameInput.trim().replace(/^(นาย|นางสาว|นาง|น\.ส\.)\s*/, "");
    if (!cleanName) {
      triggerFieldError("input-fullName", "กรุณากรอก ชื่อ - สกุล ของตนเอง");
      return false;
    }
    if (cleanName.length < 3 || !cleanName.includes(" ") || cleanName.split(" ").filter(Boolean).length < 2) {
      triggerFieldError("input-fullName", "กรุณากรอกทั้งชื่อและนามสกุลให้ครบถ้วน (คั่นด้วยการเว้นวรรค เช่น สมชาย ใจดี)");
      return false;
    }

    // 2. Nickname validation
    if (!nicknameInput.trim()) {
      triggerFieldError("input-nickname", "กรุณากรอก ชื่อเล่น ของตนเอง");
      return false;
    }

    // 3. Student ID validation (10 digits)
    const studentDigits = studentIdInput.replace(/\D/g, "");
    if (studentDigits.length !== 10) {
      triggerFieldError("input-studentId", "รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก (รูปแบบ 663050123-4)");
      return false;
    }

    // 4. Faculty validation
    if (facultyChoice === "อื่นๆ (โปรดระบุ)" && !customFacultyInput.trim()) {
      triggerFieldError("input-custom-faculty", "กรุณาระบุชื่อคณะของคุณ");
      return false;
    }

    // 5. Major validation
    if (facultyChoice === "คณะศึกษาศาสตร์" && educationMajorChoice === "อื่นๆ (โปรดระบุ)" && !customMajorInput.trim()) {
      triggerFieldError("input-custom-major", "กรุณาระบุชื่อสาขาวิชาของคุณ");
      return false;
    }
    if (facultyChoice !== "คณะศึกษาศาสตร์" && !customMajorInput.trim()) {
      triggerFieldError("input-custom-major", "กรุณากรอกชื่อสาขาวิชาของคุณ");
      return false;
    }

    // 6. Phone validation (10 digits, starts with 0)
    const phoneDigits = phoneInput.replace(/\D/g, "");
    if (phoneDigits.length !== 10 || !phoneDigits.startsWith("0")) {
      triggerFieldError("input-phone", "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักที่ถูกต้อง (ไม่มีขีด เช่น 0812345678)");
      return false;
    }

    // 7. Facebook Name validation
    if (!facebookNameInput.trim()) {
      triggerFieldError("input-facebookName", "กรุณากรอก ชื่อ Facebook ของตนเอง");
      return false;
    }

    // 8. Facebook URL validation
    if (!facebookUrlInput.trim()) {
      triggerFieldError("input-facebookUrl", "กรุณากรอก Link Facebook ของตนเอง");
      return false;
    }

    // 9. Food Allergy / Diet validation
    if (dietChoice === "แพ้อาหาร / อื่นๆ (โปรดระบุ)" && !dietCustomInput.trim()) {
      triggerFieldError("input-custom-diet", "กรุณาระบุรายละเอียดอาหารที่แพ้หรือข้อจำกัดด้านอาหารของคุณ");
      return false;
    }

    // 10. Section 2: Attitude & Questions validation
    if (!reasonToApply.trim()) {
      triggerFieldError("input-reasonToApply", "กรุณากรอก เหตุผลที่สนใจหรือต้องการสมัครเป็นพี่ค่ายคอมคลิก ครั้งที่ 20 ในส่วนที่ 2");
      return false;
    }
    if (!strengths.trim()) {
      triggerFieldError("input-strengths", "กรุณากรอก ข้อดีของตนเอง (พอสังเขป) ในส่วนที่ 2");
      return false;
    }
    if (!weaknesses.trim()) {
      triggerFieldError("input-weaknesses", "กรุณากรอก ข้อเสียของตนเอง (พอสังเขป) ในส่วนที่ 2");
      return false;
    }

    // 11. Section 3: Department choices validation
    if (firstChoiceDeptId === "directorate" || (secondChoiceDeptId !== "-" && secondChoiceDeptId !== "none" && secondChoiceDeptId === "directorate")) {
      triggerFieldError("select-choice1", "ฝ่ายอำนวยการสงวนสิทธิ์เฉพาะคณะกรรมการบริหารโครงการ ไม่เปิดรับสมัครบุคคลทั่วไป");
      return false;
    }

    if (secondChoiceDeptId && secondChoiceDeptId !== "-" && secondChoiceDeptId !== "none" && firstChoiceDeptId === secondChoiceDeptId) {
      triggerFieldError("select-choice2", "กรุณาเลือกฝ่ายอันดับที่ 1 และอันดับที่ 2 ไม่ซ้ำกัน (หรือเลือก '-' หากไม่ประสงค์เลือกอันดับ 2)");
      return false;
    }

    // Special validation for Fast response
    if (isFastResponseSelected && !hasCar) {
      triggerFieldError("section-hasCar", "เนื่องจากคุณเลือกฝ่ายรถเร็ว กรุณาตอบคำถามพิเศษ 'คุณมีรถยนต์หรือไม่'");
      return false;
    }

    clearFieldError();
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setDuplicateInfo(null);

    try {
      const finalFullName = getCleanFullName();
      const finalFaculty = getFinalFacultyString();
      const finalMajor = getFinalMajorString();
      const finalDiet =
        dietChoice === "แพ้อาหาร / อื่นๆ (โปรดระบุ)"
          ? (dietCustomInput.trim() ? `แพ้อาหาร: ${dietCustomInput.trim()}` : "แพ้อาหาร / มีข้อจำกัดเฉพาะ")
          : dietChoice;

      const payload = {
        titleTh: titlePrefix,
        fullNameTh: finalFullName,
        nicknameTh: nicknameInput.trim(),
        studentId: studentIdInput.trim(),
        faculty: finalFaculty,
        major: finalMajor,
        year: yearLevel,
        phone: phoneInput.trim().replace(/-/g, ""),
        facebookName: facebookNameInput.trim(),
        facebookUrl: facebookUrlInput.trim(),
        reasonToApply: reasonToApply.trim(),
        strengths: strengths.trim(),
        weaknesses: weaknesses.trim(),
        firstChoiceDeptId: firstChoiceDeptId,
        secondChoiceDeptId: secondChoiceDeptId,
        fallbackDeptChoice: fallbackDeptChoice,
        techPortfolioUrl: techPortfolioUrl.trim(),
        hasCar: hasCar,
        carType: carType,
        carTypeOther: carTypeOther.trim(),
        diet: finalDiet,
      };

      let serverAppId: string | undefined = undefined;

      // 1. Submit directly to Server API & Neon PostgreSQL Database
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.duplicate) {
        setDuplicateInfo({ studentId: studentIdInput.trim(), appId: result.existingId });
        clearFieldError();
        setIsSubmitting(false);
        return;
      }

      if (!res.ok || !result.success) {
        throw new Error(result.error || "เกิดข้อผิดพลาดในการบันทึกใบสมัคร");
      }

      serverAppId = result.id || (result.data && result.data.id);
      const created: Application = {
        ...payload,
        id: serverAppId || `CC20-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "SUBMITTED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Application;

      setCreatedApplication(created);
      clearFieldError();

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#FF5E36", "#FFC700", "#1B3B6F", "#2A9D8F", "#8338EC"],
        });
      } catch (_) {}
    } catch (err: any) {
      console.warn("Submission error:", err);
      setErrorMessage(err.message || "เกิดข้อผิดพลาดในการส่งใบสมัคร กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If Registration has not opened yet (Upcoming Mode with Countdown)
  if (mounted && regStatus === "upcoming" && !isPreviewMode) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 animate-fadeIn">
        <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-12 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cc-yellow text-cc-navy border-2 border-cc-navy text-xs font-mono font-bold uppercase shadow-solid-sm">
            <Clock className="w-4 h-4 text-cc-coral" />
            <span>COUNTDOWN TO REGISTRATION OPENING</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-black text-2xl sm:text-4xl text-cc-navy tracking-tight">
              ระบบรับสมัครพี่ค่าย <span className="text-cc-blue">{CAMP_INFO.nameEn}</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto font-medium">
              ระบบจะเปิดให้กรอกแบบฟอร์มรับสมัครอย่างเป็นทางการในวันที่ <strong className="text-cc-navy underline decoration-cc-yellow decoration-4 underline-offset-2">{CAMP_INFO.registrationPeriod}</strong>
            </p>
          </div>

          {/* Bento Countdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-cc-blue text-white border-3 border-cc-navy shadow-solid text-center">
              <div className="font-display font-black text-3xl sm:text-5xl text-cc-yellow">
                {String(countdownTime.days).padStart(2, "0")}
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider mt-1 opacity-90">
                วัน (DAYS)
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-cc-coral text-white border-3 border-cc-navy shadow-solid text-center">
              <div className="font-display font-black text-3xl sm:text-5xl text-white">
                {String(countdownTime.hours).padStart(2, "0")}
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider mt-1 opacity-90">
                ชั่วโมง (HOURS)
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-cc-yellow text-cc-navy border-3 border-cc-navy shadow-solid text-center">
              <div className="font-display font-black text-3xl sm:text-5xl text-cc-navy">
                {String(countdownTime.minutes).padStart(2, "0")}
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider mt-1 text-cc-navy/80">
                นาที (MINS)
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-600 text-white border-3 border-cc-navy shadow-solid text-center">
              <div className="font-display font-black text-3xl sm:text-5xl text-white">
                {String(countdownTime.seconds).padStart(2, "0")}
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider mt-1 opacity-90">
                วินาที (SECS)
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-cc-navy/10 space-y-4">
            <p className="text-xs text-gray-500 font-mono">
              💡 ระหว่างรอเปิดระบบ สามารถอ่านรายละเอียดบทบาทหน้าที่ของฝ่ายต่าง ๆ เพื่อเตรียมตัวเลือกฝ่ายที่สนใจได้เลย
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/#departments"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cc-navy hover:bg-cc-blue text-white font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-cc-yellow" />
                <span>ดูรายละเอียด 12 ฝ่ายที่เปิดรับ</span>
              </a>

              <a
                href="/status"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cc-cream hover:bg-white text-cc-navy font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-cc-coral" />
                <span>หน้าตรวจสอบสถานะ</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If Registration has already closed
  if (mounted && regStatus === "closed" && !isPreviewMode) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 animate-fadeIn">
        <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 border-2 border-cc-navy text-rose-600 flex items-center justify-center mx-auto shadow-solid-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 uppercase tracking-wider">
              REGISTRATION CLOSED
            </span>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-cc-navy">
              ระบบปิดรับสมัครพี่ค่าย Comclick 20 แล้ว
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              สิ้นสุดระยะเวลาเปิดรับสมัครเมื่อวันที่ <strong>{CAMP_INFO.registrationDeadline}</strong> ท่านสามารถตรวจสอบผลการคัดเลือกหรือสถานะใบสมัครได้ที่เมนูด้านล่าง
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <a
              href="/status"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cc-navy hover:bg-cc-blue text-white font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-cc-yellow" />
              <span>ไปที่หน้าตรวจสอบสถานะ</span>
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
            สาขาคอมพิวเตอร์ศึกษา คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cc-cream border border-cc-navy/20 text-xs font-semibold text-cc-navy">
              <Clock className="w-3.5 h-3.5 text-cc-coral" />
              <span>เปิดรับสมัคร: <strong>{CAMP_INFO.registrationPeriod}</strong></span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              <span>*เปิดรับนักศึกษาชั้นปีที่ 1 - 3 (ทุกคณะใน มข.)</span>
            </span>
          </div>
        </div>

        {/* Duplicate Application Detected Banner */}
        {duplicateInfo && (
          <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-900 space-y-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-amber-950">พบข้อมูลการสมัครในระบบแล้ว</h4>
                <p className="text-xs text-amber-800 mt-1">
                  รหัสนักศึกษา <strong>{duplicateInfo.studentId}</strong> ได้ทำการส่งใบสมัครเข้าร่วมโครงการแล้ว
                  {duplicateInfo.appId && ` (รหัสใบสมัคร: ${duplicateInfo.appId})`}
                </p>
              </div>
            </div>
            <div className="pt-1">
              <a
                href={`/status?q=${encodeURIComponent(duplicateInfo.studentId)}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cc-navy hover:bg-cc-blue text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Search className="w-4 h-4 text-cc-yellow" />
                <span>ตรวจสอบสถานะของรหัสนักศึกษานี้</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && !duplicateInfo && (
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-500 text-red-700 flex items-center gap-3 text-xs sm:text-sm font-bold animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ========================================================= */}
          {/* ส่วนที่ 1: ข้อมูลทั่วไป                                    */}
          {/* ========================================================= */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-2.5 border-b-2 border-cc-navy/15">
              <div className="w-8 h-8 rounded-xl bg-cc-blue text-white flex items-center justify-center font-bold text-xs border border-cc-navy shadow-sm">
                01
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-cc-navy">
                  ส่วนที่ 1: ข้อมูลทั่วไป
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  ข้อมูลพื้นฐานของผู้สมัครและการติดต่อ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1.1 คำนำหน้า + ชื่อ - สกุล */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  คำนำหน้า และ ชื่อ - สกุล <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-2">
                  {/* Title Prefix Dropdown */}
                  <select
                    value={titlePrefix}
                    onChange={(e) => {
                      setTitlePrefix(e.target.value);
                      clearFieldError("input-fullName");
                    }}
                    className="w-28 sm:w-32 px-3 py-3 rounded-xl border-2 border-cc-navy bg-cc-cream/40 text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer focus:bg-white focus:border-cc-blue shadow-sm flex-shrink-0"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="นาง">นาง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>

                  {/* Name Input */}
                  <div className="relative flex-1">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-fullName"
                      type="text"
                      required
                      placeholder="ชื่อและนามสกุล (เช่น สมชาย ใจดี)"
                      value={nameInput}
                      onChange={(e) => {
                        setNameInput(e.target.value);
                        clearFieldError("input-fullName");
                      }}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl border-2 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium ${
                        fieldErrors["input-fullName"]
                          ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                          : "border-cc-navy focus:bg-cc-cream-50 focus:border-cc-blue"
                      }`}
                    />
                  </div>
                </div>

                {nameInput.trim() && (
                  <p className="text-[11px] text-gray-500">
                    ชื่อที่จะบันทึก: <strong className="text-cc-navy">{getCleanFullName()}</strong>
                  </p>
                )}
              </div>

              {/* 1.2 ชื่อเล่น */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  ชื่อเล่น <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Heart className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-nickname"
                    type="text"
                    required
                    placeholder="เช่น ปอนด์, ติน, ก้อง"
                    value={nicknameInput}
                    onChange={(e) => {
                      setNicknameInput(e.target.value);
                      clearFieldError("input-nickname");
                    }}
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border-2 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium ${
                      fieldErrors["input-nickname"]
                        ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                        : "border-cc-navy focus:bg-cc-cream-50 focus:border-cc-blue"
                    }`}
                  />
                </div>
              </div>

              {/* 1.3 รหัสนักศึกษา (มีขีด XXXXXXXXX-X) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy flex items-center justify-between">
                  <span>รหัสนักศึกษา (มีขีด) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] font-mono text-gray-500 font-normal">10 หลัก</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-studentId"
                    type="text"
                    required
                    maxLength={11}
                    placeholder="เช่น 663050123-4"
                    value={studentIdInput}
                    onChange={(e) => {
                      setStudentIdInput(formatStudentId(e.target.value, studentIdInput));
                      clearFieldError("input-studentId");
                    }}
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border-2 bg-white text-xs sm:text-sm font-mono text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium ${
                      fieldErrors["input-studentId"]
                        ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                        : "border-cc-navy focus:bg-cc-cream-50 focus:border-cc-blue"
                    }`}
                  />
                </div>
              </div>

              {/* 1.4 คณะ (เปิดรับทุกคณะใน มข.) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  คณะที่สังกัด (มหาวิทยาลัยขอนแก่น) <span className="text-red-500">*</span>
                </label>
                <select
                  value={facultyChoice}
                  onChange={(e) => {
                    setFacultyChoice(e.target.value);
                    clearFieldError("input-custom-faculty");
                  }}
                  className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer shadow-sm focus:border-cc-blue focus:bg-cc-cream-50"
                >
                  {KKU_FACULTIES.map((fac) => (
                    <option key={fac} value={fac}>
                      {fac}
                    </option>
                  ))}
                </select>

                {facultyChoice === "อื่นๆ (โปรดระบุ)" && (
                  <div className="pt-1 animate-fadeIn">
                    <input
                      id="input-custom-faculty"
                      type="text"
                      required
                      placeholder="กรอกชื่อคณะของคุณ เช่น วิทยาลัยนานาชาติ, คณะเกษตรศาสตร์ ฯลฯ"
                      value={customFacultyInput}
                      onChange={(e) => {
                        setCustomFacultyInput(e.target.value);
                        clearFieldError("input-custom-faculty");
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium ${
                        fieldErrors["input-custom-faculty"]
                          ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                          : "border-cc-navy focus:bg-cc-cream-50 focus:border-cc-blue"
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* 1.5 สาขาวิชา */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  สาขาวิชา <span className="text-red-500">*</span>
                </label>

                {facultyChoice === "คณะศึกษาศาสตร์" ? (
                  <div className="space-y-1.5">
                    <select
                      value={educationMajorChoice}
                      onChange={(e) => {
                        setEducationMajorChoice(e.target.value);
                        clearFieldError("input-custom-major");
                      }}
                      className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer shadow-sm focus:border-cc-blue focus:bg-cc-cream-50"
                    >
                      {EDUCATION_MAJORS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    {educationMajorChoice === "อื่นๆ (โปรดระบุ)" && (
                      <input
                        id="input-custom-major"
                        type="text"
                        required
                        placeholder="กรอกชื่อสาขาวิชาของคุณ"
                        value={customMajorInput}
                        onChange={(e) => {
                          setCustomMajorInput(e.target.value);
                          clearFieldError("input-custom-major");
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium animate-fadeIn ${
                          fieldErrors["input-custom-major"]
                            ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                            : "border-cc-navy focus:bg-cc-cream-50 focus:border-cc-blue"
                        }`}
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-custom-major"
                      type="text"
                      required
                      placeholder="กรอกชื่อสาขาวิชา เช่น วิทยาการคอมพิวเตอร์, การตลาด ฯลฯ"
                      value={customMajorInput}
                      onChange={(e) => {
                        setCustomMajorInput(e.target.value);
                        clearFieldError("input-custom-major");
                      }}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl border-2 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium ${
                        fieldErrors["input-custom-major"]
                          ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                          : "border-cc-navy focus:bg-cc-cream-50 focus:border-cc-blue"
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* 1.6 ชั้นปี (เปิดรับเฉพาะปี 1 - 3) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-cc-blue" />
                  <span>ชั้นปี (เปิดรับเฉพาะปี 1 - 3) <span className="text-red-500">*</span></span>
                </label>
                <div className="relative">
                  <select
                    value={yearLevel}
                    onChange={(e) => {
                      setYearLevel(e.target.value);
                      clearFieldError();
                    }}
                    className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer shadow-sm focus:bg-cc-cream-50 focus:border-cc-blue transition-all"
                  >
                    {STAFF_YEAR_OPTIONS.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 1.7 เบอร์โทรศัพท์ (ไม่มีขีด 10 หลัก) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy flex items-center justify-between">
                  <span>เบอร์โทรศัพท์ (ไม่มีขีด) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] font-mono text-gray-500 font-normal">ตัวเลข 10 หลัก</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-phone"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="เช่น 0891234567"
                    value={phoneInput}
                    onChange={(e) => {
                      setPhoneInput(formatPhone(e.target.value));
                      clearFieldError("input-phone");
                    }}
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border-2 bg-white text-xs sm:text-sm font-mono text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium ${
                      fieldErrors["input-phone"]
                        ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                        : "border-cc-navy focus:bg-cc-cream-50 focus:border-cc-blue"
                    }`}
                  />
                </div>
              </div>

              {/* 1.8 ชื่อ Facebook ของตนเอง */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  ชื่อ Facebook ของตนเอง <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Facebook className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-facebookName"
                    type="text"
                    required
                    placeholder="เช่น Somchai Jaidee"
                    value={facebookNameInput}
                    onChange={(e) => {
                      setFacebookNameInput(e.target.value);
                      clearFieldError("input-facebookName");
                    }}
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border-2 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium ${
                      fieldErrors["input-facebookName"]
                        ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                        : "border-cc-navy focus:bg-cc-cream-50 focus:border-cc-blue"
                    }`}
                  />
                </div>
              </div>

              {/* 1.9 Link Facebook ของตนเอง */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  Link Facebook ของตนเอง <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-facebookUrl"
                    type="url"
                    required
                    placeholder="เช่น https://www.facebook.com/username หรือ https://facebook.com/profile.php?id=..."
                    value={facebookUrlInput}
                    onChange={(e) => {
                      setFacebookUrlInput(e.target.value);
                      clearFieldError("input-facebookUrl");
                    }}
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border-2 bg-white text-xs sm:text-sm font-mono text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium ${
                      fieldErrors["input-facebookUrl"]
                        ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                        : "border-cc-navy focus:bg-cc-cream-50 focus:border-cc-blue"
                    }`}
                  />
                </div>
              </div>

              {/* 1.10 อาหารที่แพ้ / การรับประทานอาหาร */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-cc-blue" />
                    <span>อาหารที่แพ้ / การรับประทานอาหาร <span className="text-red-500">*</span></span>
                  </span>
                  <span className="text-[10px] text-gray-500 font-normal">สำหรับจัดเตรียมอาหารและสวัสดิการในค่าย</span>
                </label>
                <div className="space-y-2">
                  <select
                    id="select-diet"
                    value={dietChoice}
                    onChange={(e) => {
                      setDietChoice(e.target.value);
                      clearFieldError("input-custom-diet");
                    }}
                    className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer shadow-sm focus:bg-cc-cream-50 focus:border-cc-blue transition-all"
                  >
                    {DIET_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {dietChoice === "แพ้อาหาร / อื่นๆ (โปรดระบุ)" && (
                    <div className="pt-1 animate-fadeIn">
                      <input
                        id="input-custom-diet"
                        type="text"
                        required
                        placeholder="ระบุอาหารที่แพ้ หรือข้อจำกัดด้านอาหาร เช่น แพ้อาหารทะเล, แพ้ถั่วลิสง, แพ้นมวัว, ไม่ทานเนื้อวัว ฯลฯ"
                        value={dietCustomInput}
                        onChange={(e) => {
                          setDietCustomInput(e.target.value);
                          clearFieldError("input-custom-diet");
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium ${
                          fieldErrors["input-custom-diet"]
                            ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                            : "border-cc-navy focus:bg-cc-cream-50 focus:border-cc-blue"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* ส่วนที่ 2: คำถามแสดงทัศนคติและความตั้งใจ                  */}
          {/* ========================================================= */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-2.5 border-b-2 border-cc-navy/15">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs border border-cc-navy shadow-sm">
                02
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-cc-navy">
                  ส่วนที่ 2: ทัศนคติและความตั้งใจ
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  บอกเล่าตัวตนและเหตุผลที่คุณอยากมาร่วมสร้างค่ายด้วยกัน
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* 2.1 เพราะเหตุใดจึงสนใจสมัคร */}
              <div className="space-y-2 p-4 sm:p-5 rounded-2xl bg-purple-50/50 border-2 border-purple-300">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy leading-relaxed">
                  2.1 เพราะเหตุใดผู้สมัครจึงสนใจหรือต้องการสมัครเป็นพี่ค่ายคอมคลิก ครั้งที่ 20 สาขาคอมพิวเตอร์ศึกษา คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น ? (พอสังเขป) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="input-reasonToApply"
                  required
                  rows={3}
                  placeholder="เขียนอธิบายเหตุผล ความตั้งใจ หรือแรงบันดาลใจในการสมัครเป็นพี่ค่าย Comclick 20 พอสังเขป..."
                  value={reasonToApply}
                  onChange={(e) => {
                    setReasonToApply(e.target.value);
                    clearFieldError("input-reasonToApply");
                  }}
                  className={`w-full p-3.5 rounded-xl border-2 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium resize-y ${
                    fieldErrors["input-reasonToApply"]
                      ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                      : "border-purple-300 focus:border-cc-navy focus:bg-white"
                  }`}
                />
              </div>

              {/* 2.2 ข้อดีของตนเอง */}
              <div className="space-y-2 p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border-2 border-emerald-300">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  2.2 ข้อดีของตนเอง (พอสังเขป) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="input-strengths"
                  required
                  rows={2}
                  placeholder="เช่น เป็นคนตรงต่อเวลา มีความรับผิดชอบ เข้ากับคนง่าย มีทักษะการทำงานเป็นทีม เป็นต้น"
                  value={strengths}
                  onChange={(e) => {
                    setStrengths(e.target.value);
                    clearFieldError("input-strengths");
                  }}
                  className={`w-full p-3.5 rounded-xl border-2 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium resize-y ${
                    fieldErrors["input-strengths"]
                      ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                      : "border-emerald-300 focus:border-cc-navy focus:bg-white"
                  }`}
                />
              </div>

              {/* 2.3 ข้อเสียของตนเอง */}
              <div className="space-y-2 p-4 sm:p-5 rounded-2xl bg-amber-50/50 border-2 border-amber-300">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  2.3 ข้อเสียของตนเอง (พอสังเขป) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="input-weaknesses"
                  required
                  rows={2}
                  placeholder="เช่น บางครั้งเป็นคนคิดมาก แต่พยายามปรับตัวและรับฟังความเห็นผู้อื่นอยู่เสมอ เป็นต้น"
                  value={weaknesses}
                  onChange={(e) => {
                    setWeaknesses(e.target.value);
                    clearFieldError("input-weaknesses");
                  }}
                  className={`w-full p-3.5 rounded-xl border-2 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-sm font-medium resize-y ${
                    fieldErrors["input-weaknesses"]
                      ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                      : "border-amber-300 focus:border-cc-navy focus:bg-white"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* ส่วนที่ 3: ฝ่ายที่ต้องการสมัคร & คำถามพิเศษเฉพาะฝ่าย        */}
          {/* ========================================================= */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-2.5 border-b-2 border-cc-navy/15">
              <div className="w-8 h-8 rounded-xl bg-cc-coral text-white flex items-center justify-center font-bold text-xs border border-cc-navy shadow-sm">
                03
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-cc-navy">
                  ส่วนที่ 3: ฝ่ายที่ต้องการสมัคร & คำถามพิเศษ
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  เลือกฝ่ายที่ต้องการลงปฏิบัติงานตามความถนัดและความสนใจ (12 ฝ่ายที่เปิดรับสมัคร *ไม่รวมฝ่ายอำนวยการ)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Choice 1 */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-blue-50/60 border-2 border-cc-blue">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  ฝ่ายที่ต้องการลง ฝ่ายที่ 1 (อันดับ 1) <span className="text-red-500">*</span>
                </label>
                <select
                  id="select-choice1"
                  value={firstChoiceDeptId}
                  onChange={(e) => {
                    handleFirstChoiceChange(e.target.value);
                    clearFieldError("select-choice1");
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border-2 bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer shadow-sm ${
                    fieldErrors["select-choice1"]
                      ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                      : "border-cc-navy"
                  }`}
                >
                  {OPEN_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nameTh}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 font-medium">
                  {OPEN_DEPARTMENTS.find((d) => d.id === firstChoiceDeptId)?.shortDesc}
                </p>
              </div>

              {/* Choice 2 */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-orange-50/60 border-2 border-cc-coral">
                <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                  ฝ่ายที่ต้องการลง ฝ่ายที่ 2 (อันดับ 2)
                </label>
                <select
                  id="select-choice2"
                  value={secondChoiceDeptId}
                  onChange={(e) => {
                    setSecondChoiceDeptId(e.target.value);
                    clearFieldError("select-choice2");
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border-2 bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer shadow-sm ${
                    fieldErrors["select-choice2"]
                      ? "border-red-500 ring-4 ring-red-200 bg-red-50/50 animate-shake"
                      : "border-cc-navy"
                  }`}
                >
                  <option value="-">- (ไม่ต้องการลงฝ่ายอื่น / ไม่เลือกอันดับ 2)</option>
                  <optgroup label="เลือกฝ่ายสำรองอันดับที่ 2">
                    {OPEN_DEPARTMENTS.map((dept) => {
                      const isSelectedInFirst = dept.id === firstChoiceDeptId;
                      return (
                        <option
                          key={dept.id}
                          value={dept.id}
                          disabled={isSelectedInFirst}
                          className={isSelectedInFirst ? "text-gray-400 bg-gray-100" : ""}
                        >
                          {dept.nameTh} {isSelectedInFirst ? "(เลือกในอันดับที่ 1 แล้ว)" : ""}
                        </option>
                      );
                    })}
                  </optgroup>
                </select>
                <p className="text-[11px] text-gray-500 font-medium">
                  {secondChoiceDeptId === "-" || secondChoiceDeptId === "none"
                    ? "💡 ไม่ประสงค์เลือกฝ่ายสำรอง (ต้องการลงเฉพาะฝ่ายอันดับที่ 1 เท่านั้น)"
                    : OPEN_DEPARTMENTS.find((d) => d.id === secondChoiceDeptId)?.shortDesc}
                </p>
              </div>
            </div>

            {/* Fallback Dept Choice */}
            <div className="p-4 sm:p-5 rounded-2xl bg-cc-cream border-2 border-cc-navy space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-cc-navy">
                ถ้าไม่ติดอันดับที่ 1 และ 2 อยากลงฝ่ายไหน? <span className="text-red-500">*</span>
              </label>
              <select
                value={fallbackDeptChoice}
                onChange={(e) => setFallbackDeptChoice(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none cursor-pointer shadow-sm"
              >
                <option value="ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร">
                  ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร (แนะนำ)
                </option>
                <option value="-">
                  - (ไม่ประสงค์ลงฝ่ายอื่นหากไม่ติดอันดับที่เลือก)
                </option>
                <optgroup label="หรือระบุเลือกฝ่ายสำรองเฉพาะเจาะจง">
                  {OPEN_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.nameTh}>
                      {dept.nameTh}
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="text-[11px] text-gray-600">
                💡 หากฝ่ายที่คุณเลือกมีผู้สมัครเต็ม คณะกรรมการจะพิจารณาจัดสรรตามตัวเลือกนี้
              </p>
            </div>

            {/* ========================================================= */}
            {/* Special Question 1: ฝ่ายเทคโนโลยีและประชาสัมพันธ์          */}
            {/* ========================================================= */}
            {isTechPRSelected && (
              <div className="p-5 rounded-3xl bg-indigo-50/80 border-3 border-indigo-500 shadow-solid space-y-4 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 border-2 border-cc-navy shadow-sm">
                    <FolderUp className="w-5 h-5 text-cc-yellow" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-300">
                      คำถามพิเศษ: ฝ่ายเทคโนโลยีและประชาสัมพันธ์
                    </span>
                    <h4 className="font-display font-black text-base text-cc-navy">
                      อัปโหลดผลงาน (Portfolio / ตัวอย่างผลงานมีเดีย)
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      สำหรับผู้ที่สมัครฝ่ายเทคโนโลยีและประชาสัมพันธ์ (ไม่ว่าจะเลือกอันดับ 1 หรืออันดับ 2) ให้กดปุ่มด้านล่างเพื่ออัปโหลดผลงานลงในโฟลเดอร์ Google Drive ของค่าย
                    </p>
                  </div>
                </div>

                {/* Google Drive Action Button */}
                <div className="pt-1">
                  <a
                    href={TECH_PR_DRIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <FolderUp className="w-4 h-4 text-cc-yellow" />
                    <span>กดเปิด Google Drive เพื่ออัปโหลดผลงาน</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>

                {/* Drive naming recommendation note */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-indigo-200 text-xs text-indigo-950 space-y-1.5 shadow-sm">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-900 text-xs">
                    <span>💡 คำแนะนำการตั้งชื่อไฟล์ / โฟลเดอร์ผลงานใน Google Drive:</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    กรุณาตั้งชื่อไฟล์หรือโฟลเดอร์ผลงานของคุณตามรูปแบบ:
                  </p>
                  <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 font-mono font-bold text-indigo-900 text-xs">
                    ชื่อเล่น-สาขา-ชั้นปี
                  </div>
                  <p className="text-[11px] text-gray-500">
                    (ตัวอย่างเช่น: <code className="text-indigo-700 font-mono font-bold">ปอนด์-คอมพิวเตอร์ศึกษา-ปี1</code>)
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* Special Question 2: ฝ่ายรถเร็ว                             */}
            {/* ========================================================= */}
            {isFastResponseSelected && (
              <div id="section-hasCar" className={`p-5 rounded-3xl bg-amber-50/80 border-3 shadow-solid space-y-4 animate-fadeIn transition-all ${
                fieldErrors["section-hasCar"] ? "border-red-500 ring-4 ring-red-200 animate-shake" : "border-amber-500"
              }`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 border-2 border-cc-navy shadow-sm">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      คำถามพิเศษ: ฝ่ายรถเร็ว
                    </span>
                    <h4 className="font-display font-black text-base text-cc-navy">
                      ข้อมูลยานพาหนะสำหรับภารกิจฝ่ายรถเร็ว
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      สำหรับผู้ที่สมัครฝ่ายรถเร็ว (ไม่ว่าจะเลือกอันดับ 1 หรืออันดับ 2) เพื่อใช้ในการวางแผนจัดสรรยานพาหนะและภารกิจเดินทาง
                    </p>
                  </div>
                </div>

                {/* Question: Do you have a car? (ใช่ / ไม่) */}
                <div className="space-y-2 pt-1">
                  <label className="block text-xs sm:text-sm font-bold text-amber-950">
                    คุณมีรถยนต์หรือไม่? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setHasCar("ใช่");
                        clearFieldError("section-hasCar");
                      }}
                      className={`py-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                        hasCar === "ใช่"
                          ? "bg-amber-500 text-white border-cc-navy shadow-solid-sm"
                          : "bg-white text-gray-700 border-amber-300 hover:bg-amber-100/50"
                      }`}
                    >
                      ✓ ใช่ (มีรถยนต์)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHasCar("ไม่");
                        clearFieldError("section-hasCar");
                      }}
                      className={`py-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                        hasCar === "ไม่"
                          ? "bg-amber-500 text-white border-cc-navy shadow-solid-sm"
                          : "bg-white text-gray-700 border-amber-300 hover:bg-amber-100/50"
                      }`}
                    >
                      ✗ ไม่ (ไม่มีรถยนต์)
                    </button>
                  </div>
                </div>

                {/* If Yes: Select Car Type (รถเก๋ง / รถกระบะ / อื่นๆ) */}
                {hasCar === "ใช่" && (
                  <div className="space-y-2 pt-2 border-t border-amber-200 animate-fadeIn">
                    <label className="block text-xs sm:text-sm font-bold text-amber-950">
                      ประเภทรถยนต์ของคุณ:
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(["รถเก๋ง", "รถกระบะ", "อื่นๆ"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setCarType(type)}
                          className={`py-2.5 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                            carType === type
                              ? "bg-cc-navy text-white border-cc-navy shadow-solid-sm"
                              : "bg-white text-gray-700 border-amber-300 hover:bg-amber-100/50"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {carType === "อื่นๆ" && (
                      <div className="pt-1 animate-fadeIn">
                        <input
                          type="text"
                          placeholder="ระบุประเภทรถยนต์ เช่น รถ SUV, รถตู้, รถกระบะ 4 ประตู ฯลฯ"
                          value={carTypeOther}
                          onChange={(e) => setCarTypeOther(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-300 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:border-cc-navy outline-none shadow-sm font-medium"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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

      {/* Success Modal / Digital Slip (Portaled to document.body for true window viewport centering) */}
      {mounted &&
        typeof document !== "undefined" &&
        createdApplication &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-3 border-cc-navy shadow-solid-lg text-center space-y-5 animate-scaleUp my-auto max-h-[92vh] overflow-y-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto border-2 border-cc-navy shadow-solid-sm flex-shrink-0">
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
                <div className="flex justify-between items-center border-b border-cc-navy/10 pb-2 font-bold">
                  <span className="text-gray-500">รหัสใบสมัคร:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-cc-navy text-sm font-black">{createdApplication.id}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(createdApplication.id)}
                      className="p-1 rounded-md bg-white border border-cc-navy/30 hover:bg-cc-yellow text-cc-navy transition-all cursor-pointer"
                      title="คัดลอกรหัสใบสมัคร"
                    >
                      {isCopied ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>คัดลอกแล้ว!</span>
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ชื่อ - สกุล (ชื่อเล่น):</span>
                  <span className="font-bold text-gray-800">
                    {createdApplication.fullNameTh} {createdApplication.nicknameTh && `(${createdApplication.nicknameTh})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">รหัสนักศึกษา / ชั้นปี:</span>
                  <span className="font-bold text-gray-800">
                    {createdApplication.studentId} • {createdApplication.year || "ปี 1"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">คณะ / สาขาวิชา:</span>
                  <span className="font-bold text-gray-800 text-right truncate max-w-[210px]" title={`${createdApplication.faculty} • ${createdApplication.major}`}>
                    {createdApplication.faculty} • {createdApplication.major}
                  </span>
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
                    {createdApplication.secondChoiceDeptId === "-" || createdApplication.secondChoiceDeptId === "none" || !createdApplication.secondChoiceDeptId
                      ? "-"
                      : DEPARTMENTS.find((d) => d.id === createdApplication.secondChoiceDeptId)?.nameTh || createdApplication.secondChoiceDeptId}
                  </span>
                </div>
                {createdApplication.diet && (
                  <div className="flex justify-between border-t border-cc-navy/10 pt-1.5">
                    <span className="text-gray-500">อาหาร / ข้อจำกัด:</span>
                    <span className="font-bold text-gray-800 text-right truncate max-w-[210px]" title={createdApplication.diet}>
                      {createdApplication.diet}
                    </span>
                  </div>
                )}
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
                    setNicknameInput("");
                    setStudentIdInput("");
                    setFacultyChoice("คณะศึกษาศาสตร์");
                    setCustomFacultyInput("");
                    setEducationMajorChoice("สาขาวิชาคอมพิวเตอร์ศึกษา");
                    setCustomMajorInput("");
                    setYearLevel("ชั้นปีที่ 1");
                    setPhoneInput("");
                    setFacebookNameInput("");
                    setFacebookUrlInput("");
                    setDietChoice("ทานได้ทุกอย่าง (ไม่แพ้อาหาร)");
                    setDietCustomInput("");
                    setReasonToApply("");
                    setStrengths("");
                    setWeaknesses("");
                    setTechPortfolioUrl("");
                    setHasCar("");
                    setCarType("");
                    setCarTypeOther("");
                    setFirstChoiceDeptId(DEPARTMENTS[0]?.id || "protocol");
                    setSecondChoiceDeptId(DEPARTMENTS[1]?.id || "fundraising");
                    setFallbackDeptChoice("ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร");
                  }}
                  className="py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-cc-navy font-bold text-xs sm:text-sm border-2 border-cc-navy/20 transition-all cursor-pointer"
                >
                  สมัครเพิ่มอีกคน
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Duplicate Application Popup Modal */}
      {mounted &&
        typeof document !== "undefined" &&
        duplicateInfo &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border-3 border-cc-navy shadow-solid-lg text-center space-y-5 animate-scaleUp my-auto max-h-[92vh] overflow-y-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-cc-navy text-amber-600 flex items-center justify-center mx-auto shadow-solid-sm flex-shrink-0">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 uppercase tracking-wider">
                  DUPLICATE APPLICATION DETECTED
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-cc-navy">
                  พบข้อมูลการสมัครในระบบแล้ว
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  รหัสนักศึกษา <strong className="text-cc-navy font-mono text-sm">{duplicateInfo.studentId}</strong> ได้ทำการส่งใบสมัครเข้าร่วมโครงการ Comclick 20 เรียบร้อยแล้ว
                </p>
              </div>

              {duplicateInfo.appId && (
                <div className="p-3.5 rounded-2xl bg-cc-cream border-2 border-cc-navy/30 text-left font-mono text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-500">รหัสใบสมัครเดิม:</span>
                    <span className="text-cc-navy font-mono text-sm font-black">{duplicateInfo.appId}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-sans">
                    💡 หากต้องการตรวจสอบผลการคัดเลือกหรือเปลี่ยนฝ่าย สามารถกดปุ่มด้านล่างได้เลย
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <a
                  href={`/status?q=${encodeURIComponent(duplicateInfo.studentId)}`}
                  className="w-full py-3.5 rounded-xl bg-cc-navy hover:bg-cc-blue text-white font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-cc-yellow" />
                  <span>ไปที่หน้าตรวจสอบสถานะทันที</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={() => setDuplicateInfo(null)}
                  className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs border border-gray-300 transition-all cursor-pointer"
                >
                  ปิดหน้าต่างนี้เพื่อแก้ไขข้อมูล
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
