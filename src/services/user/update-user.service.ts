import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const completeOnboarding = async (
  uid: string,
  role: string
) => {
  await updateDoc(doc(db, "users", uid), {
    role,
    onboardingCompleted: true,
    updatedAt: serverTimestamp(),
  });
};