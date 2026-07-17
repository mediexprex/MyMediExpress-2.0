import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDroplet,
  FiPlus,
  FiZap,
  FiInfo,
  FiTrendingUp,
  FiTarget,
  FiTrash2,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";
import { History } from "lucide-react";
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

import "../../styles/waterTracker.css";

const WaterTracker = () => {
  const [totalIntake, setTotalIntake] = useState(0);
  const [logs, setLogs] = useState([]);
  const [goal, setGoal] = useState(2500);
  const [loading, setLoading] = useState(true);

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
    });
    return unsubscribe;
  }, []);

  const addIntake = async (amount) => {
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
    await deleteDoc(doc(db, "water_logs", id));
  };

  const progress = Math.min((totalIntake / goal) * 100, 100);

  return (
    <div className="water-tracker-page">
      <div className="water-container">

        <header className="water-header">
          <h1><FiDroplet /> Hydro<span>Track</span> AI</h1>
          <div className="goal-pill">
            <span>Daily Goal</span>
            <strong>{goal}ml</strong>
            <button className="btn-edit">Edit</button>
          </div>
        </header>

        <section className="hydration-hero">

          <div className="progress-card">
            <div className="water-circle-wrap">
              <svg className="water-circle-svg">
                <circle cx="50%" cy="50%" r="45%" className="circle-bg" />
                <motion.circle
                  cx="50%" cy="50%" r="45%"
                  className="circle-progress"
                  initial={{ strokeDasharray: "0 1000" }}
                  animate={{ strokeDasharray: `${progress * 2.83} 1000` }}
                />
              </svg>
              <div className="circle-inner">
                <span className="percent-text">{Math.round(progress)}%</span>
                <span className="volume-text">{totalIntake}ml</span>
              </div>
            </div>

            <div className="quick-add-grid">
              {[250, 500, 1000].map(amt => (
                <button key={amt} className="btn-add-water" onClick={() => addIntake(amt)}>
                  <FiPlus className="add-icon" />
                  <span>{amt}ml</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-hydration-card">
            <div className="ai-icon-wrap"><FiZap /></div>
            <h4>Hydration AI Insight</h4>
            <p>
              {progress < 30 ? "Significant hydration deficit detected. Your cognitive clarity may be impacted. Drink 500ml now." :
               progress < 70 ? "Stable hydration progress. Maintaining consistent water intake will help stabilize metabolism." :
               "Optimal hydration reached. Your physical performance is supported by peak cellular hydration levels."}
            </p>
            <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <FiTarget style={{ color: '#10B981' }} />
                  <span style={{ fontSize: '13px', fontWeight: '800' }}>Next Milestone: 3000ml</span>
               </div>
            </div>
          </div>

        </section>

        <section className="logs-section">
          <div className="logs-header">
            <h2 style={{ fontWeight: 900, fontSize: '24px' }}>Log History</h2>
            <FiTrendingUp style={{ color: '#94A3B8' }} />
          </div>
          <div className="logs-list">
            {logs.map(log => (
              <div key={log.id} className="log-item">
                <div className="log-info">
                  <div className="log-icon"><FiDroplet /></div>
                  <div>
                    <span className="log-amount">{log.amount} ml</span>
                    <p className="log-time">{new Date(log.createdAt?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <button className="btn-delete-log" onClick={() => deleteLog(log.id)}>
                  <FiTrash2 />
                </button>
              </div>
            ))}
            {logs.length === 0 && <p style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>No logs today.</p>}
          </div>
        </section>

      </div>
    </div>
  );
};

export default WaterTracker;
