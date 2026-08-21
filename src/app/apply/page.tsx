import React, { Suspense } from "react";
import ApplicationForm from "@/components/ApplicationForm";
import { CAMP_INFO } from "@/lib/constants";
import { Sparkles, ArrowLeft, Send } from "lucide-react";

export const metadata = {
  title: "แบบฟอร์มรับสมัครพี่ค่าย Comclick 20 | ComClick Camp #20",
  description: "กรอกใบสมัครเป็นพี่ค่ายและคณะทำงานโครงการ Comclick ครั้งที่ 20 มหาวิทยาลัยขอนแก่น",
};

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-cc-cream pt-28 pb-20">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <a
            href="/"
            className="text-xs font-semibold text-gray-500 hover:text-cc-navy flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับหน้าหลัก</span>
          </a>
          <span className="text-gray-300">/</span>
          <span className="text-xs font-bold text-cc-coral">แบบฟอร์มรับสมัครพี่ค่าย</span>
        </div>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cc-coral-100 text-cc-coral-700 text-xs font-bold uppercase tracking-wider">
            <Send className="w-3.5 h-3.5" />
            <span>Staff Application Form</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-cc-navy tracking-tight">
            ใบสมัครเป็นพี่ค่าย <span className="text-cc-blue">COMCLICK 20</span>
          </h1>
          <p className="text-sm text-gray-600 font-light max-w-xl mx-auto">
            {CAMP_INFO.nameTh} • เปิดรับสมัคร {CAMP_INFO.registrationPeriod}
          </p>
        </div>
      </div>

      {/* Application Multi-step Form */}
      <Suspense fallback={<div className="text-center py-20 text-gray-400">กำลังโหลดแบบฟอร์ม...</div>}>
        <ApplicationForm />
      </Suspense>
    </div>
  );
}
