"use client";

import React from "react";
import { CAMP_INFO } from "@/lib/constants";
import {
  Heart,
  Mail,
  Phone,
  ArrowUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white text-cc-navy border-t-2 border-cc-navy/15 py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Compact Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-cc-navy/10">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cc-cream p-1.5 flex items-center justify-center border-2 border-cc-navy shadow-solid-sm flex-shrink-0">
              <img
                src="/img/logo.webp"
                alt="ComClick 20 Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg text-cc-navy tracking-tight">
                  COMCLICK <span className="text-cc-coral">20</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cc-cream text-cc-navy rounded border border-cc-navy/20">
                  Staff 2026
                </span>
              </div>
              <p className="text-xs text-gray-500 font-normal">
                {CAMP_INFO.organizerTh}
              </p>
            </div>
          </div>

          {/* Compact Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold">
            <a
              href="/#about"
              className="px-3 py-1.5 rounded-lg hover:bg-cc-cream text-gray-600 hover:text-cc-navy transition-colors"
            >
              เกี่ยวกับค่าย
            </a>
            <a
              href="/departments"
              className="px-3 py-1.5 rounded-lg hover:bg-cc-cream text-gray-600 hover:text-cc-navy transition-colors"
            >
              11 ฝ่ายที่เปิดรับ
            </a>
            <a
              href="/#schedule"
              className="px-3 py-1.5 rounded-lg hover:bg-cc-cream text-gray-600 hover:text-cc-navy transition-colors"
            >
              กำหนดการ
            </a>
            <a
              href="/status"
              className="px-3 py-1.5 rounded-lg hover:bg-cc-cream text-gray-600 hover:text-cc-navy transition-colors"
            >
              ตรวจสถานะ
            </a>
            <a
              href="/apply"
              className="px-4 py-1.5 rounded-xl bg-cc-coral hover:bg-cc-coral-dark text-white font-bold transition-all shadow-sm"
            >
              สมัครเป็นพี่ค่าย
            </a>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span>© 2026 ComClick Camp #20.</span>
            <span className="hidden md:inline">• {CAMP_INFO.organizerTh}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={CAMP_INFO.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-cc-blue hover:text-cc-coral font-bold inline-flex items-center gap-1 transition-colors"
            >
              <span>Facebook Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-cc-navy hover:text-cc-coral font-bold transition-colors"
            >
              <span>ด้านบน</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
