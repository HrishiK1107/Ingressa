"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};


const FAQS: FAQ[] = [
  {
    question: "What does Ingressa scan?",
    answer:
      "Ingressa scans cloud infrastructure assets across accounts and regions including compute, storage, identity, networking, and managed services.",
  },
  {
    question: "How is risk score calculated?",
    answer:
      "Risk is calculated deterministically using policy severity, exposure context, reachability, and asset criticality to produce explainable scores.",
  },
  {
    question: "How does drift reconciliation work?",
    answer:
      "Ingressa tracks configuration drift by comparing live cloud state against historical findings and secure baselines over time.",
  },
  {
    question: "What does AI assist with?",
    answer:
      "AI provides optional explanations, remediation context, and prioritization hints to speed up analyst triage.",
  },
  {
    question: "What is a finding lifecycle?",
    answer:
      "Findings move through OPEN → ACKNOWLEDGED → RESOLVED states with timelines and full history preserved.",
  },
  {
    question: "Can I export reports for audits?",
    answer:
      "Yes. Findings and remediation data can be exported in CSV or JSON formats for audits and compliance workflows.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-36 px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[900px] h-[500px] bg-accent/10 blur-[160px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-semibold tracking-tight">FAQs</h2>
        <div className="mt-2 h-px w-24 bg-border" />

        {/* FAQ Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {FAQS.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <motion.div
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={[
                  "rounded-2xl border border-border bg-bg-surface/60 backdrop-blur-xl",
                  "px-8 py-7 min-h-[120px]",
                  isOpen && "shadow-2xl",
                ].join(" ")}
              >
                {/* Question */}
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-fg">
                    {faq.question}
                  </p>

                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-fg-muted"
                  >
                    <ChevronRight size={20} />
                  </motion.div>
                </div>

                {/* Answer */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-5 text-sm text-fg-muted leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
