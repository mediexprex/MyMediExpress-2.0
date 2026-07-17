import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiZap,
  FiActivity,
  FiDroplet,
  FiPieChart,
  FiClock,
  FiCalendar,
  FiCamera,
  FiFileText,
  FiTarget,
  FiArrowRight,
  FiLayers
} from "react-icons/fi";

const AIHealthHub = () => {
  const cards = [
    {
      title: "AI Dashboard",
      desc: "Comprehensive overview of your health metrics and AI insights.",
      icon: <FiLayers />,
      link: "/ai-dashboard",
      color: "bg-blue-600",
      delay: 0.1,
    },
    {
      title: "Medicine Scanner",
      desc: "Scan any medicine pack for instant AI analysis and dosage info.",
      icon: <FiCamera />,
      link: "/scanner-ocr",
      color: "bg-purple-600",
      delay: 0.2,
    },
    {
      title: "Lab Report AI",
      desc: "Upload lab reports to get simplified AI summaries and risk analysis.",
      icon: <FiFileText />,
      link: "/lab-report-ai",
      color: "bg-teal-600",
      delay: 0.3,
    },
    {
      title: "Medicine Reminder",
      desc: "Never miss a dose with our intelligent scheduling system.",
      icon: <FiClock />,
      link: "/medicine-reminder",
      color: "bg-indigo-600",
      delay: 0.4,
    },
    {
      title: "Water Tracker",
      desc: "Track daily hydration goals with AI-optimized intake advice.",
      icon: <FiDroplet />,
      link: "/water-tracker",
      color: "bg-sky-500",
      delay: 0.5,
    },
    {
      title: "Food Tracker",
      desc: "Log meals and track calories with nutritional AI support.",
      icon: <FiPieChart />,
      link: "/food-tracker",
      color: "bg-orange-500",
      delay: 0.6,
    },
    {
      title: "Symptom Tracker",
      desc: "Log health changes and get instant AI preliminary guidance.",
      icon: <FiActivity />,
      link: "/symptom-tracker",
      color: "bg-red-500",
      delay: 0.7,
    },
    {
      title: "Health Timeline",
      desc: "A unified view of your entire medical history and activities.",
      icon: <FiCalendar />,
      link: "/health-timeline",
      color: "bg-slate-700",
      delay: 0.8,
    },
    {
      title: "3D Body Visualizer",
      desc: "Interactive anatomical engine to visualize your health data.",
      icon: <FiTarget />,
      link: "/body-3d",
      color: "bg-emerald-600",
      delay: 0.9,
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="w-12 h-[2px] bg-blue-600"></div>
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs">Premium AI Platform</span>
            <div className="w-12 h-[2px] bg-blue-600"></div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"
          >
            AI Health Hub
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-lg font-medium"
          >
            Experience the future of healthcare with our suite of intelligent modules, powered by Google Gemini and advanced OCR.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <Link to={card.link} className="block h-full">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all duration-300 group-hover:border-blue-200 dark:group-hover:border-blue-900 group-hover:shadow-2xl group-hover:shadow-blue-500/10 h-full">
                  <div className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl mb-8 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                    {card.desc}
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                    Explore Now <FiArrowRight />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-blue-600 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl shadow-blue-600/30"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <FiZap size={150} />
          </div>
          <h3 className="text-3xl font-black mb-4">Start Your AI Health Journey Today</h3>
          <p className="text-blue-100 max-w-xl mx-auto mb-10 font-medium">
            All features are included in your MyMediExpress account. Secure, private, and powered by the world's most advanced AI models.
          </p>
          <Link to="/register" className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all inline-block shadow-xl">
            Create Free Account
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AIHealthHub;