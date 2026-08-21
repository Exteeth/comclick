import React from "react";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CommitteeSection from "@/components/CommitteeSection";
import DepartmentCards from "@/components/DepartmentCards";
import CampGallery from "@/components/CampGallery";
import ScheduleTimeline from "@/components/ScheduleTimeline";
import ImpressionsGallery from "@/components/ImpressionsGallery";
import FAQSection from "@/components/FAQSection";
import { ArrowUpRight, FileSearch, Sparkles } from "lucide-react";
import { CAMP_INFO } from "@/lib/constants";
import AnimatedContent from "@/components/ui/AnimatedContent";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Split Hero Section */}
      <Hero />

      {/* 2. About Camp Section */}
      <AboutSection />

      {/* 3. Camp Committee & Department Leads */}
      <CommitteeSection />

      {/* 4. 8 Staff Departments */}
      <DepartmentCards />

      {/* 5. Interactive Camp Activity 3D Dome Gallery */}
      <CampGallery />

      {/* 6. Schedule & Itinerary */}
      <ScheduleTimeline />

      {/* 7. Impressions Gallery */}
      <ImpressionsGallery />

      {/* 8. FAQ Section */}
      <FAQSection />

      {/* 9. Call To Action Banner */}
      <section className="py-24 bg-cc-coral text-white border-t-3 border-cc-navy relative text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <AnimatedContent
            distance={40}
            direction="vertical"
            duration={0.7}
            scale={0.97}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cc-navy text-white text-xs font-mono font-bold uppercase tracking-wider shadow-solid-sm">
                <Sparkles className="w-3.5 h-3.5 text-cc-yellow" />
                <span>JOIN THE 20TH LEGACY</span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                มาร่วมเป็นส่วนหนึ่งของครอบครัว <br />
                <span className="text-cc-navy bg-white px-3 py-0.5 rounded-xl inline-block mt-1 shadow-solid-sm">
                  COMCLICK 20
                </span> ไปด้วยกัน!
              </h2>

              <p className="text-base sm:text-lg text-white/95 max-w-2xl mx-auto font-normal leading-relaxed">
                เปิดรับสมัคร <strong className="text-cc-yellow font-black underline">เริ่ม 24 ส.ค. (09:00 น.) - 29 ส.ค. 2569 (23:59 น.)</strong> ไม่จำกัดคณะและชั้นปี สมัครได้ทั้งอันดับ 1 และอันดับ 2
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="/apply"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cc-navy hover:bg-cc-blue text-white font-display font-black text-base border-2 border-white shadow-solid hover:translate-x-1 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>กรอกใบสมัครพี่ค่ายตอนนี้</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </a>

                <a
                  href="/status"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white text-cc-navy hover:bg-cc-cream border-2 border-cc-navy font-bold text-base shadow-solid-sm transition-all flex items-center justify-center gap-2"
                >
                  <FileSearch className="w-5 h-5 text-cc-blue" />
                  <span>ตรวจสอบผลการสมัคร</span>
                </a>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </section>
    </div>
  );
}
