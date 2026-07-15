import React from 'react';

export default function HealthTimeline() {
  const events = [
    { id: 1, date: 'Jul 14, 2026', title: 'Consultation Complete', desc: 'Visited Dr. Rao for routine blood reports.', category: 'consultation' },
    { id: 2, date: 'Jul 12, 2026', title: 'Medicine Replenishment', desc: 'Amoxicillin prescription refilled through MyMediExpress.', category: 'pharmacy' },
    { id: 3, date: 'Jul 10, 2026', title: 'Symptom Recorded', desc: 'Logged "Moderate headache" resolving after hydration.', category: 'symptom' }
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-slate-800 mb-6">📅 Patient Health Timeline</h3>
      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
        {events.map((event) => (
          <div key={event.id} className="relative pl-6">
            {/* Timeline Marker Point */}
            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-brand-blue-600 shadow"></span>
            
            <span className="text-xs font-bold text-slate-400 block">{event.date}</span>
            <h4 className="text-sm font-bold text-slate-800 mt-1">{event.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{event.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}