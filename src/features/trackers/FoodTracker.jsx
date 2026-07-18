import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Zap, PieChart, Trash2, Search, ChevronDown,
  Activity, CheckCircle, X, Utensils, Sparkles, TrendingUp
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
import "../../styles/foodTracker.css";

const FoodTracker = () => {
  const { t } = useLanguage();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    mealType: "Breakfast",
  });

  const targetCalories = 2200;

  useEffect(() => {
    if (!auth.currentUser) return;
    const today = new Date().toISOString().split("T")[0];
    const q = query(
      collection(db, "food_logs"),
      where("userId", "==", auth.currentUser.uid),
      where("date", "==", today),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFoods(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "food_logs"), {
        userId: auth.currentUser.uid,
        ...formData,
        calories: Number(formData.calories),
        protein: Number(formData.protein || 0),
        carbs: Number(formData.carbs || 0),
        fat: Number(formData.fat || 0),
        date: new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
      });
      setShowAdd(false);
      setFormData({ name: "", calories: "", protein: "", carbs: "", fat: "", mealType: "Breakfast" });
    } catch (error) { console.error(error); }
  };

  const deleteFood = async (id) => {
    try {
      await deleteDoc(doc(db, "food_logs", id));
    } catch (error) { console.error(error); }
  };

  const totals = foods.reduce((acc, curr) => ({
    calories: acc.calories + curr.calories,
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fat: acc.fat + curr.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const progress = Math.min((totals.calories / targetCalories) * 100, 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="food-tracker-page min-h-screen bg-bg-color">
      <div className="page-container">

        <header className="ai-module-header">
          <div className="flex items-center gap-4">
             <Utensils className="text-orange-500" size={38} />
             <h1 className="font-black">Nutri<span>Log</span> AI</h1>
          </div>
          <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)', boxShadow: '0 8px 25px rgba(249, 115, 22, 0.25)' }} onClick={() => setShowAdd(true)}>
            <Plus size={18} /> {t('foodTracker')}
          </button>
        </header>

        <section className="nutri-summary-card card p-12 relative overflow-hidden mb-12 border-none">
          <div className="calorie-circle-wrap relative w-56 h-56 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" strokeWidth="8" fill="none" stroke="var(--bg-color)" />
              <motion.circle
                cx="50" cy="50" r="44" strokeWidth="8" fill="none" stroke="#F97316" strokeLinecap="round"
                initial={{ strokeDasharray: "0 276.46" }}
                animate={{ strokeDasharray: `${(progress / 100) * 276.46} 276.46` }}
                transition={{ duration: 1.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black tracking-tighter text-main">{totals.calories}</span>
              <span className="text-xs font-black text-muted uppercase tracking-widest mt-1">KCAL LOGGED</span>
            </div>
          </div>

          <div className="macros-summary-grid grid grid-cols-3 gap-8 w-full">
            {[
              { label: "Protein", val: totals.protein, unit: "g", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.08)" },
              { label: "Carbs", val: totals.carbs, unit: "g", color: "#F97316", bg: "rgba(249, 115, 22, 0.08)" },
              { label: "Fat", val: totals.fat, unit: "g", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)" }
            ].map((m, i) => (
              <div key={i} className="macro-box p-8 rounded-[32px] text-center transition-transform hover:scale-105 border-none" style={{ background: m.bg }}>
                <p className="text-[10px] font-black uppercase text-muted tracking-[2px] mb-2">{m.label}</p>
                <h4 className="text-3xl font-black text-main">{m.val}{m.unit}</h4>
              </div>
            ))}
          </div>
        </section>

        <section className="ai-nutritionist-card p-12 bg-slate-900 border-none shadow-2xl relative overflow-hidden rounded-[40px] mb-16">
          <Sparkles className="absolute -right-6 -top-6 text-9xl opacity-5 rotate-12 text-white" />
          <div className="badge badge-primary mb-8 bg-orange-500 bg-opacity-20 text-orange-400 border-orange-500 border-opacity-20 px-6 py-2">
             <Sparkles size={14} /> AI Nutrition Insight
          </div>
          <p className="text-2xl font-medium leading-relaxed text-slate-300 max-w-4xl">
            {totals.calories === 0 ? "Identify metabolic markers by logging your initial nutrient payload. Gemini AI is on standby for heuristic analysis." :
             totals.protein < 50 ? "Your protein delta is currently sub-optimal for cellular synthesis. Immediate administration of lean amino acids or high-density legumes is suggested." :
             "Nutrient distribution equilibrium established. You are 88% synchronized with your daily thermodynamic balance protocols."}
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2">
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
               <Activity className="text-orange-500" size={32} /> Daily Fuel Registry
            </h2>
            <div className="meal-list space-y-4">
              <AnimatePresence>
                {foods.map(food => (
                  <motion.div key={food.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="meal-card card flex justify-between items-center p-8 border-l-[8px]" style={{ borderLeftColor: '#F97316' }}>
                    <div className="meal-info">
                      <div className="badge badge-secondary mb-3 bg-orange-50 text-orange-600 border-none">{food.mealType}</div>
                      <h4 className="text-2xl font-black text-main">{food.name}</h4>
                      <div className="flex gap-6 mt-3">
                         <span className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">P: <strong className="text-main">{food.protein}g</strong></span>
                         <span className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">C: <strong className="text-main">{food.carbs}g</strong></span>
                         <span className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">F: <strong className="text-main">{food.fat}g</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className="text-2xl font-black text-orange-500">{food.calories}<small className="text-[10px] ml-1 uppercase">Kcal</small></span>
                      <button onClick={() => deleteFood(food.id)} className="w-14 h-14 flex items-center justify-center rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all text-muted opacity-40 hover:opacity-100"><Trash2 size={22} /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {foods.length === 0 && (
                <div className="py-32 text-center opacity-30 border-2 border-dashed border-border rounded-[40px]">
                   <Utensils size={64} className="mx-auto mb-6" />
                   <h3 className="text-2xl font-black uppercase tracking-[4px]">Fuel Log Empty</h3>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-8">
             <div className="card p-10 bg-gradient-to-br from-card-bg to-bg-color">
                <h3 className="text-xl font-black mb-8 border-b border-border pb-4 flex items-center gap-3"><TrendingUp size={20} className="text-orange-500" /> Goal Distribution</h3>
                <div className="space-y-10">
                   <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                         <span>Calorie Intake</span>
                         <span className="text-orange-500">{totals.calories} / {targetCalories}</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-orange-500" />
                      </div>
                   </div>
                   <div className="p-6 bg-orange-500 bg-opacity-5 rounded-3xl border border-orange-500 border-opacity-10 flex gap-5 items-center">
                      <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <CheckCircle size={24} />
                      </div>
                      <p className="text-sm font-bold text-orange-800 dark:text-orange-400 leading-relaxed">Thermodynamic goals for protein synthesis are 92% complete.</p>
                   </div>
                </div>
             </div>
          </aside>
        </div>

        <AnimatePresence>
          {showAdd && (
            <div className="modal-overlay fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-950 bg-opacity-90 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card w-full max-w-xl p-12 relative border-none shadow-2xl">
                <button className="absolute top-8 right-8 text-muted hover:text-main p-2 rounded-xl hover:bg-bg-color transition-all" onClick={() => setShowAdd(false)} aria-label="Close"><X size={28} /></button>
                <h2 className="text-4xl font-black mb-10 tracking-tighter">Fuel Entry</h2>
                <form onSubmit={handleAdd} className="space-y-8">
                  <div className="form-group">
                    <label>Nutrient Payload Source</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Heuristic Balanced Meal" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="form-group">
                      <label>Energy (kcal)</label>
                      <input type="number" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Chronological Slot</label>
                      <select value={formData.mealType} onChange={e => setFormData({...formData, mealType: e.target.value})}>
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Supplementary</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="form-group">
                      <label>Protein (g)</label>
                      <input type="number" value={formData.protein} onChange={e => setFormData({...formData, protein: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Carbs (g)</label>
                      <input type="number" value={formData.carbs} onChange={e => setFormData({...formData, carbs: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Fat (g)</label>
                      <input type="number" value={formData.fat} onChange={e => setFormData({...formData, fat: e.target.value})} />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full py-6 mt-4 flex justify-center text-sm uppercase tracking-[4px] shadow-2xl" style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}>REGISTER FUEL</button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default FoodTracker;
