import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  addDoc,
 query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function SymptomTracker() {
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState("");

  const [symptoms, setSymptoms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const symptomOptions = [
    "Fever",
    "Headache",
    "Cough",
    "Cold",
    "Body Pain",
    "Stomach Pain",
    "Vomiting",
    "Diarrhea",
    "Dizziness",
    "Fatigue",
    "Chest Pain",
    "Shortness of Breath",
    "Sore Throat",
    "Other",
  ];

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "symptom_logs"),
      where("userId", "==", auth.currentUser.uid),
      where("date", "==", getTodayDate())
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

        setSymptoms(list);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to load symptom history.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveSymptom = async (e) => {
    e.preventDefault();

    if (!symptom) {
      alert("Please select a symptom.");
      return;
    }

    try {
      await addDoc(collection(db, "symptom_logs"), {
        userId: auth.currentUser.uid,
        symptom,
        severity: Number(severity),
        notes,
        date: getTodayDate(),
        createdAt: serverTimestamp(),
      });

      setSymptom("");
      setSeverity(5);
      setNotes("");
    } catch (err) {
      console.error(err);
      setError("Unable to save symptom.");
    }
  };

  const getSeverityColor = (level) => {
    if (level <= 3) return "text-green-600";
    if (level <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getAIInsight = () => {
    if (symptoms.length === 0)
      return "No symptoms recorded today.";

    const maxSeverity = Math.max(
      ...symptoms.map((s) => s.severity)
    );

    if (maxSeverity <= 3)
      return "Symptoms appear mild. Continue monitoring.";

    if (maxSeverity <= 6)
      return "Moderate symptoms detected. Stay hydrated and monitor changes.";

    return "Severe symptoms detected. Consider consulting a healthcare professional if symptoms worsen.";
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border border-slate-200 p-6">

      <h1 className="text-2xl font-bold mb-6">
        🩺 Symptom Tracker
      </h1>

      {loading && (
        <div className="text-blue-600 mb-3">
          Loading...
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={saveSymptom}
        className="space-y-4 mb-8"
      >

        <select
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select Symptom</option>

          {symptomOptions.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <div>

          <label className="block mb-2 font-semibold">
            Severity : {severity}/10
          </label>

          <input
            type="range"
            min="1"
            max="10"
            value={severity}
            onChange={(e) =>
              setSeverity(e.target.value)
            }
            className="w-full"
          />

        </div>

        <textarea
          rows="4"
          placeholder="Additional Notes..."
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Save Symptom
        </button>

      </form>

      <div className="bg-red-50 rounded-xl p-5 mb-8">

        <h2 className="font-bold text-lg mb-2">
          🤖 AI Health Insight
        </h2>

        <p className="text-slate-700">
          {getAIInsight()}
        </p>

        <p className="text-xs text-slate-500 mt-3">
          AI provides health information only and does not replace professional medical advice.
        </p>

      </div>

      <div>

        <h2 className="text-xl font-bold mb-4">
          Today's Symptoms
        </h2>

        {symptoms.length === 0 ? (
          <div className="text-slate-500">
            No symptoms recorded today.
          </div>
        ) : (
          <div className="space-y-3">

            {symptoms.map((item) => (

              <div
                key={item.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >

                <div>

                  <h3 className="font-bold">
                    {item.symptom}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.notes || "No Notes"}
                  </p>

                </div>

                <div
                  className={`font-bold text-lg ${getSeverityColor(
                    item.severity
                  )}`}
                >
                  {item.severity}/10
                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}