import { auth } from "@/lib/firebase";
import { completeOnboarding } from "@/services/user/update-user.service";
import { useLocation } from "wouter";
import { useState } from "react";

import UserTypeCard from "./UserTypeCard";
import JourneyPreview from "./JourneyPreview";

import { onboardingOptions } from "@/data/onboarding-options";
import { journeyPreviews } from "@/data/journey-previews";

export default function UserTypeSelector() {
  const [selectedId, setSelectedId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [, navigate] = useLocation();

  const handleContinue = async () => {
    if (!selectedId) return;

    try {
      setIsSaving(true);

      const user = auth.currentUser;

      if (!user) {
        alert("Please sign in again.");
        return;
      }

      await completeOnboarding(user.uid, selectedId);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving your journey.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedJourney =
    selectedId &&
    journeyPreviews[selectedId as keyof typeof journeyPreviews];

  return (
    <>
      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {onboardingOptions.map((option) => (
          <UserTypeCard
            key={option.id}
            emoji={option.emoji}
            title={option.title}
            description={option.description}
            selected={selectedId === option.id}
            onClick={() => setSelectedId(option.id)}
          />
        ))}
      </div>

      {selectedJourney && (
        <JourneyPreview
          title={selectedJourney.title}
          description={selectedJourney.description}
          experienceCards={selectedJourney.experienceCards}
          buttonText={
            isSaving
              ? "Preparing your BAYTNA experience..."
              : selectedJourney.buttonText
          }
          onContinue={handleContinue}
        />
      )}
    </>
  );
}