import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity, Zap, Droplets, PieChart, Clock, User,
  TrendingUp, Shield, ArrowRight, Plus, Camera,
  FileText, CheckCircle
} from "lucide-react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/dashboard.css";

const AIDashboard = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [vitals, setVitals] = useState({
    water: 0,
    calories: 0,
    symptoms: 0,
    reminders: 0,
  });
  const [recentScans, setRecentScans] = useState([]);
  const [upcomingMeds, setUpcomingMeds] = useState([]);

  const ICON_SIZE = 20;

  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const today = new Date().toISOString().split("T")[0];

    const waterQ = query(collection(db, "water_logs"), where("userId", "==", uid), where("date", "==", today));
    const unsubWater = onSnapshot(waterQ, (snap) => {
      let total = 0;
      snap.forEach(doc => total += (doc.data().amount || 0));
      setVitals(prev => ({ ...prev, water: total }));
    });

    const foodQ = query(collection(db, "food_logs"), where("userId", "==", uid), where("date", "==", today));
    const unsubFood = onSnapshot(foodQ, (snap) => {
      let total = 0;
      snap.forEach(doc => total += (doc.data().calories || 0));
      setVitals(prev => ({ ...prev, calories: total }));
    });

    const symptomQ = query(collection(db, "symptom_logs"), where("userId", "==", uid), where("date", "==", today));
    const unsubSymptom = onSnapshot(symptomQ, (snap) => {
      setVitals(prev => ({ ...prev, symptoms: snap.size }));
    });

    const scanQ = query(collection(db, "scan_history"), where("userId", "==", uid), orderBy("createdAt", "desc"), limit(3));
    const unsubScans = onSnapshot(scanQ, (snap) => {
      setRecentScans(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const medQ = query(collection(db, "medicine_reminders"), where("userId", "==", uid), where("taken", "==", false), limit(4));
    const unsubMeds = onSnapshot(medQ, (snap) => {
      setUpcomingMeds(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setVitals(prev => ({ ...prev, reminders: snap.size }));
      setLoading(false);
    });

    return () => {
      unsubWater(); unsubFood(); unsubSymptom(); unsubScans(); unsubMeds();
    };
  }, []);

  const healthScore = Math.min(100, Math.round(
    (vitals.water / 2000) * 25 +
    (vitals.calories > 1500 ? 25 : (vitals.calories / 1500) * 25) +
    (vitals.reminders === 0 ? 25 : 10) +
    (vitals.symptoms === 0 ? 25 : 15)
  ));

  const stats = [
    { label: t('waterIntake'), value: `${vitals.water}ml`, target: "2000ml", icon: <Droplets size={ICON_SIZE} />, color: "#3B82F6", bg: "rgba(59, 130, 246, 0.12)", link: "/water-tracker" },
    { label: t('calories'), value: `${vitals.calories}kcal`, target: "2200kcal", icon: <PieChart size={ICON_SIZE} />, color: "#F97316", bg: "rgba(249, 115, 22, 0.12)", link: "/food-tracker" },
    { label: t('activeReminders'), value: vitals.reminders, target: "Today", icon: <Clock size={ICON_SIZE} />, color: "#A855F7", bg: "rgba(168, 85, 247, 0.12)", link: "/medicine-reminder" },
    { label: t('symptoms'), value: vitals.symptoms, target: "Today", icon: <Activity size={ICON_SIZE} />, color: "#EF4444", bg: "rgba(239, 68, 68, 0.12)", link: "/symptom-tracker" },
  ];

  if (loading) return (
    <div className="loader-container min-h-screen">
      <div className="loader"></div>
      <p className="mt-4 font-bold text-muted tracking-widest uppercase">Analyzing Biological Telemetry...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ai-dashboard">
      <div className="page-container">

        <header className="dashboard-hero">
          <div className="hero-content">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hero-tag">
              <Zap size={14} /> AI Health Intelligence
            </motion.div>
            <h1 className="hero-title">
              {t('welcomeBack')}, <br/>
              <span>{auth.currentUser?.displayName?.split(" ")[0] || "Voyager"}</span>
            </h1>
            <p className="hero-desc">
              Your personalized vitality index is currently at {healthScore}%. We've synchronized your biological logs for today.
            </p>
            <div className="hero-actions">
              <Link to="/scanner-ocr" className="btn-primary">
                <Camera size={20} /> {t('scanMedicine')}
              </Link>
              <Link to="/lab-report-ai" className="btn-primary" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'none' }}>
                <FileText size={20} /> {t('labReports')}
              </Link>
            </div>
          </div>

          <div className="score-visual">
            <svg className="score-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" strokeWidth="8" fill="none" stroke="rgba(255,255,255,0.1)" />
              <motion.circle
                cx="50" cy="50" r="45" strokeWidth="8" fill="none" stroke="white" strokeLinecap="round"
                initial={{ strokeDasharray: "0 283" }}
                animate={{ strokeDasharray: `${(healthScore / 100) * 283} 283` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="score-text">
              <span className="text-4xl font-black">{healthScore}%</span>
              <span className="text-[10px] font-bold uppercase opacity-80 tracking-widest">{t('healthScore')}</span>
            </div>
          </div>
        </header>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="stat-card card">
              <div className="flex justify-between items-center mb-4">
                <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>{stat.icon}</div>
                <Link to={stat.link} className="text-muted hover:text-primary transition-colors"><ArrowRight size={20} /></Link>
              </div>
              <p className="stat-label mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="stat-value">{stat.value}</span>
                <span className="text-xs text-muted font-bold">/ {stat.target}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="dashboard-content-main">
          <div className="space-y-8">
            <section className="section-card card">
              <div className="flex justify-between items-center mb-8">
                <h2 className="section-title flex items-center gap-3">
                  <Camera size={ICON_SIZE} className="text-primary" /> {t('recentScans')}
                </h2>
                <Link to="/scanner-ocr" className="text-primary font-black text-sm uppercase tracking-widest">View All</Link>
              </div>

              <div className="scans-preview-grid">
                {recentScans.length > 0 ? recentScans.map((scan) => (
                  <div key={scan.id} className="scan-mini-card group">
                    <div className="scan-thumb aspect-video rounded-xl border border-border overflow-hidden mb-3">
                      <img src={scan.imageURL} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <h4 className="font-bold text-sm truncate">{scan.aiAnalysis?.name || "Medicine Scan"}</h4>
                    <p className="text-[10px] font-black text-muted uppercase mt-1">
                      {new Date(scan.createdAt?.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                )) : (
                  <div className="col-span-full py-10 text-center text-muted opacity-40">
                    <Shield size={40} className="mx-auto mb-2" />
                    <p className="text-sm font-bold uppercase tracking-widest">No Recent Telemetry</p>
                  </div>
                )}
              </div>
            </section>

            <section className="visualizer-promo">
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-4 tracking-tight text-white">Biological Explorer</h3>
                <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
                  Interact with our high-fidelity 3D anatomical engine to visualize localized symptoms and physiological functions.
                </p>
                <Link to="/body-3d" className="btn-primary" style={{ background: 'white', color: '#0F172A' }}>
                  {t('launchVisualizer')} <ArrowRight size={20} />
                </Link>
              </div>
              <Zap className="absolute -right-10 -bottom-10 text-[200px] text-white opacity-5 rotate-12" />
            </section>
          </div>

          <section className="section-card card">
            <div className="flex justify-between items-center mb-8">
              <h2 className="section-title flex items-center gap-3">
                <Clock size={ICON_SIZE} className="text-primary" /> {t('schedule')}
              </h2>
              <Link to="/medicine-reminder" className="w-9 h-9 flex items-center justify-center bg-primary bg-opacity-10 text-primary rounded-xl hover:bg-opacity-20 transition-all shadow-sm">
                <Plus size={20} />
              </Link>
            </div>

            <div className="meds-list">
              {upcomingMeds.length > 0 ? upcomingMeds.map((med) => (
                <div key={med.id} className="med-item flex items-center gap-4">
                  <div className="med-icon flex items-center justify-center"><Zap size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{med.name}</h4>
                    <p className="text-[10px] font-bold text-muted uppercase mt-0.5">{med.time} • {med.dosage}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                </div>
              )) : (
                <div className="text-center py-20 text-muted opacity-40">
                  <CheckCircle size={40} className="mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Protocol Verified</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
           <div className="card dark p-8 bg-slate-900 text-white shadow-xl border-none" style={{ borderRadius: '32px' }}>
              <Shield size={32} className="mb-4 text-blue-500" />
              <h4 className="text-xl font-black mb-2 text-white">{t('dataPrivacy')}</h4>
              <p className="text-sm text-slate-400 font-medium">Encrypted biometric storage utilizing AES-256 military-grade infrastructure.</p>
           </div>
           <div className="card p-8 shadow-xl border-none" style={{ borderRadius: '32px' }}>
              <TrendingUp size={32} className="mb-4 text-green-500" />
              <h4 className="text-xl font-black mb-2">{t('weeklyTrends')}</h4>
              <p className="text-sm text-muted font-medium">Proprietary AI algorithms tracking physiological progress benchmarks.</p>
           </div>
           <div className="card p-8 text-white shadow-xl border-none" style={{ background: 'var(--accent-color)', borderRadius: '32px' }}>
              <User size={32} className="mb-4 text-white" />
              <h4 className="text-xl font-black mb-2 text-white">{t('specialistAccess')}</h4>
              <p className="text-sm text-white text-opacity-80 font-medium">On-demand clinical validation for all diagnostic telemetry.</p>
           </div>
        </div>


      </div>
    </motion.div>
  );
};

export default AIDashboard;
