"use client";

import React from "react";

export interface StudentIDCardProps {
  photoUrl: string;
  nameTh: string;
  nameEn: string;
  departmentNameTh?: string;
  departmentNameEn?: string;
  positionTh?: string;
  positionEn?: string;
  facultyTh?: string;
  facultyEn?: string;
  nickname?: string;
  issueDate?: string;
  expDate?: string;
  universityLogoUrl?: string;
  campLogoUrl?: string;
  className?: string;
}

export default function StudentIDCard({
  photoUrl,
  nameTh,
  nameEn,
  departmentNameTh = "ฝ่ายอำนวยการ",
  departmentNameEn = "Selected Department",
  positionTh = "ประธานค่าย",
  positionEn = "Position",
  facultyTh = "สาขาวิชาคอมพิวเตอร์ศึกษา",
  facultyEn = "Computer Education",
  nickname,
  issueDate = "9 มิ.ย. 68",
  expDate = "31 พ.ค. 72",
  universityLogoUrl = "/img/kku.webp",
  campLogoUrl = "/img/logo.webp",
  className = "",
}: StudentIDCardProps) {
  return (
    <div
      className={`relative w-full max-w-[480px] aspect-[1.58/1] rounded-[18px] sm:rounded-[22px] bg-white text-gray-900 border-2 border-cc-navy/80 shadow-solid select-none p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-solid-lg overflow-hidden ${className}`}
    >
      {/* Clean Card Content Grid */}
      <div className="relative z-10 flex gap-3.5 sm:gap-4 h-full">
        
        {/* Left Column: Student Photo + Bottom Camp Logo */}
        <div className="w-[42%] sm:w-[40%] flex flex-col justify-between items-center flex-shrink-0 h-full">
          {/* Photo Frame with 1:1 Aspect matching 1080x1080 Artwork */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-400/90 shadow-sm bg-[#1c54b2]">
            <img
              src={photoUrl}
              alt={nameTh}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
              }}
            />
          </div>

          {/* Camp Logo placed cleanly below Photo */}
          <div className="flex items-center justify-center gap-1.5 w-full pt-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 flex items-center justify-center p-0.5 bg-cc-cream rounded-md border border-cc-navy/20 shadow-2xs">
              <img
                src={campLogoUrl}
                alt="ComClick 20 Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.display = "none";
                }}
              />
            </div>
            <span className="text-[9px] sm:text-[10.5px] font-display font-black text-cc-navy tracking-tight">
              COMCLICK <span className="text-cc-coral">20</span>
            </span>
          </div>
        </div>

        {/* Right Column: University Branding & Student Details */}
        <div className="flex-1 flex flex-col justify-between h-full text-left pl-1">
          
          {/* 1. Header: University Logo & Name */}
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
            {/* KKU Logo */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center">
              <img
                src={universityLogoUrl}
                alt="KKU Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.display = "none";
                }}
              />
            </div>

            <div className="leading-tight">
              <h4 className="font-display font-black text-[13px] sm:text-[15px] text-[#9b2a16] tracking-tight">
                มหาวิทยาลัยขอนแก่น
              </h4>
              <div className="text-[7.5px] sm:text-[8px] font-mono font-bold text-[#9b2a16] uppercase tracking-wider">
                KHON KAEN UNIVERSITY
              </div>
            </div>
          </div>

          {/* 2. Middle: Form Fields (4 Clean Underlined Rows) */}
          <div className="space-y-1.5 my-auto py-1">
            
            {/* Field 1: ฝ่ายที่เลือก */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1.5 pb-0.5 border-b border-gray-700/80">
                <span className="text-[9.5px] sm:text-[10.5px] text-gray-900 font-bold whitespace-nowrap">
                  ฝ่ายที่เลือก :
                </span>
                <span className="text-[10.5px] sm:text-[12px] font-display font-black text-cc-navy truncate">
                  {departmentNameTh}
                </span>
              </div>
              <div className="text-[7px] sm:text-[7.5px] text-gray-500 font-mono leading-none pl-0.5">
                {departmentNameEn}
              </div>
            </div>

            {/* Field 2: ตำแหน่ง */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1.5 pb-0.5 border-b border-gray-700/80">
                <span className="text-[9.5px] sm:text-[10.5px] text-gray-900 font-bold whitespace-nowrap">
                  ตำแหน่ง :
                </span>
                <span className="text-[10.5px] sm:text-[12px] font-bold text-cc-coral truncate">
                  {positionTh}
                </span>
              </div>
              <div className="text-[7px] sm:text-[7.5px] text-gray-500 font-mono leading-none pl-0.5">
                {positionEn}
              </div>
            </div>

            {/* Field 3: ชื่อ-นามสกุล (แยกมาบรรทัดเดี่ยว) */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1.5 pb-0.5 border-b border-gray-700/80">
                <span className="text-[9.5px] sm:text-[10.5px] text-gray-900 font-bold whitespace-nowrap">
                  ชื่อ-นามสกุล :
                </span>
                <span className="text-[10.5px] sm:text-[12px] font-bold text-gray-950 truncate">
                  {nameTh}
                </span>
              </div>
              <div className="text-[7px] sm:text-[7.5px] text-gray-500 font-mono uppercase leading-none pl-0.5 truncate">
                Full Name / {nameEn}
              </div>
            </div>

            {/* Field 4: สาขาวิชา (มีเฉพาะสาขาวิชา) */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1.5 pb-0.5 border-b border-gray-700/80">
                <span className="text-[9.5px] sm:text-[10.5px] text-gray-900 font-bold whitespace-nowrap">
                  สาขาวิชา :
                </span>
                <span className="text-[10.5px] sm:text-[12px] font-bold text-cc-blue truncate">
                  {facultyTh || "สาขาวิชาคอมพิวเตอร์ศึกษา"}
                </span>
              </div>
              <div className="text-[7px] sm:text-[7.5px] text-gray-500 font-mono leading-none pl-0.5">
                Major / {facultyEn || "Computer Education"}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
