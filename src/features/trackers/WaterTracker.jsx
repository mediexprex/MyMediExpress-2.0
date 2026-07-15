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

export default function WaterTracker() {
  const [water, setWater] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const target = 2000;

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "water_logs"),
      where("userId", "==", auth.currentUser.uid),
      where("date", "==", getTodayDate())
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let total = 0;

        snapshot.forEach((doc) => {
          total += doc.data().amount || 0;
        });

        setWater(total);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to load water data.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddWater = async (amount) => {
    const value = parseInt(amount);

    if (isNaN(value) || value <= 0) return;

    if (!auth.currentUser) {
      alert("Please login first.");
      return;
    }

    try {
      setError("");

      await addDoc(collection(db, "water_logs"), {
        userId: auth.currentUser.uid,
        amount: value,
        date: getTodayDate(),
        createdAt: serverTimestamp(),
      });

      setCustomAmount("");
    } catch (err) {
      console.error(err);
      setError("Failed to save water log.");
    }
  };

  const progress = Math.min((water / target) * 100, 100);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow border border-slate-200 p-6">

      <h2 className="text-2xl font-bold text-center mb-2">
        💧 Water Tracker
      </h2>

      <p className="text-center text-gray-500 mb-5">
        Daily Goal: {target} ml
      </p>

      {loading && (
        <div className="text-center text-blue-600 mb-3">
          Loading...
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 rounded-lg p-3 mb-3 text-sm">
          {error}
        </div>
      )}

      <div className="mb-5">

        <div className="flex justify-between mb-2">
          <span>Today's Intake</span>
          <strong>{water} ml</strong>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">

        <button
          onClick={() => handleAddWater(250)}
          className="bg-blue-500 text-white rounded-lg py-3 font-semibold hover:bg-blue-600"
        >
          +250 ml
        </button>

        <button
          onClick={() => handleAddWater(500)}
          className="bg-green-500 text-white rounded-lg py-3 font-semibold hover:bg-green-600"
        >
          +500 ml
        </button>

      </div>

      <div className="flex gap-2">

        <input
          type="number"
          placeholder="Custom ml"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
        />

        <button
          onClick={() => handleAddWater(customAmount)}
          className="bg-indigo-600 text-white px-5 rounded-lg hover:bg-indigo-700"
        >
          Add
        </button>

      </div>

      <div className="mt-6 bg-slate-50 rounded-lg p-4">

        <h3 className="font-semibold mb-2">
          AI Hydration Insight
        </h3>

        <p className="text-sm text-gray-600">
          {water < 1000 &&
            "💧 Drink more water to stay hydrated."}

          {water >= 1000 &&
            water < 1800 &&
            "👍 Good progress. Keep drinking water."}

          {water >= 1800 &&
            "✅ Excellent! Daily hydration goal almost achieved."}
        </p>

      </div>

    </div>
  );
}