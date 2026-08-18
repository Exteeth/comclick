"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  FileCheck2,
  Users,
  Calendar,
  Layers,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Send,
  ArrowUpRight,
  Camera,
  Crown,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/#about", label: "เกี่ยวกับ", icon: Layers },
    { href: "/#committee", label: "กรรมการ", icon: Crown },
    { href: "/departments", label: "11 ฝ่าย", icon: Users },
    { href: "/#gallery", label: "ภาพค่าย", icon: Camera },
    { href: "/#schedule", label: "กำหนดการ", icon: Calendar },
    { href: "/#faq", label: "FAQ", icon: HelpCircle },
    { href: "/status", label: "สถานะ", icon: FileCheck2 },
  ];

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-2.5 sm:px-6 pointer-events-none w-full max-w-full">
      <nav className="max-w-5xl mx-auto rounded-2xl bg-white/95 backdrop-blur-md border-2 border-cc-navy shadow-solid-sm sm:shadow-solid text-cc-navy px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between pointer-events-auto w-full">
        {/* Brand / Logo */}
        <a href="/" className="flex items-center gap-2 group min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cc-cream p-1 flex items-center justify-center border-2 border-cc-navy shadow-solid-sm group-hover:scale-105 transition-transform flex-shrink-0">
            <img
              src="/img/logo.webp"
              alt="ComClick 20 Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) parent.innerText = "C20";
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-cc-navy font-display font-black text-sm sm:text-base tracking-tight leading-none group-hover:text-cc-coral transition-colors truncate">
                COMCLICK <span className="text-cc-coral">20</span>
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase bg-cc-yellow text-cc-navy border border-cc-navy rounded">
                Staff
              </span>
            </div>
            <small className="text-gray-500 text-[10px] truncate font-normal hidden lg:block">
              จับมือน้องคลิก ครั้งที่ 20
            </small>
          </div>
        </a>

        {/* Desktop Navigation Links (Light Theme) */}
        <div className="hidden md:flex items-center gap-1 bg-cc-cream rounded-xl p-1 border border-cc-navy/15">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-cc-navy text-white shadow-sm"
                    : "text-cc-navy/80 hover:text-cc-navy hover:bg-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cc-yellow" : "text-cc-blue"}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href="/admin"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-cc-navy hover:text-cc-coral bg-cc-cream hover:bg-white border border-cc-navy/20 rounded-xl transition-all"
            title="สำหรับคณะกรรมการ"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cc-coral" />
            <span>Admin</span>
          </a>

          <a
            href="/apply"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cc-coral hover:bg-cc-coral-dark text-white font-display font-bold text-xs sm:text-sm border-2 border-cc-navy shadow-solid-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <span>สมัคร</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-1.5 flex-shrink-0">
          <a
            href="/apply"
            className="px-2.5 py-1 text-[11px] font-bold text-white bg-cc-coral rounded-lg border border-cc-navy shadow-2xs"
          >
            สมัคร
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-cc-navy hover:bg-cc-cream rounded-lg border border-cc-navy/20 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu (Light Theme) */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-5xl mx-auto mt-2 bg-white border-2 border-cc-navy rounded-2xl p-4 space-y-1.5 pointer-events-auto shadow-solid text-cc-navy animate-fadeIn">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-cc-navy hover:bg-cc-cream transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-cc-coral" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </a>
            );
          })}

          <div className="pt-2.5 border-t border-cc-navy/15 flex flex-col gap-2">
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-cc-navy bg-cc-cream rounded-xl border border-cc-navy/20"
            >
              <ShieldCheck className="w-4 h-4 text-cc-coral" />
              <span>Admin Portal</span>
            </a>

            <a
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-cc-coral rounded-xl border-2 border-cc-navy shadow-solid-sm"
            >
              <Send className="w-4 h-4" />
              <span>กรอกใบสมัครพี่ค่าย Comclick 20</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
