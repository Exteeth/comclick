import React from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "ระบบจัดการและคัดเลือกผู้สมัคร | ComClick Camp #20 Admin",
  description: "แดชบอร์ดสำหรับคณะทำงานและกรรมการคัดเลือกพี่ค่าย Comclick 20",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-cc-cream pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <a
          href="/"
          className="text-xs font-semibold text-gray-500 hover:text-cc-navy flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับหน้าหลัก</span>
        </a>
      </div>

      <AdminDashboard />
    </div>
  );
}
