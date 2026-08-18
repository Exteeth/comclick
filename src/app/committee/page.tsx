"use client";

import React, { useState } from "react";
import {
  Crown,
  ArrowLeft,
  UserCheck,
  Send,
  Sparkles,
} from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import StudentIDCard from "@/components/ui/StudentIDCard";
import {
  DIRECTORATE_MEMBERS,
  DEPARTMENT_LEADS,
} from "@/components/CommitteeSection";

export default function CommitteePage() {
  const [selectedDeptTab, setSelectedDeptTab] = useState<string>("all");

  const filteredLeads =
    selectedDeptTab === "all"
      ? DEPARTMENT_LEADS
      : DEPARTMENT_LEADS.filter((dept) => dept.id === selectedDeptTab);

  return (
    <div className="min-h-screen bg-cc-cream pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-8">
          <a
            href="/"
            className="text-xs font-semibold text-gray-500 hover:text-cc-navy flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับหน้าหลัก</span>
          </a>
          <span className="text-gray-300">/</span>
          <span className="text-xs font-bold text-cc-coral">
            ทำเนียบบัตรประจำตัวคณะกรรมการและหัวหน้าฝ่าย
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cc-yellow text-cc-navy text-xs font-mono font-bold uppercase tracking-wider border-2 border-cc-navy shadow-solid-sm">
            <Crown className="w-4 h-4 text-cc-coral" />
            <span>OFFICIAL STUDENT & STAFF ID DIRECTORY</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-cc-navy tracking-tight">
            ทำเนียบบัตรประจำตัว <span className="text-cc-blue">คณะกรรมการ & 11 ฝ่าย</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-700 font-normal">
            ทำเนียบบัตรประจำตัวนักศึกษา มหาวิทยาลัยขอนแก่น (KKU Student ID Card) ของทีมงานค่าย ComClick 20
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 1. ฝ่ายอำนวยการ (5 ท่าน) - Student ID Cards                               */}
        {/* ========================================================================= */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10 pb-4 border-b-2 border-cc-navy/15">
            <div className="w-12 h-12 rounded-2xl bg-cc-navy text-white flex items-center justify-center border-2 border-cc-navy shadow-solid-sm">
              <Crown className="w-6 h-6 text-cc-yellow" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-cc-coral uppercase tracking-wider block">
                CAMP DIRECTORATE (5 ท่าน)
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-cc-navy">
                ฝ่ายอำนวยการ
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {DIRECTORATE_MEMBERS.map((dir, idx) => (
              <AnimatedContent
                key={idx}
                distance={35}
                direction="vertical"
                duration={0.6}
                delay={idx * 0.06}
                className="w-full flex justify-center"
              >
                <div className="w-full flex flex-col items-center space-y-3">
                  <StudentIDCard
                    photoUrl={dir.image}
                    nameTh={dir.nameTh}
                    nameEn={dir.nameEn}
                    departmentNameTh="ฝ่ายอำนวยการ"
                    departmentNameEn="EXECUTIVE DIRECTORATE"
                    positionTh={dir.title}
                    positionEn={dir.role}
                    facultyTh="สาขาวิชาคอมพิวเตอร์ศึกษา"
                    facultyEn="Computer Education"
                    nickname={dir.nickname}
                    issueDate="9 มิ.ย. 68"
                    expDate="31 พ.ค. 72"
                  />
                  {/* Speech quote below card */}
                  <div className="w-full max-w-[440px] px-3.5 py-2 rounded-xl bg-white/90 border border-cc-navy/20 text-[11px] text-gray-700 italic text-center shadow-sm">
                    "{dir.quote}"
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. หัวหน้าและรองหัวหน้า 11 ฝ่าย (22 ท่าน) - Student ID Cards               */}
        {/* ========================================================================= */}
        <div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b-2 border-cc-navy/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cc-blue text-white flex items-center justify-center border-2 border-cc-navy shadow-solid-sm">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-cc-coral uppercase tracking-wider block">
                  DEPARTMENT LEADS & CO-LEADS (22 ท่าน)
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-cc-navy">
                  ทำเนียบบัตรหัวหน้าและรองหัวหน้า 11 ฝ่าย
                </h2>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 max-w-xl justify-end">
              <button
                onClick={() => setSelectedDeptTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border-2 border-cc-navy transition-all ${
                  selectedDeptTab === "all"
                    ? "bg-cc-navy text-white shadow-solid-sm scale-105"
                    : "bg-white text-cc-navy hover:bg-cc-cream-50"
                }`}
              >
                ทั้งหมด (11 ฝ่าย)
              </button>
            </div>
          </div>

          {/* Department Sections */}
          <div className="space-y-16">
            {filteredLeads.map((dept) => {
              const IconComp = dept.icon;
              return (
                <div key={dept.id} className="space-y-6">
                  {/* Department Section Header Pill */}
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-cc-navy/10">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white border-2 border-cc-navy shadow-solid-sm flex-shrink-0"
                      style={{ backgroundColor: dept.color }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-xl sm:text-2xl text-cc-navy">
                        {dept.nameTh}
                      </h3>
                      <span className="text-xs font-mono font-bold text-gray-500">
                        {dept.badge} • ทีมหัวหน้าและรองหัวหน้าประจำฝ่าย
                      </span>
                    </div>
                  </div>

                  {/* 2 Student ID Cards Side-by-Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
                    
                    {/* Head of Department ID Card */}
                    <div className="w-full flex flex-col items-center space-y-2.5">
                      <div className="w-full flex items-center justify-between max-w-[440px] px-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-black text-cc-coral uppercase">
                          <Sparkles className="w-3.5 h-3.5 text-cc-coral" />
                          <span>หัวหน้าฝ่าย (LEAD)</span>
                        </span>
                        <span className="text-[11px] font-mono text-gray-500 font-bold">
                          {dept.head.year}
                        </span>
                      </div>

                      <StudentIDCard
                        photoUrl={dept.head.image}
                        nameTh={dept.head.nameTh}
                        nameEn={dept.head.nameEn}
                        departmentNameTh={dept.nameTh}
                        departmentNameEn={dept.badge}
                        positionTh="หัวหน้าฝ่าย"
                        positionEn="HEAD OF DEPARTMENT"
                        facultyTh="สาขาวิชาคอมพิวเตอร์ศึกษา"
                        facultyEn="Computer Education"
                        nickname={dept.head.nickname}
                        issueDate="9 มิ.ย. 68"
                        expDate="31 พ.ค. 72"
                      />
                    </div>

                    {/* SubHead of Department ID Card */}
                    <div className="w-full flex flex-col items-center space-y-2.5">
                      <div className="w-full flex items-center justify-between max-w-[440px] px-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-black text-cc-blue uppercase">
                          <Sparkles className="w-3.5 h-3.5 text-cc-blue" />
                          <span>รองหัวหน้าฝ่าย (CO-LEAD)</span>
                        </span>
                        <span className="text-[11px] font-mono text-gray-500 font-bold">
                          {dept.subHead.year}
                        </span>
                      </div>

                      <StudentIDCard
                        photoUrl={dept.subHead.image}
                        nameTh={dept.subHead.nameTh}
                        nameEn={dept.subHead.nameEn}
                        departmentNameTh={dept.nameTh}
                        departmentNameEn={dept.badge}
                        positionTh="รองหัวหน้าฝ่าย"
                        positionEn="CO-HEAD OF DEPARTMENT"
                        facultyTh="สาขาวิชาคอมพิวเตอร์ศึกษา"
                        facultyEn="Computer Education"
                        nickname={dept.subHead.nickname}
                        issueDate="9 มิ.ย. 68"
                        expDate="31 พ.ค. 72"
                      />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-3xl mx-auto text-center mt-20 p-8 rounded-3xl bg-cc-navy text-white space-y-4 border-3 border-cc-navy shadow-solid-lg">
          <h3 className="font-display font-black text-2xl text-white">
            พร้อมมาร่วมงานกับพวกเราใน ComClick 20 แล้วหรือยัง?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-light">
            เปิดรับสมัครพี่ค่ายทุกคณะ ทุกชั้นปี ไม่จำกัดประสบการณ์ สมัครได้ทั้งอันดับ 1 และอันดับ 2
          </p>
          <div className="pt-2">
            <a
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cc-coral hover:bg-cc-coral-dark text-white font-bold text-sm border-2 border-white shadow-solid-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>กรอกใบสมัครพี่ค่ายทันที</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
