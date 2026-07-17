import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiClock,
  FiTrash2,
  FiCheckCircle,
  FiCalendar,
  FiAlertCircle,
  FiZap,
  FiBell,
  FiMoreVertical,
  FiSun,
  FiMoon,
  FiSunrise,
} from "react-icons/fi";
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

const MedicineReminder = () => {
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

    const q = query(
      collection(db, "medicine_reminders"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReminders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.time) return;

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
      showToast("Reminder scheduled successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTaken = async (reminder) => {
    try {
      await updateDoc(doc(db, "medicine_reminders", reminder.id), {
        taken: !reminder.taken,
        lastTaken: !reminder.taken ? serverTimestamp() : null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await deleteDoc(doc(db, "medicine_reminders", id));
      showToast("Reminder deleted.");
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeIcon = (time) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour < 12) return <FiSunrise className="text-orange-400" />;
    if (hour < 18) return <FiSun className="text-yellow-500" />;
    return <FiMoon className="text-indigo-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <FiClock className="text-blue-600" /> MedSchedule
            </h1>
            <p className="text-slate-500 font-medium">Manage your daily medication and health rituals.</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 flex items-center gap-2 hover:bg-blue-700 transition-all"
          >
            <FiPlus /> ADD MEDICINE
          </button>
        </header>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Calendar Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Calendar</h3>
                <FiCalendar className="text-blue-600" />
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <span key={d} className="text-[10px] font-black text-slate-400 uppercase">{d}</span>
                ))}
                {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl cursor-pointer transition-all ${i + 1 === new Date().getDate() ? "bg-blue-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden">
               <FiZap className="text-4xl opacity-20 absolute -right-4 -bottom-4 rotate-12" />
               <h4 className="text-xl font-black">AI Insights</h4>
               <p className="text-blue-100 text-sm font-medium">Based on your logs, morning doses are 95% consistent. Keep it up!</p>
            </div>
          </div>

          {/* Reminders List */}
          <div className="md:col-span-8 space-y-4">
            <AnimatePresence>
              {reminders.map((med) => (
                <motion.div
                  key={med.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border transition-all flex items-center gap-6 group ${med.taken ? "border-emerald-200 dark:border-emerald-900/30 opacity-60" : "border-slate-200 dark:border-slate-800 shadow-sm"}`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${med.taken ? "bg-emerald-100 text-emerald-600" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600"}`}>
                    {getTimeIcon(med.time)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-xl font-black truncate ${med.taken ? "text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}>
                        {med.name}
                      </h4>
                      {med.taken && <FiCheckCircle className="text-emerald-500" />}
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FiClock className="text-blue-500" /> {med.time} • {med.dosage} • {med.frequency}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaken(med)}
                      className={`px-6 py-3 rounded-xl font-black text-xs transition-all ${med.taken ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white"}`}
                    >
                      {med.taken ? "TAKEN" : "MARK TAKEN"}
                    </button>
                    <button
                      onClick={() => deleteReminder(med.id)}
                      className="p-3 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {reminders.length === 0 && (
              <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                <FiBell size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-2xl font-black text-slate-400">No Reminders Set</h3>
                <p className="text-slate-400 mt-2">Add your first medicine to stay on top of your health.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-10 relative">
              <button onClick={() => setShowAdd(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white"><FiPlus className="rotate-45 text-2xl" /></button>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Schedule Med</h2>

              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Medicine Name</label>
                  <input type="text" required placeholder="e.g. Paracetamol" className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Time</label>
                    <input type="time" required className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Dosage</label>
                    <input type="text" placeholder="e.g. 500mg" className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Frequency</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>As Needed</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all mt-4">
                  SAVE REMINDER
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-3 rounded-full font-bold text-sm z-50 shadow-2xl">
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicineReminder;