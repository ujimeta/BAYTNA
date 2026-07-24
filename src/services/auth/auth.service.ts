import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/services/user/user.service";

/**
 * Register a new user
 */
export const registerUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await createUserProfile(
    userCredential.user.uid,
    fullName,
    email
  );

  await sendEmailVerification(userCredential.user);

  return userCredential.user;
};

/**
 * Login user
 */
export const loginUser = async (
  email: string,
  password: string
) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Logout
 */
export const logoutUser = async () => {
  await signOut(auth);
};