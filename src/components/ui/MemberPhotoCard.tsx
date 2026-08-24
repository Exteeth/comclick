"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface MemberPhotoCardProps {
  photoUrl: string;
  nameTh: string;
  className?: string;
}

export default function MemberPhotoCard({
  photoUrl,
  nameTh,
  className = "",
}: MemberPhotoCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on ESC key and prevent body scroll when popup is open
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const modalContent = open ? (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setOpen(false)}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl sm:rounded-3xl border-3 border-cc-navy shadow-solid-lg overflow-hidden p-3.5 sm:p-4 flex flex-col items-center animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button at top-right */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-cc-yellow text-cc-navy flex items-center justify-center border border-cc-navy/30 transition-colors cursor-pointer shadow-sm"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Original Full Photo (No Crop, 4:5 ratio) */}
        <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-cc-navy/15 bg-cc-cream/40 flex items-center justify-center">
          <img
            src={photoUrl}
            alt={nameTh}
            className="w-full h-full object-contain select-none"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Thumbnail Card — Original 4:5 Poster Aspect Ratio */}
      <button
        onClick={() => setOpen(true)}
        className={`group relative w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-cc-navy/30 bg-white shadow-solid-sm hover:shadow-solid hover:border-cc-navy transition-all duration-300 hover:-translate-y-1 cursor-pointer ${className}`}
        aria-label={`เปิดดูรูป ${nameTh}`}
      >
        <img
          src={photoUrl}
          alt={nameTh}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </button>

      {/* Render Modal into document.body using Portal (so it pops up over the full window) */}
      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
