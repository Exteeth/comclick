"use client";

import React, { useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/lib/types";
import { DEPARTMENTS } from "@/lib/constants";
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  Edit,
  X,
  Lock,
  KeyRound,
  LogOut,
  EyeOff,
  AlertCircle,
  Trash2,
  Save,
  RefreshCw,
  User,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  TableProperties,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  // Tab View Mode: 'departments' | 'table'
  const [viewMode, setViewMode] = useState<"departments" | "table">("departments");

  // Expanded Department Card ID
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    id: string;
    fullNameTh: string;
    nicknameTh: string;
    studentId: string;
    year: string;
    phone: string;
    faculty: string;
    major: string;
    facebookName: string;
    facebookUrl: string;
    reasonToApply: string;
    strengths: string;
    weaknesses: string;
    techPortfolioUrl: string;
    hasCar: string;
    carType: string;
    carTypeOther: string;
    diet: string;
    firstChoiceDeptId: string;
    secondChoiceDeptId: string;
    fallbackDeptChoice: string;
    assignedDeptId: string;
    status: ApplicationStatus;
    statusNotes: string;
    interviewDate: string;
    interviewLocation: string;
  }>({
    id: "",
    fullNameTh: "",
    nicknameTh: "",
    studentId: "",
    year: "ชั้นปีที่ 1",
    phone: "",
    faculty: "คณะศึกษาศาสตร์",
    major: "",
    facebookName: "",
    facebookUrl: "",
    reasonToApply: "",
    strengths: "",
    weaknesses: "",
    techPortfolioUrl: "",
    hasCar: "",
    carType: "",
    carTypeOther: "",
    diet: "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)",
    firstChoiceDeptId: DEPARTMENTS[0]?.id ?? "protocol",
    secondChoiceDeptId: DEPARTMENTS[1]?.id ?? "fundraising",
    fallbackDeptChoice: "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร",
    assignedDeptId: "",
    status: "SUBMITTED",
    statusNotes: "",
    interviewDate: "",
    interviewLocation: "",
  });

  const fetchLiveApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/applications", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const sorted = [...json.data].sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        setApplications(sorted);
      }
    } catch (err) {
      console.warn("Failed to fetch applications from server:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const auth = sessionStorage.getItem("cc20_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    fetchLiveApplications();

    // Auto-sync polling every 3 seconds directly from server DB
    const timer = setInterval(() => {
      fetchLiveApplications();
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "cc20admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("cc20_admin_auth", "true");
      setAuthError(null);
      fetchLiveApplications();
    } else {
      setAuthError("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("cc20_admin_auth");
    setPasswordInput("");
  };

  // Helper to check if application is approved
  const isAppAccepted = (app: Application) => {
    const s = (app.status || "").toUpperCase();
    return s === "ACCEPTED" || s === "CONFIRMED" || s === "INTERVIEW_PASSED";
  };

  const isAppRejected = (app: Application) => {
    const s = (app.status || "").toUpperCase();
    return s === "REJECTED";
  };

  const isAppInterview = (app: Application) => {
    const s = (app.status || "").toUpperCase();
    return (
      s === "INTERVIEW_ELIGIBLE" ||
      s === "INTERVIEW" ||
      s === "INTERVIEW_SCHEDULED" ||
      s === "DOCUMENT_PASSED"
    );
  };

  // Filtered list for table view
  const filteredApps = applications.filter((app) => {
    const matchSearch =
      (app.fullNameTh || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.nicknameTh || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.studentId || "").includes(searchQuery) ||
      (app.phone || "").includes(searchQuery) ||
      (app.facebookName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.id || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "ACCEPTED" && isAppAccepted(app)) ||
      (statusFilter === "REJECTED" && isAppRejected(app)) ||
      (statusFilter === "INTERVIEW" && isAppInterview(app)) ||
      (statusFilter === "SUBMITTED" && !isAppAccepted(app) && !isAppRejected(app) && !isAppInterview(app));

    const matchDept =
      deptFilter === "all" ||
      app.firstChoiceDeptId === deptFilter ||
      app.secondChoiceDeptId === deptFilter ||
      app.assignedDeptId === deptFilter;

    return matchSearch && matchStatus && matchDept;
  });

  // Open Edit Modal
  const handleOpenEdit = (app: Application) => {
    const isAccepted = isAppAccepted(app);
    const isInterview = isAppInterview(app);
    const isRejected = isAppRejected(app);

    let normalizedStatus: ApplicationStatus = "SUBMITTED";
    if (isAccepted) normalizedStatus = "ACCEPTED";
    else if (isRejected) normalizedStatus = "REJECTED";
    else if (isInterview) normalizedStatus = "INTERVIEW_ELIGIBLE";

    setEditFormData({
      id: app.id,
      fullNameTh: app.fullNameTh || "",
      nicknameTh: app.nicknameTh || "",
      studentId: app.studentId || "",
      year: app.year || "ชั้นปีที่ 1",
      phone: app.phone || "",
      faculty: app.faculty || "คณะศึกษาศาสตร์",
      major: app.major || "",
      facebookName: app.facebookName || "",
      facebookUrl: app.facebookUrl || "",
      reasonToApply: app.reasonToApply || "",
      strengths: app.strengths || "",
      weaknesses: app.weaknesses || "",
      techPortfolioUrl: app.techPortfolioUrl || "",
      hasCar: String(app.hasCar || ""),
      carType: app.carType || "",
      carTypeOther: app.carTypeOther || "",
      diet: app.diet || "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)",
      firstChoiceDeptId: app.firstChoiceDeptId || DEPARTMENTS[0]?.id || "protocol",
      secondChoiceDeptId: app.secondChoiceDeptId || DEPARTMENTS[1]?.id || "fundraising",
      fallbackDeptChoice: app.fallbackDeptChoice || "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร",
      assignedDeptId: isAccepted ? (app.assignedDeptId || app.firstChoiceDeptId || "") : "",
      status: normalizedStatus,
      statusNotes: app.statusNotes || "",
      interviewDate: app.interviewDate || "",
      interviewLocation: app.interviewLocation || "",
    });
    setIsEditModalOpen(true);
  };

  // Save changes
  const handleSaveEdit = async () => {
    if (!editFormData.id) return;
    setIsSaving(true);

    try {
      // If status is not ACCEPTED, assignedDeptId should not be set
      const payloadToSave: typeof editFormData = {
        ...editFormData,
        assignedDeptId:
          editFormData.status === "ACCEPTED"
            ? (editFormData.assignedDeptId || editFormData.firstChoiceDeptId || "")
            : "",
      };

      // 1. Sync with Server API / Database
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSave),
      });

      if (!res.ok) {
        throw new Error("Failed to update application on server");
      }

      // 2. Update local component state
      setApplications((prev) =>
        prev.map((a) => (a.id === payloadToSave.id ? { ...a, ...payloadToSave } : a))
      );

      setIsEditModalOpen(false);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete applicant
  const handleDeleteApplicant = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบข้อมูลผู้สมัคร "${name}" (${id}) ใช่หรือไม่?`)) return;

    try {
      await fetch(`/api/applications?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (isEditModalOpen) setIsEditModalOpen(false);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  // Helper to get Thai department name
  const getDeptNameTh = (deptIdOrName: string | undefined | null) => {
    if (!deptIdOrName || deptIdOrName === "-") return "-";
    const found = DEPARTMENTS.find((d) => d.id === deptIdOrName || d.nameTh === deptIdOrName);
    return found ? found.nameTh : deptIdOrName;
  };

  // Export CSV with full Thai names & UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      "รหัสใบสมัคร",
      "ชื่อ-นามสกุล",
      "ชื่อเล่น",
      "รหัสนักศึกษา",
      "ชั้นปี",
      "คณะ",
      "สาขาวิชา",
      "เบอร์โทรศัพท์",
      "ชื่อ Facebook",
      "ลิงก์ Facebook",
      "เหตุผลที่สนใจสมัคร",
      "ข้อดีของตนเอง",
      "ข้อเสียของตนเอง",
      "ฝ่ายอันดับที่ 1",
      "ฝ่ายอันดับที่ 2",
      "ถ้าไม่ติด 1 และ 2 อยากลงฝ่ายไหน",
      "ลิงก์พอร์ตโฟลิโอ (ฝ่ายเทคโนฯ)",
      "มีรถยนต์ (ฝ่ายรถเร็ว)",
      "ประเภทรถ (ฝ่ายรถเร็ว)",
      "ฝ่ายที่ได้รับคัดเลือกจริง",
      "สถานะการคัดเลือก",
      "หมายเหตุ",
    ];

    const rows = filteredApps.map((a) => {
      const firstTh = getDeptNameTh(a.firstChoiceDeptId);
      const secondTh = getDeptNameTh(a.secondChoiceDeptId);
      const fallbackTh = getDeptNameTh(a.fallbackDeptChoice);

      // Final assigned dept name in Thai
      const assignedTh = isAppAccepted(a)
        ? (a.assignedDeptId ? getDeptNameTh(a.assignedDeptId) : firstTh)
        : "-";

      const statusTh = isAppAccepted(a)
        ? "ผ่านการคัดเลือก"
        : isAppInterview(a)
        ? "มีสิทธิ์เข้าสัมภาษณ์"
        : isAppRejected(a)
        ? "ไม่ผ่านการคัดเลือก"
        : "รอดำเนินการ";

      return [
        a.id,
        a.fullNameTh,
        a.nicknameTh || "-",
        `\t${a.studentId}`,
        a.year || "ปี 1",
        a.faculty || "คณะศึกษาศาสตร์",
        a.major,
        `\t${a.phone}`,
        a.facebookName || "-",
        a.facebookUrl || "-",
        a.reasonToApply || "-",
        a.strengths || "-",
        a.weaknesses || "-",
        firstTh,
        secondTh,
        fallbackTh,
        a.techPortfolioUrl || "-",
        a.hasCar ? `ใช่ (${a.carType || ""})` : "ไม่",
        a.carType || "-",
        assignedTh,
        statusTh,
        a.statusNotes || "-",
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${(val || "").toString().replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `รายชื่อผู้สมัคร_Comclick20_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If not authenticated, render password lock screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-cc-yellow border-2 border-cc-navy text-cc-navy flex items-center justify-center mx-auto shadow-solid-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="font-display font-black text-2xl text-cc-navy">
              เข้าสู่ระบบ Admin Portal
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-normal">
              แดชบอร์ดจัดการผู้สมัครสำหรับคณะกรรมการ Comclick 20
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-500 text-red-700 flex items-center gap-2.5 text-xs font-bold animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-cc-navy">
                รหัสผ่านผู้ดูแลระบบ (Admin Password)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="กรอกรหัสผ่านเพื่อเข้าสู่ระบบ"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(null);
                  }}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-cc-navy bg-white text-sm text-gray-800 placeholder-gray-400 focus:bg-cc-cream-50 focus:border-cc-blue outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cc-navy cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-display font-black text-sm text-white bg-cc-navy hover:bg-cc-blue border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-cc-yellow" />
              <span>เข้าสู่ระบบแดชบอร์ด</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Stats calculation
  const totalCount = applications.length;
  const acceptedCount = applications.filter(isAppAccepted).length;
  const interviewCount = applications.filter(isAppInterview).length;
  const rejectedCount = applications.filter(isAppRejected).length;
  const pendingCount = totalCount - acceptedCount - rejectedCount - interviewCount;

  // Total Open Slots across 11 Departments
  const totalOpenSlots = DEPARTMENTS.reduce((acc, d) => acc + d.openSlots, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-cc-navy text-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cc-yellow text-cc-navy text-xs font-mono font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ADMIN EVALUATION & ROSTER MANAGEMENT</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            ระบบบริหารจัดการและคัดเลือกพี่ค่าย Comclick 20
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-1 font-light">
            สรุปยอดผู้สมัคร 13 ฝ่าย • สัมภาษณ์ • จัดสรรสตาฟตัวจริง • ส่งออกข้อมูลสรุป
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchLiveApplications}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="รีเฟรชข้อมูลจาก Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>ซิงค์ข้อมูล</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={applications.length === 0}
            className="px-5 py-2.5 rounded-xl bg-cc-coral hover:bg-cc-coral-dark text-white font-bold text-xs sm:text-sm border-2 border-white/20 shadow-solid-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ส่งออก Excel/CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="ออกจากระบบ Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* 5 Stat Bento Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-cc-blue text-white border-3 border-cc-navy shadow-solid">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase">ผู้สมัครทั้งหมด</span>
            <Users className="w-4 h-4 text-cc-yellow" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl mt-2">{totalCount}</div>
          <div className="text-[10px] opacity-80 mt-1 font-medium">รวม 13 ฝ่าย</div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-amber-500 text-cc-navy border-3 border-cc-navy shadow-solid">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase">รอดำเนินการ</span>
            <Clock className="w-4 h-4 text-cc-navy" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl mt-2">{pendingCount}</div>
          <div className="text-[10px] opacity-80 mt-1 font-medium">รอตรวจเอกสาร</div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-purple-600 text-white border-3 border-cc-navy shadow-solid">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase">มีสิทธิ์สัมภาษณ์</span>
            <Award className="w-4 h-4 text-purple-200" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl mt-2">{interviewCount}</div>
          <div className="text-[10px] opacity-80 mt-1 font-medium">ผ่านรอบเอกสาร</div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-600 text-white border-3 border-cc-navy shadow-solid">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase">ผ่านการคัดเลือก</span>
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl mt-2">{acceptedCount}</div>
          <div className="text-[10px] opacity-80 mt-1 font-medium">สตาฟตัวจริง</div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-gray-500 text-white border-3 border-cc-navy shadow-solid col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase">ไม่ผ่านการคัดเลือก</span>
            <XCircle className="w-4 h-4 text-gray-200" />
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl mt-2">{rejectedCount}</div>
          <div className="text-[10px] opacity-80 mt-1 font-medium">ปฏิเสธ / สละสิทธิ์</div>
        </div>
      </div>

      {/* View Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-white rounded-2xl border-2 border-cc-navy shadow-solid-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setViewMode("departments")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === "departments"
                ? "bg-cc-navy text-white shadow-solid-sm border-2 border-cc-navy"
                : "text-gray-600 hover:bg-gray-100 border-2 border-transparent"
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-cc-yellow" />
            <span>สรุปยอดและโควตารายฝ่าย (13 ฝ่าย)</span>
          </button>

          <button
            onClick={() => setViewMode("table")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-cc-navy text-white shadow-solid-sm border-2 border-cc-navy"
                : "text-gray-600 hover:bg-gray-100 border-2 border-transparent"
            }`}
          >
            <TableProperties className="w-4 h-4 text-cc-coral" />
            <span>ตารางรายชื่อผู้สมัครทั้งหมด ({applications.length})</span>
          </button>
        </div>

        <div className="text-xs text-gray-500 font-mono px-3 hidden md:block">
          ฐานข้อมูล Neon PostgreSQL
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: 13 DEPARTMENTS BREAKDOWN & ROSTER VIEW                             */}
      {/* ========================================================================= */}
      {viewMode === "departments" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-xl text-cc-navy flex items-center gap-2">
              <Layers className="w-5 h-5 text-cc-coral" />
              <span>ภาพรวมยอดผู้สมัครจำแนกตามฝ่าย (13 ฝ่าย)</span>
            </h3>
            <span className="text-xs text-gray-500 font-mono">
              คลิกการ์ดเพื่อดูรายชื่อสตาฟตัวจริงและผู้สมัครในแต่ละฝ่าย
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEPARTMENTS.map((dept) => {
              // 1. Applicants who chose choice 1
              const choice1List = applications.filter((a) => a.firstChoiceDeptId === dept.id);
              // 2. Applicants who chose choice 2
              const choice2List = applications.filter((a) => a.secondChoiceDeptId === dept.id);

              // 3. Official Approved Staff in this department (Assigned to this dept AND Accepted)
              const officialStaffList = applications.filter(
                (a) =>
                  (a.assignedDeptId === dept.id || (!a.assignedDeptId && a.firstChoiceDeptId === dept.id)) &&
                  isAppAccepted(a)
              );

              // 4. Applicants who applied for Choice 1 or Choice 2
              const applicantsForThisDept = applications.filter(
                (a) => a.firstChoiceDeptId === dept.id || a.secondChoiceDeptId === dept.id
              );

              const isExpanded = expandedDeptId === dept.id;

              return (
                <div
                  key={dept.id}
                  className={`rounded-3xl border-3 border-cc-navy bg-white shadow-solid transition-all overflow-hidden flex flex-col justify-between ${
                    isExpanded ? "md:col-span-2 lg:col-span-3 shadow-solid-lg" : ""
                  }`}
                >
                  {/* Card Header & Summary */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1">
                    {/* Top Row: Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-cc-cream text-cc-navy border border-cc-navy/20 truncate">
                        {dept.badge}
                      </span>
                      {dept.isOpenForApplication === false || dept.id === "directorate" ? (
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 whitespace-nowrap">
                          ไม่เปิดรับสมัครทั่วไป
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cc-cream text-cc-navy border border-cc-navy/20 whitespace-nowrap">
                          เปิดรับสมัคร
                        </span>
                      )}
                    </div>

                    {/* Department Name & Short Desc */}
                    <div>
                      <h4 className="font-display font-black text-lg text-cc-navy leading-tight">
                        {dept.nameTh}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 font-normal line-clamp-2">
                        {dept.shortDesc}
                      </p>
                    </div>

                    {/* Clean 3 Metric Summary Boxes */}
                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                      <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-200">
                        <span className="text-[10px] font-bold text-gray-500 block">สมัครอันดับ 1</span>
                        <span className="font-display font-black text-lg text-cc-blue block mt-0.5">
                          {choice1List.length}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-200">
                        <span className="text-[10px] font-bold text-gray-500 block">สมัครอันดับ 2</span>
                        <span className="font-display font-black text-lg text-cc-coral block mt-0.5">
                          {choice2List.length}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-300">
                        <span className="text-[10px] font-bold text-emerald-800 block">สตาฟตัวจริง</span>
                        <span className="font-display font-black text-lg text-emerald-700 block mt-0.5">
                          {officialStaffList.length} คน
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expand / Collapse Action Bar */}
                  <div className="p-4 bg-gray-50 border-t-2 border-cc-navy/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">
                      สตาฟตัวจริง: <strong className="text-emerald-700 font-display">{officialStaffList.length}</strong> คน
                    </span>

                    <button
                      onClick={() => setExpandedDeptId(isExpanded ? null : dept.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-cc-navy hover:bg-cc-blue text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>{isExpanded ? "ย่อรายชื่อ" : "ดูรายชื่อสตาฟ & ผู้สมัคร"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-cc-yellow" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-cc-yellow" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Breakdown & Tables */}
                  {isExpanded && (
                    <div className="border-t-2 border-cc-navy/20 bg-white p-4 sm:p-6 space-y-6 animate-fadeIn">
                      {/* ========================================================= */}
                      {/* SECTION 1: สตาฟตัวจริงที่ได้ฝ่ายนี้ (OFFICIAL STAFF)      */}
                      {/* ========================================================= */}
                      <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-500">
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                              <Check className="w-4 h-4" />
                            </div>
                            <h5 className="font-display font-black text-base text-emerald-950">
                              สตาฟตัวจริงที่ผ่านคัดเลือกใน {dept.nameTh} ({officialStaffList.length} คน)
                            </h5>
                          </div>
                          <span className="text-xs text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                            สมาชิกฝ่ายทางการ
                          </span>
                        </div>

                        {officialStaffList.length === 0 ? (
                          <div className="text-center py-4 text-xs text-gray-500">
                            ยังไม่มีผู้สมัครที่ได้รับการจัดสรรให้ผ่านในฝ่ายนี้ (สามารถกดแก้ไข/จัดสรรผู้สมัครด้านล่างเพื่อเลือกให้อยู่ฝ่ายนี้ได้)
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs bg-white rounded-xl border border-emerald-200 overflow-hidden">
                              <thead className="bg-emerald-100/70 text-emerald-950 font-mono font-bold uppercase border-b border-emerald-200">
                                <tr>
                                  <th className="py-2.5 px-3">ที่มา / การจัดสรร</th>
                                  <th className="py-2.5 px-3">ชื่อ - นามสกุล</th>
                                  <th className="py-2.5 px-3">รหัสนักศึกษา / สาขา</th>
                                  <th className="py-2.5 px-3">เบอร์โทร</th>
                                  <th className="py-2.5 px-3">สถานะ</th>
                                  <th className="py-2.5 px-3 text-center">จัดการ</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-emerald-100 font-medium">
                                {officialStaffList.map((app) => {
                                  const isOrigChoice1 = app.firstChoiceDeptId === dept.id;
                                  const isOrigChoice2 = app.secondChoiceDeptId === dept.id;

                                  let originBadge = "จัดสรรให้ฝ่ายนี้";
                                  let originClass = "bg-purple-100 text-purple-900 border-purple-300";

                                  if (isOrigChoice1) {
                                    originBadge = "ได้ตามอันดับ 1";
                                    originClass = "bg-emerald-100 text-emerald-900 border-emerald-300";
                                  } else if (isOrigChoice2) {
                                    originBadge = "ได้ตามอันดับ 2";
                                    originClass = "bg-orange-100 text-orange-900 border-orange-300";
                                  } else {
                                    originBadge = `ย้ายมาจากอันดับ 1 (${DEPARTMENTS.find(d => d.id === app.firstChoiceDeptId)?.nameTh || app.firstChoiceDeptId})`;
                                  }

                                  return (
                                    <tr key={`staff-${app.id}`} className="hover:bg-emerald-50/50 transition-colors">
                                      <td className="py-2.5 px-3 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded-md border font-bold text-[10px] ${originClass}`}>
                                          {originBadge}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 font-bold text-cc-navy whitespace-nowrap">
                                        <div>{app.fullNameTh}</div>
                                        {app.diet && (
                                          <div className="text-[10px] font-normal text-emerald-800 flex items-center gap-1 mt-0.5">
                                            <span>🍽️ {app.diet}</span>
                                          </div>
                                        )}
                                      </td>
                                      <td className="py-2.5 px-3 whitespace-nowrap">
                                        <div className="font-mono font-bold text-cc-navy">{app.studentId}</div>
                                        <div className="text-[10px] text-gray-500">{app.major}</div>
                                      </td>
                                      <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                                        {app.phone}
                                      </td>
                                      <td className="py-2.5 px-3 whitespace-nowrap">
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] shadow-2xs">
                                          ผ่านการคัดเลือก
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                        <button
                                          onClick={() => handleOpenEdit(app)}
                                          className="px-2.5 py-1 rounded-lg bg-cc-navy text-white hover:bg-cc-blue text-xs font-bold transition-all flex items-center gap-1 mx-auto cursor-pointer"
                                        >
                                          <Edit className="w-3 h-3 text-cc-yellow" />
                                          <span>แก้ไข/ย้าย</span>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* ========================================================= */}
                      {/* SECTION 2: ผู้สมัครที่เลือกฝ่ายนี้ (อันดับ 1 & 2)          */}
                      {/* ========================================================= */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                          <h5 className="font-display font-black text-sm text-cc-navy">
                            ผู้สมัครที่เลือก {dept.nameTh} ตอนกรอกใบสมัคร ({applicantsForThisDept.length} คน)
                          </h5>
                          <span className="text-xs text-gray-500">
                            อันดับ 1: {choice1List.length} คน • อันดับ 2: {choice2List.length} คน
                          </span>
                        </div>

                        {applicantsForThisDept.length === 0 ? (
                          <div className="text-center py-4 text-xs text-gray-400">
                            ยังไม่มีผู้สมัครเลือกฝ่ายนี้
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-cc-cream/60 text-cc-navy font-mono font-bold uppercase border-b border-gray-200">
                                <tr>
                                  <th className="py-2 px-3">อันดับที่เลือก</th>
                                  <th className="py-2 px-3">ชื่อ - นามสกุล</th>
                                  <th className="py-2 px-3">รหัสนักศึกษา / สาขา</th>
                                  <th className="py-2 px-3">ถ้าไม่ติด 1-2</th>
                                  <th className="py-2 px-3">ผลการจัดสรร / ปลายทาง</th>
                                  <th className="py-2 px-3 text-center">จัดการ</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 font-medium">
                                {applicantsForThisDept.map((app) => {
                                  const isChoice1 = app.firstChoiceDeptId === dept.id;
                                  const isChoice2 = app.secondChoiceDeptId === dept.id;

                                  const assignedToThis =
                                    (app.assignedDeptId === dept.id || (!app.assignedDeptId && app.firstChoiceDeptId === dept.id)) &&
                                    isAppAccepted(app);

                                  const assignedOtherDept =
                                    isAppAccepted(app) &&
                                    app.assignedDeptId &&
                                    app.assignedDeptId !== dept.id;

                                  const otherDeptObj = assignedOtherDept
                                    ? DEPARTMENTS.find((d) => d.id === app.assignedDeptId)
                                    : null;

                                  return (
                                    <tr key={`applied-${app.id}`} className="hover:bg-cc-cream/30 transition-colors">
                                      <td className="py-2 px-3 whitespace-nowrap">
                                        {isChoice1 ? (
                                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-bold text-[10px]">
                                            อันดับ 1
                                          </span>
                                        ) : isChoice2 ? (
                                          <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-300 font-bold text-[10px]">
                                            อันดับ 2
                                          </span>
                                        ) : null}
                                      </td>
                                      <td className="py-2 px-3 font-bold text-cc-navy whitespace-nowrap">
                                        {app.fullNameTh}
                                      </td>
                                      <td className="py-2 px-3 whitespace-nowrap">
                                        <div className="font-mono font-bold text-cc-navy">{app.studentId}</div>
                                        <div className="text-[10px] text-gray-500">{app.major}</div>
                                      </td>
                                      <td className="py-2 px-3 text-[11px] max-w-[120px] truncate" title={app.fallbackDeptChoice}>
                                        {app.fallbackDeptChoice || "ตามที่จัดสรร"}
                                      </td>
                                      <td className="py-2 px-3 whitespace-nowrap">
                                        {assignedToThis ? (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px]">
                                            <Check className="w-3 h-3" />
                                            <span>ได้ฝ่ายนี้แล้ว (สตาฟตัวจริง)</span>
                                          </span>
                                        ) : assignedOtherDept ? (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold text-[10px]">
                                            <span>ย้ายไป:</span>
                                            <strong className="text-emerald-800">{otherDeptObj?.nameTh || app.assignedDeptId}</strong>
                                          </span>
                                        ) : isAppRejected(app) ? (
                                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold text-[10px]">
                                            ไม่ผ่านการคัดเลือก
                                          </span>
                                        ) : (
                                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 font-bold text-[10px]">
                                            รอดำเนินการ
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-2 px-3 text-center whitespace-nowrap">
                                        <button
                                          onClick={() => handleOpenEdit(app)}
                                          className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-cc-navy hover:text-white text-gray-700 text-xs font-bold transition-all flex items-center gap-1 mx-auto cursor-pointer border border-gray-300"
                                        >
                                          <Edit className="w-3 h-3 text-cc-yellow" />
                                          <span>จัดสรร</span>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: ALL APPLICANTS TABLE VIEW                                         */}
      {/* ========================================================================= */}
      {viewMode === "table" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter and Search Bar */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white border-3 border-cc-navy shadow-solid space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อ, รหัสนักศึกษา, เบอร์โทร, รหัสใบสมัคร..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-cc-navy bg-cc-cream/40 text-xs sm:text-sm font-medium focus:bg-white focus:border-cc-blue outline-none transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Status Filter */}
                <div className="flex items-center gap-2 flex-1 md:flex-initial">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border-2 border-cc-navy bg-white text-xs font-bold text-cc-navy outline-none cursor-pointer"
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="SUBMITTED">รอดำเนินการ</option>
                    <option value="INTERVIEW">🎙️ มีสิทธิ์สัมภาษณ์</option>
                    <option value="ACCEPTED">🎉 ผ่านการคัดเลือก</option>
                    <option value="REJECTED">❌ ไม่ผ่านการคัดเลือก</option>
                  </select>
                </div>

                {/* Department Filter */}
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border-2 border-cc-navy bg-white text-xs font-bold text-cc-navy outline-none flex-1 md:flex-initial cursor-pointer"
                >
                  <option value="all">ทุกฝ่าย (13 ฝ่าย)</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameTh}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b-2 border-cc-navy/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg text-cc-navy">
                  รายชื่อผู้สมัครพี่ค่าย ({filteredApps.length} ท่าน)
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                ฐานข้อมูล Neon Serverless Postgres
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-cc-cream border-2 border-cc-navy flex items-center justify-center mx-auto text-gray-400">
                  <Users className="w-7 h-7" />
                </div>
                <h4 className="font-display font-black text-lg text-cc-navy">ยังไม่มีข้อมูลผู้สมัครในระบบ</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  เมื่อมีนักศึกษากรอกข้อมูลผ่านหน้าแบบฟอร์มรับสมัคร รายชื่อจะปรากฏในแดชบอร์ดนี้โดยอัตโนมัติ
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cc-cream/60 text-cc-navy font-mono font-bold uppercase border-b-2 border-cc-navy/15">
                    <tr>
                      <th className="py-3.5 px-4">รหัส / วันที่</th>
                      <th className="py-3.5 px-4">ชื่อ - นามสกุล</th>
                      <th className="py-3.5 px-4">รหัส / สาขา</th>
                      <th className="py-3.5 px-4">อันดับที่เลือก (1 & 2)</th>
                      <th className="py-3.5 px-4">ถ้าไม่ติด 1-2</th>
                      <th className="py-3.5 px-4">ผลการจัดสรรฝ่ายจริง</th>
                      <th className="py-3.5 px-4">สถานะ</th>
                      <th className="py-3.5 px-4 text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {filteredApps.map((app) => {
                      const firstDept = DEPARTMENTS.find((d) => d.id === app.firstChoiceDeptId);
                      const secondDept = DEPARTMENTS.find((d) => d.id === app.secondChoiceDeptId);
                      const assignedDept = DEPARTMENTS.find((d) => d.id === app.assignedDeptId);

                      const isAccepted = isAppAccepted(app);
                      const isRejected = isAppRejected(app);
                      const isInterview = isAppInterview(app);

                      // Check if moved to different department
                      const finalDeptObj = assignedDept || (isAccepted ? firstDept : null);
                      const isMoved = isAccepted && finalDeptObj && finalDeptObj.id !== app.firstChoiceDeptId;

                      return (
                        <tr key={app.id} className="hover:bg-cc-cream/20 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-cc-navy whitespace-nowrap">
                            <div>{app.id}</div>
                            <div className="text-[10px] text-gray-400 font-normal">
                              {app.createdAt ? new Date(app.createdAt).toLocaleDateString("th-TH") : "-"}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-cc-navy">
                            <div>
                              {app.fullNameTh} {app.nicknameTh && <span className="text-gray-500 font-normal">({app.nicknameTh})</span>}
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono font-normal">
                              โทร: {app.phone}
                            </div>
                            {app.facebookName && (
                              <div className="text-[11px] text-blue-600 font-normal truncate max-w-[150px]">
                                {app.facebookUrl ? (
                                  <a href={app.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    FB: {app.facebookName}
                                  </a>
                                ) : (
                                  <span>FB: {app.facebookName}</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-mono text-cc-navy font-bold">
                              {app.studentId} • <span className="text-gray-600 font-sans">{app.year || "ปี 1"}</span>
                            </div>
                            <div className="text-[10px] text-gray-500 font-bold">{app.faculty || "คณะศึกษาศาสตร์"}</div>
                            <div className="text-[11px] text-gray-700">{app.major}</div>
                            {app.diet && app.diet !== "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)" && (
                              <div className="mt-1">
                                <span className="inline-block px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200" title={app.diet}>
                                  🍽️ {app.diet}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-[11px] text-gray-700 font-bold">
                              1: {firstDept?.nameTh || app.firstChoiceDeptId}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              2: {secondDept?.nameTh || app.secondChoiceDeptId}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-cc-cream text-cc-navy border border-cc-navy/20 font-bold block truncate max-w-[140px]" title={app.fallbackDeptChoice}>
                              {app.fallbackDeptChoice || "ตามที่จัดสรร"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isAccepted && finalDeptObj ? (
                              <div>
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px] inline-flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>{finalDeptObj.nameTh}</span>
                                </span>
                                {isMoved && (
                                  <div className="text-[10px] text-amber-700 mt-0.5 font-bold">
                                    (จัดสรรใหม่จากอันดับ 1)
                                  </div>
                                )}
                              </div>
                            ) : isInterview ? (
                              <span className="text-purple-700 font-bold text-[11px]">รอผลสัมภาษณ์</span>
                            ) : (
                              <span className="text-gray-400 text-[11px]">-</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                isAccepted
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  : isInterview
                                  ? "bg-purple-100 text-purple-800 border-purple-300 font-black"
                                  : isRejected
                                  ? "bg-rose-100 text-rose-800 border-rose-300"
                                  : "bg-blue-100 text-blue-800 border-blue-300"
                              }`}
                            >
                              {isAccepted
                                ? "ผ่านการคัดเลือก"
                                : isInterview
                                ? "🎙️ มีสิทธิ์สัมภาษณ์"
                                : isRejected
                                ? "ไม่ผ่านการคัดเลือก"
                                : "รอดำเนินการ"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEdit(app)}
                              className="px-3 py-1.5 rounded-lg bg-cc-navy text-white hover:bg-cc-blue text-xs font-bold transition-all shadow-sm flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5 text-cc-yellow" />
                              <span>แก้ไข/จัดสรร</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Edit / Evaluation Modal (3 Statuses Only) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-3 border-cc-navy shadow-solid-lg relative space-y-6 my-auto max-h-[90dvh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-cc-navy flex items-center justify-center text-cc-navy font-bold transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cc-yellow text-cc-navy text-[10px] font-mono font-bold uppercase mb-1">
                EDIT APPLICANT DATA & EVALUATION
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-cc-navy">
                แก้ไขข้อมูล & จัดสรรฝ่ายผู้สมัคร
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                ID: {editFormData.id}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* 1. Personal Info Edit Grid */}
              <div className="p-4 rounded-2xl bg-gray-50 border-2 border-cc-navy/15 space-y-3">
                <span className="font-bold text-cc-navy block text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cc-blue" />
                  <span>1. ข้อมูลส่วนตัวและการติดต่อ</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">ชื่อ - นามสกุล:</label>
                    <input
                      type="text"
                      value={editFormData.fullNameTh}
                      onChange={(e) => setEditFormData({ ...editFormData, fullNameTh: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium outline-none focus:border-cc-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">ชื่อเล่น:</label>
                    <input
                      type="text"
                      placeholder="เช่น ปอนด์, ติน"
                      value={editFormData.nicknameTh}
                      onChange={(e) => setEditFormData({ ...editFormData, nicknameTh: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium outline-none focus:border-cc-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">รหัสนักศึกษา (10 หลัก):</label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="663050123-4"
                      value={editFormData.studentId}
                      onChange={(e) => {
                        const val = e.target.value;
                        const prev = editFormData.studentId;
                        if (prev.endsWith("-") && !val.endsWith("-") && val.length === 9) {
                          setEditFormData({ ...editFormData, studentId: val.slice(0, 8) });
                          return;
                        }
                        const digits = val.replace(/\D/g, "").slice(0, 10);
                        let formatted = digits;
                        if (digits.length === 9) formatted = `${digits}-`;
                        else if (digits.length === 10) formatted = `${digits.slice(0, 9)}-${digits.slice(9, 10)}`;
                        setEditFormData({ ...editFormData, studentId: formatted });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-mono font-bold outline-none focus:border-cc-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">ชั้นปี (1-3):</label>
                    <input
                      type="text"
                      placeholder="ชั้นปีที่ 1"
                      value={editFormData.year}
                      onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium outline-none focus:border-cc-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">คณะที่สังกัด:</label>
                    <input
                      type="text"
                      placeholder="เช่น คณะศึกษาศาสตร์, คณะวิทยาศาสตร์"
                      value={editFormData.faculty || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, faculty: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium outline-none focus:border-cc-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">สาขาวิชา:</label>
                    <input
                      type="text"
                      value={editFormData.major}
                      onChange={(e) => setEditFormData({ ...editFormData, major: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium outline-none focus:border-cc-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">เบอร์โทรศัพท์ (10 หลัก):</label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="0812345678"
                      value={editFormData.phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setEditFormData({ ...editFormData, phone: digits });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-mono outline-none focus:border-cc-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">ชื่อ Facebook:</label>
                    <input
                      type="text"
                      placeholder="เช่น Somchai Jaidee"
                      value={editFormData.facebookName}
                      onChange={(e) => setEditFormData({ ...editFormData, facebookName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium outline-none focus:border-cc-blue"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-gray-700">Link Facebook:</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={editFormData.facebookUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-mono outline-none focus:border-cc-blue"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-gray-700">อาหารที่แพ้ / ข้อจำกัดด้านอาหาร:</label>
                    <input
                      type="text"
                      placeholder="เช่น ทานได้ทุกอย่าง, แพ้อาหารทะเล, ฮาลาล ฯลฯ"
                      value={editFormData.diet || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, diet: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium outline-none focus:border-cc-blue"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Section 2 Answers: Attitude & Reasons */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border-2 border-purple-200 space-y-3">
                <span className="font-bold text-cc-navy block text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>2. คำถามแสดงทัศนคติและความตั้งใจ</span>
                </span>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-purple-950">เหตุผลที่สนใจสมัครเป็นพี่ค่าย Comclick 20:</label>
                    <textarea
                      rows={2}
                      value={editFormData.reasonToApply}
                      onChange={(e) => setEditFormData({ ...editFormData, reasonToApply: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white font-medium outline-none focus:border-purple-500 text-gray-800"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-emerald-900">ข้อดีของตนเอง:</label>
                      <textarea
                        rows={2}
                        value={editFormData.strengths}
                        onChange={(e) => setEditFormData({ ...editFormData, strengths: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white font-medium outline-none focus:border-emerald-500 text-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-amber-900">ข้อเสียของตนเอง:</label>
                      <textarea
                        rows={2}
                        value={editFormData.weaknesses}
                        onChange={(e) => setEditFormData({ ...editFormData, weaknesses: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white font-medium outline-none focus:border-amber-500 text-gray-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Department Preferences & Special Questions */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border-2 border-cc-blue/40 space-y-3">
                <span className="font-bold text-cc-navy block text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cc-coral" />
                  <span>3. ฝ่ายที่เลือกสมัคร & คำถามพิเศษ</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">ฝ่ายอันดับที่ 1 (หลัก):</label>
                    <select
                      value={editFormData.firstChoiceDeptId}
                      onChange={(e) => setEditFormData({ ...editFormData, firstChoiceDeptId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-bold text-cc-navy outline-none"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d.id} value={d.id}>{d.nameTh}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">ฝ่ายอันดับที่ 2 (สำรอง):</label>
                    <select
                      value={editFormData.secondChoiceDeptId}
                      onChange={(e) => setEditFormData({ ...editFormData, secondChoiceDeptId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-bold text-cc-navy outline-none"
                    >
                      <option value="-">- (ไม่เลือก / ไม่ประสงค์ลงฝ่ายอื่น)</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d.id} value={d.id}>{d.nameTh}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-gray-700">ถ้าไม่ติดอันดับ 1 และ 2 อยากลงฝ่ายไหน:</label>
                    <input
                      type="text"
                      value={editFormData.fallbackDeptChoice}
                      onChange={(e) => setEditFormData({ ...editFormData, fallbackDeptChoice: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium outline-none focus:border-cc-blue"
                    />
                  </div>

                  {/* Tech PR Portfolio Link */}
                  {(editFormData.firstChoiceDeptId === "tech-pr" || editFormData.secondChoiceDeptId === "tech-pr" || editFormData.techPortfolioUrl) && (
                    <div className="sm:col-span-2 space-y-1 pt-1 border-t border-indigo-200">
                      <label className="font-bold text-indigo-950">ลิงก์ Portfolio / ผลงาน (ฝ่ายเทคโนฯ):</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editFormData.techPortfolioUrl}
                        onChange={(e) => setEditFormData({ ...editFormData, techPortfolioUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-indigo-300 bg-white font-mono outline-none focus:border-indigo-600"
                      />
                    </div>
                  )}

                  {/* Fast Response Car details */}
                  {(editFormData.firstChoiceDeptId === "fast-response" || editFormData.secondChoiceDeptId === "fast-response" || editFormData.hasCar) && (
                    <div className="sm:col-span-2 grid grid-cols-2 gap-3 pt-1 border-t border-amber-200">
                      <div className="space-y-1">
                        <label className="font-bold text-amber-950">มีรถยนต์หรือไม่ (ฝ่ายรถเร็ว):</label>
                        <select
                          value={editFormData.hasCar}
                          onChange={(e) => setEditFormData({ ...editFormData, hasCar: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-bold outline-none"
                        >
                          <option value="">-- ระบุ --</option>
                          <option value="ใช่">ใช่ (มีรถยนต์)</option>
                          <option value="ไม่">ไม่ (ไม่มีรถยนต์)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-amber-950">ประเภทรถยนต์:</label>
                        <input
                          type="text"
                          placeholder="รถเก๋ง, รถกระบะ, อื่นๆ"
                          value={editFormData.carType}
                          onChange={(e) => setEditFormData({ ...editFormData, carType: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Committee Decision & Evaluation */}
              <div className="p-4 rounded-2xl bg-cc-yellow/30 border-2 border-cc-navy space-y-3">
                <span className="font-bold text-cc-navy block text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-cc-navy" />
                  <span>4. การตัดสินของคณะกรรมการ & จัดสรรฝ่าย</span>
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-cc-navy">สถานะผู้สมัคร (Status):</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as ApplicationStatus;
                        setEditFormData({
                          ...editFormData,
                          status: newStatus,
                          assignedDeptId:
                            newStatus === "ACCEPTED"
                              ? (editFormData.assignedDeptId || editFormData.firstChoiceDeptId || "")
                              : "",
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border-2 border-cc-navy bg-white font-bold text-cc-navy outline-none cursor-pointer"
                    >
                      <option value="SUBMITTED">รอดำเนินการ (พิจารณาเอกสาร)</option>
                      <option value="INTERVIEW_ELIGIBLE">🎙️ มีสิทธิ์เข้าสัมภาษณ์</option>
                      <option value="ACCEPTED">🎉 ผ่านการคัดเลือกเป็นพี่ค่าย</option>
                      <option value="REJECTED">❌ ไม่ผ่านการคัดเลือก</option>
                    </select>
                  </div>

                  {/* If ACCEPTED: Show Assigned Department selection */}
                  {editFormData.status === "ACCEPTED" ? (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="font-bold text-emerald-950 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ฝ่ายที่จัดสรรให้จริง (สตาฟตัวจริง):</span>
                      </label>
                      <select
                        value={editFormData.assignedDeptId || editFormData.firstChoiceDeptId}
                        onChange={(e) => setEditFormData({ ...editFormData, assignedDeptId: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border-2 border-emerald-600 bg-emerald-50 font-bold text-emerald-900 outline-none cursor-pointer"
                      >
                        <option value="">-- จัดสรรตามอันดับ 1 ({DEPARTMENTS.find(d => d.id === editFormData.firstChoiceDeptId)?.nameTh}) --</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d.id} value={d.id}>{d.nameTh}</option>
                        ))}
                      </select>
                    </div>
                  ) : editFormData.status === "INTERVIEW_ELIGIBLE" ? (
                    /* If INTERVIEW_ELIGIBLE: Notice that department is NOT assigned yet */
                    <div className="space-y-1 p-3 rounded-xl bg-purple-100/80 border border-purple-300 text-purple-950 text-xs flex flex-col justify-center animate-fadeIn">
                      <span className="font-bold flex items-center gap-1 text-purple-900">
                        🎙️ มีสิทธิ์เข้าสัมภาษณ์ (ยังไม่ต้องจัดสรรฝ่าย)
                      </span>
                      <span className="text-[11px] text-purple-800">
                        ผู้สมัครจะอยู่ในสถานะมีสิทธิ์สัมภาษณ์ โดยน้องๆ จะได้เลือกวันเวลาสัมภาษณ์จากตารางนัดหมายในภายหลัง และจะจัดสรรฝ่ายเมื่อสัมภาษณ์ผ่านแล้ว
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1 p-2.5 rounded-xl bg-gray-100 border border-gray-300 text-gray-600 text-xs flex flex-col justify-center">
                      <span className="font-bold">สถานะ: {editFormData.status === "REJECTED" ? "ไม่ผ่านการคัดเลือก" : "รอดำเนินการ"}</span>
                      <span className="text-[11px]">ไม่มีการจัดสรรฝ่าย</span>
                    </div>
                  )}

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-gray-700">บันทึกหมายเหตุเพิ่มเติม (ถ้ามี):</label>
                    <textarea
                      rows={2}
                      placeholder="บันทึกผลการประเมินหรือข้อเสนอแนะ..."
                      value={editFormData.statusNotes}
                      onChange={(e) => setEditFormData({ ...editFormData, statusNotes: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => handleDeleteApplicant(editFormData.id, editFormData.fullNameTh)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบผู้สมัครนี้</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-cc-navy hover:bg-cc-blue text-white font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <span>กำลังบันทึก...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-cc-yellow" />
                      <span>บันทึกการแก้ไข</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
