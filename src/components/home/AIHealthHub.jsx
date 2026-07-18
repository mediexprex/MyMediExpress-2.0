import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, Activity, Droplets, PieChart, Clock,
  Calendar, Camera, FileText, Target, ArrowRight, Layers
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const AIHealthHub = () => {
  const { t } = useLanguage();

  const cards = [
    {
      title: t('aiDashboard'),
      desc: "Clinical overview of health metrics and biometric telemetry insights.",
      icon: <Layers size={28} />,
      link: "/ai-dashboard",
      color: "from-blue-600 to-blue-400",
      delay: 0.1,
    },
    {
      title: t('medicineScanner'),
      desc: "Optical pharmaceutical analysis for instant dosage and safety info.",
      icon: <Camera size={28} />,
      link: "/scanner-ocr",
      color: "from-purple-600 to-purple-400",
      delay: 0.2,
    },
    {
      title: t('labReportAI'),
      desc: "Heuristic mapping of diagnostic reports and clinical risk evaluation.",
      icon: <FileText size={28} />,
      link: "/lab-report-ai",
      color: "from-teal-600 to-teal-400",
      delay: 0.3,
    },
    {
      title: t('medicineReminder'),
      desc: "Chronological pharmaceutical administration scheduling protocols.",
      icon: <Clock size={28} />,
      link: "/medicine-reminder",
      color: "from-indigo-600 to-indigo-400",
      delay: 0.4,
    },
    {
      title: t('waterTracker'),
      desc: "Heuristic hydration tracking with metabolic efficiency advice.",
      icon: <Droplets size={28} />,
      link: "/water-tracker",
      color: "from-sky-600 to-sky-400",
      delay: 0.5,
    },
    {
      title: t('foodTracker'),
      desc: "Nutrient payload logging with Gemini AI thermodynamic analysis.",
      icon: <PieChart size={28} />,
      link: "/food-tracker",
      color: "from-orange-600 to-orange-400",
      delay: 0.6,
    },
    {
      title: t('symptomTracker'),
      desc: "Biometric variance logging with automated preliminary guidance.",
      icon: <Activity size={28} />,
      link: "/symptom-tracker",
      color: "from-red-600 to-red-400",
      delay: 0.7,
    },
    {
      title: t('healthTimeline'),
      desc: "Unified medical registry of chronological clinical events.",
      icon: <Calendar size={28} />,
      link: "/health-timeline",
      color: "from-slate-700 to-slate-500",
      delay: 0.8,
    },
    {
      title: t('body3d'),
      desc: "High-fidelity anatomical explorer for physiological telemetry.",
      icon: <Target size={28} />,
      link: "/body-3d",
      color: "from-emerald-600 to-emerald-400",
      delay: 0.9,
    },
  ];

  return (
    <section className="py-32 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-16 h-[2px] bg-primary"></div>
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Clinical Intelligence Platform</span>
            <div className="w-16 h-[2px] bg-primary"></div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-main mb-8 tracking-tighter"
          >
            AI Health Hub
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-xl font-medium leading-relaxed"
          >
            Experience the next generation of healthcare telemetry powered by Gemini BioAI and high-fidelity heuristic mapping.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay, duration: 0.6, cubicBezier: [0.175, 0.885, 0.32, 1.275] }}
              className="group"
            >
              <Link to={card.link} className="block h-full">
                <div className="card glass h-full p-10 flex flex-col border-none shadow-md hover:shadow-2xl hover:-translate-y-4 group-hover:border-primary border-opacity-10 transition-all duration-500 rounded-[40px] relative overflow-hidden">
                  <div className={`w-20 h-20 rounded-[28px] bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-10 shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-black text-main mb-4 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-muted font-bold text-sm leading-relaxed mb-10 opacity-80">
                    {card.desc}
                  </p>
                  <div className="mt-auto flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[3px] group-hover:gap-5 transition-all">
                    Initialize Protocol <ArrowRight size={16} />
                  </div>

                  {/* Decorative Gradient Blob */}
                  <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 rounded-full blur-2xl transition-opacity`}></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-16 bg-slate-900 rounded-[60px] text-center text-white relative overflow-hidden shadow-2xl"
        >
          <Zap className="absolute -right-20 -top-20 text-[300px] opacity-5 rotate-12 text-white" />
          <h3 className="text-4xl font-black mb-6 relative z-10 tracking-tight">Sync Your Biological Profile</h3>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12 relative z-10 font-medium">
            Commence high-fidelity health tracking with MyMediExpress secure clinical infrastructure.
          </p>
          <Link to="/register" className="btn-primary py-5 px-16 text-sm uppercase tracking-[4px] relative z-10 shadow-2xl hover:scale-105 transition-all rounded-3xl">
             Begin Initialization
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AIHealthHub;
