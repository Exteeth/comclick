"use client";

import React, { useState, useEffect, useCallback } from "react";
import { findApplicationByQuery } from "@/lib/storage";
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
} from "lucide-react";

export default function StatusChecker() {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Application | null | "NOT_FOUND">(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

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
      } else {
        // Fallback to local storage
        const local = findApplicationByQuery(searchQuery);
        if (local) {
          setSearchResult(local);
          setLastSyncedTime(new Date().toLocaleTimeString("th-TH"));
        } else {
          setSearchResult("NOT_FOUND");
        }
      }
    } catch (err) {
      console.warn("Status fetch error, using local fallback", err);
      const local = findApplicationByQuery(searchQuery);
      if (local) {
        setSearchResult(local);
        setLastSyncedTime(new Date().toLocaleTimeString("th-TH"));
      } else {
        setSearchResult("NOT_FOUND");
      }
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

                {/* 🌟 HERO: FINAL ASSIGNED DEPARTMENT (WHEN PASSED) */}
                {isAccepted && assignedDept ? (
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
                        <span>ยืนยันฝ่ายตัวจริง</span>
                      </div>
                    </div>

                    {/* Historical applied choice reference for clarity */}
                    <div className="text-[11px] text-emerald-800/80 pt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span><strong>อันดับที่เลือกไว้ตอนสมัคร:</strong> อันดับ 1: {firstDept?.nameTh || searchResult.firstChoiceDeptId}</span>
                      <span>อันดับ 2: {secondDept?.nameTh || searchResult.secondChoiceDeptId}</span>
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
                        <span className="text-gray-800 font-medium">{secondDept?.nameTh || searchResult.secondChoiceDeptId}</span>
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
                        <span className="text-gray-500">เบอร์โทรศัพท์:</span>{" "}
                        <strong className="text-cc-navy font-mono">{searchResult.phone}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500">สาขาวิชา:</span>{" "}
                        <span className="text-gray-800 font-medium">{searchResult.major}</span>
                      </div>
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
