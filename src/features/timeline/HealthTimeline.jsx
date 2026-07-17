import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiActivity,
  FiDroplet,
  FiFileText,
  FiClock,
  FiTrendingUp,
  FiFilter,
  FiZap,
  FiChevronRight,
} from "react-icons/fi";
import { Utensils, Pill } from "lucide-react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

import "../../styles/timeline.css";

const HealthTimeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    const collections = [
      { name: "scan_history", class: "scan", label: "Medicine Scan" },
      { name: "lab_reports", class: "lab", label: "Lab Report" },
      { name: "water_logs", class: "water", label: "Water Intake" },
      { name: "food_logs", class: "food", label: "Nutrition Log" },
      { name: "symptom_logs", class: "symptom", label: "Symptom Log" },
    ];

    const unsubscribes = [];
    let combinedEvents = {};

    collections.forEach((coll) => {
      const q = query(
        collection(db, coll.name),
        where("userId", "==", uid),
        orderBy("createdAt", "desc"),
        limit(15)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        combinedEvents[coll.name] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: coll.label,
          category: coll.class,
          source: coll.name
        }));

        const all = Object.values(combinedEvents).flat().sort((a, b) =>
          (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)
        );
        setEvents(all);
        setLoading(false);
      });
      unsubscribes.push(unsub);
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const getEventTitle = (event) => {
    switch(event.source) {
      case "scan_history": return event.aiAnalysis?.name || "Medicine Scan";
      case "lab_reports": return event.fileName || "Lab Analysis";
      case "water_logs": return `Hydration: ${event.amount}ml`;
      case "food_logs": return `${event.foodName}`;
      case "symptom_logs": return `${event.symptom}`;
      default: return "Health Activity";
    }
  };

  const getEventDesc = (event) => {
    switch(event.source) {
      case "scan_history": return `Analyzed dosage: ${event.aiAnalysis?.dosage || "Available in records"}`;
      case "lab_reports": return event.analysis?.summary?.substring(0, 150) + "..." || "Report clinical analysis completed.";
      case "symptom_logs": return event.notes || `Severity level ${event.severity}/10 recorded.`;
      case "food_logs": return `Logged ${event.calories} kcal for ${event.mealType}.`;
      default: return "Record synchronization successful.";
    }
  };

  return (
    <div className="timeline-page">
      <div className="timeline-container">

        <header className="timeline-header">
          <h1>Health<span>Timeline</span></h1>
          <p>Unified medical ledger synchronized across all diagnostic modules.</p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <div className="loader"></div>
            <p style={{ marginTop: '20px', color: '#94A3B8', fontWeight: '800' }}>LOADING LEDGER...</p>
          </div>
        ) : (
          <main className="timeline-main">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="timeline-event-wrap"
              >
                <div className={`timeline-dot dot-${event.category}`}></div>

                <div className="timeline-card">
                  <div className="event-meta">
                    <span className={`event-type-badge type-${event.category}`}>{event.type}</span>
                    <span className="event-date"><FiClock /> {new Date(event.createdAt?.toDate()).toLocaleDateString()}</span>
                  </div>

                  <h3 className="event-title">{getEventTitle(event)}</h3>
                  <p className="event-desc">{getEventDesc(event)}</p>

                  <div className="event-footer">
                    <div className="ai-verified">
                      <FiZap /> AI Verified
                    </div>
                    <button className="btn-details">
                      Open Record <FiChevronRight />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {events.length === 0 && (
              <div style={{ textAlign: 'center', padding: '100px', opacity: 0.3 }}>
                 <FiCalendar size={80} style={{ marginBottom: '20px' }} />
                 <h3 style={{ fontWeight: 900, textTransform: 'uppercase' }}>No events recorded</h3>
              </div>
            )}
          </main>
        )}

      </div>
    </div>
  );
};

export default HealthTimeline;
