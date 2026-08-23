"use client";

import React from "react";
import {
  Camera,
  Move,
  Sparkles,
} from "lucide-react";
import DomeGallery, { DomeGalleryItem } from "./ui/DomeGallery";

const CAMP_GALLERY_IMAGES: DomeGalleryItem[] = [
  { src: "/img/gallery/camp-1.webp", alt: "บรรยากาศกิจกรรมค่าย ComClick" },
  { src: "/img/gallery/camp-2.webp", alt: "กิจกรรมนันทนาการและรอยยิ้มพี่น้องค่าย" },
  { src: "/img/gallery/camp-3.webp", alt: "ความร่วมมือในการทำงานเป็นทีม" },
  { src: "/img/gallery/camp-4.webp", alt: "ช่วงเวลาแห่งความสุขในค่าย" },
  { src: "/img/gallery/camp-5.webp", alt: "กิจกรรมเวิร์กช็อปและการเรียนรู้" },
  { src: "/img/gallery/camp-6.webp", alt: "พลังและเสียงหัวเราะของชาวค่าย" },
  { src: "/img/gallery/camp-7.webp", alt: "การรวมพลังทีมสตาฟพี่ค่าย" },
  { src: "/img/gallery/camp-8.webp", alt: "มิตรภาพและการดูแลน้องๆ ค่าย" },
  { src: "/img/gallery/camp-9.webp", alt: "บรรยากาศเวทีและกิจกรรมไฮไลท์" },
  { src: "/img/gallery/camp-10.webp", alt: "ความอบอุ่นและความประทับใจ" },
  { src: "/img/gallery/camp-11.webp", alt: "บรรยากาศฐานกิจกรรม Wild Game" },
  { src: "/img/gallery/camp-12.webp", alt: "ภาพความทรงจำร่วมกัน" },
  { src: "/img/gallery/camp-13.webp", alt: "ทีมงานพี่ค่ายกับการเตรียมความพร้อม" },
  { src: "/img/gallery/camp-14.webp", alt: "ความสนุกสนานในกิจกรรมสันทนาการ" },
  { src: "/img/gallery/camp-15.webp", alt: "การร่วมแรงร่วมใจของพี่น้อง Comclick" },
  { src: "/img/gallery/camp-16.webp", alt: "กิจกรรมกระชับมิตรภาพ" },
  { src: "/img/gallery/camp-17.webp", alt: "รอยยิ้มและความผูกพันของชาวค่าย" },
  { src: "/img/gallery/camp-18.webp", alt: "ช่วงเวลาประทับใจส่งท้ายค่าย" },
  { src: "/img/gallery/camp-19.webp", alt: "ความสำเร็จและพลังบวกจากทุกคน" },
  { src: "/img/gallery/camp-20.webp", alt: "Comclick ความทรงจำที่ไม่สิ้นสุด" },
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
            fit={0.72}
            minRadius={380}
            maxVerticalRotationDeg={19}
            dragDampening={3.6}
            dragSensitivity={22}
            grayscale={false}
            overlayBlurColor="#132338"
            imageBorderRadius="16px"
            openedImageBorderRadius="24px"
            openedImageWidth="min(88vw, 560px)"
            openedImageHeight="min(78vh, 420px)"
          />
        </div>
      </div>
    </section>
  );
}
