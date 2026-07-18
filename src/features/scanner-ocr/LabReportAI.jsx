import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, UploadCloud, Activity, Shield,
  AlertCircle, CheckCircle, Info, Trash2,
  Download, ArrowLeft, Printer, Zap, Database, Clock, ChevronRight
} from "lucide-react";
import LabReportService from "../../ai/LabReportService";
import { auth } from "../../firebase/config";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/labReport.css";

const LabReportAI = () => {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: "", percent: 0 });
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const data = await LabReportService.getHistory();
    setHistory(data);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processSelectedFile(e.dataTransfer.files[0]);
  }, []);

  const processSelectedFile = (selectedFile) => {
    setError(null);
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Clinical file format not supported. Use PDF or High-res Images.");
      return;
    }
    setFile(selectedFile);
    setAnalysis(null);
  };

  const startProcessing = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const result = await LabReportService.processReport(file, (p) => setProgress(p));
    if (result.success) {
      setAnalysis(result.data.analysis);
      fetchHistory();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(result.error);
    }
    setLoading(false);
    setProgress({ step: "", percent: 0 });
  };

  const handleDelete = async (reportId, storagePath) => {
    if (!window.confirm("Archive deletion irreversible. Proceed?")) return;
    try {
      await LabReportService.deleteReport(reportId, storagePath);
      setHistory(prev => prev.filter(item => item.id !== reportId));
      if (analysis && analysis.id === reportId) setAnalysis(null);
    } catch (e) { setError("Clinical record deletion failed."); }
  };

  const ICON_SIZE = 20;

  return (
    <div className="lab-report-page">
      <div className="page-container">
        <header className="ai-module-header">
          <div>
            <h1 className="text-main"><FileText className="text-secondary" size={32} /> LabReport<span className="text-secondary">AI</span></h1>
            <p>Heuristic biomarker mapping and diagnostic risk factor analysis.</p>
          </div>
          <div className="flex gap-4">
             {analysis && (
               <button className="btn-secondary flex items-center gap-2" onClick={() => window.print()}>
                 <Printer size={18} /> Print Record
               </button>
             )}
             <button className="btn-primary" onClick={() => { setAnalysis(null); setFile(null); }}>
               <UploadCloud size={18} /> New Upload
             </button>
          </div>
        </header>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 dark:bg-red-950 dark:bg-opacity-20 border border-red-100 dark:border-red-900 rounded-2xl flex gap-3 items-center text-red-600 font-bold mb-8">
            <AlertCircle size={20} /> {error}
          </motion.div>
        )}

        <main className="lab-workspace">
          <AnimatePresence mode="wait">
            {!analysis && !loading ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`upload-card ${isDragging ? "dragging" : ""}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-24 h-24 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-8 mx-auto">
                   <UploadCloud className="text-primary" size={42} />
                </div>
                <h3 className="text-3xl font-black mb-3">{file ? file.name : "Input Diagnostic Data"}</h3>
                <p className="text-muted mb-8 max-w-sm mx-auto">Supported architectures: PDF, PNG, JPG (Max 10MB clinical payload)</p>
                <input type="file" ref={fileInputRef} onChange={(e) => processSelectedFile(e.target.files[0])} hidden accept=".pdf, .png, .jpg, .jpeg" />
                {file && (
                  <button className="btn-primary py-4 px-16 text-sm uppercase tracking-widest" onClick={(e) => { e.stopPropagation(); startProcessing(); }}>
                    Run Biomarker Analysis
                  </button>
                )}
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card glass p-24 flex flex-col items-center justify-center text-center shadow-none"
              >
                <div className="loader mb-10 shadow-lg"></div>
                <h3 className="font-black tracking-[4px] uppercase text-muted mb-6 text-sm">{progress.step}</h3>
                <div className="progress-bar-wrap max-w-md mx-auto" style={{ height: '10px', background: 'var(--border-color)', borderRadius: '20px', overflow: 'hidden', width: '320px' }}>
                  <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progress.percent}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))' }} />
                </div>
                <p className="mt-6 font-black text-primary text-xs tracking-widest">{progress.percent}% MAPPED</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="results-grid">
                  <div className="analysis-main space-y-8">
                    <div className="card p-10">
                      <h2 className="text-2xl font-black mb-6 flex items-center gap-4 border-b border-border pb-6">
                         <FileText className="text-primary" size={28} /> Clinical Executive Summary
                      </h2>
                      <p className="text-main leading-relaxed font-medium text-lg">{analysis.patientSummary}</p>
                    </div>

                    <div className="card p-10 border-l-[12px] border-red-500">
                      <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-red-600">
                         <AlertCircle size={28} /> Critical Biomarker Deviations
                      </h2>
                      <div className="space-y-6">
                        {analysis.abnormalTests.map((test, i) => (
                          <div key={i} className="test-item group flex gap-6 p-6 bg-red-50 bg-opacity-30 rounded-3xl border border-red-100 border-opacity-50">
                            <div className="flex-1">
                              <h4 className="text-xl font-black text-main">{test.name}</h4>
                              <div className="flex items-center gap-4 mt-2 mb-4">
                                <span className="text-xs font-black text-muted uppercase tracking-wider">Observed: <strong className="text-red-600">{test.value}</strong></span>
                                <span className="text-xs font-black text-muted uppercase tracking-wider">Ref: {test.reference}</span>
                              </div>
                              <p className="text-sm text-slate-500 leading-relaxed font-medium italic">"{test.reason}"</p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                               <span className={`badge ${test.status === 'High' ? 'badge-error' : 'badge-secondary'}`}>{test.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card p-10">
                      <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                         <CheckCircle className="text-primary" size={28} /> Optimal Biological Markers
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analysis.normalTests.map((test, i) => (
                          <div key={i} className="p-5 bg-bg-color rounded-2xl border border-border flex flex-col justify-center">
                              <h4 className="font-bold text-sm text-main">{test.name}</h4>
                              <p className="text-xs font-black text-primary mt-1 uppercase tracking-tight">{test.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-8">
                     <div className="card p-10 text-center relative overflow-hidden bg-gradient-to-br from-card-bg to-bg-color">
                        <h2 className="text-xs font-black mb-10 tracking-[3px] uppercase text-muted flex items-center justify-center gap-3">
                           <Activity size={16} /> Vitality Grade
                        </h2>
                        <div className="gauge-circle mx-auto relative w-40 h-40">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" strokeWidth="8" fill="none" stroke="var(--border-color)" />
                            <motion.circle
                              cx="50" cy="50" r="45" strokeWidth="8" fill="none" stroke="var(--primary-color)" strokeLinecap="round"
                              initial={{ strokeDasharray: "0 283" }}
                              animate={{ strokeDasharray: `${(analysis.healthScore / 100) * 283} 283` }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-5xl font-black">{analysis.healthScore}</span>
                             <span className="text-[10px] font-black text-muted uppercase mt-1">Score</span>
                          </div>
                        </div>
                        <div className={`badge risk-${analysis.overallRisk.toLowerCase()} mt-10 w-full justify-center py-3 rounded-2xl`}>
                          Triage Risk: {analysis.overallRisk}
                        </div>
                     </div>

                     <div className="card p-10 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                        <Zap className="absolute -right-8 -top-8 text-8xl opacity-10 rotate-12" />
                        <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                           <Shield className="text-primary" size={24} /> AI Triage Advice
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">{analysis.doctorAdvice}</p>
                        <div className="space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">Dietary Intervention</h4>
                           <div className="flex flex-wrap gap-2">
                             {analysis.dietSuggestions.map((s, i) => (
                               <span key={i} className="px-4 py-2 bg-white bg-opacity-5 rounded-xl text-xs font-bold border border-white border-opacity-10">{s}</span>
                             ))}
                           </div>
                        </div>
                     </div>
                  </aside>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {!loading && history.length > 0 && (
          <section className="history-section mt-32">
            <div className="flex items-center gap-4 mb-10 border-b border-border pb-8">
               <Database className="text-primary" size={32} />
               <h2 className="text-3xl font-black">Archive Repository</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {history.map(item => (
                <motion.div key={item.id} layout className="card p-8 group hover:border-primary cursor-pointer relative" onClick={() => setAnalysis(item.analysis)}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-muted uppercase flex items-center gap-2">
                       <Clock size={12} /> {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}
                    </span>
                    <button className="text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg" onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.storagePath); }}>
                       <Trash2 size={16} />
                    </button>
                  </div>
                  <h4 className="font-black text-sm truncate mb-8 text-main">{item.fileName}</h4>
                  <div className="flex justify-between items-center pt-6 border-t border-border">
                    <span className={`badge risk-${item.overallRisk.toLowerCase()} text-[9px] px-2`}>{item.overallRisk}</span>
                    <div className="flex items-center gap-1 font-black text-primary text-sm">
                       {item.healthScore}% <ChevronRight size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LabReportAI;
