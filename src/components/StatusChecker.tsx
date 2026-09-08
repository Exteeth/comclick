"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Application, ApplicationStatus } from "@/lib/types";
import { DEPARTMENTS } from "@/lib/constants";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Layers,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Award,
  Check,
  Mic,
  Calendar,
  MapPin,
  Mail,
  HeartPulse,
  Pill,
  Copy,
  CheckCheck,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function StatusChecker() {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Application | null | "NOT_FOUND">(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Confirmation Flow States
  const [kkuMailPrefix, setKkuMailPrefix] = useState("");
  const [hasMedicalCondition, setHasMedicalCondition] = useState(false);
  const [medicalConditionInput, setMedicalConditionInput] = useState("");
  const [drugAllergyInput, setDrugAllergyInput] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [isCopiedFb, setIsCopiedFb] = useState(false);

  const fetchStatusRealtime = useCallback(async (searchQuery: string, isManualRefresh = false) => {
    if (!searchQuery.trim()) return;

    if (isManualRefresh) setIsRefreshing(true);
    else setIsSearching(true);

    try {
      // 1. Fetch live directly from Neon DB / API endpoint with no-cache
      const res = await fetch(`/api/status?q=${encodeURIComponent(searchQuery.trim())}`, {
        cache: "no-store",
        headers: { "Pragma": "no-cache" },
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSearchResult(json.data);
        setLastSyncedTime(new Date().toLocaleTimeString("th-TH"));

        // Prefill existing confirmation data if present
        if (json.data.kkuMail) {
          setKkuMailPrefix(json.data.kkuMail.replace(/@.*$/, ""));
        }
        if (json.data.medicalConditions && json.data.medicalConditions !== "ไม่มี") {
          setHasMedicalCondition(true);
          setMedicalConditionInput(json.data.medicalConditions);
        }
        if (json.data.drugAllergies && json.data.drugAllergies !== "ไม่มี") {
          setHasMedicalCondition(true);
          setDrugAllergyInput(json.data.drugAllergies);
        }
        if (String(json.data.status).toUpperCase() === "CONFIRMED") {
          setConfirmSuccess(true);
        } else {
          setConfirmSuccess(false);
        }
        setConfirmError(null);
      } else {
        setSearchResult("NOT_FOUND");
      }
    } catch (err) {
      console.warn("Status fetch error:", err);
      setSearchResult("NOT_FOUND");
    } finally {
      setIsSearching(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchStatusRealtime(query);
  };

  const handleCopyFbLink = () => {
    try {
      navigator.clipboard.writeText("https://www.facebook.com/groups/staffcomclick20/");
      setIsCopiedFb(true);
      setTimeout(() => setIsCopiedFb(false), 2500);
    } catch (e) {
      // fallback
    }
  };

  const handleConfirmRights = async (appId: string) => {
    const cleanMailPrefix = kkuMailPrefix.trim().replace(/@.*$/, "");
    if (!cleanMailPrefix) {
      setConfirmError("กรุณากรอกชื่ออีเมล KKU Mail ก่อนยืนยันสิทธิ์");
      return;
    }

    if (hasMedicalCondition) {
      if (!medicalConditionInput.trim() && !drugAllergyInput.trim()) {
        setConfirmError("เนื่องจากท่านเลือกมีข้อมูลแพ้ยา/โรคประจำตัว กรุณาระบุรายละเอียดโรคประจำตัวหรือยาที่แพ้ (หากไม่มีให้ระบุว่า ไม่มี)");
        return;
      }
    }

    const fullKkuMail = `${cleanMailPrefix}@kkumail.com`;
    const finalMedical = hasMedicalCondition ? (medicalConditionInput.trim() || "ไม่มี") : "ไม่มี";
    const finalAllergies = hasMedicalCondition ? (drugAllergyInput.trim() || "ไม่มี") : "ไม่มี";

    setConfirmError(null);
    setIsConfirming(true);

    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appId,
          action: "confirm_rights",
          kkuMail: fullKkuMail,
          medicalConditions: finalMedical,
          drugAllergies: finalAllergies,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setConfirmSuccess(true);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (cErr) {
          // ignore
        }

        // Instantly update local state to reflect CONFIRMED
        setSearchResult((prev) => {
          if (!prev || prev === "NOT_FOUND") return prev;
          return {
            ...prev,
            status: "CONFIRMED",
            kkuMail: fullKkuMail,
            medicalConditions: finalMedical,
            drugAllergies: finalAllergies,
          };
        });
      } else {
        setConfirmError(json.error || "เกิดข้อผิดพลาดในการยืนยันสิทธิ์ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err) {
      setConfirmError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsConfirming(false);
    }
  };

  // Auto-sync status every 10 seconds if applicant is viewing
  useEffect(() => {
    if (!searchResult || searchResult === "NOT_FOUND") return;

    const interval = setInterval(() => {
      if (query.trim()) {
        fetchStatusRealtime(query, true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [searchResult, query, fetchStatusRealtime]);

  const getStatusBadge = (status: ApplicationStatus | string) => {
    const s = (status || "").toUpperCase();
    if (s === "ACCEPTED" || s === "CONFIRMED" || s === "INTERVIEW_PASSED") {
      return {
        label: "ผ่านการคัดเลือกเป็นพี่ค่าย Comclick 20!",
        color: "bg-emerald-500 text-white border-cc-navy",
        icon: Sparkles,
        desc: "ขอแสดงความยินดีด้วยอย่างยิ่ง! คุณผ่านการคัดเลือกเป็นทีมงานพี่ค่าย ComClick Camp #20",
      };
    }

    if (
      s === "INTERVIEW_ELIGIBLE" ||
      s === "INTERVIEW" ||
      s === "INTERVIEW_SCHEDULED" ||
      s === "DOCUMENT_PASSED"
    ) {
      return {
        label: "มีสิทธิ์เข้าสัมภาษณ์พี่ค่าย Comclick 20! 🎙️",
        color: "bg-purple-600 text-white border-cc-navy",
        icon: Mic,
        desc: "ขอแสดงความยินดีด้วย! คุณผ่านการพิจารณาคุณสมบัติรอบเอกสารและมีสิทธิ์เข้ารับการสัมภาษณ์เป็นพี่ค่าย ComClick Camp #20",
      };
    }

    if (s === "REJECTED") {
      return {
        label: "ไม่ผ่านการคัดเลือก",
        color: "bg-gray-100 text-gray-700 border-gray-400",
        icon: XCircle,
        desc: "ขอขอบคุณสำหรับความสนใจอย่างยิ่ง ทางโครงการหวังว่าจะได้ร่วมงานกับคุณในโอกาสต่อไป",
      };
    }

    return {
      label: "รอดำเนินการ (อยู่ระหว่างพิจารณา)",
      color: "bg-blue-100 text-blue-800 border-blue-400",
      icon: Clock,
      desc: "ใบสมัครของคุณอยู่ในระบบเรียบร้อยแล้ว อยู่ระหว่างการตรวจทานและจัดสรรฝ่ายโดยคณะกรรมการ",
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Box with Solid Border and Shadow */}
      <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-8">
        <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cc-cream text-cc-navy border border-cc-navy/20 text-xs font-mono font-bold">
            <Search className="w-3.5 h-3.5 text-cc-coral" />
            <span>REALTIME APPLICATION STATUS</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-cc-navy">
            ค้นหาและตรวจสอบสถานะการสมัคร
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-normal">
            กรอก <strong className="text-cc-navy">รหัสนักศึกษา</strong>, <strong className="text-cc-navy">เบอร์โทรศัพท์</strong> หรือ <strong className="text-cc-navy">รหัสใบสมัคร (CC20-...)</strong>
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="เช่น 663050123-4 หรือ 0891234567"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-cc-navy/30 focus:border-cc-navy bg-gray-50 text-sm font-bold text-cc-navy outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-8 py-3.5 rounded-xl bg-cc-navy hover:bg-cc-blue text-white font-display font-bold text-sm border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังค้นหา...</span>
                </>
              ) : (
                <span>ตรวจสอบ</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Not Found State */}
      {searchResult === "NOT_FOUND" && (
        <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid p-8 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display font-black text-xl text-cc-navy">ไม่พบข้อมูลการสมัคร</h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            กรุณาตรวจสอบรหัสนักศึกษา หรือเบอร์โทรศัพท์ที่ใช้สมัครอีกครั้ง หรือหากเพิ่งกรอกใบสมัคร กรุณารอสักครู่แล้วลองค้นหาใหม่
          </p>
          <div className="pt-2">
            <a
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cc-coral hover:bg-cc-coral-dark text-white font-bold text-xs border-2 border-cc-navy shadow-solid-sm transition-all"
            >
              <span>ไปที่หน้ากรอกใบสมัครพี่ค่าย</span>
            </a>
          </div>
        </div>
      )}

      {/* Result Card */}
      {searchResult && searchResult !== "NOT_FOUND" && (
        <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Header with Live Sync Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-[11px] text-gray-500 font-mono">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE DATABASE SYNC</span>
            </div>
            {lastSyncedTime && (
              <button
                onClick={() => fetchStatusRealtime(query, true)}
                className="flex items-center gap-1 text-cc-blue hover:text-cc-coral font-bold cursor-pointer transition-colors"
                title="รีเฟรชข้อมูลล่าสุดจากเซิร์ฟเวอร์"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>อัปเดตล่าสุด: {lastSyncedTime}</span>
              </button>
            )}
          </div>

          {/* Result Core */}
          {(() => {
            const rawStatus = (searchResult.status || "SUBMITTED").toUpperCase();
            const isAccepted = rawStatus === "ACCEPTED" || rawStatus === "CONFIRMED" || rawStatus === "INTERVIEW_PASSED";
            const isInterview = rawStatus === "INTERVIEW_ELIGIBLE" || rawStatus === "INTERVIEW" || rawStatus === "INTERVIEW_SCHEDULED" || rawStatus === "DOCUMENT_PASSED";
            const badge = getStatusBadge(searchResult.status);
            const BadgeIcon = badge.icon;

            const firstDept = DEPARTMENTS.find((d) => d.id === searchResult.firstChoiceDeptId);
            const secondDept = DEPARTMENTS.find((d) => d.id === searchResult.secondChoiceDeptId);
            
            // Final assigned department:
            const assignedDept = searchResult.assignedDeptId
              ? DEPARTMENTS.find((d) => d.id === searchResult.assignedDeptId)
              : isAccepted
              ? firstDept
              : null;

            return (
              <>
                {/* Applicant Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-cc-navy/10">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-500 block">
                      APPLICATION ID: {searchResult.id}
                    </span>
                    <h3 className="font-display font-black text-2xl text-cc-navy mt-0.5">
                      {searchResult.fullNameTh}
                    </h3>
                    <div className="text-xs text-gray-600 font-medium mt-1">
                      รหัสนักศึกษา: <span className="font-mono font-bold text-cc-navy">{searchResult.studentId}</span> • {searchResult.major}
                    </div>
                  </div>

                  <div
                    className={`px-4 py-2.5 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm ${badge.color}`}
                  >
                    <BadgeIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{badge.label}</span>
                  </div>
                </div>

                {/* 🌟 HERO 1: FINAL ASSIGNED DEPARTMENT (WHEN PASSED) */}
                {isAccepted && assignedDept ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-6 rounded-3xl bg-emerald-50 border-3 border-emerald-600 shadow-solid-sm space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>ผลการจัดสรรฝ่ายอย่างเป็นทางการ</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-emerald-500">
                        <div>
                          <span className="text-[11px] text-gray-500 font-bold block">
                            ฝ่ายที่คุณได้รับคัดเลือกเป็นพี่ค่าย Comclick 20 คือ:
                          </span>
                          <div className="font-display font-black text-2xl sm:text-3xl text-emerald-900 mt-1">
                            {assignedDept.nameTh}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            💡 <strong>หน้าที่หลัก:</strong> {assignedDept.shortDesc}
                          </p>
                        </div>

                        <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-center">
                          <Check className="w-4 h-4" />
                          <span>ผ่านการคัดเลือก</span>
                        </div>
                      </div>

                      {/* Historical applied choice reference for clarity */}
                      <div className="text-[11px] text-emerald-800/80 pt-1 flex flex-wrap gap-x-4 gap-y-1">
                        <span><strong>อันดับที่เลือกไว้ตอนสมัคร:</strong> อันดับ 1: {firstDept?.nameTh || searchResult.firstChoiceDeptId}</span>
                        <span>อันดับ 2: {secondDept?.nameTh || searchResult.secondChoiceDeptId}</span>
                      </div>
                    </div>

                    {/* CONFIRMATION SECTION: CONFIRMED OR PENDING CONFIRMATION */}
                    {rawStatus === "CONFIRMED" || confirmSuccess ? (
                      /* ✅ STATE 1: ALREADY CONFIRMED */
                      <div className="p-6 sm:p-7 rounded-3xl bg-emerald-50/80 border-3 border-emerald-600 shadow-solid-sm space-y-5 animate-fadeIn">
                        <div className="flex items-center justify-between gap-2 border-b border-emerald-200 pb-3">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>สถานะการยืนยันสิทธิ์: สำเร็จเรียบร้อยแล้ว</span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                            ยืนยันสิทธิ์แล้ว ✅
                          </span>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-400 space-y-3">
                          <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl border border-emerald-300 flex-shrink-0">
                              🎉
                            </div>
                            <div>
                              <h4 className="font-display font-black text-lg text-emerald-950">
                                ยืนยันสิทธิ์เป็นพี่ค่าย Comclick 20 เรียบร้อยแล้ว!
                              </h4>
                              <p className="text-xs text-gray-600 mt-0.5">
                                ข้อมูลของคุณได้รับการบันทึกในระบบเรียบร้อยแล้ว เตรียมพร้อมพบกับกิจกรรมสุดพิเศษได้เลย
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-emerald-100 text-xs">
                            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-0.5">
                              <span className="text-gray-500 font-bold block text-[10px] uppercase">
                                อีเมลมหาวิทยาลัย (KKU Mail)
                              </span>
                              <span className="font-mono font-bold text-emerald-950 text-sm">
                                {searchResult.kkuMail || `${kkuMailPrefix}@kkumail.com`}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-0.5">
                              <span className="text-gray-500 font-bold block text-[10px] uppercase">
                                ข้อมูลสุขภาพ / ประวัติแพ้ยา
                              </span>
                              <div className="text-emerald-950 font-medium text-xs leading-snug">
                                <div><strong>โรคประจำตัว:</strong> {searchResult.medicalConditions || medicalConditionInput || "ไม่มี"}</div>
                                <div><strong>ประวัติแพ้ยา:</strong> {searchResult.drugAllergies || drugAllergyInput || "ไม่มี"}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* FACEBOOK GROUP LINK CARD */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-2 border-cc-navy shadow-solid-sm space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold font-mono tracking-wider">
                                <span>COMMUNITY INVITATION</span>
                              </div>
                              <h4 className="font-display font-black text-xl text-white mt-1">
                                กลุ่ม Facebook พี่ค่าย Comclick 20
                              </h4>
                              <p className="text-xs text-blue-100 mt-0.5 max-w-lg leading-relaxed">
                                ขอให้น้องๆ พี่ค่ายทุกคนเข้าร่วมกลุ่ม Facebook เพื่อรับการนัดหมาย ประชุมฝ่าย และประสานงานค่ายอย่างเป็นทางการ
                              </p>
                            </div>

                            <a
                              href="https://www.facebook.com/groups/staffcomclick20/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 rounded-xl bg-white hover:bg-cc-cream text-blue-900 font-bold text-xs sm:text-sm border-2 border-white shadow-sm flex items-center justify-center gap-2 whitespace-nowrap transition-all self-start sm:self-center"
                            >
                              <span>เข้ากลุ่ม Facebook</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>

                          <div className="flex items-center gap-2 bg-black/25 p-3 rounded-xl text-xs font-mono">
                            <span className="text-blue-100 select-all truncate flex-1 font-medium">
                              www.facebook.com/groups/staffcomclick20/
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyFbLink}
                              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                            >
                              {isCopiedFb ? (
                                <>
                                  <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                                  <span>คัดลอกแล้ว</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>คัดลอกลิงก์</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ✍️ STATE 2: PENDING CONFIRMATION FORM */
                      <div className="p-6 sm:p-7 rounded-3xl bg-white border-3 border-cc-navy shadow-solid-sm space-y-5 animate-fadeIn">
                        <div className="border-b-2 border-cc-navy/10 pb-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cc-coral/10 text-cc-coral text-xs font-bold font-mono">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>CONFIRMATION REQUIRED</span>
                          </div>
                          <h3 className="font-display font-black text-xl sm:text-2xl text-cc-navy mt-1.5">
                            กรอกข้อมูลเพื่อยืนยันสิทธิ์เป็นพี่ค่าย Comclick 20
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            กรุณากรอกข้อมูลเพิ่มเติมก่อนกดยืนยันสิทธิ์ เพื่อใช้ในการติดต่อประสานงานและการดูแลความปลอดภัยตลอดค่าย
                          </p>
                        </div>

                        {confirmError && (
                          <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-medium">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                            <span>{confirmError}</span>
                          </div>
                        )}

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleConfirmRights(searchResult.id);
                          }}
                          className="space-y-4"
                        >
                          {/* 1. KKU Mail */}
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-cc-navy flex items-center gap-1.5">
                              <Mail className="w-4 h-4 text-cc-blue" />
                              <span>อีเมลมหาวิทยาลัยขอนแก่น (KKU Mail) <span className="text-cc-coral">*</span></span>
                            </label>
                            <div className="flex rounded-xl border-2 border-cc-navy/30 focus-within:border-cc-navy overflow-hidden shadow-sm bg-white transition-all">
                              <input
                                type="text"
                                placeholder="เช่น somchai.k"
                                value={kkuMailPrefix}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/@.*$/, "").trim();
                                  setKkuMailPrefix(val);
                                  if (confirmError) setConfirmError(null);
                                }}
                                className="flex-1 px-4 py-3 bg-transparent text-sm font-bold text-cc-navy outline-none placeholder:text-gray-400 placeholder:font-normal"
                                required
                              />
                              <div className="bg-cc-cream border-l-2 border-cc-navy/20 px-4 py-3 flex items-center text-xs font-mono font-bold text-cc-navy select-none">
                                @kkumail.com
                              </div>
                            </div>
                            <p className="text-[11px] text-gray-500">
                              💡 พิมพ์เฉพาะชื่อผู้ใช้ข้างหน้า ระบบจะต่อท้าย <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-cc-navy font-bold">@kkumail.com</code> ให้อัตโนมัติ
                            </p>
                          </div>

                          {/* 2. Medical Conditions Checkbox */}
                          <div className="pt-2">
                            <label className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border-2 border-cc-navy/20 hover:border-cc-navy/40 cursor-pointer transition-all">
                              <input
                                type="checkbox"
                                checked={hasMedicalCondition}
                                onChange={(e) => {
                                  setHasMedicalCondition(e.target.checked);
                                  if (!e.target.checked) {
                                    setMedicalConditionInput("");
                                    setDrugAllergyInput("");
                                  }
                                }}
                                className="mt-0.5 w-4 h-4 rounded border-2 border-cc-navy text-cc-navy focus:ring-0 cursor-pointer"
                              />
                              <div className="flex-1">
                                <span className="text-xs sm:text-sm font-bold text-cc-navy flex items-center gap-1.5">
                                  <HeartPulse className="w-4 h-4 text-rose-500" />
                                  <span>ข้อมูลแพ้ยา หรือมีโรคประจำตัว</span>
                                </span>
                                <span className="text-[11px] text-gray-500 block mt-0.5">
                                  หากมีโรคประจำตัวหรือประวัติแพ้ยา กรุณาทำเครื่องหมายเพื่อระบุรายละเอียดให้ทีมพยาบาลและสวัสดิการดูแล
                                </span>
                              </div>
                            </label>

                            {/* Expandable sub-fields */}
                            {hasMedicalCondition && (
                              <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-rose-50/60 border-2 border-rose-300 space-y-3.5 animate-fadeIn">
                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-rose-950 flex items-center gap-1.5">
                                    <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                                    <span>โรคประจำตัว (Medical Conditions)</span>
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="เช่น หอบหืด, ภูมิแพ้, ไมเกรน (ถ้าไม่มี ให้ระบุว่า ไม่มี)"
                                    value={medicalConditionInput}
                                    onChange={(e) => setMedicalConditionInput(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-rose-200 focus:border-rose-500 bg-white text-xs sm:text-sm font-medium text-gray-800 outline-none shadow-sm"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-rose-950 flex items-center gap-1.5">
                                    <Pill className="w-3.5 h-3.5 text-rose-600" />
                                    <span>ประวัติการแพ้ยา (Drug Allergies)</span>
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="เช่น แพ้ยาเพนิซิลลิน, ยาซัลฟา (ถ้าไม่มี ให้ระบุว่า ไม่มี)"
                                    value={drugAllergyInput}
                                    onChange={(e) => setDrugAllergyInput(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-rose-200 focus:border-rose-500 bg-white text-xs sm:text-sm font-medium text-gray-800 outline-none shadow-sm"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 3. Confirm Rights Button */}
                          <div className="pt-3">
                            <button
                              type="submit"
                              disabled={isConfirming}
                              className="w-full py-3.5 px-6 rounded-xl bg-cc-coral hover:bg-cc-coral-dark text-white font-display font-bold text-sm sm:text-base border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              {isConfirming ? (
                                <>
                                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>กำลังบันทึกข้อมูลการยืนยันสิทธิ์...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-5 h-5 text-cc-yellow" />
                                  <span>ยืนยันสิทธิ์เป็นพี่ค่าย Comclick 20</span>
                                </>
                              )}
                            </button>
                            <p className="text-center text-[11px] text-gray-500 mt-2">
                              เมื่อกดยืนยันสิทธิ์แล้ว สถานะของคุณจะเปลี่ยนเป็นผู้ยืนยันสิทธิ์ตัวจริงทันที
                            </p>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ) : isInterview ? (
                  /* 🎙️ HERO 2: INTERVIEW DETAILS (WHEN INTERVIEW ELIGIBLE) */
                  <div className="p-6 rounded-3xl bg-purple-50 border-3 border-purple-600 shadow-solid-sm space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-900 uppercase">
                      <Mic className="w-4 h-4 text-purple-700" />
                      <span>ประกาศผลการคัดเลือกรอบเอกสาร</span>
                    </div>

                    <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-purple-400 space-y-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-2xl border-2 border-cc-navy shadow-solid-sm">
                          🎙️
                        </div>
                        <div>
                          <div className="font-display font-black text-xl sm:text-2xl text-purple-950">
                            คุณมีสิทธิ์เข้ารับการสัมภาษณ์พี่ค่าย Comclick 20!
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                            ขอแสดงความยินดีด้วย! คุณผ่านการพิจารณาคุณสมบัติรอบเอกสารเรียบร้อยแล้ว
                          </p>
                        </div>
                      </div>

                      {/* Notice: Interview schedule selection coming soon */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-purple-100/60 border-2 border-purple-300 text-purple-950 text-xs sm:text-sm space-y-2">
                        <div className="font-bold flex items-center gap-2 text-purple-950 text-sm">
                          <Calendar className="w-4 h-4 text-purple-700 flex-shrink-0" />
                          <span>กำหนดการและตารางนัดหมายการสัมภาษณ์:</span>
                        </div>
                        <p className="text-xs sm:text-sm text-purple-900 leading-relaxed font-medium">
                          📌 <strong>วันและเวลาสัมภาษณ์:</strong> ทางคณะกรรมการกำลังจัดเตรียมระบบตารางนัดหมาย เพื่อให้น้องๆ ผู้มีสิทธิ์สัมภาษณ์สามารถ <strong>เลือกวันและช่วงเวลาที่สะดวกได้ด้วยตนเอง</strong> ในเร็วๆ นี้
                        </p>
                        <p className="text-[11px] sm:text-xs text-purple-700 pt-1 border-t border-purple-200/80">
                          💡 กรุณาติดตามลิงก์ตารางเลือกวันสัมภาษณ์ผ่านทางหน้าตรวจสอบสถานะนี้ หรือทางเพจ Facebook ประชาสัมพันธ์ของค่าย
                        </p>
                      </div>

                      {searchResult.statusNotes && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                          <strong>💡 ข้อความเพิ่มเติมจากคณะกรรมการ:</strong> {searchResult.statusNotes}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Status Description for Pending / Rejected */
                  <div className="p-4 rounded-2xl bg-cc-cream border-2 border-cc-navy text-xs sm:text-sm text-gray-800 space-y-1">
                    <span className="font-bold text-cc-navy block">สถานะปัจจุบัน:</span>
                    <p className="font-normal">{badge.desc}</p>
                    {searchResult.statusNotes && (
                      <p className="text-xs text-gray-600 pt-1 border-t border-cc-navy/10 mt-1">
                        <strong>หมายเหตุจากกรรมการ:</strong> {searchResult.statusNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-gray-50 border-2 border-cc-navy/15 space-y-2">
                    <span className="font-bold text-cc-navy block flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cc-blue" />
                      <span>ข้อมูลการเลือกฝ่าย</span>
                    </span>
                    <div className="space-y-1">
                      <div>
                        <span className="text-gray-500">อันดับ 1:</span>{" "}
                        <strong className="text-cc-navy font-bold">{firstDept?.nameTh || searchResult.firstChoiceDeptId}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500">อันดับ 2:</span>{" "}
                        <span className="text-gray-800 font-medium">
                          {searchResult.secondChoiceDeptId === "-" || searchResult.secondChoiceDeptId === "none" || !searchResult.secondChoiceDeptId
                            ? "-"
                            : secondDept?.nameTh || searchResult.secondChoiceDeptId}
                        </span>
                      </div>
                      {searchResult.fallbackDeptChoice && (
                        <div className="pt-1 border-t border-gray-200 text-[11px]">
                          <span className="text-gray-500">ถ้าไม่ติดอันดับ 1-2:</span>{" "}
                          <span className="text-cc-coral font-bold">{searchResult.fallbackDeptChoice}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border-2 border-cc-navy/15 space-y-2">
                    <span className="font-bold text-cc-navy block flex items-center gap-1.5">
                      <User className="w-4 h-4 text-cc-coral" />
                      <span>ข้อมูลผู้สมัคร</span>
                    </span>
                    <div className="space-y-1">
                      <div>
                        <span className="text-gray-500">ชื่อเล่น:</span>{" "}
                        <strong className="text-cc-navy">{searchResult.nicknameTh || "-"}</strong> • <span className="text-gray-500">ชั้นปี:</span>{" "}
                        <strong className="text-cc-navy">{searchResult.year || "ปี 1"}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500">คณะ / สาขาวิชา:</span>{" "}
                        <span className="text-gray-800 font-medium">{searchResult.faculty || "คณะศึกษาศาสตร์"} • {searchResult.major}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">เบอร์โทรศัพท์:</span>{" "}
                        <strong className="text-cc-navy font-mono">{searchResult.phone}</strong>
                      </div>
                      {searchResult.facebookName && (
                        <div className="pt-1 border-t border-gray-200 text-[11px]">
                          <span className="text-gray-500">Facebook:</span>{" "}
                          {searchResult.facebookUrl ? (
                            <a
                              href={searchResult.facebookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 font-bold underline hover:text-blue-800"
                            >
                              {searchResult.facebookName} ↗
                            </a>
                          ) : (
                            <span className="text-gray-800 font-bold">{searchResult.facebookName}</span>
                          )}
                        </div>
                      )}
                      {searchResult.kkuMail && (
                        <div className="pt-1 border-t border-gray-200 text-[11px]">
                          <span className="text-gray-500">KKU Mail:</span>{" "}
                          <span className="font-mono font-bold text-cc-navy">{searchResult.kkuMail}</span>
                        </div>
                      )}
                      {searchResult.diet && (
                        <div className="pt-1 border-t border-gray-200 text-[11px]">
                          <span className="text-gray-500">อาหาร / ข้อจำกัด:</span>{" "}
                          <span className="text-cc-navy font-bold">{searchResult.diet}</span>
                        </div>
                      )}
                      {(searchResult.medicalConditions || searchResult.drugAllergies) && (
                        <div className="pt-1 border-t border-gray-200 text-[11px] space-y-0.5">
                          {searchResult.medicalConditions && searchResult.medicalConditions !== "ไม่มี" && (
                            <div>
                              <span className="text-gray-500">โรคประจำตัว:</span>{" "}
                              <span className="text-rose-700 font-bold">{searchResult.medicalConditions}</span>
                            </div>
                          )}
                          {searchResult.drugAllergies && searchResult.drugAllergies !== "ไม่มี" && (
                            <div>
                              <span className="text-gray-500">แพ้ยา:</span>{" "}
                              <span className="text-rose-700 font-bold">{searchResult.drugAllergies}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
