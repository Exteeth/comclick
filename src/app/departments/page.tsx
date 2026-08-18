import React from "react";
import DepartmentCards from "@/components/DepartmentCards";
import { ArrowLeft, Users, Send } from "lucide-react";
import { CAMP_INFO } from "@/lib/constants";

export const metadata = {
  title: "11 ฝ่ายที่เปิดรับสมัครพี่ค่าย Comclick 20 | ComClick Camp #20",
  description: "รายละเอียด 11 ฝ่ายงาน ภาระหน้าที่ คุณสมบัติ และจำนวนที่เปิดรับในค่าย Comclick 20",
};

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-cc-cream pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <a
            href="/"
            className="text-xs font-semibold text-gray-500 hover:text-cc-navy flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับหน้าหลัก</span>
          </a>
          <span className="text-gray-300">/</span>
          <span className="text-xs font-bold text-cc-coral">รายละเอียดฝ่ายทั้งหมด</span>
        </div>
      </div>

      <DepartmentCards showAll={true} />

      {/* Direct Apply CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mt-10">
        <div className="p-8 rounded-3xl bg-white text-cc-navy border-3 border-cc-navy space-y-4 shadow-solid-lg">
          <h3 className="font-display font-black text-2xl text-cc-navy">
            เลือกฝ่ายที่ใช่ แล้วมาสร้างค่ายในฝันด้วยกัน!
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            คุณสามารถเลือกฝ่ายที่ต้องการได้ทั้งอันดับ 1 และอันดับ 2 ในแบบฟอร์มการสมัคร
          </p>
          <a
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-cc-coral hover:bg-cc-coral-dark text-white font-bold text-sm border-2 border-cc-navy shadow-solid-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>ไปที่แบบฟอร์มสมัครพี่ค่าย</span>
          </a>
        </div>
      </div>
    </div>
  );
}
