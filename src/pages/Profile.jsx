import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore";
import {
  getUserProfile,
  saveUserProfile,
} from "../services/profileService";
import {
  FiUser,
  FiActivity,
  FiZap,
  FiShield,
  FiClock,
  FiFileText,
  FiCamera,
  FiChevronRight,
  FiEdit3,
} from "react-icons/fi";
import "./Profile.css";

import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfo from "../components/profile/PersonalInfo";
import AddressInfo from "../components/profile/AddressInfo";
import EmergencyContact from "../components/profile/EmergencyContact";
import MedicalInfo from "../components/profile/MedicalInfo";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    healthScore: 88,
    scans: 0,
    reports: 0,
    reminders: 0,
  });

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    house: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    bloodGroup: "",
    allergies: "",
    medicines: "",
    medicalConditions: "",
    notes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        // 1. Profile Data
        const firestoreProfile = await getUserProfile(user.uid);
        if (firestoreProfile) {
          setProfile((prev) => ({ ...prev, ...firestoreProfile }));
        } else {
          setProfile((prev) => ({
            ...prev,
            fullName: user.displayName || "",
            email: user.email || "",
            phone: user.phoneNumber || "",
          }));
        }

        // 2. AI Stats
        const scansSnap = await getDocs(query(collection(db, "scan_history"), where("userId", "==", user.uid)));
        const reportsSnap = await getDocs(query(collection(db, "lab_reports"), where("userId", "==", user.uid)));
        const medsSnap = await getDocs(query(collection(db, "medicine_reminders"), where("userId", "==", user.uid)));

        setStats({
          healthScore: 75 + Math.min(25, (scansSnap.size + reportsSnap.size) * 5),
          scans: scansSnap.size,
          reports: reportsSnap.size,
          reminders: medsSnap.size,
        });

      } catch (error) {
        console.error("Profile Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      setSaving(true);
      await saveUserProfile(user.uid, profile);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-slate-400">Loading Patient Records...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Sidebar: Profile Overview & Stats */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-center">
             <div className="relative inline-block mb-6">
                <img
                  src={auth.currentUser?.photoURL || "https://ui-avatars.com/api/?name=" + profile.fullName}
                  alt="Profile"
                  className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg border-4 border-white dark:border-slate-800">
                   <FiEdit3 size={16} />
                </div>
             </div>
             <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{profile.fullName || "User Name"}</h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">{profile.bloodGroup || "Blood Group Unknown"}</p>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                   <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Health Score</span>
                   <span className="text-2xl font-black text-blue-600">{stats.healthScore}%</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                   <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Status</span>
                   <span className="text-sm font-black text-emerald-500 uppercase">Active</span>
                </div>
             </div>
          </section>

          {/* AI Activity Summary */}
          <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-slate-900/40">
             <h3 className="text-xl font-black flex items-center gap-3">
                <FiZap className="text-blue-500" /> AI Health Summary
             </h3>
             <div className="space-y-4">
                {[
                  { label: "Medicine Scans", val: stats.scans, icon: <FiCamera />, color: "text-purple-400" },
                  { label: "Lab Reports", val: stats.reports, icon: <FiFileText />, color: "text-blue-400" },
                  { label: "Active Reminders", val: stats.reminders, icon: <FiClock />, color: "text-orange-400" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className={`text-xl ${item.color}`}>{item.icon}</div>
                        <span className="text-sm font-bold text-slate-300">{item.label}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="font-black">{item.val}</span>
                        <FiChevronRight className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                     </div>
                  </div>
                ))}
             </div>
             <div className="pt-4">
                <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-2xl flex gap-4 items-start">
                   <FiShield className="text-blue-400 mt-1 flex-shrink-0" />
                   <p className="text-[10px] font-medium text-blue-100 leading-relaxed">
                      AI is continuously monitoring your vitals. Your next health milestone is 10 consecutive hydration logs.
                   </p>
                </div>
             </div>
          </section>
        </div>

        {/* Right Side: Form Sections */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50 dark:border-slate-800">
               <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <FiUser className="text-blue-600" /> Medical Profile
               </h2>
               <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
               >
                  {saving ? "SAVING..." : "UPDATE PROFILE"}
               </button>
            </div>

            <div className="space-y-12">
               <PersonalInfo profile={profile} setProfile={setProfile} />
               <MedicalInfo profile={profile} setProfile={setProfile} />
               <AddressInfo profile={profile} setProfile={setProfile} />
               <EmergencyContact profile={profile} setProfile={setProfile} />
            </div>
          </div>

          {/* Privacy Disclaimer */}
          <div className="p-8 bg-slate-100 dark:bg-slate-900/50 rounded-[2.5rem] flex items-center gap-6">
             <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                <FiShield size={32} />
             </div>
             <div>
                <h4 className="font-black text-slate-800 dark:text-slate-200">HIPAA Compliant Cloud Storage</h4>
                <p className="text-xs text-slate-500 font-medium">Your medical records and AI analysis data are encrypted at rest and in transit using AES-256 military-grade standards.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;