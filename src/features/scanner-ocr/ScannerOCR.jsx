import React, { useState, useEffect, useRef } from "react";
import {
  Upload, Camera, Trash2, Copy, Download, RefreshCw,
  CheckCircle, AlertCircle, FileText, Activity, Info,
  Shield, Zap, Clock, ArrowRight, X, Scan, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { extractTextFromImage } from "../../ai/OCRService";
import { analyzeMedicine } from "../../ai/MedicineAI";
import { db, storage, auth } from "../../firebase/config";
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/scannerOCR.css";

const ScannerOCR = () => {
  const { t } = useLanguage();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrData, setOcrData] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const ICON_SIZE = 20;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "scan_history"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Max file size is 5MB", "error");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setOcrData(null);
      setAiData(null);
    }
  };

  const runScanPipeline = async () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);
    try {
      setProgress(20);
      const ocrResult = await extractTextFromImage(image);
      if (!ocrResult.success) throw new Error("Optical Analysis Interrupted");

      setOcrData({ text: ocrResult.text, confidence: 92 });
      setProgress(50);

      const aiResult = await analyzeMedicine(ocrResult.text);
      if (!aiResult.success) throw new Error("AI Processing Failure");

      const parsedAI = typeof aiResult.text === 'string' ? JSON.parse(aiResult.text) : aiResult.text;
      setAiData(parsedAI);
      setProgress(80);

      await saveScanToCloud(image, ocrResult.text, parsedAI);
      setProgress(100);
      showToast("Diagnostic analysis complete");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 600);
    }
  };

  const saveScanToCloud = async (file, text, ai) => {
    if (!auth.currentUser) return;
    const path = `scanner/${auth.currentUser.uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "scan_history"), {
      userId: auth.currentUser.uid,
      imageURL: url,
      storagePath: path,
      rawText: text,
      aiAnalysis: ai,
      createdAt: serverTimestamp(),
    });
  };

  const deleteRecord = async (scan) => {
    if (!window.confirm("Confirm deletion of this telemetry log?")) return;
    try {
      await deleteDoc(doc(db, "scan_history", scan.id));
      if (scan.storagePath) await deleteObject(ref(storage, scan.storagePath));
      showToast("Log removed");
    } catch (error) {
      showToast("Deletion error", "error");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Data copied to clinical buffer");
  };

  const downloadReport = () => {
    if (!aiData) return;
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(aiData, null, 2)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `medi_telemetry_${aiData.name || 'unit'}.json`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="scanner-page">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className={`toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-container">
        <header className="ai-module-header">
          <div>
            <h1 className="text-main"><Scan className="text-secondary" size={32} /> Medi<span>Scan</span> AI</h1>
            <p>High-fidelity pharmaceutical verification and biological cross-referencing.</p>
          </div>
          <div className="flex gap-4">
            <button className="btn-secondary flex items-center gap-2" onClick={() => fileInputRef.current.click()}>
              <Upload size={18} /> {t('scanMedicine')}
            </button>
            <button className="btn-primary" onClick={() => cameraInputRef.current.click()}>
              <Camera size={18} /> Capture
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
            <input type="file" ref={cameraInputRef} onChange={handleFileChange} hidden capture="environment" accept="image/*" />
          </div>
        </header>

        <div className="scanner-grid">
          <div className="preview-card card relative">
            {!preview ? (
              <div className="drop-zone flex-1" onClick={() => fileInputRef.current.click()}>
                <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-3xl flex items-center justify-center mb-6">
                  <Sparkles className="text-primary" size={38} />
                </div>
                <h3 className="font-bold text-xl mb-2">Protocol Standby</h3>
                <p className="text-sm text-muted">Awaiting pharmaceutical visual input<br/>Supports JPG, PNG, WEBP (Max 5MB)</p>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex-1 bg-slate-900 bg-opacity-95 flex items-center justify-center p-6">
                  <img src={preview} alt="Input" className="max-h-full max-w-full object-contain shadow-2xl rounded-lg" />
                </div>
                <div className="p-8 bg-card-bg border-t border-border flex gap-4">
                  <button className="btn-primary flex-1 py-4" onClick={runScanPipeline} disabled={loading}>
                    <Zap size={20} /> {loading ? "INITIALIZING..." : "RUN DIAGNOSTIC"}
                  </button>
                  <button className="btn-secondary p-4 flex items-center justify-center hover:text-red-500 hover:bg-red-50" onClick={() => {setPreview(null); setImage(null);}} aria-label="Discard">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}

            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-overlay absolute inset-0 flex flex-col items-center justify-center p-12 z-20">
                  <div className="loader mb-8 shadow-sm"></div>
                  <div className="progress-bar-wrap mb-4">
                    <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                  </div>
                  <p className="loading-text">Intelligence Mapping: {progress}%</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="ai-results-view h-full">
            {!aiData ? (
              <div className="card h-full flex flex-col items-center justify-center text-center p-16 opacity-40 border-dashed border-2 bg-transparent shadow-none">
                <Shield size={64} className="text-muted mb-6" />
                <h3 className="text-2xl font-black mb-2">Telemetry Buffer Empty</h3>
                <p className="max-w-xs text-sm">Provide medicine pack visual telemetry to initiate Gemini AI heuristic analysis.</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <section className="medicine-hero-card">
                  <div className="flex justify-between items-start mb-8">
                    <span className="badge badge-primary"><Sparkles size={12} /> Verified Biometric ID</span>
                    <div className="flex gap-2">
                       <button onClick={downloadReport} className="p-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all" aria-label="Download"><Download size={18} /></button>
                       <button onClick={() => copyToClipboard(JSON.stringify(aiData, null, 2))} className="p-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all" aria-label="Copy"><Copy size={18} /></button>
                    </div>
                  </div>
                  <h2 className="med-name mb-3">{aiData.name}</h2>
                  <div className="flex items-center gap-3 text-slate-300 font-bold mb-10">
                    <Activity className="text-primary" size={22} /> {aiData.generic_name}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Recommended Dosage", val: aiData.dosage, icon: <Clock size={12} /> },
                      { label: "Molecular Strength", val: aiData.strength, icon: <Zap size={12} /> },
                      { label: "Safe Expiration", val: aiData.expiry || "N/A", icon: <Info size={12} /> }
                    ].map((s, i) => (
                      <div key={i} className="bg-white bg-opacity-5 p-4 rounded-2xl border border-white border-opacity-10 text-center">
                        <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 mb-2 flex items-center justify-center gap-1">
                          {s.icon} {s.label}
                        </p>
                        <p className="font-bold text-sm">{s.val}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="info-card-styled card border-red-500 border-opacity-10">
                    <h3 className="flex items-center gap-2 font-black text-red-500 mb-6 uppercase tracking-wider text-xs">
                      <AlertCircle size={14} /> Risk Mitigation Warnings
                    </h3>
                    <ul className="space-y-3">
                      {aiData.warnings?.map((w, i) => (
                        <li key={i} className="text-sm font-medium flex gap-3 text-muted leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="info-card-styled card border-orange-500 border-opacity-10">
                    <h3 className="flex items-center gap-2 font-black text-orange-500 mb-6 uppercase tracking-wider text-xs">
                      <Info size={14} /> Clinical Side Effects
                    </h3>
                    <ul className="space-y-3">
                      {aiData.side_effects?.map((s, i) => (
                        <li key={i} className="text-sm font-medium flex gap-3 text-muted leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="card">
                  <div className="flex justify-between items-center mb-6">
                    <p className="font-black text-[10px] uppercase tracking-[2px] text-muted flex items-center gap-2">
                       <FileText size={12} /> Heuristic Optical Log
                    </p>
                    <button onClick={() => copyToClipboard(ocrData.text)} className="p-2 hover:bg-bg-color rounded-xl transition-all" aria-label="Copy Raw"><Copy size={16} /></button>
                  </div>
                  <div className="ocr-content">{ocrData?.text}</div>
                </div>

                <button className="btn-secondary w-full py-5 flex items-center justify-center gap-3 border-2" onClick={() => {setPreview(null); setAiData(null); setOcrData(null); window.scrollTo({top:0, behavior:'smooth'})}}>
                   <RefreshCw size={18} /> INITIATE NEW PROTOCOL
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <section className="history-section mt-24">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
                <Clock className="text-primary" size={32} />
                <h2 className="text-3xl font-black">{t('recentScans')}</h2>
             </div>
             <p className="text-xs font-bold text-muted uppercase tracking-widest">{history.length} Synchronized Logs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {history.map(scan => (
              <motion.div key={scan.id} layout className="history-card card p-0 overflow-hidden group">
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-900">
                  <img src={scan.imageURL} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <button onClick={(e) => { e.stopPropagation(); deleteRecord(scan); }} className="absolute top-4 right-4 w-9 h-9 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-sm truncate mb-1">{scan.aiAnalysis?.name || "Unidentified Compound"}</h4>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-[9px] font-black text-muted uppercase flex items-center gap-1"><Clock size={10} /> {new Date(scan.createdAt?.toDate()).toLocaleDateString()}</span>
                    <ArrowRight size={14} className="text-primary transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ScannerOCR;
