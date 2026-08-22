export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "interview_eligible"
  | "interview"
  | "interview_passed"
  | "reserved"
  | "confirmed"
  | "rejected"
  | "SUBMITTED"
  | "DOCUMENT_PASSED"
  | "INTERVIEW_ELIGIBLE"
  | "INTERVIEW_SCHEDULED"
  | "ACCEPTED"
  | "CONFIRMED"
  | "REJECTED";

export type YearLevel = "ปี 1" | "ปี 2" | "ปี 3" | "ปี 4" | "อื่นๆ / บัณฑิตศึกษา";

export type ShirtSize = "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "4XL";

export type DietRequirement = "ทั่วไป (อาหารปกติ)" | "ฮาลาล (อิสลาม)" | "มังสวิรัติ" | "เจ" | "แพ้อาหารเฉพาะ";

export interface Department {
  id: string;
  nameTh: string;
  nameEn: string;
  badge: string;
  icon: string;
  color: string;
  description: string;
  shortDesc: string;
  responsibilities: string[];
  qualifications: string[];
  openSlots: number;
  tags: string[];
  bannerGradient: string;
  isOpenForApplication?: boolean;
}

export interface Application {
  id: string;                      // e.g. CC20-2026-8942
  createdAt: string;               // ISO String
  updatedAt: string;

  // Section 1: ข้อมูลทั่วไป
  titleTh?: "นาย" | "นางสาว" | "นาง" | "อื่นๆ" | string;
  fullNameTh: string;              // ชื่อ - นามสกุล
  nicknameTh?: string;             // ชื่อเล่น
  studentId: string;               // รหัสนักศึกษา (รูปแบบ 663050123-4)
  faculty: string;                 // คณะ
  major: string;                   // สาขาวิชา
  year: string;                    // ชั้นปี (ปี 1 - ปี 3)
  phone: string;                   // เบอร์โทรศัพท์ (10 หลัก ไม่มีขีด)
  facebookName?: string;           // ชื่อ Facebook ของตนเอง
  facebookUrl?: string;            // Link Facebook ของตนเอง

  // Section 2: คำถามแสดงทัศนคติ
  reasonToApply?: string;          // เพราะเหตุใดผู้สมัครจึงสนใจหรือต้องการสมัครเป็นพี่ค่าย...
  strengths?: string;              // ข้อดีของตนเอง (พอสังเขป)
  weaknesses?: string;             // ข้อเสียของตนเอง (พอสังเขป)

  // Section 3: ฝ่ายที่ต้องการลงสมัคร
  firstChoiceDeptId: string;       // ฝ่ายที่ต้องการลง อันดับที่ 1
  secondChoiceDeptId: string;      // ฝ่ายที่ต้องการลง อันดับที่ 2
  fallbackDeptChoice: string;      // ถ้าไม่ติดอยากลงฝ่ายไหน

  // Special Questions
  techPortfolioUrl?: string;       // สำหรับฝ่ายเทคโนโลยีและประชาสัมพันธ์
  hasCar?: boolean | string;       // มีรถยนต์หรือไม่ (ใช่ / ไม่)
  carType?: string;                // รถเก๋ง / รถกระบะ / อื่นๆ
  carTypeOther?: string;           // ระบุประเภทรถอื่นๆ

  // Additional / Compatibility Fields
  diet?: DietRequirement | string;
  dietNote?: string;
  shirtSize?: ShirtSize | string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  canJoinPreparation?: boolean;
  canJoinCampDates?: boolean;
  pastExperience?: string;
  skillsAndStrengths?: string;
  problemSolvingScenario?: string;
  portfolioUrl?: string;

  // Status & Administration
  status: ApplicationStatus;
  statusNotes?: string;
  interviewDate?: string;
  interviewLocation?: string;
  assignedDeptId?: string;
}

export interface CampTimelineItem {
  phase: string;
  date: string;
  title: string;
  description: string;
  status: "upcoming" | "active" | "completed";
  highlight?: boolean;
}

export interface CampStat {
  label: string;
  value: string;
  subtext: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "qualification" | "interview" | "activity" | "general";
}
