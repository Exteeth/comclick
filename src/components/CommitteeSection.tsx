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
} from "lucide-react";
import AnimatedContent from "./ui/AnimatedContent";
import StudentIDCard from "./ui/StudentIDCard";

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
    nameTh: "นายกิตติกร รัตนรุ่งเรือง",
    nameEn: "MR. KITTIKORN RATTANARUNGRUEANG",
    nickname: "พี่ท็อป",
    year: "ชั้นปีที่ 4",
    faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    facultyEn: "Computer Education",
    studentId: "653050123-4",
    citizenId: "1-4099-00123-45-1",
    quote: "มุ่งมั่นส่งต่อองค์ความรู้และสร้างแรงกระเพื่อมดิจิทัลสู่น้องๆ ในทศวรรษที่ 2",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "รองประธานฝ่ายบริหาร",
    role: "รองประธานกรรมการฝ่ายบริหาร",
    nameTh: "นางสาวชุติมา เจริญพร",
    nameEn: "MISS CHUTIMA CHAROENPORN",
    nickname: "พี่มายด์",
    year: "ชั้นปีที่ 4",
    faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    facultyEn: "Computer Education",
    studentId: "653050234-5",
    citizenId: "1-4099-00234-56-2",
    quote: "บริหารจัดการทีมงานทุกฝ่ายให้ขับเคลื่อนไปด้วยความราบรื่นและเป็นหนึ่งเดียว",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "รองประธานฝ่ายวิชาการ",
    role: "รองประธานกรรมการฝ่ายวิชาการ",
    nameTh: "นายณัฐนนท์ ภักดีสุวรรณ",
    nameEn: "MR. NATTHANON PHAKDEESUWAN",
    nickname: "พี่นนท์",
    year: "ชั้นปีที่ 4",
    faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    facultyEn: "Computer Education",
    studentId: "653050345-6",
    citizenId: "1-4099-00345-67-3",
    quote: "ยกระดับหลักสูตรและแล็บการเรียนรู้ AI & Coding ให้เข้มข้นและสนุกที่สุด",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "เลขานุการค่าย",
    role: "กรรมการและเลขานุการค่าย",
    nameTh: "นางสาวปภาวดี สุขสมบูรณ์",
    nameEn: "MISS PAPHAWADEE SUKSOMBOON",
    nickname: "พี่พลอย",
    year: "ชั้นปีที่ 3",
    faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    facultyEn: "Computer Education",
    studentId: "663050456-7",
    citizenId: "1-4099-00456-78-4",
    quote: "บันทึกและประสานงานข้อมูลทุกมิติ เพื่อให้การดำเนินงานเป็นไปตามแผนงาน",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "เหรัญญิกค่าย",
    role: "กรรมการและเหรัญญิกค่าย",
    nameTh: "นางสาวศิริลักษณ์ วงษ์ทอง",
    nameEn: "MISS SIRILAK WONGTHONG",
    nickname: "พี่ตาล",
    year: "ชั้นปีที่ 3",
    faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
    facultyEn: "Computer Education",
    studentId: "663050567-8",
    citizenId: "1-4099-00567-89-5",
    quote: "ดูแลระบบงบประมาณและสวัสดิการอย่างโปร่งใสและคุ้มค่าที่สุด",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
  },
];

