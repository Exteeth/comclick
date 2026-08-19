export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "interview_eligible"
  | "interview_passed"
  | "reserved"
  | "confirmed"
  | "rejected"
  | "SUBMITTED"
  | "DOCUMENT_PASSED"
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
}

export interface Application {
  id: string;                      // e.g. CC20-2026-8942
  createdAt: string;               // ISO String
  updatedAt: string;

  // Core 6 Required Fields
  fullNameTh: string;              // 1. ชื่อ - นามสกุล
  studentId: string;               // 2. รหัสนักศึกษา
  phone: string;                   // 3. เบอร์โทรศัพท์
  major: string;                   // 4. สาขาวิชา
  firstChoiceDeptId: string;       // 5. ฝ่ายที่ต้องการลง อันดับที่ 1
  secondChoiceDeptId: string;      // 5. ฝ่ายที่ต้องการลง อันดับที่ 2
  fallbackDeptChoice: string;      // 6. ถ้าไม่ติดอยากลงฝ่ายไหน

  // Additional / Optional Fields
  titleTh?: "นาย" | "นางสาว" | "นาง" | "อื่นๆ";
  nicknameTh?: string;
  fullNameEn?: string;
  faculty?: string;
  year?: YearLevel | string;
  lineId?: string;
  facebookOrIg?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };

  shirtSize?: ShirtSize | string;
  diet?: DietRequirement | string;
  dietNote?: string;
  medicalConditions?: string;
  canJoinPreparation?: boolean;
  canJoinCampDates?: boolean;

  reasonToApply?: string;
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
