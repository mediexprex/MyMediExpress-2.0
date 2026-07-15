import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../firebase/config";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  collection,
  addDoc,
  query,
 where,
 orderBy,
 onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function LabReportAI() {

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewURL, setPreviewURL] = useState("");

  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [reports, setReports] = useState([]);

  const [aiSummary, setAiSummary] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);

  // -----------------------------
  // File Selection
  // -----------------------------

  const handleFileSelect = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {

      setError(
        "Only PDF, JPG, PNG and WEBP files are supported."
      );

      return;
    }

    setError("");

    setSelectedFile(file);

    if (file.type.startsWith("image")) {

      setPreviewURL(URL.createObjectURL(file));

    } else {

      setPreviewURL("");

    }
  };

  // -----------------------------
  // Upload Report
  // -----------------------------

  const uploadReport = async () => {

    if (!selectedFile) {

      alert("Please select a report.");

      return;
    }

    if (!auth.currentUser) {

      alert("Please login first.");

      return;
    }

    try {

      setUploading(true);

      setUploadProgress(20);

      const fileName =
        Date.now() + "_" + selectedFile.name;

      const storageRef = ref(
        storage,
        `lab_reports/${auth.currentUser.uid}/${fileName}`
      );

      await uploadBytes(storageRef, selectedFile);

      setUploadProgress(70);

      const downloadURL =
        await getDownloadURL(storageRef);

      await addDoc(collection(db, "lab_reports"), {

        userId: auth.currentUser.uid,

        fileName: selectedFile.name,

        fileType: selectedFile.type,

        reportURL: downloadURL,

        status: "Uploaded",

        aiStatus: "Pending",

        createdAt: serverTimestamp(),

      });

      setUploadProgress(100);

      setAiSummary(
        "Report uploaded successfully. AI analysis will be available in the next step."
      );

      setSelectedFile(null);

      setPreviewURL("");

      setTimeout(() => {

        setUploadProgress(0);

        setUploading(false);

      }, 1000);

    } catch (err) {

      console.error(err);

      setUploading(false);

      setError("Failed to upload report.");

    }

  };
  // -----------------------------
  // Load Reports (Realtime)
  // -----------------------------

  useEffect(() => {

    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "lab_reports"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        const list = [];

        snapshot.forEach((doc) => {

          list.push({
            id: doc.id,
            ...doc.data(),
          });

        });

        setReports(list);

        setLoading(false);

      },
      (err) => {

        console.error(err);

        setError("Unable to load reports.");

        setLoading(false);

      }
    );

    return () => unsubscribe();

  }, []);

  // -----------------------------
  // Preview Report
  // -----------------------------

  const openReport = (url) => {

    window.open(url, "_blank");

  };

  // -----------------------------
  // AI Mock Analysis
  // (Gemini Integration in Next Step)
  // -----------------------------

  const analyzeReport = async (report) => {

    setAiSummary("Analyzing report using AI...");

    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );

    setAiSummary(`
🩺 AI Health Summary

• Report appears successfully uploaded.

• No critical abnormalities detected from metadata.

• Detailed AI analysis will be available after Gemini OCR integration.

• Future version will automatically identify:
   ✔ Blood Sugar
   ✔ Hemoglobin
   ✔ Cholesterol
   ✔ Liver Function
   ✔ Kidney Function
   ✔ Thyroid
   ✔ Vitamin Levels

Recommendation:

Please consult your physician for final diagnosis.
`);

  };

  // -----------------------------
  // Health Score (Temporary)
  // -----------------------------

  const healthScore = reports.length
    ? 92
    : 0;

  const scoreColor =
    healthScore >= 85
      ? "text-green-600"
      : healthScore >= 60
      ? "text-yellow-600"
      : "text-red-600";
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-800">
            🧪 AI Lab Report Analyzer
          </h1>

          <p className="text-slate-500 mt-2">
            Upload your Lab Reports and let AI organize your health records.
          </p>

        </div>

        {/* Loading */}

        {loading && (

          <div className="bg-white rounded-xl shadow p-6 text-center">

            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto"></div>

            <p className="mt-4 text-slate-600">
              Loading Reports...
            </p>

          </div>

        )}

        {/* Error */}

        {error && (

          <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-4 mb-6">

            {error}

          </div>

        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Upload Card */}

          <div className="lg:col-span-1 bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Upload Report
            </h2>

            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileSelect}
              className="w-full border rounded-lg p-3"
            />

            {previewURL && (

              <img
                src={previewURL}
                alt="Preview"
                className="mt-4 rounded-lg border"
              />

            )}

            {uploadProgress > 0 && (

              <div className="mt-5">

                <div className="flex justify-between text-sm mb-1">

                  <span>Uploading...</span>

                  <span>{uploadProgress}%</span>

                </div>

                <div className="bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-teal-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  ></div>

                </div>

              </div>

            )}

            <button
              onClick={uploadReport}
              disabled={uploading}
              className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
            >

              {uploading
                ? "Uploading..."
                : "Upload Report"}

            </button>

          </div>

          {/* Health Score */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">

              AI Health Score

            </h2>

            <div className="text-center">

              <div className={`text-6xl font-black ${scoreColor}`}>

                {healthScore}

              </div>

              <p className="text-slate-500 mt-2">

                Overall Health Score

              </p>

            </div>

            <div className="mt-8">

              <div className="w-full bg-slate-200 rounded-full h-4">

                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{
                    width: `${healthScore}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

          {/* AI Summary */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">

              🤖 AI Summary

            </h2>

            <div className="bg-slate-50 rounded-lg p-4 min-h-[220px] whitespace-pre-line text-sm leading-7">

              {aiSummary ||

                "Upload a report to receive AI-generated insights."}

            </div>

          </div>

        </div>

        {/* Report History */}

        <div className="mt-10 bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">

            Previous Reports

          </h2>

          {reports.length === 0 ? (

            <div className="text-slate-500">

              No reports uploaded yet.

            </div>

          ) : (

            <div className="space-y-4">

              {reports.map((report) => (

                <div
                  key={report.id}
                  className="border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >

                  <div>

                    <h3 className="font-bold">

                      {report.fileName}

                    </h3>

                    <p className="text-sm text-slate-500">

                      {report.fileType}

                    </p>

                    <p className="text-xs text-slate-400 mt-1">

                      Status : {report.status}

                    </p>

                  </div>

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        openReport(report.reportURL)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    >
                      Open
                    </button>

                    <button
                      onClick={() =>
                        analyzeReport(report)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                    >
                      Analyze
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </div>

    </div>
  );
}