import React, { useState, useEffect, useRef } from "react";
import {
  FiUpload,
  FiCamera,
  FiTrash2,
  FiCopy,
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiActivity,
  FiCalendar,
  FiInfo,
  FiShield,
  FiZap,
  FiClock,
  FiArrowRight,
  FiChevronDown,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { extractTextFromImage } from "../../ai/OCRService";
import { analyzeMedicine } from "../../ai/MedicineAI";
import { db, storage } from "../../firebase/config";
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

import "../../styles/scannerOCR.css";

const ScannerOCR = () => {
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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const q = query(
      collection(db, "scan_history"),
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
      if (!ocrResult.success) throw new Error("OCR Failed");

      setOcrData({ text: ocrResult.text, confidence: 92 });
      setProgress(50);

      const aiResult = await analyzeMedicine(ocrResult.text);
      if (!aiResult.success) throw new Error("AI Analysis Failed");

      const parsedAI = typeof aiResult.text === 'string' ? JSON.parse(aiResult.text) : aiResult.text;
      setAiData(parsedAI);
      setProgress(80);

      await saveScanToCloud(image, ocrResult.text, parsedAI);
      setProgress(100);
      showToast("Scan completed successfully");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  const saveScanToCloud = async (file, text, ai) => {
    const path = `scanner/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "scan_history"), {
      imageURL: url,
      storagePath: path,
      rawText: text,
      aiAnalysis: ai,
      createdAt: serverTimestamp(),
    });
  };

  const deleteRecord = async (scan) => {
    if (!window.confirm("Delete this scan?")) return;
    try {
      await deleteDoc(doc(db, "scan_history", scan.id));
      if (scan.storagePath) await deleteObject(ref(storage, scan.storagePath));
      showToast("Record deleted");
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="scanner-page">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className={`toast ${toast.type}`}>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scanner-container">
        <header className="scanner-header">
          <div className="header-left">
            <h1>Medi<span>Scan</span> AI</h1>
            <p>Advanced medicine verification and automated dosage analysis.</p>
          </div>
          <div className="header-actions">
            <button className="btn-upload" onClick={() => fileInputRef.current.click()}>
              <FiUpload /> Upload
            </button>
            <button className="btn-capture" onClick={() => cameraInputRef.current.click()}>
              <FiCamera /> Capture
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
            <input type="file" ref={cameraInputRef} onChange={handleFileChange} hidden capture="environment" accept="image/*" />
          </div>
        </header>

        <div className="scanner-grid">

          <div className="preview-card">
            {!preview ? (
              <div className="drop-zone" onClick={() => fileInputRef.current.click()}>
                <FiZap className="drop-icon" />
                <p>Drag & Drop or Click to Scan</p>
                <span style={{ fontSize: '12px' }}>Supports JPG, PNG, WEBP</span>
              </div>
            ) : (
              <div className="image-preview-container">
                <img src={preview} alt="Target" />
                <div className="preview-overlay">
                  <button className="btn-process" onClick={runScanPipeline} disabled={loading}>
                    <FiZap /> {loading ? "PROCESSING..." : "ANALYZE NOW"}
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-overlay">
                <div className="progress-bar-wrap">
                  <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                </div>
                <p className="loading-text">Intelligence running: {progress}%</p>
              </div>
            )}
          </div>

          <div className="ai-results-view">
            {!aiData ? (
              <div className="placeholder-view">
                <FiShield className="placeholder-icon" />
                <h3>AI Analysis Pending</h3>
                <p>Upload a medicine pack image to receive automated insights.</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="results-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                <section className="medicine-hero-card">
                  <div className="med-tag">Verified Medical Info</div>
                  <h2 className="med-name">{aiData.name}</h2>
                  <div className="med-generic">
                    <FiActivity /> {aiData.generic_name}
                  </div>
                  <div className="med-specs-grid">
                    <div className="spec-item">
                      <p className="spec-label">Dosage</p>
                      <p className="spec-value">{aiData.dosage}</p>
                    </div>
                    <div className="spec-item">
                      <p className="spec-label">Strength</p>
                      <p className="spec-value">{aiData.strength}</p>
                    </div>
                    <div className="spec-item">
                      <p className="spec-label">Expiry</p>
                      <p className="spec-value">{aiData.expiry || "Detecting..."}</p>
                    </div>
                  </div>
                </section>

                <div className="info-section-grid">
                  <div className="info-card-styled">
                    <h3><FiAlertCircle style={{ color: '#EF4444' }} /> Safety Warnings</h3>
                    <div className="info-list">
                      {aiData.warnings?.map((w, i) => (
                        <div key={i} className="info-list-item">
                          <FiChevronDown /> {w}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="info-card-styled">
                    <h3><FiInfo style={{ color: '#F97316' }} /> Side Effects</h3>
                    <div className="info-list">
                      {aiData.side_effects?.map((s, i) => (
                        <div key={i} className="info-list-item">
                          <FiChevronDown /> {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="ocr-text-card">
                  <div className="ocr-header">
                    <p style={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', color: '#94A3B8' }}>Extracted OCR Raw</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <FiCopy onClick={() => navigator.clipboard.writeText(ocrData.text)} style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                  <div className="ocr-content">{ocrData?.text}</div>
                </div>

              </motion.div>
            )}
          </div>

        </div>

        <section className="history-section">
          <div className="history-header">
             <h2 style={{ fontWeight: 900, fontSize: '24px' }}>Scan History</h2>
          </div>
          <div className="history-grid">
            {history.map(scan => (
              <div key={scan.id} className="history-card">
                <div className="history-thumb">
                  <img src={scan.imageURL} alt="Scan" />
                  <button onClick={() => deleteRecord(scan)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', padding: '8px', borderRadius: '10px' }}>
                    <FiTrash2 />
                  </button>
                </div>
                <div className="history-body">
                  <h4 className="history-title">{scan.aiAnalysis?.name || "Unknown Item"}</h4>
                  <p className="history-date">{new Date(scan.createdAt?.toDate()).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ScannerOCR;
