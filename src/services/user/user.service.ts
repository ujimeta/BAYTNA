import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const createUserProfile = async (
  uid: string,
  fullName: string,
  email: string
) => {
  await setDoc(doc(db, "users", uid), {
    uid,
    fullName,
    email,

    role: "",

    onboardingCompleted: false,

    profilePhoto: "",

    phoneNumber: "",

    accountStatus: "active",

    emailVerified: false,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  });
};