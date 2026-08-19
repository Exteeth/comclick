"use client";

import React, { useState } from "react";
import { FAQS, CAMP_INFO } from "@/lib/constants";
import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedContent from "./ui/AnimatedContent";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-cc-cream border-t-2 border-cc-navy relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cc-yellow text-cc-navy text-xs font-mono font-bold uppercase tracking-wider border-2 border-cc-navy shadow-solid-sm">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-cc-navy tracking-tight">
            มีข้อสงสัยเกี่ยวกับ <span className="text-cc-coral">การสมัครพี่ค่าย?</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-normal">
            รวบรวมคำถามที่เพื่อนๆ พี่น้องมักถามบ่อยเกี่ยวกับการรับสมัครและการทำงานในค่าย Comclick 20
          </p>
        </div>

        {/* FAQ Accordion List with Silky Framer Motion Animations */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <AnimatedContent key={idx} distance={20} duration={0.5} delay={idx * 0.04}>
                <div className="bg-white rounded-2xl border-3 border-cc-navy shadow-solid transition-all overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-cc-cream/40 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="font-display font-black text-base sm:text-lg text-cc-navy">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-9 h-9 rounded-xl border-2 border-cc-navy flex items-center justify-center font-bold flex-shrink-0 transition-colors ${
                        isOpen ? "bg-cc-coral text-white" : "bg-cc-cream text-cc-navy"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="faq-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25 }}
                          className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-sm text-gray-700 leading-relaxed border-t-2 border-cc-navy/10 font-normal"
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedContent>
            );
          })}
        </div>

        {/* Bright & Clean Contact Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white text-cc-navy border-3 border-cc-navy shadow-solid-lg text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cc-cream text-cc-navy border-2 border-cc-navy text-xs font-mono font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-cc-coral" />
            <span>CONTACT & SUPPORT</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-cc-navy">
            ยังมีคำถามอื่นๆ เพิ่มเติมหรือไม่?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto font-normal leading-relaxed">
            สามารถส่งข้อความทักทายหรือสอบถามพี่ๆ ผ่านช่องทาง Facebook Page ของค่ายได้ตลอดเวลา
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={CAMP_INFO.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cc-coral hover:bg-cc-coral-dark text-white text-xs font-bold transition-all border-2 border-cc-navy shadow-solid-sm hover:translate-x-0.5 hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inbox Facebook Page</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
