"use client";

import React, { useState, useEffect } from "react";
import {
  getApplications,
  updateApplicationStatus,
  updateApplicationInterview,
  resetToInitialData,
} from "@/lib/storage";
import { Application, ApplicationStatus } from "@/lib/types";
import { DEPARTMENTS, INITIAL_APPLICANTS } from "@/lib/constants";
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  XCircle,
  FileSpreadsheet,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Edit,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Award,
  X,
  Phone,
  Mail,
  Layers,
} from "lucide-react";

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("SUBMITTED");
  const [interviewDateInput, setInterviewDateInput] = useState("");
  const [interviewLocationInput, setInterviewLocationInput] = useState("");

  const refreshData = () => {
    const apps = getApplications();
    setApplications(apps);
  };

  useEffect(() => {
    refreshData();
    window.addEventListener("comclick_storage_updated", refreshData);
    return () => window.removeEventListener("comclick_storage_updated", refreshData);
  }, []);

  // Filtered list
  const filteredApps = applications.filter((app) => {
    const matchSearch =
      app.fullNameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentId.includes(searchQuery) ||
      app.phone.includes(searchQuery) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "all" || app.status === statusFilter;
    const matchDept =
      deptFilter === "all" ||
      app.firstChoiceDeptId === deptFilter ||
      app.secondChoiceDeptId === deptFilter;

    return matchSearch && matchStatus && matchDept;
  });

  // Open Edit Modal
  const handleOpenEdit = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setInterviewDateInput(app.interviewDate || "5 ต.ค. 2569 เวลา 10:00 น.");
    setInterviewLocationInput(
      app.interviewLocation || "ห้อง 2105 อาคาร ED2 คณะศึกษาศาสตร์ มข."
    );
    setIsEditModalOpen(true);
  };

  // Save changes
  const handleSaveEvaluation = () => {
    if (!selectedApp) return;

    updateApplicationStatus(selectedApp.id, newStatus);
    if (newStatus === "INTERVIEW_SCHEDULED" || newStatus === "DOCUMENT_PASSED") {
      updateApplicationInterview(selectedApp.id, interviewDateInput, interviewLocationInput);
    }

    setIsEditModalOpen(false);
    refreshData();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "รหัสใบสมัคร",
      "คำนำหน้า",
      "ชื่อ-นามสกุล",
      "ชื่อเล่น",
      "รหัสนักศึกษา",
      "คณะ",
      "สาขา",
      "ชั้นปี",
      "เบอร์โทร",
      "Line ID",
      "ฝ่ายอันดับ 1",
      "ฝ่ายอันดับ 2",
      "ไซส์เสื้อ",
      "อาหาร",
      "สถานะ",
      "วันที่สัมภาษณ์",
    ];

    const rows = filteredApps.map((a) => [
      a.id,
      a.titleTh,
      a.fullNameTh,
      a.nicknameTh,
      a.studentId,
      a.faculty,
      a.major,
      a.year,
      a.phone,
      a.lineId,
      a.firstChoiceDeptId,
      a.secondChoiceDeptId,
      a.shirtSize,
      a.diet,
      a.status,
      a.interviewDate || "-",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `comclick20_applicants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const totalCount = applications.length;
  const passedDocsCount = applications.filter(
    (a) => a.status === "DOCUMENT_PASSED" || a.status === "INTERVIEW_SCHEDULED"
  ).length;
  const acceptedCount = applications.filter(
    (a) => a.status === "ACCEPTED" || a.status === "CONFIRMED"
  ).length;
  const pendingCount = applications.filter((a) => a.status === "SUBMITTED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner with Solid Styling */}
      <div className="bg-cc-navy text-white rounded-3xl border-3 border-cc-navy shadow-solid-lg p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cc-yellow text-cc-navy text-xs font-mono font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PORTAL FOR EVALUATION COMMITTEE</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            ระบบบริหารจัดการและคัดเลือกพี่ค่าย Comclick 20
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-1 font-light">
            ตรวจสอบรายชื่อผู้สมัคร ประเมินใบสมัคร นัดหมายสัมภาษณ์ และส่งออกข้อมูลสรุป
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-xl bg-cc-coral hover:bg-cc-coral-dark text-white font-bold text-xs sm:text-sm border-2 border-white/20 shadow-solid-sm transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ส่งออก Excel/CSV</span>
          </button>

          <button
            onClick={() => {
              if (confirm("คุณต้องการรีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้นหรือไม่?")) {
                resetToInitialData();
                refreshData();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-1.5"
            title="รีเซ็ตข้อมูลตัวอย่างเพื่อการทดสอบ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ต Demo Data</span>
          </button>
        </div>
      </div>

      {/* 4 Solid Stat Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-cc-blue text-white border-3 border-cc-navy shadow-solid">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase">ผู้สมัครทั้งหมด</span>
            <Users className="w-5 h-5 text-cc-yellow" />
          </div>
          <div className="font-display font-black text-4xl mt-3">{totalCount}</div>
          <div className="text-[11px] opacity-80 mt-1 font-medium">รวมทุกฝ่ายที่เปิดรับ</div>
        </div>

        <div className="p-5 rounded-3xl bg-cc-coral text-white border-3 border-cc-navy shadow-solid">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase">รอการตรวจทาน</span>
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="font-display font-black text-4xl mt-3">{pendingCount}</div>
          <div className="text-[11px] opacity-80 mt-1 font-medium">ต้องพิจารณาคำตอบ</div>
        </div>

        <div className="p-5 rounded-3xl bg-cc-yellow text-cc-navy border-3 border-cc-navy shadow-solid">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase">ผ่านรอบเอกสาร / นัดสัมภาษณ์</span>
            <Calendar className="w-5 h-5 text-cc-navy" />
          </div>
          <div className="font-display font-black text-4xl mt-3">{passedDocsCount}</div>
          <div className="text-[11px] opacity-80 mt-1 font-medium">พร้อมนัดหมายสัมภาษณ์</div>
        </div>

        <div className="p-5 rounded-3xl bg-white text-emerald-800 border-3 border-cc-navy shadow-solid">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-gray-600">ผ่านการคัดเลือกตัวจริง</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="font-display font-black text-4xl text-emerald-600 mt-3">{acceptedCount}</div>
          <div className="text-[11px] text-gray-500 mt-1 font-medium">เป้าหมายรวม 100+ คน</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, รหัสนักศึกษา, เบอร์โทร, รหัสใบสมัคร..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-cc-navy/20 focus:border-cc-navy text-xs sm:text-sm font-medium outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/20 focus:border-cc-navy text-xs sm:text-sm font-bold text-cc-navy outline-none bg-gray-50"
            >
              <option value="all">สถานะทั้งหมด (ทุกสถานะ)</option>
              <option value="SUBMITTED">ส่งใบสมัครแล้ว (SUBMITTED)</option>
              <option value="DOCUMENT_PASSED">ผ่านรอบเอกสาร (DOCUMENT_PASSED)</option>
              <option value="INTERVIEW_SCHEDULED">นัดสัมภาษณ์ (INTERVIEW_SCHEDULED)</option>
              <option value="ACCEPTED">ผ่านการคัดเลือก (ACCEPTED)</option>
              <option value="CONFIRMED">ยืนยันสิทธิ์แล้ว (CONFIRMED)</option>
              <option value="REJECTED">ไม่ผ่านการคัดเลือก (REJECTED)</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="md:col-span-3">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy/20 focus:border-cc-navy text-xs sm:text-sm font-bold text-cc-navy outline-none bg-gray-50"
            >
              <option value="all">ฝ่ายทั้งหมด (8 ฝ่าย)</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameTh}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary */}
        <div className="text-xs text-gray-500 font-medium">
          พบผู้สมัคร <strong className="text-cc-navy font-black">{filteredApps.length}</strong> รายการ จากทั้งหมด {applications.length} รายการ
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border-3 border-cc-navy shadow-solid-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cc-navy text-white font-mono uppercase font-bold text-[11px] border-b-2 border-cc-navy">
              <tr>
                <th className="py-3.5 px-4">รหัส / ผู้สมัคร</th>
                <th className="py-3.5 px-4">คณะ & ชั้นปี</th>
                <th className="py-3.5 px-4">ฝ่ายที่เลือก (อันดับ 1 / 2)</th>
                <th className="py-3.5 px-4">ติดต่อ</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100 font-medium text-gray-700">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    ไม่พบข้อมูลผู้สมัครที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const d1 = DEPARTMENTS.find((d) => d.id === app.firstChoiceDeptId);
                  const d2 = DEPARTMENTS.find((d) => d.id === app.secondChoiceDeptId);

                  return (
                    <tr key={app.id} className="hover:bg-cc-cream-50 transition-colors">
                      {/* Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[10px] font-bold text-cc-blue">{app.id}</div>
                        <div className="font-bold text-cc-navy text-sm">
                          {app.titleTh} {app.fullNameTh} ({app.nicknameTh})
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono">{app.studentId}</div>
                      </td>

                      {/* Faculty */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-cc-navy">{app.faculty}</div>
                        <div className="text-[11px] text-gray-500">{app.major}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold border">
                          {app.year}
                        </span>
                      </td>

                      {/* Departments */}
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="text-xs font-bold text-cc-navy">
                          <span className="text-cc-blue mr-1 font-mono">[1]</span>
                          {d1?.nameTh || app.firstChoiceDeptId}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          <span className="text-cc-coral mr-1 font-mono">[2]</span>
                          {d2?.nameTh || app.secondChoiceDeptId}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-[11px]">
                        <div>{app.phone}</div>
                        <div className="text-gray-500 font-mono">Line: {app.lineId}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border ${
                            app.status === "CONFIRMED"
                              ? "bg-cc-navy text-white border-cc-navy"
                              : app.status === "ACCEPTED"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-400"
                              : app.status === "INTERVIEW_SCHEDULED"
                              ? "bg-amber-100 text-amber-900 border-amber-400"
                              : app.status === "DOCUMENT_PASSED"
                              ? "bg-blue-100 text-blue-800 border-blue-400"
                              : app.status === "REJECTED"
                              ? "bg-gray-100 text-gray-700 border-gray-300"
                              : "bg-cc-cream text-cc-navy border-cc-navy/30"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="px-3 py-1.5 rounded-lg bg-cc-navy hover:bg-cc-blue text-white font-bold text-xs border border-cc-navy shadow-sm transition-all"
                        >
                          ตรวจ & แก้ไข
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit & Evaluation Modal */}
      {isEditModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border-3 border-cc-navy shadow-solid-lg relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-cc-navy flex items-center justify-center text-cc-navy font-bold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-6">
              {/* Modal Header */}
              <div>
                <span className="text-xs font-mono font-bold text-cc-coral block">
                  APPLICATION ID: {selectedApp.id}
                </span>
                <h3 className="font-display font-black text-2xl text-cc-navy mt-1">
                  ประเมินใบสมัคร: {selectedApp.titleTh} {selectedApp.fullNameTh} ({selectedApp.nicknameTh})
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedApp.faculty} • {selectedApp.major} ({selectedApp.year}) | โทร: {selectedApp.phone}
                </p>
              </div>

              {/* Answers Review */}
              <div className="p-4 rounded-2xl bg-cc-cream border-2 border-cc-navy space-y-3 text-xs">
                <div>
                  <strong className="text-cc-navy block">1. เหตุผลที่อยากมาเป็นพี่ค่าย:</strong>
                  <p className="text-gray-700 mt-0.5">{selectedApp.reasonToApply}</p>
                </div>
                <div>
                  <strong className="text-cc-navy block">2. ประสบการณ์ทำงานที่ผ่านมา:</strong>
                  <p className="text-gray-700 mt-0.5">{selectedApp.pastExperience || "ไม่ได้ระบุ"}</p>
                </div>
                <div>
                  <strong className="text-cc-navy block">3. จุดเด่นและทักษะ:</strong>
                  <p className="text-gray-700 mt-0.5">{selectedApp.skillsAndStrengths}</p>
                </div>
                <div>
                  <strong className="text-cc-navy block">4. แนวทางการแก้ปัญหาในทีม:</strong>
                  <p className="text-gray-700 mt-0.5">{selectedApp.problemSolvingScenario}</p>
                </div>
                {selectedApp.portfolioUrl && (
                  <div>
                    <strong className="text-cc-navy block">ลิงก์ผลงาน Portfolio:</strong>
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cc-blue font-bold underline flex items-center gap-1 mt-0.5"
                    >
                      <span>{selectedApp.portfolioUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Evaluation Form */}
              <div className="space-y-4 pt-2 border-t-2 border-cc-navy/10">
                <div>
                  <label className="block text-xs font-bold text-cc-navy mb-1.5">
                    กำหนดสถานะการคัดเลือก (Status) *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-cc-navy bg-white text-xs sm:text-sm font-bold text-cc-navy outline-none"
                  >
                    <option value="SUBMITTED">SUBMITTED (รอการพิจารณา)</option>
                    <option value="DOCUMENT_PASSED">DOCUMENT_PASSED (ผ่านรอบเอกสาร)</option>
                    <option value="INTERVIEW_SCHEDULED">INTERVIEW_SCHEDULED (นัดสัมภาษณ์)</option>
                    <option value="ACCEPTED">ACCEPTED (ผ่านการคัดเลือกตัวจริง)</option>
                    <option value="CONFIRMED">CONFIRMED (ยืนยันสิทธิ์แล้ว)</option>
                    <option value="REJECTED">REJECTED (ไม่ผ่านการคัดเลือก)</option>
                  </select>
                </div>

                {/* Interview Date Inputs if applicable */}
                {(newStatus === "INTERVIEW_SCHEDULED" || newStatus === "DOCUMENT_PASSED") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-950 mb-1">
                        วันและเวลานัดสัมภาษณ์
                      </label>
                      <input
                        type="text"
                        value={interviewDateInput}
                        onChange={(e) => setInterviewDateInput(e.target.value)}
                        placeholder="เช่น 5 ต.ค. 2569 เวลา 10:30 น."
                        className="w-full px-3 py-2 rounded-lg border border-amber-400 text-xs bg-white outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-950 mb-1">
                        สถานที่ / ลิงก์ห้องสัมภาษณ์
                      </label>
                      <input
                        type="text"
                        value={interviewLocationInput}
                        onChange={(e) => setInterviewLocationInput(e.target.value)}
                        placeholder="เช่น ห้อง ED2-2105 หรือ Google Meet"
                        className="w-full px-3 py-2 rounded-lg border border-amber-400 text-xs bg-white outline-none font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t-2 border-cc-navy/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs border border-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveEvaluation}
                  className="px-6 py-2.5 rounded-xl bg-cc-coral hover:bg-cc-coral-dark text-white font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm transition-all"
                >
                  บันทึกผลการประเมิน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
