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
        
        {/* Left Column: Student Photo + Bottom Date Box */}
        <div className="w-[33%] sm:w-[31%] flex flex-col justify-between flex-shrink-0 h-full">
          {/* Photo Frame with Royal Blue Studio Backdrop */}
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-400/90 shadow-sm bg-[#1c54b2]">
            <img
              src={photoUrl}
              alt={nameTh}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
              }}
            />

            {/* Nickname Tag */}
            {nickname && (
              <div className="absolute top-1.5 left-1.5 bg-cc-yellow/95 text-cc-navy px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-black border border-cc-navy/40 shadow-sm">
                {nickname}
              </div>
            )}
          </div>

          {/* Bottom Left Date Stamp Box (Clean Light Salmon/Sand) */}
          <div className="w-full mt-1 bg-[#e8a38f] text-gray-950 rounded-md py-1 px-1.5 leading-tight border border-[#d68a74] shadow-2xs">
            <div className="flex justify-between items-baseline text-[7.5px] sm:text-[8.5px]">
              <span className="font-semibold">วันออกบัตร</span>
              <span className="font-bold">{issueDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-[6.5px] sm:text-[7.5px] text-gray-800 font-medium mt-0.5">
              <span>Issue Date</span>
              <span className="text-[7.5px] sm:text-[8px] text-gray-950 font-bold">วันหมดอายุ {expDate}</span>
            </div>
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

          {/* 3. Bottom Right: Camp Logo + Staff Pass Label */}
          <div className="flex items-end justify-between pt-1 border-t border-gray-200">
            <div className="text-[7.5px] sm:text-[8px] font-mono font-bold text-gray-400">
              STAFF ID PASS
            </div>

            {/* Camp Logo placed at bottom right */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[8px] sm:text-[9px] font-display font-black text-cc-navy">
                COMCLICK 20
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 flex items-center justify-center p-0.5 bg-cc-cream rounded-md border border-cc-navy/20">
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
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
