import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Zap, AlertCircle, Trash2, Activity,
  MessageSquare, TrendingUp, Clock, Shield, Droplets, X, Stethoscope, ChevronRight, HeartPulse
} from "lucide-react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/symptomTracker.css";

const SymptomTracker = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    symptom: "",
    severity: 5,
    notes: "",
    duration: "1 day",
  });

  const symptomOptions = [
    "Fever", "Headache", "Cough", "Cold", "Body Pain",
    "Stomach Pain", "Vomiting", "Diarrhea", "Dizziness",
    "Fatigue", "Chest Pain", "Shortness of Breath", "Sore Throat",
  ];

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "symptom_logs"), where("userId", "==", auth.currentUser.uid), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.symptom || !auth.currentUser) return;
    try {
      await addDoc(collection(db, "symptom_logs"), {
        userId: auth.currentUser.uid,
        ...formData,
        date: new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
      });
      setShowAdd(false);
      setFormData({ symptom: "", severity: 5, notes: "", duration: "1 day" });
    } catch (error) { console.error(error); }
  };

  const deleteLog = async (id) => {
    try {
      await deleteDoc(doc(db, "symptom_logs", id));
    } catch (error) { console.error(error); }
  };

  const getSeverityColor = (val) => {
    if (val < 4) return "#10B981";
    if (val < 8) return "#F97316";
    return "#EF4444";
  };

  const getSeverityLabel = (val) => {
    if (val < 4) return "Mild";
    if (val < 8) return "Moderate";
    return "Critical";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="symptom-tracker-page">
      <div className="page-container">

        <header className="ai-module-header">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-main"><HeartPulse className="text-red-500" size={32} /> SymptomFlow AI</h1>
            <p>Chronological biometric variance logging and Gemini medical triage.</p>
          </motion.div>
          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => setShowAdd(true)}
            className="btn-primary"
            style={{ backgroundColor: '#EF4444' }}
          >
            <Plus size={18} /> Register Event
          </motion.button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">

          <div className="lg:col-span-8">
             <section className="timeline-premium space-y-8">
                <AnimatePresence mode="popLayout">
                   {logs.map((log, index) => (
                     <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="symptom-card-premium"
                     >
                        <div className="severity-dot" style={{ backgroundColor: getSeverityColor(log.severity) }} />

                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-4">
                              <h4 className="text-2xl font-black text-main">{log.symptom}</h4>
                              <span className="severity-pill" style={{ backgroundColor: getSeverityColor(log.severity) }}>
                                {getSeverityLabel(log.severity)} : {log.severity}/10
                              </span>
                           </div>
                           <button onClick={() => deleteLog(log.id)} className="p-2 text-muted hover:text-red-500 transition-all rounded-xl hover:bg-red-50"><Trash2 size={18} /></button>
                        </div>

                        <p className="text-main leading-relaxed font-medium text-lg">{log.notes || "Clinical metadata not provided for this biological variance event."}</p>

                        <div className="log-meta">
                           <span className="meta-info"><Clock size={14} className="text-red-500" /> Duration: {log.duration}</span>
                           <span className="meta-info"><Activity size={14} className="text-red-500" /> Biometric ID: {log.id.slice(0,8).toUpperCase()}</span>
                           <span className="meta-info"><Shield size={14} className="text-red-500" /> AI Triage Synced</span>
                        </div>
                     </motion.div>
                   ))}
                </AnimatePresence>

                {logs.length === 0 && (
                  <div className="py-40 text-center card border-dashed border-2 bg-transparent shadow-none opacity-40">
                     <Activity size={64} className="mx-auto mb-6 text-muted" />
                     <h3 className="text-2xl font-black uppercase tracking-[4px]">Telemetry Optimal</h3>
                     <p className="font-bold mt-2">Log initial biological variance to enable AI medical triage.</p>
                  </div>
                )}
             </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
             <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="ai-triage-card">
                <div className="triage-glow"></div>
                <div className="triage-content">
                   <div className="icon-box-red mb-8">
                      <Zap size={24} />
                   </div>
                   <h3 className="text-3xl font-black mb-6 tracking-tight">Clinical Guidance</h3>

                   <div className="p-6 bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 backdrop-blur-md mb-10">
                      <p className="text-base font-medium leading-relaxed text-slate-300">
                         {logs.length === 0 ? "Identify biometric variance by logging initial health events. Gemini AI medical triage is on standby." :
                          logs[0].severity > 7 ? "AI CRITICAL ALERT: Extreme intensity logged. Prioritize immediate professional medical consultation. Monitor for auxiliary symptoms." :
                          "Protocol stable. Heuristic models suggest regular metabolic hydration and rest intervals. Continue monitoring intensity deltas."}
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[3px] text-slate-500 mb-4">Heuristic Directives</h4>
                      {[
                        { icon: <Droplets size={16} />, text: "Increase hydration (2.5L+)" },
                        { icon: <Clock size={16} />, text: "Refresh telemetry (240m)" },
                        { icon: <Shield size={16} />, text: "Suspend strenuous activity" },
                      ].map((step, i) => (
                        <div key={i} className="directive-pill">
                           <div className="w-8 h-8 rounded-lg bg-white bg-opacity-5 flex items-center justify-center text-red-500 border border-white border-opacity-5">{step.icon}</div>
                           <span className="text-sm font-bold text-slate-300">{step.text}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </motion.section>

             <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="card p-8 border-none shadow-premium">
                <h3 className="text-lg font-black text-main mb-8 flex items-center gap-3"><TrendingUp size={18} className="text-red-500" /> Variance Trends</h3>
                <div className="trend-visual">
                   {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
                     <div key={i} className="bar-segment">
                        <motion.div
                           initial={{ height: 0 }}
                           animate={{ height: `${h}%` }}
                           className="bar-fill"
                           style={{ backgroundColor: getSeverityColor(h / 10) }}
                        />
                     </div>
                   ))}
                </div>
                <div className="flex justify-between mt-6 text-[10px] font-black text-muted uppercase tracking-[2px]">
                   <span>Day 01</span>
                   <span>Day 07</span>
                </div>
             </motion.div>
          </aside>

        </div>

        <AnimatePresence>
          {showAdd && (
            <div className="modal-overlay fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-950 bg-opacity-95 backdrop-blur-xl">
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card w-full max-w-xl p-10 md:p-14 relative border-none shadow-premium rounded-[40px]">
                  <button onClick={() => setShowAdd(false)} className="absolute top-8 right-8 text-muted hover:text-main p-3 rounded-2xl hover:bg-bg-color transition-all"><X size={28} /></button>
                  <h2 className="text-4xl font-black mb-10 tracking-tighter">Register Event</h2>
                  <form onSubmit={handleAdd} className="space-y-8">
                     <div className="form-group">
                        <label>Biological Variance</label>
                        <select required value={formData.symptom} onChange={e => setFormData({...formData, symptom: e.target.value})}>
                          <option value="">Select Symptom</option>
                          {symptomOptions.map(s => <option key={s}>{s}</option>)}
                          <option>Other / auxiliary</option>
                        </select>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="font-black text-xs uppercase tracking-widest text-muted">Intensity Delta</label>
                          <span className="text-xs font-black px-4 py-1.5 rounded-xl text-white shadow-lg" style={{ backgroundColor: getSeverityColor(formData.severity) }}>
                            {getSeverityLabel(formData.severity)} : {formData.severity}/10
                          </span>
                        </div>
                        <input type="range" min="1" max="10" step="1" className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-red-600" value={formData.severity} onChange={e => setFormData({...formData, severity: Number(e.target.value)})} />
                     </div>
                     <div className="form-group">
                        <label>Auxiliary Observations</label>
                        <textarea rows="3" placeholder="Identify environmental triggers or auxiliary observations..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                     </div>
                     <button type="submit" className="btn-primary w-full py-6 rounded-[2rem] font-black text-sm shadow-2xl mt-4 uppercase tracking-[4px]" style={{ backgroundColor: '#EF4444' }}>TRANSMIT PROTOCOL</button>
                  </form>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SymptomTracker;
