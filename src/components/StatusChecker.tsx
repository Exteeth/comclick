"use client";

import React, { useState } from "react";
import { findApplicationByQuery, updateApplicationStatus } from "@/lib/storage";
import { Application, ApplicationStatus } from "@/lib/types";
import { DEPARTMENTS, CAMP_INFO } from "@/lib/constants";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  FileText,
  User,
  Phone,
  Layers,
  AlertCircle,
  ShieldCheck,
  Printer,
  Sparkles,
} from "lucide-react";

export default function StatusChecker() {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Application | null | "NOT_FOUND">(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasConfirmedRights, setHasConfirmedRights] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const result = findApplicationByQuery(query);
      if (result) {
        setSearchResult(result);
      } else {
        setSearchResult("NOT_FOUND");
      }
      setIsSearching(false);
    }, 300);
  };

  const handleConfirmRights = () => {
    if (!searchResult || searchResult === "NOT_FOUND") return;
    updateApplicationStatus(searchResult.id, "CONFIRMED");
    setSearchResult((prev) => (prev && prev !== "NOT_FOUND" ? { ...prev, status: "CONFIRMED" } : prev));
    setHasConfirmedRights(true);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "SUBMITTED":
        return {
          label: "ส่งใบสมัครแล้ว (รอการพิจารณา)",
          color: "bg-blue-100 text-blue-800 border-blue-400",
          icon: Clock,
          desc: "ใบสมัครของคุณอยู่ในระบบเรียบร้อยแล้ว อยู่ระหว่างการตรวจทานโดยคณะกรรมการฝ่ายคัดเลือก",
        };
      case "DOCUMENT_PASSED":
        return {
          label: "ผ่านการคัดเลือกรอบเอกสาร",
          color: "bg-emerald-100 text-emerald-800 border-emerald-400",
          icon: CheckCircle2,
          desc: "ยินดีด้วย! คุณผ่านการคัดเลือกรอบเอกสาร กรุณาตรวจสอบวันและเวลาสัมภาษณ์ด้านล่าง",
        };
      case "INTERVIEW_SCHEDULED":
        return {
          label: "มีนัดสัมภาษณ์ (โปรดตรงต่อเวลา)",
          color: "bg-amber-100 text-amber-900 border-amber-400",
          icon: Calendar,
          desc: "คุณมีกำหนดการสัมภาษณ์พี่ค่าย กรุณาเตรียมตัวและเข้าห้องสัมภาษณ์ตามวันเวลาที่ระบุ",
        };
      case "ACCEPTED":
        return {
          label: "ผ่านการคัดเลือกเป็นพี่ค่าย Comclick 20!",
          color: "bg-emerald-500 text-white border-cc-navy",
          icon: Sparkles,
          desc: "ขอแสดงความยินดีด้วยอย่างยิ่ง! คุณได้รับคัดเลือกเป็นพี่ค่าย Comclick 20 กรุณากดยืนยันสิทธิ์",
        };
      case "CONFIRMED":
        return {
          label: "ยืนยันสิทธิ์เป็นพี่ค่ายเรียบร้อยแล้ว",
          color: "bg-cc-navy text-white border-white",
          icon: ShieldCheck,
          desc: "คุณได้ยืนยันสิทธิ์เข้าร่วมเป็นทีมงานพี่ค่าย Comclick 20 แล้ว แล้วพบกันในวันปฐมนิเทศ!",
        };
      case "REJECTED":
        return {
          label: "ไม่ผ่านการคัดเลือกในรอบนี้",
          color: "bg-gray-100 text-gray-700 border-gray-400",
          icon: XCircle,
          desc: "ขอขอบคุณสำหรับความสนใจอย่างยิ่ง ทางโครงการหวังว่าจะได้ร่วมงานกับคุณในโอกาสต่อไป",
        };
      default:
        return {
          label: "อยู่ระหว่างตรวจสอบ",
          color: "bg-gray-100 text-gray-800 border-gray-400",
          icon: Clock,
          desc: "กำลังประมวลผลข้อมูล",
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Box with Solid Border and Shadow */}
      <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-8">
        <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
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
              className="px-8 py-3.5 rounded-xl bg-cc-navy hover:bg-cc-blue text-white font-display font-bold text-sm border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังค้นหา...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>ค้นหาข้อมูล</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Quick Queries */}
        <div className="mt-4 text-center">
          <span className="text-[11px] text-gray-500 font-medium">ตัวอย่างข้อมูลทดสอบ: </span>
          <button
            type="button"
            onClick={() => setQuery("663050123-4")}
            className="text-[11px] font-mono font-bold text-cc-blue hover:underline mx-1"
          >
            663050123-4
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => setQuery("653050456-7")}
            className="text-[11px] font-mono font-bold text-cc-coral hover:underline mx-1"
          >
            653050456-7
          </button>
        </div>
      </div>

      {/* RESULT NOT FOUND */}
      {searchResult === "NOT_FOUND" && (
        <div className="p-8 rounded-3xl bg-white border-3 border-cc-navy shadow-solid text-center space-y-3 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display font-black text-xl text-cc-navy">
            ไม่พบข้อมูลการสมัครในระบบ
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto font-normal">
            ไม่พบข้อมูลที่ตรงกับคำค้นหา "{query}" กรุณาตรวจสอบความถูกต้องของรหัสนักศึกษา หรือเบอร์โทรศัพท์อีกครั้ง
          </p>
          <div className="pt-2">
            <a
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cc-coral text-white text-xs font-bold border-2 border-cc-navy shadow-solid-sm hover:bg-cc-coral-dark transition-all"
            >
              <span>ไปที่แบบฟอร์มสมัครพี่ค่าย</span>
            </a>
          </div>
        </div>
      )}

      {/* RESULT FOUND */}
      {searchResult && searchResult !== "NOT_FOUND" && (
        <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Header with Status */}
          {(() => {
            const badge = getStatusBadge(searchResult.status);
            const BadgeIcon = badge.icon;
            const firstDept = DEPARTMENTS.find((d) => d.id === searchResult.firstChoiceDeptId);
            const secondDept = DEPARTMENTS.find((d) => d.id === searchResult.secondChoiceDeptId);

            return (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-cc-navy/10">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-500 block">
                      APPLICATION ID: {searchResult.id}
                    </span>
                    <h3 className="font-display font-black text-2xl text-cc-navy mt-0.5">
                      {searchResult.titleTh} {searchResult.fullNameTh} ({searchResult.nicknameTh})
                    </h3>
                    <div className="text-xs text-gray-600 font-medium mt-1">
                      {searchResult.faculty} • {searchResult.major} ({searchResult.year})
                    </div>
                  </div>

                  <div
                    className={`px-4 py-2.5 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm ${badge.color}`}
                  >
                    <BadgeIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{badge.label}</span>
                  </div>
                </div>

                {/* Status Explanation Card */}
                <div className="p-4 rounded-2xl bg-cc-cream border-2 border-cc-navy text-xs sm:text-sm text-gray-800 space-y-1">
                  <span className="font-bold text-cc-navy block">สถานะปัจจุบัน:</span>
                  <p className="font-normal">{badge.desc}</p>
                </div>

                {/* Interview Information (If Available) */}
                {searchResult.interviewDate && (
                  <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-black text-amber-950 font-display">
                      <Calendar className="w-4 h-4 text-amber-700" />
                      <span>กำหนดการสัมภาษณ์สำหรับคุณ</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-amber-300">
                        <span className="text-gray-500 block text-[10px] font-bold">วันและเวลาสัมภาษณ์</span>
                        <strong className="text-amber-950 text-sm font-mono block mt-0.5">
                          {searchResult.interviewDate}
                        </strong>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-amber-300">
                        <span className="text-gray-500 block text-[10px] font-bold">สถานที่ / ลิงก์ออนไลน์</span>
                        <strong className="text-amber-950 text-sm block mt-0.5">
                          {searchResult.interviewLocation || "ห้อง 2105 อาคาร ED2 คณะศึกษาศาสตร์"}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-gray-50 border-2 border-cc-navy/15 space-y-2">
                    <span className="font-bold text-cc-navy block flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cc-blue" />
                      <span>ฝ่ายที่เลือกสมัคร</span>
                    </span>
                    <div className="space-y-1">
                      <div>
                        <span className="text-gray-500">อันดับ 1:</span>{" "}
                        <strong className="text-cc-navy font-bold">{firstDept?.nameTh}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500">อันดับ 2:</span>{" "}
                        <span className="text-gray-800">{secondDept?.nameTh}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border-2 border-cc-navy/15 space-y-2">
                    <span className="font-bold text-cc-navy block flex items-center gap-1.5">
                      <User className="w-4 h-4 text-cc-coral" />
                      <span>ข้อมูลการติดต่อและสวัสดิการ</span>
                    </span>
                    <div className="space-y-1">
                      <div>
                        <span className="text-gray-500">เบอร์โทร / Line:</span>{" "}
                        <strong className="text-cc-navy">{searchResult.phone} | {searchResult.lineId}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500">เสื้อ / อาหาร:</span>{" "}
                        <span>{searchResult.shirtSize} / {searchResult.diet}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Rights Button (If Accepted) */}
                {searchResult.status === "ACCEPTED" && !hasConfirmedRights && (
                  <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-display font-black text-sm text-emerald-950">
                        ยืนยันสิทธิ์การเป็นพี่ค่าย Comclick 20
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        กรุณากดยืนยันสิทธิ์เพื่อยืนยันการเข้าร่วมทีมงานอย่างเป็นทางการ
                      </p>
                    </div>
                    <button
                      onClick={handleConfirmRights}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm border-2 border-emerald-900 shadow-solid-sm transition-all"
                    >
                      กดยืนยันสิทธิ์ทันที
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
