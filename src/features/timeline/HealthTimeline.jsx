import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Activity, Droplet, FileText, Clock,
  TrendingUp, Filter, Zap, ChevronRight, Pill,
  Utensils, Scan, FlaskConical, Search
} from "lucide-react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/timeline.css";

const HealthTimeline = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    const collections = [
      { name: "scan_history", class: "scan", label: "Medicine Scan", icon: <Scan size={14}/> },
      { name: "lab_reports", class: "lab", label: "Lab Report", icon: <FlaskConical size={14}/> },
      { name: "water_logs", class: "water", label: "Water Intake", icon: <Droplet size={14}/> },
      { name: "food_logs", class: "food", label: "Nutrition Log", icon: <Utensils size={14}/> },
      { name: "symptom_logs", class: "symptom", label: "Symptom Log", icon: <Activity size={14}/> },
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
          icon: coll.icon,
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
      case "scan_history": return `Analyzed dosage: ${event.aiAnalysis?.dosage || "Synchronized"}`;
      case "lab_reports": return event.analysis?.summary?.substring(0, 140) + "..." || "Diagnostic summary complete.";
      case "symptom_logs": return event.notes || `Biological variance intensity at ${event.severity}/10.`;
      case "food_logs": return `Nutrient load: ${event.calories} kcal / ${event.mealType}.`;
      default: return "Record synchronization successful.";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="timeline-page min-h-screen">
      <div className="page-container">

        <header className="timeline-header flex flex-col items-center text-center mb-24">
          <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-3xl flex items-center justify-center mb-6">
             <Calendar className="text-primary" size={32} />
          </div>
          <h1 className="font-black text-5xl tracking-tighter">Health<span>Timeline</span></h1>
          <p className="text-lg font-medium text-muted mt-4 max-w-lg">Universal ledger of synchronized clinical diagnostic telemetry and biological logs.</p>
        </header>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="loader mb-6"></div>
            <p className="font-black text-xs tracking-widest text-muted uppercase">Indexing Ledger History...</p>
          </div>
        ) : (
          <main className="timeline-main">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="timeline-event-wrap"
              >
                <div className={`timeline-dot dot-${event.category} flex items-center justify-center shadow-lg`}>
                   <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>

                <div className="timeline-card card p-10 hover:translate-x-3 transition-transform border-none shadow-md">
                  <div className="event-meta flex justify-between items-center mb-6">
                    <span className={`badge type-${event.category} font-black text-[9px] uppercase tracking-[2px]`}>{event.icon} {event.type}</span>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted opacity-60">
                       <Clock size={12} />
                       <span>{new Date(event.createdAt?.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <h3 className="event-title text-2xl font-black mb-3">{getEventTitle(event)}</h3>
                  <p className="event-desc text-lg leading-relaxed font-medium mb-10 opacity-70">{getEventDesc(event)}</p>

                  <div className="event-footer flex justify-between items-center pt-8 border-t border-border border-opacity-50">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-primary bg-opacity-10 flex items-center justify-center text-primary">
                          <Zap size={18} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[2px] text-primary">Biometrically Verified</span>
                    </div>
                    <button className="btn-secondary py-3 px-6 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all">
                      Diagnostics <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {events.length === 0 && (
              <div className="text-center py-40 opacity-20">
                 <Search size={80} className="mx-auto mb-6" />
                 <h3 className="text-2xl font-black uppercase tracking-[4px]">Archives Empty</h3>
              </div>
            )}
          </main>
        )}

      </div>
    </motion.div>
  );
};

export default HealthTimeline;
