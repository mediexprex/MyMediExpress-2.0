import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  limit,
  onSnapshot,
} from "firebase/firestore";

export default function AIDashboard() {
  const [vitals, setVitals] = useState({
    water: 0,
    calories: 0,
    steps: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiTip, setAiTip] = useState(
    "🤖 Analyzing your health data..."
  );

  useEffect(() => {
    const q = query(collection(db, "daily_logs"), limit(1));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();

          setVitals({
            water: data.waterML || 0,
            calories: data.calories || 0,
            steps: data.steps || 0,
          });
        }

        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to load dashboard.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (vitals.water < 1000) {
      setAiTip("💧 Drink more water today.");
    } else if (vitals.calories < 1200) {
      setAiTip("🍎 Your calorie intake is low.");
    } else if (vitals.steps < 5000) {
      setAiTip("🚶 Try walking a little more today.");
    } else {
      setAiTip(
        "✅ Excellent! Your daily health activity looks good."
      );
    }
  }, [vitals]);

  const healthScore = Math.min(
    100,
    Math.round(
      (vitals.water / 2000) * 30 +
        (vitals.calories / 2500) * 30 +
        (vitals.steps / 10000) * 40
    )
  );

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">
          Loading AI Dashboard...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          AI Health Dashboard
        </h1>

        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
          Live
        </span>
      </div>

      {/* AI Insight */}

      <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-xl p-6 text-white mb-6">
        <h2 className="text-xl font-bold mb-2">
          🤖 AI Health Companion
        </h2>

        <p>{aiTip}</p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Water */}

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">
            💧 Water Intake
          </h3>

          <p className="text-3xl font-bold mt-2">
            {vitals.water} ml
          </p>

          <div className="mt-3 bg-gray-200 h-2 rounded-full">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  (vitals.water / 2000) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Calories */}

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">
            🍽 Calories
          </h3>

          <p className="text-3xl font-bold mt-2">
            {vitals.calories}
          </p>

          <div className="mt-3 bg-gray-200 h-2 rounded-full">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  (vitals.calories / 2500) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Steps */}

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">
            🚶 Steps
          </h3>

          <p className="text-3xl font-bold mt-2">
            {vitals.steps}
          </p>

          <div className="mt-3 bg-gray-200 h-2 rounded-full">
            <div
              className="bg-orange-500 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  (vitals.steps / 10000) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Health Score */}

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">
            ❤️ Health Score
          </h3>

          <p className="text-4xl font-bold text-green-600 mt-2">
            {healthScore}%
          </p>

          <p className="text-sm mt-2 text-gray-500">
            Overall Daily Health
          </p>
        </div>

      </div>

      {/* Coming Soon */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold mb-3">
            💊 Medicine Reminder
          </h3>

          <p className="text-gray-500">
            Coming in next module...
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold mb-3">
            📊 Health Timeline
          </h3>

          <p className="text-gray-500">
            Coming in next module...
          </p>
        </div>

      </div>

    </div>
  );
}