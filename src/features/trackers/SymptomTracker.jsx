import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiZap,
  FiAlertCircle,
  FiTrash2,
  FiActivity,
  FiMessageSquare,
  FiTrendingUp,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { Stethoscope } from "lucide-react";
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

const SymptomTracker = () => {
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

    const q = query(
      collection(db, "symptom_logs"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.symptom) return;

    try {
      await addDoc(collection(db, "symptom_logs"), {
        userId: auth.currentUser.uid,
        ...formData,
        date: new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
      });
      setShowAdd(false);
      setFormData({ symptom: "", severity: 5, notes: "", duration: "1 day" });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLog = async (id) => {
    try {
      await deleteDoc(doc(db, "symptom_logs", id));
    } catch (error) {
      console.error(error);
    }
  };

  const getSeverityColor = (val) => {
    if (val < 4) return "bg-emerald-500";
    if (val < 8) return "bg-orange-500";
    return "bg-red-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <Stethoscope className="text-red-500" /> SymptomFlow AI
            </h1>
            <p className="text-slate-500 font-medium">Log health events and receive Gemini-powered clinical guidance.</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-600/20 flex items-center gap-2 hover:bg-red-700 transition-all"
          >
            <FiPlus /> LOG SYMPTOM
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Timeline View */}
          <div className="lg:col-span-8 space-y-8">
             <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                      <FiActivity className="text-red-500" /> Health Event Timeline
                   </h2>
                   <div className="flex gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                      <span className="w-3 h-3 rounded-full bg-red-600"></span>
                   </div>
                </div>

                <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-12">
                   <AnimatePresence>
                     {logs.map((log) => (
                       <motion.div
                         key={log.id}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="relative pl-10 group"
                       >
                          {/* Dot Marker */}
                          <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-950 ${getSeverityColor(log.severity)} shadow-lg shadow-black/10`} />

                          <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-all hover:border-red-200 dark:hover:border-red-900/30">
                             <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                   <h4 className="text-xl font-black text-slate-900 dark:text-white">{log.symptom}</h4>
                                   <span className={`text-[10px] font-black uppercase text-white px-3 py-1 rounded-full ${getSeverityColor(log.severity)}`}>Severity {log.severity}/10</span>
                                </div>
                                <button onClick={() => deleteLog(log.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><FiTrash2 /></button>
                             </div>
                             <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">{log.notes || "No additional notes recorded."}</p>
                             <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><FiClock /> {log.duration} Duration</span>
                                <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><FiMessageSquare /> AI Reviewed</span>
                             </div>
                          </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>

                   {logs.length === 0 && (
                     <div className="py-20 text-center opacity-30">
                        <Stethoscope size={64} className="mx-auto mb-4" />
                        <p className="font-black text-sm uppercase">Clean Health Slate</p>
                     </div>
                   )}
                </div>
             </section>
          </div>

          {/* AI Guidance Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             <section className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><FiZap size={150} /></div>

                <div className="flex items-center gap-3 mb-10">
                   <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-600/20"><FiZap /></div>
                   <h3 className="text-2xl font-black">AI Health Guidance</h3>
                </div>

                <div className="space-y-8">
                   <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                      <p className="text-slate-300 font-medium leading-loose text-sm">
                         {logs.length === 0 ? "Log any physical discomfort to receive specialized Gemini medical triage analysis." :
                          logs[0].severity > 7 ? "AI Alert: Critical severity logged. Please prioritize professional medical consultation. Monitor for shortness of breath or persistent pain." :
                          "Current symptoms appear manageable. Gemini suggests maintaining hydration and regular rest intervals. Log any changes in intensity."}
                      </p>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Recommended Steps</h4>
                      {[
                        { icon: <FiDroplet />, text: "Increase fluid intake (2.5L+)" },
                        { icon: <FiClock />, text: "Record symptoms every 4 hours" },
                        { icon: <FiShield />, text: "Avoid strenuous physical activity" },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-300">
                           <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-red-400">{step.icon}</div>
                           {step.text}
                        </div>
                      ))}
                   </div>
                </div>
             </section>

             <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Severity Trends</h3>
                <div className="flex items-end gap-2 h-32">
                   {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
                     <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className={`absolute bottom-0 w-full rounded-t-lg ${h > 75 ? "bg-red-500" : h > 50 ? "bg-orange-500" : "bg-emerald-500"}`}
                        />
                     </div>
                   ))}
                </div>
                <div className="flex justify-between mt-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Mon</span>
                   <span>Sun</span>
                </div>
             </div>
          </div>
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] p-10 relative overflow-hidden">
                <button onClick={() => setShowAdd(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"><FiPlus className="rotate-45 text-3xl" /></button>

                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Log Symptom</h2>

                <form onSubmit={handleAdd} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">How do you feel?</label>
                      <select required className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-red-500 outline-none appearance-none" value={formData.symptom} onChange={e => setFormData({...formData, symptom: e.target.value})}>
                        <option value="">Select Symptom</option>
                        {symptomOptions.map(s => <option key={s}>{s}</option>)}
                        <option>Other</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Severity Intensity</label>
                        <span className={`text-xs font-black px-3 py-1 rounded-full text-white ${getSeverityColor(formData.severity)}`}>{formData.severity}/10</span>
                      </div>
                      <input type="range" min="1" max="10" step="1" className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600" value={formData.severity} onChange={e => setFormData({...formData, severity: Number(e.target.value)})} />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Additional Observations</label>
                      <textarea rows="3" placeholder="Describe how it started, specific triggers..." className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-red-500 outline-none" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                   </div>

                   <button type="submit" className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-sm shadow-2xl shadow-red-600/30 hover:bg-red-700 transition-all mt-4 uppercase tracking-widest">
                      LOG TO HEALTH FLOW
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomTracker;