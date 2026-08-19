"use client";

import React from "react";
import { Application } from "@/lib/types";
import { DEPARTMENTS, CAMP_INFO } from "@/lib/constants";
import {
  CheckCircle2,
  Calendar,
  Phone,
  User,
  GraduationCap,
  Sparkles,
  Download,
  X,
  Printer,
  Compass,
} from "lucide-react";

interface ApplicationSlipModalProps {
  application: Application;
  onClose: () => void;
}

export default function ApplicationSlipModal({
  application,
  onClose,
}: ApplicationSlipModalProps) {
  const firstDept = DEPARTMENTS.find((d) => d.id === application.firstChoiceDeptId);
  const secondDept = DEPARTMENTS.find((d) => d.id === application.secondChoiceDeptId);

  const printSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border-3 border-cc-navy shadow-solid-lg relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-cc-navy flex items-center justify-center text-cc-navy font-bold transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto shadow-solid-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="font-display font-black text-2xl text-cc-navy">
            บันทึกการสมัครพี่ค่ายสำเร็จ!
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            ระบบได้ลงทะเบียนข้อมูลของคุณในโครงการ {CAMP_INFO.nameTh} เรียบร้อยแล้ว
          </p>
        </div>

        {/* Digital Slip Card */}
        <div
          id="printable-slip"
          className="p-6 rounded-3xl bg-cc-cream border-3 border-dashed border-cc-navy space-y-4 relative overflow-hidden"
        >
          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cc-navy/5 font-display font-black text-6xl pointer-events-none select-none">
            COMCLICK 20
          </div>

          {/* Slip Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-cc-navy/15">
            <div>
              <span className="text-[10px] font-mono font-bold text-cc-coral uppercase tracking-widest block">
                OFFICIAL REGISTRATION PASS
              </span>
              <h4 className="font-display font-black text-lg text-cc-navy">
                บัตรยืนยันการสมัครพี่ค่าย Comclick 20
              </h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cc-navy text-white flex items-center justify-center font-display font-black text-xs border border-white">
              CC20
            </div>
          </div>

          {/* Application ID Box */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-cc-navy flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] text-gray-500 font-mono block font-bold">
                รหัสประจำตัวผู้สมัคร (APPLICATION ID)
              </span>
              <span className="font-mono font-black text-lg text-cc-blue tracking-wide">
                {application.id}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 font-mono block font-bold">วันที่สมัคร</span>
              <span className="text-xs font-bold text-cc-navy font-mono">
                {new Date(application.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Details Grid: 4 Core Info */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-white rounded-xl border border-cc-navy/20">
              <span className="text-gray-500 block text-[10px] font-bold">1. ชื่อ - นามสกุล</span>
              <span className="font-bold text-cc-navy block truncate">
                {application.fullNameTh}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-cc-navy/20">
              <span className="text-gray-500 block text-[10px] font-bold">2. รหัสนักศึกษา</span>
              <span className="font-bold text-cc-navy font-mono block">{application.studentId}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-cc-navy/20">
              <span className="text-gray-500 block text-[10px] font-bold">3. เบอร์โทรศัพท์</span>
              <span className="font-bold text-cc-navy block truncate font-mono">
                {application.phone}
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-cc-navy/20">
              <span className="text-gray-500 block text-[10px] font-bold">4. สาขาวิชา</span>
              <span className="font-bold text-cc-navy block truncate">
                {application.major}
              </span>
            </div>
          </div>

          {/* Department Choices */}
          <div className="p-3.5 bg-white rounded-xl border-2 border-cc-navy space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-bold">5. ฝ่ายที่ต้องการลง (อันดับ 1):</span>
              <strong className="text-cc-navy">{firstDept?.nameTh || application.firstChoiceDeptId}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-bold">5. ฝ่ายที่ต้องการลง (อันดับ 2):</span>
              <span className="text-gray-800 font-medium">{secondDept?.nameTh || application.secondChoiceDeptId}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-600 font-bold">6. ถ้าไม่ติดอยากลงฝ่ายไหน:</span>
              <span className="text-cc-coral font-bold">{application.fallbackDeptChoice || "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร"}</span>
            </div>
          </div>

          {/* Status Box */}
          <div className="p-3 rounded-xl bg-cc-blue text-white font-bold text-center text-xs border-2 border-cc-navy shadow-sm">
            สถานะ: ส่งใบสมัครแล้ว (รอการตรวจสอบและประกาศผลรอบสัมภาษณ์)
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={printSlip}
            className="w-full sm:flex-1 py-3 rounded-xl bg-cc-navy hover:bg-cc-blue text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 border-2 border-cc-navy shadow-solid-sm"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ / บันทึกภาพใบสมัคร</span>
          </button>

          <a
            href="/status"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-cc-cream text-cc-navy font-bold text-xs sm:text-sm transition-colors text-center border-2 border-cc-navy"
          >
            ไปหน้าตรวจสอบสถานะ
          </a>
        </div>
      </div>
    </div>
  );
}
