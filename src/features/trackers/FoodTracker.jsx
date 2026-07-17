import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiZap,
  FiPieChart,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiActivity,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { Utensils } from "lucide-react";
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

import "../../styles/foodTracker.css";

const FoodTracker = () => {
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
    await deleteDoc(doc(db, "food_logs", id));
  };

  const totals = foods.reduce((acc, curr) => ({
    calories: acc.calories + curr.calories,
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fat: acc.fat + curr.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const progress = Math.min((totals.calories / targetCalories) * 100, 100);

  return (
    <div className="food-tracker-page">
      <div className="food-container">

        <header className="food-header">
          <h1>Nutri<span>Log</span> AI</h1>
          <button className="btn-log" onClick={() => setShowAdd(true)}>
            <FiPlus /> Log Meal
          </button>
        </header>

        <section className="nutri-summary-card">
          <div className="calorie-circle-wrap">
            <svg className="calorie-circle-svg">
              <circle cx="50%" cy="50%" r="45%" className="circle-bg" />
              <motion.circle
                cx="50%" cy="50%" r="45%"
                className="circle-progress"
                initial={{ strokeDasharray: "0 1000" }}
                animate={{ strokeDasharray: `${progress * 2.83} 1000` }}
              />
            </svg>
            <div className="circle-content">
              <span className="circle-val">{totals.calories}</span>
              <span className="circle-label">kcal</span>
            </div>
          </div>

          <div className="macros-summary-grid">
            <div className="macro-box protein">
              <p className="macro-label">Protein</p>
              <h4 className="macro-val">{totals.protein}g</h4>
            </div>
            <div className="macro-box carbs">
              <p className="macro-label">Carbs</p>
              <h4 className="macro-val">{totals.carbs}g</h4>
            </div>
            <div className="macro-box fat">
              <p className="macro-label">Fat</p>
              <h4 className="macro-val">{totals.fat}g</h4>
            </div>
          </div>
        </section>

        <section className="ai-nutritionist-card">
          <div className="ai-badge">AI Nutrition Intelligence</div>
          <p className="ai-insight-text">
            {totals.calories === 0 ? "Start logging meals for a personalized metabolic analysis." :
             totals.protein < 50 ? "Your protein intake is below optimal levels for muscle synthesis. AI recommends lean meats or legumes." :
             "Nutrient distribution looks stable. You are 75% on track for your daily caloric balance."}
          </p>
        </section>

        <div className="food-content-layout">
          <section className="meal-history-section">
            <h2>Today's Intake</h2>
            <div className="meal-list">
              {foods.map(food => (
                <div key={food.id} className="meal-card">
                  <div className="meal-info">
                    <h4>{food.name}</h4>
                    <p className="meal-meta">{food.mealType} • P:{food.protein}g C:{food.carbs}g F:{food.fat}g</p>
                  </div>
                  <div className="meal-stats">
                    <span className="meal-calories">{food.calories} kcal</span>
                    <button onClick={() => deleteFood(food.id)} style={{ marginLeft: '15px', color: '#EF4444', background: 'none', border: 'none' }}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
              {foods.length === 0 && <p style={{ color: '#94A3B8', textAlign: 'center', padding: '40px' }}>No meals logged yet.</p>}
            </div>
          </section>

          <aside className="food-sidebar-stats">
             <div className="info-card light" style={{ background: 'white', borderRadius: '32px', padding: '30px', border: '1px solid #F1F5F9' }}>
                <h3 style={{ fontWeight: 900, marginBottom: '20px' }}>Goal Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
                      <span>Calorie Burn</span>
                      <span>1,850 kcal</span>
                   </div>
                   <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: '80%', height: '100%', background: '#F97316' }}></div>
                   </div>
                </div>
             </div>
          </aside>
        </div>

        <AnimatePresence>
          {showAdd && (
            <div className="modal-overlay">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-card">
                <button className="btn-close" onClick={() => setShowAdd(false)}><FiX /></button>
                <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '40px' }}>Log New Meal</h2>
                <form onSubmit={handleAdd}>
                  <div className="form-group">
                    <label>Meal / Item Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label>Calories (kcal)</label>
                      <input type="number" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Meal Type</label>
                      <select value={formData.mealType} onChange={e => setFormData({...formData, mealType: e.target.value})}>
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snacks</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
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
                  <button type="submit" className="btn-log" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}>Save Entry</button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default FoodTracker;
