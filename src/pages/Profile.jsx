import { useEffect, useState } from "react";
import { auth } from "../firebase/config";

import {
  getUserProfile,
  saveUserProfile,
} from "../services/profileService";

import "./Profile.css";

import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfo from "../components/profile/PersonalInfo";
import AddressInfo from "../components/profile/AddressInfo";
import EmergencyContact from "../components/profile/EmergencyContact";
import MedicalInfo from "../components/profile/MedicalInfo";

function Profile() {

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

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

    const loadProfile = async () => {

      try {

        const user = auth.currentUser;

        if (!user) {
          setLoading(false);
          return;
        }

        const firestoreProfile =
          await getUserProfile(user.uid);

        if (firestoreProfile) {

          setProfile((prev) => ({
            ...prev,
            ...firestoreProfile,
          }));

        } else {

          setProfile((prev) => ({
            ...prev,
            fullName: user.displayName || "",
            email: user.email || "",
            phone: user.phoneNumber || "",
          }));

        }

      } catch (error) {

        console.error("Profile Load Error:", error);

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);

  const handleSaveProfile = async () => {

    try {

      const user = auth.currentUser;

      if (!user) {
        alert("Please login first.");
        return;
      }

      setSaving(true);

      await saveUserProfile(
        user.uid,
        profile
      );

      alert("Profile saved successfully.");

    } catch (error) {

      console.error("Save Error:", error);

      alert("Failed to save profile.");

    } finally {

      setSaving(false);

    }

  };
  if (loading) {
    return (
      <section className="profile-page">
        <div className="profile-container">

          <h2
            style={{
              textAlign: "center",
              padding: "50px 0",
            }}
          >
            Loading Profile...
          </h2>

        </div>
      </section>
    );
  }

  return (

    <section className="profile-page">

      <div className="profile-container">

        <ProfileHeader
          profile={profile}
        />

        <PersonalInfo
          profile={profile}
          setProfile={setProfile}
        />

        <AddressInfo
          profile={profile}
          setProfile={setProfile}
        />

        <EmergencyContact
          profile={profile}
          setProfile={setProfile}
        />

        <MedicalInfo
          profile={profile}
          setProfile={setProfile}
        />

        <div className="profile-actions">

          <button
            type="button"
            className="save-btn"
            onClick={handleSaveProfile}
            disabled={saving}
          >

            {saving
              ? "Saving Profile..."
              : "Save Profile"}

          </button>

        </div>

      </div>

    </section>

  );
}

export default Profile;