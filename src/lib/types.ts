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

  // Personal Info
  titleTh: "นาย" | "นางสาว" | "นาง" | "อื่นๆ";
  fullNameTh: string;
  nicknameTh: string;
  fullNameEn?: string;
  studentId: string;               // รหัสนักศึกษา 10-11 หลัก
  faculty: string;                 // คณะ เช่น ศึกษาศาสตร์, วิศวกรรมศาสตร์, วิทยาศาสตร์ ฯลฯ
  major: string;                   // สาขาวิชา เช่น คอมพิวเตอร์ศึกษา, วิทยาการคอมพิวเตอร์
  year: YearLevel;
  phone: string;
  lineId: string;
  facebookOrIg?: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };

  // Lifestyle & Logistics
  shirtSize: ShirtSize;
  diet: DietRequirement;
  dietNote?: string;
  medicalConditions?: string;      // โรคประจำตัว หรือ ยาที่แพ้
  canJoinPreparation: boolean;     // สามารถเข้าร่วมการเตรียมงานได้
  canJoinCampDates: boolean;       // สามารถอยู่ร่วมค่ายตลอดระยะเวลาได้

  // Department Choices
  firstChoiceDeptId: string;
  secondChoiceDeptId: string;

  // Screening & Interview Q&A
  reasonToApply: string;           // เหตุผลที่อยากมาเป็นพี่ค่าย Comclick 20
  pastExperience: string;          // ประสบการณ์ทำงานค่ายหรือกิจกรรมที่ผ่านมา
  skillsAndStrengths: string;      // ทักษะ จุดเด่น ความสามารถพิเศษที่สอดคล้องกับฝ่าย
  problemSolvingScenario: string;  // วิธีแก้ปัญหาเฉพาะหน้าในการทำงานเป็นทีม
  portfolioUrl?: string;           // ลิงก์พอร์ตโฟลิโอ / ผลงาน / Google Drive

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
