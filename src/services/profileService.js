import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  db,
  storage,
} from "../firebase/config";

/* =====================================================
   DEFAULT PROFILE DATA
===================================================== */

export const defaultProfile = {

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

  profilePhoto: "",

};

/* =====================================================
   UPLOAD PROFILE PHOTO
===================================================== */

export async function uploadProfilePhoto(
  uid,
  file
) {

  if (!file) return null;

  const storageRef = ref(
    storage,
    `profilePhotos/${uid}/${Date.now()}-${file.name}`
  );

  await uploadBytes(
    storageRef,
    file
  );

  const photoURL =
    await getDownloadURL(storageRef);

  return photoURL;

}
/* =====================================================
   SAVE USER PROFILE
===================================================== */

export async function saveUserProfile(
  uid,
  profileData
) {

  if (!uid) {
    throw new Error("User ID is required.");
  }

  const userRef = doc(
    db,
    "users",
    uid
  );

  const dataToSave = {
    ...profileData,

    updatedAt: serverTimestamp(),
  };

  // Never save local File object to Firestore
  delete dataToSave.profilePhotoFile;

  await setDoc(
    userRef,
    dataToSave,
    {
      merge: true,
    }
  );

}

/* =====================================================
   GET USER PROFILE
===================================================== */

export async function getUserProfile(
  uid
) {

  if (!uid) return null;

  const userRef = doc(
    db,
    "users",
    uid
  );

  const snapshot =
    await getDoc(userRef);

  if (!snapshot.exists()) {

    return null;

  }

  return snapshot.data();

}
/* =====================================================
   UPDATE PROFILE PHOTO URL
===================================================== */

export async function updateProfilePhoto(
  uid,
  photoURL
) {

  if (!uid) {
    throw new Error("User ID is required.");
  }

  const userRef = doc(
    db,
    "users",
    uid
  );

  await updateDoc(
    userRef,
    {
      profilePhoto: photoURL,
      updatedAt: serverTimestamp(),
    }
  );

}

/* =====================================================
   DELETE PROFILE PHOTO FROM STORAGE
===================================================== */

export async function deleteProfilePhoto(
  storagePath
) {

  if (!storagePath) return;

  try {

    const photoRef = ref(
      storage,
      storagePath
    );

    await deleteObject(photoRef);

  } catch (error) {

    console.warn(
      "Unable to delete profile photo:",
      error.message
    );

  }

}

/* =====================================================
   CHECK PROFILE EXISTS
===================================================== */

export async function profileExists(
  uid
) {

  if (!uid) return false;

  const userRef = doc(
    db,
    "users",
    uid
  );

  const snapshot =
    await getDoc(userRef);

  return snapshot.exists();

}
/* =====================================================
   DELETE USER PROFILE
===================================================== */

export async function deleteUserProfile(
  uid
) {

  if (!uid) {
    throw new Error("User ID is required.");
  }

  const userRef = doc(
    db,
    "users",
    uid
  );

  await deleteDoc(
    userRef
  );

}

/* =====================================================
   UPDATE LAST LOGIN
===================================================== */

export async function updateLastLogin(
  uid
) {

  if (!uid) return;

  const userRef = doc(
    db,
    "users",
    uid
  );

  await updateDoc(
    userRef,
    {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

}

/* =====================================================
   GET PROFILE PHOTO URL
===================================================== */

export async function getProfilePhoto(
  uid
) {

  if (!uid) return "";

  const profile =
    await getUserProfile(uid);

  return profile?.profilePhoto || "";

}
