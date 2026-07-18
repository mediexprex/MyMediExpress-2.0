import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Activity, Zap, Shield, Search, Info,
  CheckCircle, AlertCircle, Plus, X, ExternalLink,
  ChevronRight, Fingerprint, RotateCcw, Maximize,
  Minimize, Heart, Brain, Pill, FlaskConical, Stethoscope,
  AlertTriangle, BookOpen, UserCheck, Microscope
} from "lucide-react";
import { Link } from "react-router-dom";

import "../../styles/body3d.css";

const BodyVisualizer3D = () => {
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSystem, setActiveSystem] = useState("Circulatory");
  const [isBackView, setIsBackView] = useState(false);
  const [zoom, setZoom] = useState(1);

  const anatomyData = [
    {
      id: "brain",
      name: "Brain",
      system: "Nervous",
      desc: "The central control hub of the human body, responsible for processing sensory data, cognitive thought, and motor control.",
      functions: ["Cognitive Processing", "Motor Control", "Homeostasis", "Sensory Integration"],
      symptoms: ["Memory Loss", "Chronic Headaches", "Disorientation", "Aphasia"],
      diseases: ["Alzheimer's Disease", "Epilepsy", "Multiple Sclerosis", "Parkinson's"],
      aiInsights: "Current neural load is optimal. Recommended: 7-9 hours of sleep to maintain hippocampal neuroplasticity.",
      tests: ["MRI Brain", "EEG", "CT Scan", "Cognitive Assessment"],
      doctors: ["Neurologist", "Neurosurgeon"],
      vitals: "98% Efficiency",
      color: "#3B82F6",
      top: "12%", left: "50%",
      icon: <Brain />
    },
    {
      id: "heart",
      name: "Heart",
      system: "Circulatory",
      desc: "A powerful muscular pump that circulates oxygenated blood through the cardiovascular network to sustain life.",
      functions: ["Blood Circulation", "Pressure Regulation", "Oxygen Transport", "Nutrient Delivery"],
      symptoms: ["Chest Tightness", "Palpitations", "Shortness of Breath", "Edema"],
      diseases: ["Coronary Artery Disease", "Atrial Fibrillation", "Heart Failure", "Hypertension"],
      aiInsights: "HRV (Heart Rate Variability) indicates a slight stress trend. Consider 10 minutes of guided respiratory synchronization.",
      tests: ["ECG / EKG", "Echocardiogram", "Lipid Profile", "Stress Test"],
      doctors: ["Cardiologist", "Vascular Specialist"],
      vitals: "72 BPM - Stable",
      color: "#EF4444",
      top: "32%", left: "47%",
      icon: <Heart />
    },
    {
      id: "lungs",
      name: "Lungs",
      system: "Respiratory",
      desc: "Primary organs for gas exchange, extracting life-sustaining oxygen from the air and expelling carbon dioxide.",
      functions: ["Gas Exchange", "Acid-Base Balance", "Air Filtration", "Phonation"],
      symptoms: ["Wheezing", "Persistent Cough", "Cyanosis", "Rapid Breathing"],
      diseases: ["COPD", "Asthma", "Emphysema", "Cystic Fibrosis"],
      aiInsights: "Oxygen saturation is excellent (99%). Respiratory rhythm is synchronized with current metabolic demands.",
      tests: ["Spirometry", "Chest X-Ray", "Pulse Oximetry", "ABG Analysis"],
      doctors: ["Pulmonologist", "Respiratory Therapist"],
      vitals: "14 Breaths/Min",
      color: "#14B8A6",
      top: "32%", left: "54%",
      icon: <Activity />
    },
    {
      id: "liver",
      name: "Liver",
      system: "Digestive",
      desc: "The body's primary metabolic factory, responsible for detoxification, protein synthesis, and bile production.",
      functions: ["Detoxification", "Protein Synthesis", "Glycogen Storage", "Bile Secretion"],
      symptoms: ["Jaundice", "Abdominal Swelling", "Dark Urine", "Chronic Fatigue"],
      diseases: ["Hepatitis B/C", "Non-Alcoholic Fatty Liver", "Cirrhosis", "Hemochromatosis"],
      aiInsights: "Enzymatic markers (ALT/AST) indicate healthy metabolic processing. Continue high antioxidant intake.",
      tests: ["LFT Panel", "Liver Ultrasound", "FibroScan", "AFP Test"],
      doctors: ["Hepatologist", "Gastroenterologist"],
      vitals: "Normal Enzyme Levels",
      color: "#B45309",
      top: "43%", left: "44%",
      icon: <Shield />
    },
    {
      id: "kidneys",
      name: "Kidneys",
      system: "Urinary",
      desc: "Vital filtration units that remove metabolic waste from blood and maintain critical electrolyte and fluid balance.",
      functions: ["Waste Filtration", "Fluid Balance", "Erythropoietin Release", "Electrolyte Regulation"],
      symptoms: ["Hematuria", "Periorbital Edema", "Foamy Urine", "Lower Back Pain"],
      diseases: ["CKD (Chronic Kidney Disease)", "Nephrolithiasis", "Polycystic Kidney Disease"],
      aiInsights: "Filtration rate (eGFR) is stable. Increase fluid intake by 400ml today due to ambient temperature change.",
      tests: ["Creatinine Test", "BUN", "Kidney Ultrasound", "GFR Calculation"],
      doctors: ["Nephrologist", "Urologist"],
      vitals: "eGFR: 95 mL/min",
      color: "#8B5CF6",
      top: "52%", left: "50%",
      icon: <FlaskConical />
    },
    {
      id: "stomach",
      name: "Stomach",
      system: "Digestive",
      desc: "Muscular organ that initiates chemical and mechanical digestion through acid secretion and rhythmic contractions.",
      functions: ["Chemical Digestion", "Intrinsic Factor Secretion", "Temporary Storage"],
      symptoms: ["Epigastric Pain", "Hematemesis", "Melena", "Persistent Bloating"],
      diseases: ["Gastritis", "Peptic Ulcer Disease", "GERD", "Gastroparesis"],
      aiInsights: "Gastric acid levels are balanced. Post-prandial motility is within expected parameters.",
      tests: ["Endoscopy (EGD)", "H. Pylori Breath Test", "Barium Swallow"],
      doctors: ["Gastroenterologist"],
      vitals: "pH 2.0 (Active)",
      color: "#F97316",
      top: "45%", left: "52%",
      icon: <Pill />
    }
  ];

  const systems = [
    { name: "Circulatory", icon: "❤️" },
    { name: "Nervous", icon: "🧠" },
    { name: "Respiratory", icon: "🫁" },
    { name: "Digestive", icon: "🥣" },
    { name: "Urinary", icon: "💧" },
    { name: "Skeletal", icon: "🦴" },
    { name: "Muscular", icon: "💪" }
  ];

  const filteredHotspots = useMemo(() => {
    return anatomyData.filter(organ => {
      const matchesSearch = organ.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSystem = activeSystem === "All" || organ.system === activeSystem;
      return matchesSearch && matchesSystem;
    });
  }, [searchTerm, activeSystem]);

  // Initial selection
  useEffect(() => {
    if (!selectedOrgan) setSelectedOrgan(anatomyData.find(o => o.id === "heart"));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="body-visualizer-page"
    >
      <div className="anatomy-container">

        {/* ==========================================
           HEADER & SEARCH SECTION
           ========================================== */}
        <header className="explorer-header">
          <div className="brand-badge">
            <div className="brand-icon">
              <Fingerprint size={30} />
            </div>
            <div className="brand-text">
              <h1>Bio<span>Explorer</span></h1>
              <p>High Fidelity Anatomical Engine</p>
            </div>
          </div>

          <div className="search-bar-glass">
            <Search size={20} className="text-muted" />
            <input
              type="text"
              placeholder="Search physiological systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* ==========================================
           MAIN GRID (Viewer + Info)
           ========================================== */}
        <div className="anatomy-main-grid">
          
          {/* LEFT: 3D VIEWER STAGE */}
          <section className="viewer-stage">
            <div className="viewer-ui-overlay">
              <div className="viewer-tool active" onClick={() => setIsBackView(!isBackView)}>
                <RotateCcw size={22} />
              </div>
              <div className="viewer-tool" onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}>
                <Maximize size={22} />
              </div>
              <div className="viewer-tool" onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}>
                <Minimize size={22} />
              </div>
            </div>

            <motion.div
              className="human-body-container"
              animate={{
                scale: zoom,
                rotateY: isBackView ? 180 : 0
              }}
              transition={{ type: "spring", stiffness: 50 }}
            >
              {/* Professional Anatomy SVG Group */}
              <svg viewBox="0 0 100 200" className="body-svg">
                <defs>
                  <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--secondary-color)" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                <path
                  d="M50,10 C56,10 61,16 61,26 C61,36 56,42 50,42 C44,42 39,36 39,26 C39,16 44,10 50,10 M39,42 L61,42 L72,95 L63,190 L37,190 L28,95 Z"
                  fill="url(#bodyGrad)"
                  stroke="var(--border-color)"
                  strokeWidth="0.5"
                />
                <path d="M42,95 L38,190" stroke="var(--border-color)" strokeWidth="0.5" fill="none" />
                <path d="M58,95 L62,190" stroke="var(--border-color)" strokeWidth="0.5" fill="none" />
              </svg>

              {/* Real Hotspots */}
              {filteredHotspots.map(organ => (
                <div
                  key={organ.id}
                  className={`anatomy-hotspot ${selectedOrgan?.id === organ.id ? 'active' : ''}`}
                  style={{
                    top: organ.top,
                    left: organ.left,
                    backgroundColor: organ.color,
                    color: organ.color,
                    rotateY: isBackView ? 180 : 0 // Keep hotspots front-facing
                  }}
                  onClick={() => setSelectedOrgan(organ)}
                />
              ))}
            </motion.div>
          </section>

          {/* RIGHT: GLASS ORGAN CARD */}
          <aside className="organ-info-card">
            <AnimatePresence mode="wait">
              {selectedOrgan ? (
                <motion.div
                  key={selectedOrgan.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="organ-card-scroll"
                >
                  <div className="organ-image-wrapper">
                    <div style={{ color: selectedOrgan.color, opacity: 0.2 }}>
                      {React.cloneElement(selectedOrgan.icon, { size: 180 })}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       {React.cloneElement(selectedOrgan.icon, { size: 100, color: selectedOrgan.color })}
                    </div>
                  </div>

                  <div className="organ-title-section">
                    <span className="system-tag">{selectedOrgan.system} System</span>
                    <h2>{selectedOrgan.name}</h2>
                    <div className="organ-vitals">
                       <div className="vital-item">
                         <span>Status</span>
                         <strong>Optimal</strong>
                       </div>
                       <div className="vital-item">
                         <span>Live Telemetry</span>
                         <strong>{selectedOrgan.vitals}</strong>
                       </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h4><Info size={16} /> Description</h4>
                    <p>{selectedOrgan.desc}</p>
                  </div>

                  <div className="info-section">
                    <h4><Activity size={16} /> Primary Functions</h4>
                    <div className="pill-container">
                      {selectedOrgan.functions.map(f => <div key={f} className="data-pill">{f}</div>)}
                    </div>
                  </div>

                  <div className="ai-insight-box">
                    <h5><Zap size={14} fill="currentColor" /> AI Health Bio-Insight</h5>
                    <p className="text-sm italic font-medium text-slate-500">"{selectedOrgan.aiInsights}"</p>
                  </div>

                  <div className="info-section">
                    <h4><AlertTriangle size={16} /> Common Symptoms</h4>
                    <div className="pill-container">
                      {selectedOrgan.symptoms.map(s => <div key={s} className="data-pill" style={{ borderColor: '#FEE2E2', color: '#EF4444' }}>{s}</div>)}
                    </div>
                  </div>

                  <div className="info-section">
                    <h4><Shield size={16} /> Related Diseases</h4>
                    <div className="pill-container">
                      {selectedOrgan.diseases.map(d => <div key={d} className="data-pill">{d}</div>)}
                    </div>
                  </div>

                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center p-12 text-center">
                  <p className="text-muted font-bold">Select an anatomical node to initialize data stream.</p>
                </div>
              )}
            </AnimatePresence>

            <div className="organ-card-actions">
              <button className="btn-primary w-full py-5 rounded-2xl">
                 <Stethoscope size={20} /> Consult Specialist
              </button>
              <div className="action-row">
                <button className="btn-secondary flex-1 py-4 rounded-xl">
                  <Microscope size={18} /> Lab Tests
                </button>
                <button className="btn-secondary flex-1 py-4 rounded-xl">
                  <BookOpen size={18} /> Learn More
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ==========================================
           BOTTOM: SYSTEMS & RELATED
           ========================================== */}
        <section className="anatomy-footer-content">

          <div className="systems-scroller">
            {systems.map(sys => (
              <div
                key={sys.name}
                className={`system-card ${activeSystem === sys.name ? 'active' : ''}`}
                onClick={() => setActiveSystem(sys.name)}
              >
                <span className="sys-icon">{sys.icon}</span>
                <span>{sys.name}</span>
              </div>
            ))}
          </div>

          <div className="related-grid">
            <div className="related-section">
              <h3><AlertTriangle size={20} /> Common Regional Pathologies</h3>
              <div className="related-list">
                {selectedOrgan?.diseases.map(d => (
                  <div key={d} className="related-item">
                    <span>{d}</span>
                    <ChevronRight size={16} />
                  </div>
                ))}
              </div>
            </div>

            <div className="related-section">
              <h3><Microscope size={20} /> Recommended Diagnostic Protocols</h3>
              <div className="related-list">
                {selectedOrgan?.tests.map(t => (
                  <div key={t} className="related-item">
                    <span>{t}</span>
                    <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-lg">
                       <Plus size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

      </div>
    </motion.div>
  );
};

export default BodyVisualizer3D;