// 2. ทั้ง 11 ฝ่าย (หัวหน้าฝ่าย และ รองหัวหน้าฝ่าย รวม 2 คนทุกฝ่าย)
export const DEPARTMENT_LEADS: DepartmentLeadGroup[] = [
  {
    id: "academic",
    nameTh: "ฝ่ายวิชาการ",
    badge: "Academic & AI Lab",
    color: "#5e97d3",
    icon: Code2,
    head: {
      role: "หัวหน้าฝ่ายวิชาการ",
      nameTh: "นายพงศธร มงคลกุล",
      nameEn: "MR. PONGSATHORN MONGKOLKUL",
      nickname: "พี่อาร์ม",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663050111-2",
      citizenId: "1-4099-01111-22-1",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายวิชาการ",
      nameTh: "นางสาวธันยพร วรรณวิเชียร",
      nameEn: "MISS THANYAPORN WANNAWICHIAN",
      nickname: "พี่พิม",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050222-3",
      citizenId: "1-4099-02222-33-2",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop",
    },
  },
  {
    id: "recreation",
    nameTh: "ฝ่ายกิจกรรมพิเศษและนันทนาการ",
    badge: "Recreation & Energy",
    color: "#eccb7d",
    icon: Sparkles,
    head: {
      role: "หัวหน้าฝ่ายกิจกรรมพิเศษฯ",
      nameTh: "นายธนวัฒน์ ศรีโชค",
      nameEn: "MR. THANAWAT SRICHOK",
      nickname: "พี่บอล",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663010333-4",
      citizenId: "1-4099-03333-44-3",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายกิจกรรมพิเศษฯ",
      nameTh: "นางสาวณิชาภา วงศ์สว่าง",
      nameEn: "MISS NICHAPA WONGSAWANG",
      nickname: "พี่กิ๊ฟ",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050444-5",
      citizenId: "1-4099-04444-55-4",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=500&auto=format&fit=crop",
    },
  },
  {
    id: "tech-pr",
    nameTh: "ฝ่ายเทคโนโลยีและประชาสัมพันธ์",
    badge: "Tech, Media & PR",
    color: "#d98e89",
    icon: Camera,
    head: {
      role: "หัวหน้าฝ่ายเทคโนโลยีและ PR",
      nameTh: "นายชนาธิป ปัญญาวงศ์",
      nameEn: "MR. CHANATHIP PANYAWONG",
      nickname: "พี่เจมส์",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663090555-6",
      citizenId: "1-4099-05555-66-5",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายเทคโนโลยีและ PR",
      nameTh: "นางสาวกุลธิดา สุวรรณ",
      nameEn: "MISS KULTHIDA SUWAN",
      nickname: "พี่แก้ม",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050666-7",
      citizenId: "1-4099-06666-77-6",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop",
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
      nameTh: "นายวรเมธ วิโรจน์ชัย",
      nameEn: "MR. WORAMETH WIROTCHANA",
      nickname: "พี่มิน",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663080777-8",
      citizenId: "1-4099-07777-88-7",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายจัดหาทุน",
      nameTh: "นางสาวศรัญยา บุญยืน",
      nameEn: "MISS SARANYA BOONYUEN",
      nickname: "พี่แนน",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050888-9",
      citizenId: "1-4099-08888-99-8",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop",
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
      nameTh: "นายศุภกฤต อินทรานนท์",
      nameEn: "MR. SUPHAKRIT INTHANON",
      nickname: "พี่บิ๊ก",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663070999-0",
      citizenId: "1-4099-09999-00-9",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายปกครอง",
      nameTh: "นางสาววรัญญา ทรัพย์เจริญ",
      nameEn: "MISS WARANYA SAPCHAROEN",
      nickname: "พี่แป้ง",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050124-5",
      citizenId: "1-4099-01245-67-0",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=500&auto=format&fit=crop",
    },
  },
  {
    id: "registration",
    nameTh: "ฝ่ายทะเบียน วัดและประเมินผล",
    badge: "Registration & Data QA",
    color: "#5e97d3",
    icon: ClipboardCheck,
    head: {
      role: "หัวหน้าฝ่ายทะเบียนฯ",
      nameTh: "นางสาวนันทิชา พงษ์ศิริ",
      nameEn: "MISS NANTICHA PONGSIRI",
      nickname: "พี่นุ๊ก",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663050235-6",
      citizenId: "1-4099-02356-78-1",
      image: "https://images.unsplash.com/photo-1534751516642-a171edd25218?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายทะเบียนฯ",
      nameTh: "นายภาณุพงศ์ สมหวัง",
      nameEn: "MR. PANUPONG SOMWANG",
      nickname: "พี่ฟลุ๊ค",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673090346-7",
      citizenId: "1-4099-03467-89-2",
      image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=500&auto=format&fit=crop",
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
      nameTh: "นางสาวภัทราภรณ์ มั่นคง",
      nameEn: "MISS PHATTRAPORN MANKHONG",
      nickname: "พี่ปิ่น",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663050457-8",
      citizenId: "1-4099-04578-90-3",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายประสานงาน",
      nameTh: "นายธีรวัฒน์ รุ่งเรือง",
      nameEn: "MR. THEERAWAT RUNGRUEANG",
      nickname: "พี่ตั้ม",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673010568-9",
      citizenId: "1-4099-05689-01-4",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=500&auto=format&fit=crop",
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
      nameTh: "นางสาวพิมพาภรณ์ ศรีสุวรรณ",
      nameEn: "MISS PIMPAPORN SRISUWAN",
      nickname: "พี่แพรว",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663040679-0",
      citizenId: "1-4099-06790-12-5",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายพยาบาล",
      nameTh: "นายจิรายุ ภูมินทร์",
      nameEn: "MR. JIRAYU PHOOMIN",
      nickname: "พี่เจ",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673030780-1",
      citizenId: "1-4099-07801-23-6",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=500&auto=format&fit=crop",
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
      nameTh: "นางสาวกรกนก อมรรัตน์",
      nameEn: "MISS KORNKANOK AMONRAT",
      nickname: "พี่เนย",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663050891-2",
      citizenId: "1-4099-08912-34-7",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายพิธีการและปฏิคม",
      nameTh: "นายอภิสิทธิ์ วาณิช",
      nameEn: "MR. APHISIT WANIT",
      nickname: "พี่เบนซ์",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673050902-3",
      citizenId: "1-4099-09023-45-8",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop",
    },
  },
  {
    id: "venue",
    nameTh: "ฝ่ายสถานที่",
    badge: "Venue & Infrastructure",
    color: "#b08b5f",
    icon: Hammer,
    head: {
      role: "หัวหน้าฝ่ายสถานที่",
      nameTh: "นายอานนท์ เพชรประดับ",
      nameEn: "MR. ARNON PHETPRADAP",
      nickname: "พี่เอิร์ธ",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663090013-4",
      citizenId: "1-4099-00134-56-9",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายสถานที่",
      nameTh: "นายวุฒิชัย บุญเรือง",
      nameEn: "MR. WUTTICHAI BOONRUEANG",
      nickname: "พี่ก็อต",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673020124-5",
      citizenId: "1-4099-01245-67-1",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=500&auto=format&fit=crop",
    },
  },
  {
    id: "catering-welfare",
    nameTh: "ฝ่ายอาหารและสวัสดิการ",
    badge: "Catering & Welfare",
    color: "#eccb7d",
    icon: Utensils,
    head: {
      role: "หัวหน้าฝ่ายอาหารและสวัสดิการ",
      nameTh: "นางสาวศศิธร นามดี",
      nameEn: "MISS SASITHORN NAMDEE",
      nickname: "พี่ทราย",
      year: "ชั้นปีที่ 3",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "663050235-7",
      citizenId: "1-4099-02357-89-2",
      image: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=500&auto=format&fit=crop",
    },
    subHead: {
      role: "รองหัวหน้าฝ่ายอาหารและสวัสดิการ",
      nameTh: "นางสาวกานดา พิพัฒน์",
      nameEn: "MISS KANDA PIPHAT",
      nickname: "พี่ก้อย",
      year: "ชั้นปีที่ 2",
      faculty: "สาขาวิชาคอมพิวเตอร์ศึกษา",
      facultyEn: "Computer Education",
      studentId: "673060346-8",
      citizenId: "1-4099-03468-90-3",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=500&auto=format&fit=crop",
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
              <span>ดูทำเนียบบัตรประจำตัวหัวหน้าและรองหัวหน้าทั้ง 11 ฝ่าย (22 ท่าน) →</span>
            </a>
          </div>

          {/* 5 Directorate Student ID Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {DIRECTORATE_MEMBERS.map((dir, idx) => (
              <AnimatedContent
                key={idx}
                distance={35}
                direction="vertical"
                duration={0.6}
                delay={idx * 0.08}
                className="w-full flex justify-center"
              >
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
              ทำเนียบบัตรประจำตัวหัวหน้าและรองหัวหน้า 11 ฝ่าย (22 ท่าน)
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
              <span>เปิดดูทำเนียบบัตรทั้งหมด (22 ท่าน)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
