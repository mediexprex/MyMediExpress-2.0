import React, { useState } from 'react';

export default function BodyVisualizer3D() {
  const [selectedZone, setSelectedZone] = useState(null);

  const zones = [
    { id: 'brain', label: 'Brain & CNS', details: 'Cognitive health indicator normal. Rest state: stable.' },
    { id: 'chest', label: 'Cardiopulmonary System', details: 'Oxygen saturation levels steady at 98%.' },
    { id: 'abdomen', label: 'Gastrointestinal', details: 'Digestion active. Last calorie logger cycle active.' }
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 max-w-xl mx-auto text-center">
      <h3 className="text-lg font-bold text-slate-800 mb-2">🧍 Interactive 3D Anatomy Visualizer</h3>
      <p className="text-xs text-slate-400 mb-6">Select muscle group boundaries or internal body systems to view localized telemetry data.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Placeholder rendering a stylized anatomical frame mapping targets to actual canvas points later */}
        <div className="w-full aspect-[2/3] bg-slate-50 rounded-xl relative flex items-center justify-center border border-slate-100">
          <div className="text-slate-200 text-8xl font-black select-none pointer-events-none opacity-40">3D</div>
          
          {/* Interactive clickable regions */}
          <button 
            onClick={() => setSelectedZone(zones[0])}
            className="absolute top-8 bg-brand-blue-600/10 hover:bg-brand-blue-600/30 text-brand-blue-900 border border-brand-blue-300 px-3 py-1 text-xs font-bold rounded-full transition-all"
          >
            Brain
          </button>
          
          <button 
            onClick={() => setSelectedZone(zones[1])}
            className="absolute top-32 bg-teal-600/10 hover:bg-teal-600/30 text-teal-950 border border-teal-300 px-3 py-1 text-xs font-bold rounded-full transition-all"
          >
            Lungs & Heart
          </button>

          <button 
            onClick={() => setSelectedZone(zones[2])}
            className="absolute top-52 bg-emerald-600/10 hover:bg-emerald-600/30 text-emerald-950 border border-emerald-300 px-3 py-1 text-xs font-bold rounded-full transition-all"
          >
            Abdomen
          </button>
        </div>

        {/* Selected Zone Telemetry */}
        <div className="text-left bg-slate-50 p-5 rounded-xl border min-h-[180px] flex flex-col justify-center">
          {selectedZone ? (
            <div>
              <h4 className="font-bold text-brand-blue-900 text-base">{selectedZone.label}</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedZone.details}</p>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Normal Operations</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic text-center">Click on any anatomical region to display live system diagnostics.</p>
          )}
        </div>
      </div>
    </div>
  );
}