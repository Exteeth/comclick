"use client";

import React from "react";
import {
  Crown,
  ArrowRight,
  UserCheck,
  Code2,
  Sparkles,
  Camera,
  Coins,
  ShieldCheck,
  ClipboardCheck,
  HeartHandshake,
  HeartPulse,
  Award,
  Hammer,
  Utensils,
  Zap,
} from "lucide-react";
import AnimatedContent from "./ui/AnimatedContent";
import MemberPhotoCard from "./ui/MemberPhotoCard";

export interface CommitteeLeader {
  role: string;
  nameTh: string;
  nameEn: string;
  nickname: string;
  year: string;
  faculty: string;
  facultyEn?: string;
  studentId?: string;
  citizenId?: string;
  image: string;
}

export interface DepartmentLeadGroup {
  id: string;
  nameTh: string;
  badge: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  head: CommitteeLeader;
  subHead: CommitteeLeader;
}

// 1. ฝ่ายอำนวยการ (5 ท่าน)
export const DIRECTORATE_MEMBERS: (CommitteeLeader & { title: string; quote: string })[] = [
  {
    title: "ประธานค่าย",
    role: "ประธานกรรมการดำเนินงานค่าย",
    nameTh: "นางสาวณัฐณิชา ศรีสมบัติ",
    nameEn: "MISS NATTANICHA SRISOMBAT",
    nickname: "พี่ใบหม่อน",
    year: "ชั้นปีที่ 3",
    faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    facultyEn: "Computer Education",
    studentId: "673050382-3",
    citizenId: "1-4099-00382-23-1",
    quote: "มุ่งมั่นส่งต่อองค์ความรู้และสร้างแรงบันดาลใจด้านเทคโนโลยีสู่น้องๆ ในค่าย Comclick 20",
    image: "/img/committee/1.webp",
  },
  {
    title: "รองประธานค่าย",
    role: "รองประธานกรรมการดำเนินงานค่าย",
    nameTh: "นางสาวณิชนันท์ ภูโอบ",
    nameEn: "MISS NICHANAN PHU-OB",
    nickname: "พี่วุ้นเส้น",
    year: "ชั้นปีที่ 3",
    faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    facultyEn: "Computer Education",
    studentId: "673050547-7",
    citizenId: "1-4099-00547-78-2",
    quote: "บริหารจัดการทีมงานทุกฝ่ายให้ขับเคลื่อนไปด้วยความราบรื่นและเป็นหนึ่งเดียว",
    image: "/img/committee/2.webp",
  },
  {
    title: "รองประธานค่าย",
    role: "รองประธานกรรมการดำเนินงานค่าย",
    nameTh: "นายอภิชาติ ไชยต้นเทือก",
    nameEn: "MR. APHICHAT CHAITONTHUEAK",
    nickname: "พี่ก้อบ",
    year: "ชั้นปีที่ 3",
    faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    facultyEn: "Computer Education",
    studentId: "673050553-2",
    citizenId: "1-4099-00553-34-3",
    quote: "พัฒนาและยกระดับกิจกรรมค่ายให้เข้มข้น สนุกสนาน และสร้างประสบการณ์ที่น่าจดจำ",
    image: "/img/committee/3.webp",
  },
  {
    title: "เลขานุการค่าย",
    role: "กรรมการและเลขานุการค่าย",
    nameTh: "นายติณณภพ หงษ์ทอง",
    nameEn: "MR. TINNAPOP HONGTHONG",
    nickname: "พี่ตินติน",
    year: "ชั้นปีที่ 3",
    faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    facultyEn: "Computer Education",
    studentId: "673050130-0",
    citizenId: "1-4099-00130-01-4",
    quote: "บันทึกและประสานงานข้อมูลทุกมิติ เพื่อให้การดำเนินงานเป็นไปตามแผนงาน",
    image: "/img/committee/4.webp",
  },
  {
    title: "เหรัญญิกค่าย",
    role: "กรรมการและเหรัญญิกค่าย",
    nameTh: "นายทัตเทพ เทียกสม",
    nameEn: "MR. THATTHEP THEAKSOM",
    nickname: "พี่พี",
    year: "ชั้นปีที่ 3",
    faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    facultyEn: "Computer Education",
    studentId: "673050385-7",
    citizenId: "1-4099-00385-56-5",
    quote: "ดูแลระบบงบประมาณและสวัสดิการอย่างโปร่งใส ถูกต้อง และคุ้มค่าที่สุด",
    image: "/img/committee/5.webp",
  },
];

