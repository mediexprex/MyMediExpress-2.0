import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/config";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  FaCapsules,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaInfoCircle,
  FaClock,
  FaHeartbeat,
  FaShieldAlt,
  FaPlusCircle,
  FaCheckCircle,
} from "react-icons/fa";

export default function MedicineDetails({

  medicineId = "demo",

  medicineData = {},

}) {

  const [medicine, setMedicine] = useState({

    name: "",

    manufacturer: "",

    dosage: "",

    batchNumber: "",

    expiryDate: "",

    manufactureDate: "",

    description: "",

    uses: [],

    sideEffects: [],

    warnings: [],

    storage: "",

    image: "",

  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [aiSummary, setAiSummary] = useState("");

  const [riskLevel, setRiskLevel] = useState("Low");

  const [expiryDays, setExpiryDays] = useState(null);

  const [reminderAdded, setReminderAdded] = useState(false);

  const [timelineAdded, setTimelineAdded] = useState(false);

  // -----------------------------------
  // Load Medicine
  // -----------------------------------

  useEffect(() => {

    loadMedicine();

  }, []);

  const loadMedicine = async () => {

    try {

      setLoading(true);

      if (medicineData?.name) {

        setMedicine(medicineData);

        calculateExpiry(medicineData.expiryDate);

        generateAISummary(medicineData);

      } else {

        const ref = doc(
          db,
          "medicines",
          medicineId
        );

        const snap = await getDoc(ref);

        if (snap.exists()) {

          const data = snap.data();

          setMedicine(data);

          calculateExpiry(data.expiryDate);

          generateAISummary(data);

        } else {

          setError("Medicine not found.");

        }

      }

    } catch (err) {

      console.error(err);

      setError("Unable to load medicine.");

    } finally {

      setLoading(false);

    }

  };

  // -----------------------------------
  // Expiry Detection
  // -----------------------------------

  const calculateExpiry = (expiryDate) => {

    if (!expiryDate) return;

    const today = new Date();

    const expiry = new Date(expiryDate);

    const diff = expiry - today;

    const days = Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );

    setExpiryDays(days);

    if (days < 0) {

      setRiskLevel("Expired");

    } else if (days <= 30) {

      setRiskLevel("High");

    } else if (days <= 90) {

      setRiskLevel("Medium");

    } else {

      setRiskLevel("Low");

    };

  };

  // -----------------------------------
  // AI Summary
  // -----------------------------------

  const generateAISummary = (data) => {

    let summary = "";

    summary += `Medicine: ${data.name}\n\n`;

    summary += `Dosage: ${data.dosage}\n\n`;

    summary += `Manufacturer: ${data.manufacturer}\n\n`;

    summary += `Uses:\n`;

    if (data.uses?.length) {

      data.uses.forEach((item) => {

        summary += `• ${item}\n`;

      });

    }

    summary += `\n`;

    summary += `Risk Level: ${riskLevel}\n`;

    summary += `\n`;

    summary +=
      "Always take this medicine exactly as prescribed by your doctor.\n\n";

    summary +=
      "AI provides informational guidance only and does not replace professional medical advice.";

    setAiSummary(summary);

  };
  // -----------------------------------
  // Add Medicine Reminder
  // -----------------------------------

  const addReminder = async () => {

    if (!auth.currentUser) {
      alert("Please login first.");
      return;
    }

    try {

      const reminderRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "medicine_reminders",
        medicineId
      );

      await setDoc(reminderRef, {

        medicineId,

        medicineName: medicine.name,

        dosage: medicine.dosage,

        reminderTime: "08:00",

        status: "active",

        createdAt: serverTimestamp(),

      });

      setReminderAdded(true);

    } catch (err) {

      console.error(err);

      alert("Unable to create reminder.");

    }

  };

  // -----------------------------------
  // Add Health Timeline
  // -----------------------------------

  const addTimeline = async () => {

    if (!auth.currentUser) {
      alert("Please login first.");
      return;
    }

    try {

      const timelineRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "health_timeline",
        Date.now().toString()
      );

      await setDoc(timelineRef, {

        medicineName: medicine.name,

        dosage: medicine.dosage,

        batchNumber: medicine.batchNumber,

        event: "Medicine Added",

        createdAt: serverTimestamp(),

      });

      setTimelineAdded(true);

    } catch (err) {

      console.error(err);

      alert("Unable to update timeline.");

    }

  };

  // -----------------------------------
  // Drug Interaction
  // -----------------------------------

  const drugInteractions = [

    "Avoid Alcohol while taking this medicine.",

    "Avoid taking with other pain killers without doctor's advice.",

    "Inform your doctor if taking Blood Thinners.",

    "Use carefully in Kidney Disease.",

    "Use carefully in Liver Disease.",

  ];

  // -----------------------------------
  // Dosage Guide
  // -----------------------------------

  const dosageGuide = [

    {
      title: "Morning",
      value: "After Breakfast"
    },

    {
      title: "Afternoon",
      value: "Only if prescribed"
    },

    {
      title: "Night",
      value: "After Dinner"
    }

  ];

  // -----------------------------------
  // Emergency Warning
  // -----------------------------------

  const emergencyWarnings = [

    "Stop medicine immediately if severe allergy develops.",

    "Visit nearest hospital if breathing difficulty occurs.",

    "Consult doctor if symptoms worsen.",

    "Do not exceed prescribed dosage.",

  ];

  // -----------------------------------
  // Storage Information
  // -----------------------------------

  const storageGuide = [

    "Store below 25°C.",

    "Protect from direct sunlight.",

    "Keep away from children.",

    "Do not use after expiry.",

  ];

  // -----------------------------------
  // Risk Color
  // -----------------------------------

  const riskColor =

    riskLevel === "Expired"
      ? "text-red-600"

      : riskLevel === "High"
      ? "text-orange-500"

      : riskLevel === "Medium"
      ? "text-yellow-500"

      : "text-green-600";

  // -----------------------------------
  // Expiry Badge
  // -----------------------------------

  const expiryBadge =

    riskLevel === "Expired"
      ? "bg-red-100 text-red-700"

      : riskLevel === "High"
      ? "bg-orange-100 text-orange-700"

      : riskLevel === "Medium"
      ? "bg-yellow-100 text-yellow-700"

      : "bg-green-100 text-green-700";
  // -----------------------------------
  // UI
  // -----------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-teal-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600">
            Loading Medicine Details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-red-100 border border-red-300 rounded-xl p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              💊 Medicine Details
            </h1>

            <p className="text-slate-500 mt-1">
              AI Powered Medicine Information
            </p>

          </div>

          <div
            className={`px-4 py-2 rounded-full font-semibold ${expiryBadge}`}
          >
            {riskLevel}
          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Medicine Information */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">

            <div className="flex gap-5">

              <div className="w-32 h-32 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">

                {medicine.image ? (

                  <img
                    src={medicine.image}
                    alt={medicine.name}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <FaCapsules
                    className="text-teal-500"
                    size={55}
                  />

                )}

              </div>

              <div className="flex-1">

                <h2 className="text-2xl font-bold">

                  {medicine.name}

                </h2>

                <p className="text-slate-500 mt-1">

                  {medicine.manufacturer}

                </p>

                <div className="grid md:grid-cols-2 gap-4 mt-6">

                  <div className="bg-slate-50 rounded-lg p-4">

                    <p className="text-xs text-slate-500">
                      Dosage
                    </p>

                    <h3 className="font-semibold mt-1">
                      {medicine.dosage}
                    </h3>

                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">

                    <p className="text-xs text-slate-500">
                      Batch Number
                    </p>

                    <h3 className="font-semibold mt-1">
                      {medicine.batchNumber}
                    </h3>

                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">

                    <p className="text-xs text-slate-500">
                      Manufacture Date
                    </p>

                    <h3 className="font-semibold mt-1">
                      {medicine.manufactureDate}
                    </h3>

                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">

                    <p className="text-xs text-slate-500">
                      Expiry Date
                    </p>

                    <h3 className="font-semibold mt-1">
                      {medicine.expiryDate}
                    </h3>

                  </div>

                </div>

              </div>

            </div>

            {/* Description */}

            <div className="mt-8">

              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">

                <FaInfoCircle />

                Description

              </h3>

              <div className="bg-slate-50 rounded-lg p-4">

                {medicine.description || "No description available."}

              </div>

            </div>

          </div>

          {/* AI Summary */}

          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex items-center gap-2 mb-5">

              <FaHeartbeat className="text-teal-500" />

              <h2 className="text-xl font-bold">

                AI Summary

              </h2>

            </div>

            <div className="bg-teal-50 rounded-xl p-5 whitespace-pre-line text-sm leading-7">

              {aiSummary}

            </div>

            <div className="mt-6">

              <div className="flex justify-between mb-2">

                <span className="text-sm text-slate-500">
                  Expiry Status
                </span>

                <span className={`font-bold ${riskColor}`}>
                  {riskLevel}
                </span>

              </div>

              <div className="w-full bg-slate-200 rounded-full h-3">

                <div
                  className={`h-3 rounded-full ${
                    riskLevel === "Expired"
                      ? "bg-red-500"
                      : riskLevel === "High"
                      ? "bg-orange-500"
                      : riskLevel === "Medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      Math.max(
                        ((365 - (expiryDays || 0)) / 365) * 100,
                        5
                      ),
                      100
                    )}%`,
                  }}
                ></div>

              </div>

              <p className="text-sm text-slate-500 mt-3">

                {expiryDays >= 0
                  ? `${expiryDays} days remaining`
                  : "Medicine Expired"}

              </p>

            </div>

          </div>

        </div>
        {/* Bottom Information Section */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          {/* Uses */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-5">

              <FaCheckCircle className="text-green-600" />

              Uses

            </h2>

            <ul className="space-y-3">

              {(medicine.uses || []).length > 0 ? (

                medicine.uses.map((item, index) => (

                  <li
                    key={index}
                    className="bg-green-50 rounded-lg p-3"
                  >
                    • {item}
                  </li>

                ))

              ) : (

                <li className="text-slate-500">
                  No usage information available.
                </li>

              )}

            </ul>

          </div>

          {/* Side Effects */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-5">

              <FaExclamationTriangle className="text-yellow-500" />

              Possible Side Effects

            </h2>

            <ul className="space-y-3">

              {(medicine.sideEffects || []).length > 0 ? (

                medicine.sideEffects.map((item, index) => (

                  <li
                    key={index}
                    className="bg-yellow-50 rounded-lg p-3"
                  >
                    • {item}
                  </li>

                ))

              ) : (

                <li className="text-slate-500">
                  No side effects available.
                </li>

              )}

            </ul>

          </div>

        </div>

        {/* Drug Interaction + Storage */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">

              Drug Interactions

            </h2>

            <ul className="space-y-3">

              {drugInteractions.map((item, index) => (

                <li
                  key={index}
                  className="bg-red-50 rounded-lg p-3"
                >
                  • {item}
                </li>

              ))}

            </ul>

          </div>

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">

              Storage Instructions

            </h2>

            <ul className="space-y-3">

              {storageGuide.map((item, index) => (

                <li
                  key={index}
                  className="bg-blue-50 rounded-lg p-3"
                >
                  • {item}
                </li>

              ))}

            </ul>

          </div>

        </div>

        {/* Emergency Warnings */}

        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <h2 className="text-xl font-bold flex items-center gap-2 mb-5">

            <FaShieldAlt className="text-red-600" />

            Emergency Warnings

          </h2>

          <ul className="space-y-3">

            {emergencyWarnings.map((item, index) => (

              <li
                key={index}
                className="bg-red-100 rounded-lg p-3"
              >
                • {item}
              </li>

            ))}

          </ul>

        </div>

        {/* Dosage Schedule */}

        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <h2 className="text-xl font-bold flex items-center gap-2 mb-5">

            <FaClock />

            Recommended Schedule

          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            {dosageGuide.map((item, index) => (

              <div
                key={index}
                className="bg-slate-50 rounded-xl p-5 text-center"
              >

                <h3 className="font-bold">

                  {item.title}

                </h3>

                <p className="text-slate-500 mt-2">

                  {item.value}

                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Action Buttons */}

        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <div className="flex flex-wrap gap-4">

            <button
              onClick={addReminder}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl"
            >
              <FaPlusCircle />

              Add Reminder

            </button>

            <button
              onClick={addTimeline}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              <FaCalendarAlt />

              Add Timeline

            </button>

          </div>

          {reminderAdded && (

            <div className="mt-5 bg-green-100 border border-green-300 rounded-xl p-4 text-green-700">

              ✅ Medicine reminder added successfully.

            </div>

          )}

          {timelineAdded && (

            <div className="mt-4 bg-blue-100 border border-blue-300 rounded-xl p-4 text-blue-700">

              ✅ Medicine added to Health Timeline.

            </div>

          )}

        </div>
      </div>

    </div>
  );
}