"use client";

import React from "react";
import {
  Camera,
  Move,
  Sparkles,
} from "lucide-react";
import DomeGallery, { DomeGalleryItem } from "./ui/DomeGallery";

const CAMP_GALLERY_IMAGES: DomeGalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    alt: "AI & Coding Hands-on Lab",
  },
  {
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
    alt: "กิจกรรมสันทนาการสุดมันส์",
  },
  {
    src: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop",
    alt: "Comclick Night & บายศรีสู่ขวัญ",
  },
  {
    src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
    alt: "Micro:bit & Robotics Workshop",
  },
  {
    src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    alt: "Mini Hackathon & Project Pitching",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    alt: "ความผูกพันของทีมงานพี่ค่าย",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    alt: "Team Collaboration & Brainstorming",
  },
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    alt: "บรรยากาศการมอบรางวัลและปิดค่าย",
  },
];

export default function CampGallery() {
  return (
    <section id="gallery" className="py-24 bg-cc-cream border-t-2 border-cc-navy relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cc-coral text-white text-xs font-mono font-bold uppercase tracking-wider border-2 border-cc-navy shadow-solid-sm">
            <Camera className="w-3.5 h-3.5" />
            <span>CAMP 3D DOME GALLERY</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-cc-navy tracking-tight">
            ภาพบรรยากาศและความทรงจำ <span className="text-cc-blue">ComClick</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-normal">
            สำรวจบรรยากาศค่ายแบบ 3 มิติ — ลากเพื่อหมุนดูรอบทิศทาง 360° และคลิกที่รูปเพื่อเปิดดูแบบเต็มจอ
          </p>
        </div>

        {/* 3D Dome Gallery Container */}
        <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[700px] rounded-3xl overflow-hidden border-3 border-cc-navy shadow-solid-lg bg-cc-navy">
          {/* Interaction Instruction Overlay Tag */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur text-cc-navy text-xs font-mono font-bold border-2 border-cc-navy shadow-solid-sm pointer-events-none">
            <Move className="w-3.5 h-3.5 text-cc-coral animate-pulse" />
            <span>DRAG TO ROTATE 360° • CLICK TO ENLARGE</span>
          </div>

          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cc-yellow text-cc-navy text-[11px] font-mono font-black border-2 border-cc-navy shadow-solid-sm pointer-events-none">
            <Sparkles className="w-3 h-3 text-cc-navy" />
            <span>3D DOME VIEW</span>
          </div>

          {/* Render DomeGallery */}
          <DomeGallery
            images={CAMP_GALLERY_IMAGES}
            fit={0.7}
            minRadius={480}
            maxVerticalRotationDeg={19}
            dragDampening={3.6}
            dragSensitivity={22}
            grayscale={false}
            overlayBlurColor="#132338"
            imageBorderRadius="20px"
            openedImageBorderRadius="24px"
            openedImageWidth="min(88vw, 560px)"
            openedImageHeight="min(78vh, 420px)"
          />
        </div>
      </div>
    </section>
  );
}