// 2. ทั้ง 12 ฝ่าย (หัวหน้าฝ่าย และ รองหัวหน้าฝ่าย รวม 2 คนทุกฝ่าย = 24 ท่าน)
export const DEPARTMENT_LEADS: DepartmentLeadGroup[] = [
  {
    id: "registration",
    nameTh: "ฝ่ายทะเบียนและธุรการ",
    badge: "Registration & Admin",
    color: "#5e97d3",
    icon: ClipboardCheck,
    head: {
      role: "หัวหน้าฝ่ายทะเบียนและธุรการ",
      nameTh: "นายทรงพล ประทุมมา",
      nameEn: "MR. SONGPHOL PRATHUMMA",
      nickname: "พี่น็อตตี้",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050383-1",
      citizenId: "1-4099-00383-12-3",
      image: "/img/committee/10.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายทะเบียนและธุรการ",
      nameTh: "นางสาวปัณณพร เนืองทอง",
      nameEn: "MISS PANNAPORN NUEANGTHONG",
      nickname: "พี่เปรียว",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "683050152-1",
      citizenId: "1-4099-00152-12-4",
      image: "/img/committee/11.webp",
    },
  },
  {
    id: "medical",
    nameTh: "ฝ่ายพยาบาล",
    badge: "Medical & Health Care",
    color: "#d98e89",
    icon: HeartPulse,
    head: {
      role: "หัวหน้าฝ่ายพยาบาล",
      nameTh: "นางสาวฐิติรัตน์ เสรี",
      nameEn: "MISS THITIRAT SEREE",
      nickname: "พี่โอปอ",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050515-0",
      citizenId: "1-4099-00515-01-5",
      image: "/img/committee/12.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายพยาบาล",
      nameTh: "นายกมลภพ ราศรีนวล",
      nameEn: "MR. KAMOLPHOP RASRINUAL",
      nickname: "พี่ภูมิ",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "683050389-0",
      citizenId: "1-4099-00389-01-6",
      image: "/img/committee/13.webp",
    },
  },
  {
    id: "tech-pr",
    nameTh: "ฝ่ายเทคโนโลยีและประชาสัมพันธ์",
    badge: "Tech, Media & PR",
    color: "#d98e89",
    icon: Camera,
    head: {
      role: "หัวหน้าฝ่ายเทคโนโลยีและประชาสัมพันธ์",
      nameTh: "นายอชิระ โพธิญาณ์",
      nameEn: "MR. ACHIRA PHOTHIYA",
      nickname: "พี่อชิ",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050147-3",
      citizenId: "1-4099-00147-31-7",
      image: "/img/committee/14.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายเทคโนโลยีและประชาสัมพันธ์",
      nameTh: "นายณัฐนนท์ รุกขชาติ",
      nameEn: "MR. NATTHANON RUKKHACHAT",
      nickname: "พี่ปลาย",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "683050141-6",
      citizenId: "1-4099-00141-61-8",
      image: "/img/committee/15.webp",
    },
  },
  {
    id: "fundraising",
    nameTh: "ฝ่ายจัดหาทุน",
    badge: "Fundraising & Sponsor",
    color: "#b08b5f",
    icon: Coins,
    head: {
      role: "หัวหน้าฝ่ายจัดหาทุน",
      nameTh: "นายธเนศพล สังฆะเภท",
      nameEn: "MR. THANETPOL SANGKHAPHET",
      nickname: "พี่พอตเตอร์",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "683050149-0",
      citizenId: "1-4099-00149-01-9",
      image: "/img/committee/16.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายจัดหาทุน",
      nameTh: "นายธีระ จันทรศร",
      nameEn: "MR. THEERA CHANTHARASORN",
      nickname: "พี่ธีระ",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "683050148-2",
      citizenId: "1-4099-00148-21-0",
      image: "/img/committee/17.webp",
    },
  },
  {
    id: "coordination",
    nameTh: "ฝ่ายประสานงาน",
    badge: "Coordination & Liaison",
    color: "#d98e89",
    icon: HeartHandshake,
    head: {
      role: "หัวหน้าฝ่ายประสานงาน",
      nameTh: "นางสาวพนมพร ชัชวาลย์",
      nameEn: "MISS PHANOMPORN CHATCHAWAN",
      nickname: "พี่พลอย",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050518-4",
      citizenId: "1-4099-00518-41-1",
      image: "/img/committee/6.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายประสานงาน",
      nameTh: "นายถิรวิทย์ เอี่ยมแย้ม",
      nameEn: "MR. THIRAWIT EIAMYAM",
      nickname: "พี่เก๊กฮวย",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "683050396-3",
      citizenId: "1-4099-00396-31-2",
      image: "/img/committee/7.webp",
    },
  },
  {
    id: "protocol",
    nameTh: "ฝ่ายพิธีการและปฏิคม",
    badge: "Protocol & Hospitality",
    color: "#eccb7d",
    icon: Award,
    head: {
      role: "หัวหน้าฝ่ายพิธีการและปฏิคม",
      nameTh: "นางสาวชญาดา สิงหวัฒน์",
      nameEn: "MISS CHAYADA SINGHAWAT",
      nickname: "พี่ฟ้าใส",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "683050135-1",
      citizenId: "1-4099-00135-11-3",
      image: "/img/committee/8.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายพิธีการและปฏิคม",
      nameTh: "นายกิตติคุณ บรรจะโรจน์",
      nameEn: "MR. KITTIKHUN BANJAROEN",
      nickname: "พี่วีนัส",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "683050391-3",
      citizenId: "1-4099-00391-31-4",
      image: "/img/committee/9.webp",
    },
  },
  {
    id: "discipline",
    nameTh: "ฝ่ายปกครอง",
    badge: "Discipline & Governance",
    color: "#132338",
    icon: ShieldCheck,
    head: {
      role: "หัวหน้าฝ่ายปกครอง",
      nameTh: "นายภานุพงศ์ สืบเสนาะ",
      nameEn: "MR. PHANUPHONG SUEBSANOH",
      nickname: "พี่อิง",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050141-5",
      citizenId: "1-4099-00141-51-5",
      image: "/img/committee/18.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายปกครอง",
      nameTh: "นายมงคล ภูสีดิน",
      nameEn: "MR. MONGKHON PHUSEEDIN",
      nickname: "พี่เวฟ",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050143-1",
      citizenId: "1-4099-00143-11-6",
      image: "/img/committee/19.webp",
    },
  },
  {
    id: "fast-response",
    nameTh: "ฝ่ายรถเร็ว",
    badge: "Fast Response & Transport",
    color: "#e06c3a",
    icon: Zap,
    head: {
      role: "หัวหน้าฝ่ายรถเร็ว",
      nameTh: "นางสาวสุชานันท์ แก้วนาง",
      nameEn: "MISS SUCHANAN KAEWNANG",
      nickname: "พี่กาตุ่ย",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050552-4",
      citizenId: "1-4099-00552-41-7",
      image: "/img/committee/20.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายรถเร็ว",
      nameTh: "นางสาวศิรินิพา แพนไธสง",
      nameEn: "MISS SIRINIPHA PHAENTHAISONG",
      nickname: "พี่ครีม",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050394-6",
      citizenId: "1-4099-00394-61-8",
      image: "/img/committee/21.webp",
    },
  },
  {
    id: "academic",
    nameTh: "ฝ่ายวิชาการ",
    badge: "Academic & Tech Workshop",
    color: "#5e97d3",
    icon: Code2,
    head: {
      role: "หัวหน้าฝ่ายวิชาการ",
      nameTh: "นางสาวสุพิชญา พันพิลา",
      nameEn: "MISS SUPITCHAYA PHANPHILA",
      nickname: "พี่หยกหยก",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050395-4",
      citizenId: "1-4099-00395-41-9",
      image: "/img/committee/22.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายวิชาการ",
      nameTh: "นายสรยุทธ แย้มงาม",
      nameEn: "MR. SORAYUTH YAEMNGAM",
      nickname: "พี่โฟกัส",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050551-6",
      citizenId: "1-4099-00551-61-0",
      image: "/img/committee/23.webp",
    },
  },
  {
    id: "welfare",
    nameTh: "ฝ่ายสวัสดิการ",
    badge: "Welfare & Catering",
    color: "#eccb7d",
    icon: Utensils,
    head: {
      role: "หัวหน้าฝ่ายสวัสดิการ",
      nameTh: "นางสาวพลอยวรีย์ เวียงอินทร์",
      nameEn: "MISS PLOYWAREE WIANG-IN",
      nickname: "พี่จอย",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050519-2",
      citizenId: "1-4099-00519-21-1",
      image: "/img/committee/24.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายสวัสดิการ",
      nameTh: "นางสาวภูษิตา เขื่อนแก้ว",
      nameEn: "MISS PHUSITA KHUEANKAEW",
      nickname: "พี่เครป",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050520-7",
      citizenId: "1-4099-00520-71-2",
      image: "/img/committee/25.webp",
    },
  },
  {
    id: "venue",
    nameTh: "ฝ่ายสถานที่",
    badge: "Venue & Facilities",
    color: "#b08b5f",
    icon: Hammer,
    head: {
      role: "หัวหน้าฝ่ายสถานที่",
      nameTh: "นายนพรัตน์ พลราชม",
      nameEn: "MR. NOPPARAT PHONRACHOM",
      nickname: "พี่หม่อน",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050133-4",
      citizenId: "1-4099-00133-41-3",
      image: "/img/committee/26.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายสถานที่",
      nameTh: "นายเสฎฐวุฒิ กลิ่นขจร",
      nameEn: "MR. SETTHAWUT KLINKHACHON",
      nickname: "พี่ดิว",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050554-0",
      citizenId: "1-4099-00554-01-4",
      image: "/img/committee/27.webp",
    },
  },
  {
    id: "comkitty",
    nameTh: "ฝ่ายคอมคิตตี้",
    badge: "ComKitty & Recreation",
    color: "#eccb7d",
    icon: Sparkles,
    head: {
      role: "หัวหน้าฝ่ายคอมคิตตี้",
      nameTh: "นางสาวธีรริญญ์ ปุริสาร",
      nameEn: "MISS THEERARIN PURISAN",
      nickname: "พี่หนูดี",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050549-3",
      citizenId: "1-4099-00549-31-5",
      image: "/img/committee/28.webp",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายคอมคิตตี้",
      nameTh: "นางสาววิลาสินี ทองขวาง",
      nameEn: "MISS WILASINEE THONGKHUANG",
      nickname: "พี่ซีน",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050146-5",
      citizenId: "1-4099-00146-51-6",
      image: "/img/committee/29.webp",
    },
  },
];

