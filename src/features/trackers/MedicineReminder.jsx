import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Clock, Trash2, CheckCircle, Calendar as CalendarIcon,
  Zap, Bell, Sun, Moon, Sunrise, X, Pill, AlertCircle, ChevronRight, Activity, TrendingUp
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
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/medicineReminder.css";

const MedicineReminder = () => {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    time: "",
    frequency: "Daily",
    type: "Pill",
  });
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "medicine_reminders"), where("userId", "==", auth.currentUser.uid), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReminders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.time || !auth.currentUser) return;
    try {
      await addDoc(collection(db, "medicine_reminders"), {
        userId: auth.currentUser.uid,
        ...formData,
        taken: false,
        lastTaken: null,
        createdAt: serverTimestamp(),
      });
      setShowAdd(false);
      setFormData({ name: "", dosage: "", time: "", frequency: "Daily", type: "Pill" });
      showToast("Protocol scheduled");
    } catch (error) { console.error(error); }
  };

  const toggleTaken = async (reminder) => {
    try {
      await updateDoc(doc(db, "medicine_reminders", reminder.id), {
        taken: !reminder.taken,
        lastTaken: !reminder.taken ? serverTimestamp() : null,
      });
    } catch (error) { console.error(error); }
  };

  const deleteReminder = async (id) => {
    try {
      await deleteDoc(doc(db, "medicine_reminders", id));
      showToast("Protocol removed");
    } catch (error) { console.error(error); }
  };

  const getTimeIcon = (time) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour < 12) return <Sunrise className="text-orange-400" size={32} />;
    if (hour < 18) return <Sun className="text-yellow-500" size={32} />;
    return <Moon className="text-indigo-400" size={32} />;
  };

  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        num: d.getDate(),
        isToday: i === 0
      });
    }
    return days;
  };

  return (
    <div className="medicine-reminder-page">
      <div className="page-container">

        <header className="ai-module-header">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-main"><Activity className="text-primary" size={32} /> MedSchedule AI</h1>
            <p>Pharmaceutical administration protocols and adherence tracking.</p>
          </motion.div>
          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => setShowAdd(true)}
            className="btn-primary"
          >
            <Plus size={18} /> Schedule Med
          </motion.button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">

          <aside className="lg:col-span-4 space-y-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="calendar-card">
              <div className="calendar-header">
                <h3 className="text-lg font-black text-main">Chronometer</h3>
                <CalendarIcon className="text-primary" size={20} />
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getWeekDays().map((d, i) => (
                  <div key={i} className={`day-slot ${d.isToday ? 'active' : ''}`}>
                    <span>{d.name}</span>
                    <strong>{d.num}</strong>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="insight-card">
              <div className="insight-glow"></div>
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-8 flex items-center gap-3"><Zap className="text-primary" size={24} /> Bio-Insights</h4>

                <div className="stat-item">
                  <div className="stat-circle"><TrendingUp size={20} /></div>
                  <div className="stat-info">
                    <span>Adherence</span>
                    <strong>94.8%</strong>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-circle"><Bell size={20} /></div>
                  <div className="stat-info">
                    <span>Next Due</span>
                    <strong>14:30 PM</strong>
                  </div>
                </div>

                <p className="text-slate-400 text-sm mt-8 leading-relaxed font-medium">Protocol adherence is optimal. Gemini AI confirms therapeutic stability based on current dosing consistency.</p>
              </div>
            </motion.div>
          </aside>

          <main className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {reminders.map((med, index) => (
                <motion.div
                  key={med.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`medicine-card-premium ${med.taken ? 'taken' : ''}`}
                >
                  <div className="icon-container">
                    {getTimeIcon(med.time)}
                  </div>

                  <div className="flex-1 med-info">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={med.taken ? 'line-through opacity-50' : ''}>{med.name}</h4>
                      {med.taken && <CheckCircle className="text-primary" size={18} />}
                    </div>
                    <div className="med-meta">
                       <span className="meta-pill"><Clock size={12} /> {med.time}</span>
                       <span className="meta-pill"><Pill size={12} /> {med.dosage}</span>
                       <span className="meta-pill"><Activity size={12} /> {med.frequency}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTaken(med)}
                      className={`btn-action-med ${med.taken ? 'completed' : 'mark'}`}
                    >
                      {med.taken ? "Completed" : "Mark Taken"}
                    </button>
                    <button
                      onClick={() => deleteReminder(med.id)}
                      className="p-3 text-muted hover:text-red-500 transition-all rounded-xl hover:bg-red-50"
                    >
                       <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {reminders.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="py-32 text-center card border-dashed border-2 bg-transparent shadow-none">
                <Bell size={64} className="mx-auto text-muted mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-[4px]">No Protocols Active</h3>
                <p className="text-sm font-bold text-muted mt-2">Initialize your medication schedule to sync with AI Health hub.</p>
              </motion.div>
            )}
          </main>
        </div>

        <AnimatePresence>
          {showAdd && (
            <div className="modal-overlay fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-950 bg-opacity-90 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card w-full max-w-lg p-10 md:p-14 relative border-none shadow-premium rounded-[40px]">
                <button onClick={() => setShowAdd(false)} className="absolute top-8 right-8 text-muted hover:text-main p-2 rounded-xl hover:bg-bg-color transition-all"><X size={28} /></button>
                <h2 className="text-4xl font-black mb-10 tracking-tighter">Schedule Med</h2>
                <form onSubmit={handleAdd} className="space-y-8">
                  <div className="form-group">
                    <label>Identification</label>
                    <input type="text" required placeholder="Molecular / Compound name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="form-group">
                      <label>Administer Time</label>
                      <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Dosage Unit</label>
                      <input type="text" placeholder="e.g. 500mg / 5ml" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Administer Frequency</label>
                    <select value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>As Required (S.O.S)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full py-6 rounded-[2rem] font-black shadow-2xl tracking-[2px]">COMMENCE PROTOCOL</button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs tracking-widest z-[1200] shadow-premium flex items-center gap-3">
              <CheckCircle size={16} className="text-primary" /> {toast.toUpperCase()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicineReminder;
