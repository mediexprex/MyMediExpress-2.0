import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiUploadCloud, FiActivity, FiShield,
  FiAlertCircle, FiCheckCircle, FiInfo, FiTrash2,
  FiDownload, FiArrowLeft, FiPrinter, FiZap, FiDatabase
} from "react-icons/fi";
import LabReportService from "../../ai/LabReportService";
import "../../styles/labReport.css";

const LabReportAI = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: "", percent: 0 });
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Load History on Mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const data = await LabReportService.getHistory();
    setHistory(data);
  };

  // Drag and Drop Handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile) => {
    setError(null);
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Unsupported file format. Please upload PDF or Images.");
      return;
    }
    setFile(selectedFile);
    setAnalysis(null);
  };

  // Start Processing
  const startProcessing = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const result = await LabReportService.processReport(file, (p) => setProgress(p));

    if (result.success) {
      setAnalysis(result.data.analysis);
      fetchHistory(); // Refresh history
    } else {
      setError(result.error);
    }
    setLoading(false);
    setProgress({ step: "", percent: 0 });
  };

  const handleDelete = async (reportId, storagePath) => {
    if (!window.confirm("Permanent delete this report?")) return;
    try {
      await LabReportService.deleteReport(reportId, storagePath);
      setHistory(prev => prev.filter(item => item.id !== reportId));
      if (analysis && analysis.id === reportId) setAnalysis(null);
    } catch (e) {
      setError("Failed to delete report.");
    }
  };

  const loadFromHistory = (item) => {
    setAnalysis(item.analysis);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="lab-report-container animated-fade">

      {/* Hero Header */}
      <header className="lab-hero">
        <h1>LabReport<span>AI</span></h1>
        <p>Professional grade biomarker analysis powered by MyMediExpress Intelligence.</p>
      </header>

      {/* Main Interface */}
      <div className="lab-workspace">

        {/* Error Messaging */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="error-box"
              style={{ background: "#FEE2E2", color: "#B91C1C", padding: "15px", borderRadius: "12px", marginBottom: "20px", fontWeight: "700" }}
            >
              <FiAlertCircle style={{ marginRight: "10px" }} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Card */}
        {!analysis && !loading && (
          <div
            className={`upload-card ${isDragging ? "dragging" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <FiUploadCloud className="upload-icon" />
            <h3>{file ? file.name : "Drag & Drop Laboratory Report"}</h3>
            <p>PDF, PNG, JPG supported (Max 10MB)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileSelect}
              hidden
              accept=".pdf, .png, .jpg, .jpeg"
            />
            {file && (
              <button
                className="btn-primary"
                onClick={(e) => { e.stopPropagation(); startProcessing(); }}
                style={{ marginTop: "20px" }}
              >
                Analyze Biomarkers
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card-glass score-gauge">
             <div className="progress-overlay">
                <FiZap className="upload-icon" style={{ animation: "pulse 1.5s infinite" }} />
                <h3 style={{ textTransform: "uppercase", letterSpacing: "2px" }}>{progress.step}</h3>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${progress.percent}%` }}></div>
                </div>
                <p>{progress.percent}% Processed</p>
             </div>
          </div>
        )}

        {/* Results Analysis */}
        {analysis && !loading && (
          <div className="results-view">
            <div className="history-header" style={{ marginBottom: "20px" }}>
              <button className="btn-details" onClick={() => setAnalysis(null)}>
                <FiArrowLeft /> Back to Upload
              </button>
              <button className="btn-primary" onClick={printReport}>
                <FiPrinter /> Print Clinical Report
              </button>
            </div>

            <div className="results-grid">

              <div className="analysis-main">
                {/* Patient Summary */}
                <div className="card-glass">
                  <h2 className="card-title"><FiFileText /> Clinical Executive Summary</h2>
                  <p style={{ lineHeight: "1.7", color: "#4B5563" }}>{analysis.patientSummary}</p>
                </div>

                {/* Abnormal Findings */}
                <div className="card-glass" style={{ borderLeft: "6px solid var(--lab-danger)" }}>
                  <h2 className="card-title" style={{ color: "var(--lab-danger)" }}>
                    <FiAlertCircle /> Abnormal Biomarkers ({analysis.abnormalTests.length})
                  </h2>
                  {analysis.abnormalTests.map((test, idx) => (
                    <div key={idx} className="test-item">
                      <div className="test-info">
                        <span className="test-name">{test.name}</span>
                        <span className="test-value">Value: <strong>{test.value}</strong> | Ref: {test.reference}</span>
                        <span style={{ fontSize: "12px", color: "var(--lab-danger)", fontWeight: "600", marginTop: "4px" }}>
                          {test.reason}
                        </span>
                      </div>
                      <span className={`status-badge status-${test.status.toLowerCase()}`}>{test.status}</span>
                    </div>
                  ))}
                </div>

                {/* Normal Markers */}
                <div className="card-glass" style={{ opacity: 0.8 }}>
                  <h2 className="card-title"><FiCheckCircle /> Optimal Ranges</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    {analysis.normalTests.map((test, idx) => (
                      <div key={idx} className="test-item" style={{ marginBottom: 0 }}>
                        <div className="test-info">
                          <span className="test-name" style={{ fontSize: "14px" }}>{test.name}</span>
                          <span className="test-value" style={{ fontSize: "12px" }}>{test.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: Health Score & Advice */}
              <aside className="analysis-sidebar">

                {/* Health Score Gauge */}
                <div className="card-glass score-gauge">
                  <h2 className="card-title"><FiActivity /> Health Grade</h2>
                  <div className="gauge-circle">
                    <svg className="gauge-svg">
                      <circle cx="80" cy="80" r="70" className="gauge-bg" />
                      <circle
                        cx="80" cy="80" r="70"
                        className="gauge-fill"
                        style={{
                          strokeDasharray: 440,
                          strokeDashoffset: 440 - (440 * analysis.healthScore) / 100
                        }}
                      />
                    </svg>
                    <div className="gauge-text">
                      <span className="gauge-number">{analysis.healthScore}</span>
                      <span className="gauge-label">Score</span>
                    </div>
                  </div>
                  <div className={`risk-badge risk-${analysis.overallRisk.toLowerCase()}`}>
                    {analysis.overallRisk} Risk Level
                  </div>
                </div>

                {/* AI Advice */}
                <div className="card-glass" style={{ marginTop: "24px", background: "var(--lab-bg)" }}>
                  <h2 className="card-title"><FiShield /> AI Triage Advice</h2>
                  <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "20px" }}>{analysis.doctorAdvice}</p>
                  <h4 style={{ fontSize: "12px", textTransform: "uppercase", marginBottom: "10px", color: "var(--lab-primary)" }}>Dietary Interventions</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {analysis.dietSuggestions.map((diet, idx) => (
                      <span key={idx} style={{ background: "white", padding: "5px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", border: "1px solid #E2E8F0" }}>
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>

              </aside>
            </div>
          </div>
        )}

        {/* Clinical History Section */}
        {!loading && history.length > 0 && (
          <section className="history-section">
            <h2 className="card-title"><FiDatabase /> Clinical Audit Trail</h2>
            <div className="history-grid">
              {history.map((item) => (
                <div key={item.id} className="card-glass history-card" onClick={() => loadFromHistory(item)}>
                  <div className="history-header">
                    <span className="history-date">{new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                    <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.storagePath); }}>
                      <FiTrash2 />
                    </button>
                  </div>
                  <h4 style={{ margin: "5px 0", fontWeight: "800" }}>{item.fileName}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                    <span className={`risk-badge risk-${item.overallRisk.toLowerCase()}`} style={{ fontSize: "10px", padding: "4px 10px" }}>
                      {item.overallRisk}
                    </span>
                    <span style={{ fontWeight: "900", color: "var(--lab-primary)" }}>{item.healthScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Disclaimer */}
      <footer style={{ marginTop: "80px", textAlign: "center", padding: "40px", borderTop: "1px solid #E2E8F0" }}>
        <p style={{ fontSize: "12px", color: "#94A3B8", maxWidth: "800px", margin: "0 auto" }}>
          <strong>Medical Disclaimer:</strong> MyMediExpress LabReportAI provides informational biomarker analysis only.
          This is not a substitute for professional medical diagnosis or treatment. Always consult with a qualified
          healthcare professional for any health concerns or before making dietary or lifestyle changes.
        </p>
      </footer>
    </div>
  );
};

export default LabReportAI;