export default function CommitteeSection() {
  return (
    <section id="committee" className="py-24 bg-cc-cream border-t-2 border-cc-navy relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cc-yellow text-cc-navy text-xs font-mono font-bold uppercase tracking-wider border-2 border-cc-navy shadow-solid-sm">
            <Crown className="w-4 h-4 text-cc-coral" />
            <span>กรรมการค่าย</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-cc-navy tracking-tight">
            คณะกรรมการดำเนินงาน <span className="text-cc-blue">ฝ่ายอำนวยการ</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-normal">
            ทีมผู้บริหารและฝ่ายอำนวยการค่าย ComClick 20 ที่ร่วมขับเคลื่อนและดูแลการจัดงานในทุกมิติ
          </p>
        </div>

        {/* ฝ่ายอำนวยการ (5 คน) Student ID Card Grid */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b-2 border-cc-navy/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cc-navy text-white flex items-center justify-center border-2 border-cc-navy shadow-solid-sm">
                <Crown className="w-5 h-5 text-cc-yellow" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-cc-coral uppercase tracking-wider block">
                  CAMP DIRECTORATE (5 ท่าน)
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl text-cc-navy">
                  ฝ่ายอำนวยการ
                </h3>
              </div>
            </div>

            {/* Quick Action Button to Full Directory */}
            <a
              href="/committee"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cc-yellow hover:bg-cc-yellow-dark text-cc-navy text-xs font-mono font-bold border-2 border-cc-navy shadow-solid-sm transition-all hover:scale-105"
            >
              <UserCheck className="w-4 h-4 text-cc-navy" />
              <span>ดูทำเนียบบัตรประจำตัวหัวหน้าและรองหัวหน้าทั้ง 12 ฝ่าย (24 ท่าน) →</span>
            </a>
          </div>

          {/* 5 Directorate Photo Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {DIRECTORATE_MEMBERS.map((dir, idx) => (
              <AnimatedContent
                key={idx}
                distance={35}
                direction="vertical"
                duration={0.6}
                delay={idx * 0.08}
                className="w-full"
              >
                <MemberPhotoCard
                  photoUrl={dir.image}
                  nameTh={dir.nameTh}
                />
              </AnimatedContent>
            ))}
          </div>
        </div>

        {/* Dedicated Navigation Callout Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border-3 border-cc-navy shadow-solid-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cc-coral text-white text-[10px] font-mono font-bold uppercase">
              <UserCheck className="w-3.5 h-3.5" />
              <span>แนะนำบุคลากรและคณะทำงาน</span>
            </div>
            <h4 className="font-display font-black text-xl sm:text-2xl text-cc-navy">
              ทำเนียบบัตรประจำตัวหัวหน้าและรองหัวหน้า 12 ฝ่าย (24 ท่าน)
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 font-normal">
              เปิดดูทำเนียบบัตรประจำตัวนักศึกษา (Student ID Card) รายชื่อ สาขาวิชา และฝ่ายที่รับผิดชอบแบบละเอียด
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <a
              href="/committee"
              className="px-8 py-4 rounded-2xl bg-cc-coral hover:bg-cc-coral-dark text-white font-display font-black text-sm border-2 border-cc-navy shadow-solid-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>เปิดดูทำเนียบบัตรทั้งหมด (24 ท่าน)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
