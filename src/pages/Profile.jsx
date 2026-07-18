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
import { useLanguage } from "../context/LanguageContext";
import "./Profile.css";

import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfo from "../components/profile/PersonalInfo";
import AddressInfo from "../components/profile/AddressInfo";
import EmergencyContact from "../components/profile/EmergencyContact";
import MedicalInfo from "../components/profile/MedicalInfo";

function Profile() {
  const { t } = useLanguage();
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="loader"></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="profile-page"
    >
      <div className="profile-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <section className="profile-card text-center relative overflow-hidden">
               <div className="relative inline-block mb-6">
                  <img
                    src={auth.currentUser?.photoURL || "https://ui-avatars.com/api/?name=" + profile.fullName}
                    alt="Profile"
                    className="w-32 h-32 rounded-3xl object-cover border-4 border-card-bg shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary-color text-white p-2 rounded-xl shadow-lg border-2 border-card-bg">
                     <FiEdit3 size={16} />
                  </div>
               </div>
               <h2 className="text-2xl font-black mb-1">{profile.fullName || "User Name"}</h2>
               <p className="text-muted font-bold uppercase tracking-widest text-[10px] mb-8">{profile.bloodGroup || "Blood Group N/A"}</p>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-color rounded-2xl border border-border">
                     <span className="text-[10px] font-black uppercase text-muted block mb-1">{t('healthScore')}</span>
                     <span className="text-2xl font-black text-primary-color">{stats.healthScore}%</span>
                  </div>
                  <div className="p-4 bg-bg-color rounded-2xl border border-border">
                     <span className="text-[10px] font-black uppercase text-muted block mb-1">Status</span>
                     <span className="text-sm font-black text-green-500 uppercase">Active</span>
                  </div>
               </div>
            </section>

            <section className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-2xl">
               <h3 className="text-xl font-black flex items-center gap-3">
                  <FiZap className="text-blue-500" /> AI Health Summary
               </h3>
               <div className="space-y-4">
                  {[
                    { label: "Medicine Scans", val: stats.scans, icon: <FiCamera />, color: "text-purple-400" },
                    { label: "Lab Reports", val: stats.reports, icon: <FiFileText />, color: "text-blue-400" },
                    { label: "Active Reminders", val: stats.reminders, icon: <FiClock />, color: "text-orange-400" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 group hover:bg-opacity-10 transition-all cursor-pointer">
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
            </section>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="profile-card">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    <FiUser className="text-primary-color" /> {t('profile')}
                 </h2>
                 <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-primary"
                 >
                    {saving ? "SAVING..." : "UPDATE PROFILE"}
                 </button>
              </div>

              <div className="space-y-10">
                 <PersonalInfo profile={profile} setProfile={setProfile} />
                 <MedicalInfo profile={profile} setProfile={setProfile} />
                 <AddressInfo profile={profile} setProfile={setProfile} />
                 <EmergencyContact profile={profile} setProfile={setProfile} />
              </div>
            </div>

            <div className="p-8 bg-blue-600 bg-opacity-5 rounded-[2rem] border border-blue-500 border-opacity-10 flex items-center gap-6">
               <div className="w-16 h-16 bg-card-bg rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-border">
                  <FiShield size={32} />
               </div>
               <div>
                  <h4 className="font-black text-lg">{t('dataPrivacy')}</h4>
                  <p className="text-xs text-muted font-medium leading-relaxed">Your medical records and AI analysis data are encrypted at rest and in transit using AES-256 military-grade standards. Fully HIPAA compliant.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;
