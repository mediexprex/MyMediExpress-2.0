import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplet, Plus, Zap, Info, TrendingUp, Target,
  Trash2, ChevronRight, Clock, RefreshCw, History as HistoryIcon,
  Award, Flame
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
import "../../styles/waterTracker.css";

const WaterTracker = () => {
  const { t } = useLanguage();
  const [totalIntake, setTotalIntake] = useState(0);
  const [logs, setLogs] = useState([]);
  const [goal, setGoal] = useState(2500);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const today = new Date().toISOString().split("T")[0];
    const q = query(
      collection(db, "water_logs"),
      where("userId", "==", auth.currentUser.uid),
      where("date", "==", today),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      const historyItems = [];
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        total += data.amount;
        historyItems.push(data);
      });
      setTotalIntake(total);
      setLogs(historyItems);
      setLoading(false);
      setRefreshing(false);
    });
    return unsubscribe;
  }, []);

  const addIntake = async (amount) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "water_logs"), {
        userId: auth.currentUser.uid,
        amount,
        date: new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
      });
    } catch (error) { console.error(error); }
  };

  const deleteLog = async (id) => {
    try {
      await deleteDoc(doc(db, "water_logs", id));
    } catch (error) { console.error(error); }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const progress = Math.min((totalIntake / goal) * 100, 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="water-tracker-page min-h-screen bg-bg-color">
      <div className="page-container">

        <header className="ai-module-header">
          <div className="flex items-center gap-4">
             <Droplet className="text-primary" size={38} />
             <h1 className="font-black">Hydro<span>Track</span> AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleRefresh} className={`p-3 rounded-full hover:bg-white transition-all shadow-sm border border-border ${refreshing ? 'animate-spin' : ''}`}>
              <RefreshCw size={18} />
            </button>
            <div className="goal-pill flex items-center gap-4 card py-3 px-6 shadow-sm border-none">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Daily Objective</span>
              <strong className="text-lg font-black">{goal}ml</strong>
              <button className="text-xs font-black text-primary hover:text-primary-dark transition-colors uppercase">Edit</button>
            </div>
          </div>
        </header>

        <section className="hydration-hero">
          <div className="progress-card card relative overflow-hidden">
            <div className="mx-auto relative w-72 h-72 mb-10 mt-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" className="circle-bg" strokeWidth="8" fill="none" stroke="var(--bg-color)" />
                <motion.circle
                  cx="50" cy="50" r="44"
                  className="circle-progress"
                  strokeWidth="8"
                  fill="none"
                  stroke="var(--secondary-color)"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 276.46" }}
                  animate={{ strokeDasharray: `${(progress / 100) * 276.46} 276.46` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-6xl font-black tracking-tighter text-main">{Math.round(progress)}%</span>
                <div className="flex items-center gap-2 mt-1">
                   <Droplet size={14} className="text-secondary" fill="currentColor" />
                   <span className="text-sm font-bold text-muted">{totalIntake}ml consumed</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[250, 500, 1000].map(amt => (
                <button key={amt} className="btn-secondary group flex flex-col items-center gap-2 py-6 rounded-3xl border-2 hover:border-secondary" onClick={() => addIntake(amt)}>
                  <Plus className="group-hover:scale-125 transition-transform" size={20} />
                  <span className="text-sm font-black tracking-widest">{amt}ML</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-hydration-card flex flex-col justify-center bg-slate-900 border-none shadow-2xl relative overflow-hidden">
            <Zap className="absolute -right-10 -top-10 text-[200px] text-white opacity-5 rotate-12" />
            <div className="w-14 h-14 bg-primary bg-opacity-20 rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary border-opacity-20">
              <Zap size={28} />
            </div>
            <h4 className="text-3xl font-black text-white mb-4 tracking-tight">Hydration AI Analysis</h4>
            <p className="text-slate-400 leading-relaxed mb-10 text-lg font-medium">
              {progress < 30 ? "Critical hydration deficit identified. Heuristic models indicate possible cognitive fatigue. Immediate administration of 500ml recommended." :
               progress < 70 ? "Protocol stable. Cellular saturation is within nominal ranges. Maintain incremental intake for optimal performance." :
               "Peak homeostasis attained. Biological telemetry confirms optimal cellular hydration and metabolic efficiency."}
            </p>
            <div className="milestone-box p-6 bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 backdrop-blur-md">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary bg-opacity-20 flex items-center justify-center text-primary shadow-inner">
                    <Target size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] mb-1">Biological Target</p>
                    <p className="font-black text-white text-lg">3000ml (Hydration Pro)</p>
                  </div>
                  <ChevronRight size={24} className="ml-auto text-slate-700" />
               </div>
            </div>
          </div>
        </section>

        <section className="logs-section mt-16">
          <div className="flex justify-between items-center mb-12 border-b border-border pb-8">
            <h2 className="text-3xl font-black flex items-center gap-4">
              <HistoryIcon size={32} className="text-primary" /> Synchronized History
            </h2>
            <div className="flex gap-4">
               <div className="badge badge-primary"><Award size={14} /> 5 Day Streak</div>
               <div className="badge badge-secondary"><Flame size={14} /> Peak Intake Today</div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence>
              {logs.map(log => (
                <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} className="card flex justify-between items-center p-6 border-l-[6px] border-secondary">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-secondary bg-opacity-10 text-secondary rounded-2xl flex items-center justify-center shadow-inner">
                      <Droplet size={24} />
                    </div>
                    <div>
                      <span className="block font-black text-2xl text-main">{log.amount} ml</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-muted" />
                        <p className="text-xs text-muted font-bold uppercase tracking-widest">
                          Logged at {new Date(log.createdAt?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="p-4 rounded-2xl text-muted hover:text-red-500 hover:bg-red-50 transition-all" onClick={() => deleteLog(log.id)} aria-label="Delete Entry">
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {logs.length === 0 && (
              <div className="col-span-full py-32 text-center opacity-30 border-2 border-dashed border-border rounded-[40px]">
                <Droplet size={64} className="mx-auto mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-[4px]">Telemetry Clear</h3>
              </div>
            )}
          </div>
        </section>

      </div>
    </motion.div>
  );
};

export default WaterTracker;
