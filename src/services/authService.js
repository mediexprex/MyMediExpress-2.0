import {
  auth,
} from "../firebase/config";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  deleteUser,
} from "firebase/auth";

import { createUserProfile } from "./userService";

/* =====================================================
   GOOGLE PROVIDER
===================================================== */

const googleProvider = new GoogleAuthProvider();

/* =====================================================
   REGISTER USER
===================================================== */

export async function registerUser(
  name,
  email,
  password
) {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  await updateProfile(
    userCredential.user,
    {
      displayName: name,
    }
  );

  await createUserProfile({
    ...userCredential.user,
    displayName: name,
  });

  return userCredential.user;
}

/* =====================================================
   LOGIN USER
===================================================== */

export async function loginUser(
  email,
  password
) {

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;
}

/* =====================================================
   GOOGLE LOGIN
===================================================== */

export async function googleLogin() {

  const result =
    await signInWithPopup(
      auth,
      googleProvider
    );

  await createUserProfile(result.user);

  return result.user;
}

/* =====================================================
   LOGOUT
===================================================== */

export async function logoutUser() {

  await signOut(auth);

}

/* =====================================================
   RESET PASSWORD
===================================================== */

export async function resetPassword(
  email
) {

  await sendPasswordResetEmail(
    auth,
    email
  );

}

/* =====================================================
   UPDATE DISPLAY NAME
===================================================== */

export async function updateUserDisplayName(
  name
) {

  if (!auth.currentUser) return;

  await updateProfile(
    auth.currentUser,
    {
      displayName: name,
    }
  );

}

/* =====================================================
   CHANGE PASSWORD
===================================================== */

export async function changeUserPassword(
  newPassword
) {

  if (!auth.currentUser) return;

  await updatePassword(
    auth.currentUser,
    newPassword
  );

}

/* =====================================================
   DELETE ACCOUNT
===================================================== */

export async function deleteCurrentAccount() {

  if (!auth.currentUser) return;

  await deleteUser(
    auth.currentUser
  );

}

/* =====================================================
   AUTH LISTENER
===================================================== */

export function listenAuth(callback) {

  return onAuthStateChanged(
    auth,
    callback
  );

}

/* =====================================================
   CURRENT USER
===================================================== */

export function getCurrentUser() {

  return auth.currentUser;

}

/* =====================================================
   ADMIN LOGIN (Backward Compatibility)
===================================================== */

export async function loginAdmin(
  email,
  password
) {

  return loginUser(
    email,
    password
  );

}

/* =====================================================
   ADMIN LOGOUT (Backward Compatibility)
===================================================== */

export async function logoutAdmin() {

  return logoutUser();

}