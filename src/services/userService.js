import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "../firebase/config";

/* =====================================================
   CREATE USER PROFILE
===================================================== */

export async function createUserProfile(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) return;

  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email || "",
    phone: user.phoneNumber || "",
    photo: user.photoURL || "",
    role: "customer",

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),

    addresses: [],

    stats: {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      cancelledOrders: 0,
    },
  });
}

/* =====================================================
   GET USER PROFILE
===================================================== */

export async function getUserProfile(uid) {

  const ref = doc(db, "users", uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data();

}

/* =====================================================
   UPDATE USER PROFILE
===================================================== */

export async function updateUserProfile(uid, data) {

  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });

}

/* =====================================================
   GET DASHBOARD STATS
===================================================== */

export async function getDashboardStats(uid) {

  const profile = await getUserProfile(uid);

  if (!profile) {

    return {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      cancelledOrders: 0,
    };

  }

  return profile.stats || {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  };

}

/* =====================================================
   GET SAVED ADDRESSES
===================================================== */

export async function getAddresses(uid) {

  const profile = await getUserProfile(uid);

  if (!profile) return [];

  return profile.addresses || [];

}

/* =====================================================
   ADD ADDRESS
===================================================== */

export async function addAddress(uid, address) {

  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    addresses: arrayUnion(address),
    updatedAt: serverTimestamp(),
  });

}

/* =====================================================
   DELETE ADDRESS
===================================================== */

export async function deleteAddress(uid, address) {

  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    addresses: arrayRemove(address),
    updatedAt: serverTimestamp(),
  });

}

/* =====================================================
   UPDATE PROFILE PHOTO
===================================================== */

export async function updateProfilePhoto(uid, photoUrl) {

  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    photo: photoUrl,
    updatedAt: serverTimestamp(),
  });

}