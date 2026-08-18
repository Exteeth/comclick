import React from "react";
import StatusChecker from "@/components/StatusChecker";
import { ArrowLeft, FileCheck2 } from "lucide-react";

export const metadata = {
  title: "ตรวจสอบสถานะการสมัครพี่ค่าย Comclick 20 | ComClick Camp #20",
  description: "ระบบตรวจสอบผลการสมัคร สิทธิ์การสัมภาษณ์ และยืนยันสิทธิ์พี่ค่าย Comclick 20",
};

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-cc-cream pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-4">
        <a
          href="/"
          className="text-xs font-semibold text-gray-500 hover:text-cc-navy flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับหน้าหลัก</span>
        </a>
      </div>

      <StatusChecker />
    </div>
  );
}
