"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Code2, Sparkles, Users, GraduationCap } from "lucide-react";
import AnimatedContent from "./ui/AnimatedContent";

export default function ImpressionsGallery() {
  const slides = [
    {
      id: 1,
      title: "กิจกรรมวิชาการแนะแนวสายอาชีพ & คณะใน มข.",
      tag: "CAREER & ACADEMIC",
      desc: "เปิดประตูสู่อนาคต ถ่ายทอดประสบการณ์ตรงจากพี่ๆ นักศึกษา มข. สู่แรงบันดาลใจน้องมัธยม",
      solidBg: "bg-cc-blue text-white",
      tagBg: "bg-cc-navy text-white",
      icon: GraduationCap,
    },
    {
      id: 2,
      title: "นันทนาการสุดมันส์ ฐาน Wild Game",
      tag: "WILD GAME & RECREATION",
      desc: "ระเบิดเสียงหัวเราะ เอนเนอร์จี้ล้นเวที ละลายพฤติกรรม และประลองความสามัคคี",
      solidBg: "bg-cc-yellow text-cc-navy",
      tagBg: "bg-cc-navy text-cc-yellow",
      icon: Sparkles,
    },
    {
      id: 3,
      title: "Comclick Innovation Pitching Workshop",
      tag: "INNOVATION & PITCHING",
      desc: "สร้างสรรค์โครงงานนวัตกรรมดิจิทัล และฝึกทักษะการนำเสนอ Pitching ต่อหน้าคณะกรรมการ",
      solidBg: "bg-cc-coral text-white",
      tagBg: "bg-white text-cc-coral",
      icon: Code2,
    },
    {
      id: 4,
      title: "ค่ำคืนกิจกรรมรอบกองไฟ & Big Cleaning",
      tag: "CAMPFIRE & VOLUNTEER",
      desc: "ค่ำคืนแห่งความทรงจำรอบกองไฟสุดอบอุ่น และร่วมจิตอาสาทำความสะอาดโรงเรียนส่งท้ายค่าย",
      solidBg: "bg-cc-bronze text-white",
      tagBg: "bg-white text-cc-bronze",
      icon: Heart,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 bg-cc-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cc-coral text-white text-xs font-mono font-bold uppercase tracking-wider border-2 border-cc-navy shadow-solid-sm">
            <Heart className="w-3.5 h-3.5" />
            <span>COMMUNITY & MEMORIES</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-cc-navy tracking-tight">
            เสี้ยวหนึ่งของความทรงจำ <span className="text-cc-blue">ComClick</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-normal">
            มากกว่าแค่ค่ายวิชาการ คือพื้นที่แห่งการเรียนรู้ เติบโต และค้นพบมิตรภาพของชาวค่ายทุกคน
          </p>
        </div>

        {/* Gallery Solid Card */}
        <div className="max-w-4xl mx-auto relative">
          <AnimatedContent distance={30} duration={0.6}>
            <div
              className={`rounded-3xl border-3 border-cc-navy shadow-solid-lg p-8 sm:p-14 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between transition-all duration-300 relative ${slides[currentIndex].solidBg}`}
            >
              {/* Top Tag & Slide Number */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-mono font-black uppercase border border-current ${slides[currentIndex].tagBg}`}
                >
                  {slides[currentIndex].tag}
                </span>
                <span className="font-mono font-bold text-xs opacity-75">
                  0{currentIndex + 1} / 0{slides.length}
                </span>
              </div>

              {/* Slide Body */}
              <div className="space-y-4 my-8 text-center max-w-2xl mx-auto">
                <h3 className="font-display font-black text-2xl sm:text-4xl tracking-tight leading-tight">
                  {slides[currentIndex].title}
                </h3>
                <p className="text-sm sm:text-base font-normal opacity-90 max-w-lg mx-auto leading-relaxed">
                  {slides[currentIndex].desc}
                </p>
              </div>

              {/* Bottom Dots & Navigation Arrows */}
              <div className="flex items-center justify-between pt-4 border-t border-current/20">
                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-3 rounded-full border border-current transition-all ${
                        currentIndex === i ? "w-8 bg-current" : "w-3 opacity-40 hover:opacity-80"
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-xl bg-white text-cc-navy border-2 border-cc-navy flex items-center justify-center font-bold shadow-solid-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-xl bg-white text-cc-navy border-2 border-cc-navy flex items-center justify-center font-bold shadow-solid-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
