import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTarget,
  FiActivity,
  FiZap,
  FiShield,
  FiSearch,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiX,
  FiExternalLink,
  FiChevronRight,
} from "react-icons/fi";

import "../../styles/body3d.css";

const BodyVisualizer3D = () => {
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const anatomyData = [
    {
      id: "brain",
      name: "Brain",
      system: "Nervous System",
      desc: "Central organ of the human nervous system. Controls cognitive functions, sensory processing, and motor skills through specialized neural networks.",
      diseases: ["Alzheimer's", "Epilepsy", "Migraines"],
      medications: ["Donepezil", "Sumatriptan"],
      vitals: "Normal cognitive load.",
      color: "#3B82F6",
      top: "8%", left: "50%",
    },
    {
      id: "heart",
      name: "Heart",
      system: "Circulatory System",
      desc: "Muscular pump that circulates blood throughout the body. Regulates blood pressure and maintains oxygen distribution to all major tissues.",
      diseases: ["Hypertension", "Arrhythmia"],
      medications: ["Atorvastatin", "Amlodipine"],
      vitals: "72 BPM - Stable",
      color: "#EF4444",
      top: "28%", left: "46%",
    },
    {
      id: "lungs",
      name: "Lungs",
      system: "Respiratory System",
      desc: "Primary organs of gas exchange. Responsible for extracting oxygen from the atmosphere and transferring it into the bloodstream.",
      diseases: ["Asthma", "COPD"],
      medications: ["Albuterol", "Fluticasone"],
      vitals: "98% SpO2 - Clear",
      color: "#14B8A6",
      top: "28%", left: "54%",
    },
    {
      id: "stomach",
      name: "Stomach",
      system: "Digestive System",
      desc: "Organ responsible for mechanical and chemical digestion of ingested material using gastric acids and enzymes.",
      diseases: ["Gastritis", "GERD"],
      medications: ["Omeprazole", "Pantoprazole"],
      vitals: "Digestion active.",
      color: "#F97316",
      top: "42%", left: "50%",
    },
    {
      id: "liver",
      name: "Liver",
      system: "Digestive System",
      desc: "Metabolic factory that detoxifies blood, produces bile for digestion, and stores glycogen for energy regulation.",
      diseases: ["Hepatitis", "Cirrhosis"],
      medications: ["Tenofovir"],
      vitals: "Enzymes optimal.",
      color: "#B45309",
      top: "40%", left: "43%",
    },
  ];

  const filtered = useMemo(() =>
    anatomyData.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  return (
    <div className="body-visualizer-page">
      <div className="body-container">

        <header className="body-header">
          <h1><FiTarget /> Body<span>Visualizer</span></h1>
          <div className="search-wrap">
            <i><FiSearch /></i>
            <input
              type="text"
              className="body-search"
              placeholder="Search anatomy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="body-layout-grid">
          
          <main className="visualizer-card">
            <div className="model-stage">
              <svg viewBox="0 0 100 200" style={{ height: '100%', width: '100%' }}>
                <path
                  d="M50,10 C55,10 60,15 60,25 C60,35 55,40 50,40 C45,40 40,35 40,25 C40,15 45,10 50,10 M40,40 L60,40 L70,100 L60,180 L40,180 L30,100 Z"
                  fill="#f1f5f9"
                />
              </svg>

              {filtered.map(organ => (
                <div
                  key={organ.id}
                  className={`hotspot ${selectedOrgan?.id === organ.id ? 'active' : ''}`}
                  style={{ top: organ.top, left: organ.left, backgroundColor: organ.color }}
                  onClick={() => setSelectedOrgan(organ)}
                ></div>
              ))}
            </div>

            <div className="legend-card">
               <div className="legend-item"><div className="legend-dot" style={{ background: '#3B82F6' }}></div> Nervous</div>
               <div className="legend-item"><div className="legend-dot" style={{ background: '#EF4444' }}></div> Circulatory</div>
               <div className="legend-item"><div className="legend-dot" style={{ background: '#14B8A6' }}></div> Respiratory</div>
               <div className="legend-item"><div className="legend-dot" style={{ background: '#F97316' }}></div> Digestive</div>
            </div>
          </main>

          <aside className="organ-details-view">
            <AnimatePresence mode="wait">
              {!selectedOrgan ? (
                <div className="empty-details-state">
                  <FiInfo size={48} style={{ marginBottom: '20px', opacity: 0.2 }} />
                  <h3>Interactive Anatomy</h3>
                  <p>Select a region on the biological model to view telemetry data and AI insights.</p>
                </div>
              ) : (
                <motion.div
                  key={selectedOrgan.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}
                >
                  <section className="organ-hero-card">
                    <span className="organ-tag">{selectedOrgan.system}</span>
                    <h2 className="organ-title">{selectedOrgan.name}</h2>
                    <p className="organ-desc">{selectedOrgan.desc}</p>
                    <div className="diag-pill">
                      <FiActivity /> {selectedOrgan.vitals}
                    </div>
                  </section>

                  <div className="info-box">
                    <h4><FiAlertCircle style={{ color: '#EF4444' }} /> Common Conditions</h4>
                    <div className="pill-list">
                      {selectedOrgan.diseases.map(d => (
                        <span key={d} className="data-pill">{d}</span>
                      ))}
                    </div>
                  </div>

                  <div className="info-box">
                    <h4><FiZap style={{ color: '#3B82F6' }} /> Targeted Medications</h4>
                    <div className="pill-list">
                      {selectedOrgan.medications.map(m => (
                        <span key={m} className="data-pill">{m}</span>
                      ))}
                    </div>
                  </div>

                  <a href="#" className="btn-ai-specialist">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <FiShield size={24} />
                      <div>
                        <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Expert Query</span>
                        <span>Ask AI Specialist</span>
                      </div>
                    </div>
                    <FiChevronRight size={24} />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

        </div>

      </div>
    </div>
  );
};

export default BodyVisualizer3D;
