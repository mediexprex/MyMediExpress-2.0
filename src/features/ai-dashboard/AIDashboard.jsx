import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiActivity,
  FiZap,
  FiDroplet,
  FiPieChart,
  FiClock,
  FiCalendar,
  FiUser,
  FiTrendingUp,
  FiShield,
  FiArrowRight,
  FiPlus,
  FiCamera,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

import "../../styles/dashboard.css";

const AIDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [vitals, setVitals] = useState({
    water: 0,
    calories: 0,
    symptoms: 0,
    reminders: 0,
  });
  const [recentScans, setRecentScans] = useState([]);
  const [upcomingMeds, setUpcomingMeds] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const today = new Date().toISOString().split("T")[0];

    // 1. Water Today
    const waterQ = query(
      collection(db, "water_logs"),
      where("userId", "==", uid),
      where("date", "==", today)
    );
    const unsubWater = onSnapshot(waterQ, (snap) => {
      let total = 0;
      snap.forEach(doc => total += (doc.data().amount || 0));
      setVitals(prev => ({ ...prev, water: total }));
    });

    // 2. Food Today
    const foodQ = query(
      collection(db, "food_logs"),
      where("userId", "==", uid),
      where("date", "==", today)
    );
    const unsubFood = onSnapshot(foodQ, (snap) => {
      let total = 0;
      snap.forEach(doc => total += (doc.data().calories || 0));
      setVitals(prev => ({ ...prev, calories: total }));
    });

    // 3. Symptoms Today
    const symptomQ = query(
      collection(db, "symptom_logs"),
      where("userId", "==", uid),
      where("date", "==", today)
    );
    const unsubSymptom = onSnapshot(symptomQ, (snap) => {
      setVitals(prev => ({ ...prev, symptoms: snap.size }));
    });

    // 4. Recent Scans
    const scanQ = query(
      collection(db, "scan_history"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    const unsubScans = onSnapshot(scanQ, (snap) => {
      setRecentScans(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 5. Medicine Reminders
    const medQ = query(
      collection(db, "medicine_reminders"),
      where("userId", "==", uid),
      where("taken", "==", false),
      limit(4)
    );
    const unsubMeds = onSnapshot(medQ, (snap) => {
      setUpcomingMeds(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setVitals(prev => ({ ...prev, reminders: snap.size }));
      setLoading(false);
    });

    return () => {
      unsubWater();
      unsubFood();
      unsubSymptom();
      unsubScans();
      unsubMeds();
    };
  }, []);

  const healthScore = Math.min(100, Math.round(
    (vitals.water / 2000) * 25 +
    (vitals.calories > 1500 ? 25 : (vitals.calories / 1500) * 25) +
    (vitals.reminders === 0 ? 25 : 10) +
    (vitals.symptoms === 0 ? 25 : 15)
  ));

  const stats = [
    { label: "Water Intake", value: `${vitals.water}ml`, target: "2000ml", icon: <FiDroplet />, color: "#3B82F6", bg: "#EFF6FF", link: "/water-tracker" },
    { label: "Calories", value: `${vitals.calories}kcal`, target: "2200kcal", icon: <FiPieChart />, color: "#F97316", bg: "#FFF7ED", link: "/food-tracker" },
    { label: "Active Reminders", value: vitals.reminders, target: "Today", icon: <FiClock />, color: "#A855F7", bg: "#FAF5FF", link: "/medicine-reminder" },
    { label: "Symptoms", value: vitals.symptoms, target: "Today", icon: <FiActivity />, color: "#EF4444", bg: "#FEF2F2", link: "/symptom-tracker" },
  ];

  if (loading) return (
    <div className="ai-dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="loader"></div>
        <p style={{ marginTop: '20px', fontWeight: '800', color: '#94A3B8' }}>ANALYZING VITALS...</p>
      </div>
    </div>
  );

  return (
    <div className="ai-dashboard">
      <div className="dashboard-container">

        {/* Hero Section */}
        <header className="dashboard-hero">
          <div className="hero-content">
            <div className="hero-tag">
              <FiZap /> AI Health Intelligence
            </div>
            <h1 className="hero-title">
              Welcome back, <br/>
              <span>{auth.currentUser?.displayName?.split(" ")[0] || "User"}</span>
            </h1>
            <p className="hero-desc">
              Your personalized health score is currently {healthScore}%. We've analyzed your daily vitals and have some optimizations for you.
            </p>
            <div className="hero-actions">
              <Link to="/scanner-ocr" className="btn-primary">
                <FiCamera /> Scan Medicine
              </Link>
              <Link to="/lab-report-ai" className="btn-outline">
                <FiFileText /> Lab Reports
              </Link>
            </div>
          </div>

          <div className="score-visual">
            <svg className="score-svg">
              <circle cx="50%" cy="50%" r="45%" className="score-bg" />
              <motion.circle
                cx="50%" cy="50%" r="45%"
                className="score-fill"
                initial={{ strokeDasharray: "0 1000" }}
                animate={{ strokeDasharray: `${healthScore * 2.83} 1000` }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="score-text">
              <span className="score-number">{healthScore}%</span>
              <span className="score-label">Health Score</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
                  {stat.icon}
                </div>
                <Link to={stat.link} className="stat-link">
                  <FiArrowRight />
                </Link>
              </div>
              <p className="stat-label">{stat.label}</p>
              <div className="stat-value-group">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-target">/ {stat.target}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="dashboard-content-main">

          <div className="content-left">
            <section className="section-card">
              <div className="section-header">
                <h2 className="section-title">
                  <FiCamera /> Recent Scans
                </h2>
                <Link to="/scanner-ocr" className="view-all">View History</Link>
              </div>

              <div className="scans-preview-grid">
                {recentScans.length > 0 ? recentScans.map((scan) => (
                  <div key={scan.id} className="scan-mini-card">
                    <div className="scan-thumb">
                      <img src={scan.imageURL} alt="Scan" />
                    </div>
                    <h4 className="scan-name">{scan.aiAnalysis?.name || "Medicine Scan"}</h4>
                    <p className="scan-date">
                      {new Date(scan.createdAt?.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                )) : (
                  <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                    <p>No recent scans found.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="visualizer-promo">
              <div className="promo-content">
                <h3 className="promo-title">AI 3D Body Visualizer</h3>
                <p className="promo-desc">
                  Explore your physiological health through our interactive 3D anatomy engine. Identify symptoms and organ functions.
                </p>
                <Link to="/body-3d" className="btn-white">
                  Launch Visualizer <FiArrowRight />
                </Link>
              </div>
            </section>
          </div>

          <div className="content-right">
            <section className="section-card">
              <div className="section-header">
                <h2 className="section-title">
                  <FiClock /> Schedule
                </h2>
                <Link to="/medicine-reminder" className="view-all">
                  <FiPlus />
                </Link>
              </div>

              <div className="meds-list">
                {upcomingMeds.length > 0 ? upcomingMeds.map((med) => (
                  <div key={med.id} className="med-item">
                    <div className="med-icon">
                      <FiZap />
                    </div>
                    <div className="med-info">
                      <h4 className="med-name">{med.name}</h4>
                      <p className="med-meta">{med.time} • {med.dosage}</p>
                    </div>
                    <div className="med-status-dot"></div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                    <FiCheckCircle size={32} style={{ marginBottom: '12px' }} />
                    <p style={{ fontSize: '12px', fontWeight: '800' }}>ALL CLEAR</p>
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>

        {/* Info Cards Row */}
        <div className="info-cards-row">
           <div className="info-card dark">
              <div className="info-icon" style={{ color: '#3B82F6' }}><FiShield /></div>
              <h4 className="info-title">Data Privacy</h4>
              <p className="info-desc">Your health records are encrypted and stored following HIPAA standards.</p>
           </div>
           <div className="info-card light">
              <div className="info-icon" style={{ color: '#10B981' }}><FiTrendingUp /></div>
              <h4 className="info-title">Weekly Trends</h4>
              <p className="info-desc">AI tracks your performance across weeks to identify health patterns.</p>
           </div>
           <div className="info-card tint">
              <div className="info-icon" style={{ color: '#0EA5E9' }}><FiUser /></div>
              <h4 className="info-title">Specialist Access</h4>
              <p className="info-desc">Connect with certified physicians for your scanned reports.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AIDashboard;
