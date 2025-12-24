"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BottleSizeSelector from "@/components/perfume/BottleSizeSelector";
import GenderProfileSelector from "@/components/perfume/GenderProfileSelector";
import NotesSelector from "@/components/perfume/NotesSelector";
import RecommendationEngine from "@/components/perfume/RecommendationEngine";
import PerfumeNaming from "@/components/perfume/PerfumeNaming";
import BottlePreview from "@/components/perfume/BottlePreview";
import PriceDisplay from "@/components/perfume/PriceDisplay";
import { usePerfumeStore } from "@/store/perfumeStore";
import { notesData } from "@/data/notes";
import { useTheme } from "@/contexts/ThemeContext";
import type { PerfumeCreationStep } from "@/types";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps: {
  number: PerfumeCreationStep;
  title: string;
  description: string;
}[] = [
  { number: 1, title: "Bottle Size", description: "Choose your size" },
  { number: 2, title: "Gender Profile", description: "Select your preference" },
  { number: 3, title: "Choose Notes", description: "Build your fragrance" },
  { number: 4, title: "Recommendations", description: "Get inspired" },
  { number: 5, title: "Name Your Perfume", description: "Make it personal" },
  {
    number: 6,
    title: "Review & Add to Cart",
    description: "Finalize your order",
  },
];

export default function BuildPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { syncCart } = useCartStore();
  const {
    currentStep,
    setCurrentStep,
    canProceedToNextStep,
    selectedBottleSize,
    genderProfile,
    selectedTopNotes,
    selectedMiddleNotes,
    selectedBaseNotes,
    customPerfumeName,
    estimatedPrice,
    selectedPerfume,
    reset,
  } = usePerfumeStore();

  const bgColor = theme === "light" ? "bg-[#F6EDE6]" : "bg-[#0F172A]";
  const textColor = theme === "light" ? "text-[#1A1A1A]" : "text-[#F8F8F8]";
  const textSecondary = theme === "light" ? "text-[#4A4A4A]" : "text-[#D1D5DB]";
  const surfaceColor = theme === "light" ? "bg-white" : "bg-[#1E293B]";
  const accentColor = "bg-[#8B7355]";
  const accentText = "text-[#8B7355]";

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up ScrollTrigger on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < 6) {
      setCurrentStep((currentStep + 1) as PerfumeCreationStep);
      // Scroll to top of content
      contentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as PerfumeCreationStep);
      contentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAddToCart = async () => {
    try {
      // First, create the custom perfume
      const customPerfumeResponse = await fetch("/api/custom-perfumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customPerfumeName || undefined,
          bottleSizeId: selectedBottleSize!.id,
          genderProfile: genderProfile!.toUpperCase(),
          topNotes: selectedTopNotes,
          middleNotes: selectedMiddleNotes,
          baseNotes: selectedBaseNotes,
          inspirationProductId: selectedPerfume?.id || undefined,
        }),
      });

      if (!customPerfumeResponse.ok) {
        const error = await customPerfumeResponse.json();
        throw new Error(error.error || "Failed to create custom perfume");
      }

      const { customPerfume } = await customPerfumeResponse.json();

      // Then, add to cart
      const cartResponse = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customPerfumeId: customPerfume.id,
          quantity: 1,
        }),
      });

      if (!cartResponse.ok) {
        throw new Error("Failed to add to cart");
      }

      // Sync cart and redirect
      await syncCart();
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(
        error instanceof Error ? error.message : "Failed to add perfume to cart"
      );
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BottleSizeSelector />;
      case 2:
        return <GenderProfileSelector />;
      case 3:
        return <NotesSelector />;
      case 4:
        return <RecommendationEngine />;
      case 5:
        return <PerfumeNaming />;
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                Review Your Custom Perfume
              </h2>
              <p className="text-gray-600 text-sm">
                Review your selections before adding to cart.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Bottle Size</div>
                  <div className="font-semibold">
                    {selectedBottleSize?.size || "Not selected"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Gender Profile</div>
                  <div className="font-semibold capitalize">
                    {genderProfile || "Not selected"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Perfume Name</div>
                  <div className="font-semibold">
                    {customPerfumeName || "Unnamed"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Price</div>
                  <div className="font-semibold text-purple-600">
                    ${estimatedPrice?.toFixed(2) || "0.00"}
                  </div>
                </div>
              </div>

              {/* Notes Summary */}
              {(selectedTopNotes.length > 0 ||
                selectedMiddleNotes.length > 0 ||
                selectedBaseNotes.length > 0) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium mb-2">
                    Selected Notes:
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {selectedTopNotes.length > 0 && (
                      <div>
                        Top:{" "}
                        {selectedTopNotes
                          .map((n) => {
                            const note = notesData.find(
                              (note) => note.id === n.note_id
                            );
                            return note?.name;
                          })
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                    {selectedMiddleNotes.length > 0 && (
                      <div>
                        Middle:{" "}
                        {selectedMiddleNotes
                          .map((n) => {
                            const note = notesData.find(
                              (note) => note.id === n.note_id
                            );
                            return note?.name;
                          })
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                    {selectedBaseNotes.length > 0 && (
                      <div>
                        Base:{" "}
                        {selectedBaseNotes
                          .map((n) => {
                            const note = notesData.find(
                              (note) => note.id === n.note_id
                            );
                            return note?.name;
                          })
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 px-6 ${accentColor} text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity`}
            >
              Add to Cart - ${estimatedPrice?.toFixed(2) || "0.00"}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className={`min-h-screen ${bgColor} pt-20`}>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${textColor}`}>
            Build Your Perfume
          </h1>
          <p className={`text-lg ${textSecondary} max-w-2xl mx-auto`}>
            Create a custom fragrance that's uniquely yours. Follow the steps
            below to craft your signature scent.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isAccessible = currentStep >= step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => {
                        if (isAccessible) {
                          setCurrentStep(step.number);
                        }
                      }}
                      disabled={!isAccessible}
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-opacity ${
                        isActive
                          ? `${accentColor} text-white`
                          : isCompleted
                          ? "bg-green-600 text-white"
                          : theme === "light"
                          ? "bg-gray-200 text-gray-500"
                          : "bg-gray-700 text-gray-400"
                      } ${
                        isAccessible
                          ? "cursor-pointer hover:opacity-80"
                          : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        step.number
                      )}
                    </button>
                    <div className="mt-2 text-center hidden md:block">
                      <div
                        className={`text-xs font-medium ${
                          isActive ? accentText : textSecondary
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className={`text-xs ${textSecondary} opacity-70`}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div
              ref={contentRef}
              key={currentStep}
              className={`${surfaceColor} rounded-2xl shadow-md p-8`}
            >
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-opacity ${
                  currentStep === 1
                    ? theme === "light"
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : theme === "light"
                    ? "bg-gray-200 text-gray-700 hover:opacity-80"
                    : "bg-gray-700 text-gray-200 hover:opacity-80"
                }`}
              >
                ← Previous
              </button>

              {currentStep < 6 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceedToNextStep()}
                  className={`px-6 py-3 rounded-lg font-semibold transition-opacity ${
                    canProceedToNextStep()
                      ? `${accentColor} text-white hover:opacity-90`
                      : theme === "light"
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next →
                </button>
              ) : null}
            </div>
          </div>

          {/* Right Column: Preview & Summary */}
          <div className="space-y-6">
            <div
              className={`${surfaceColor} rounded-2xl shadow-md p-8 min-h-[500px] flex items-center justify-center`}
            >
              <BottlePreview />
            </div>

            <div className={`${surfaceColor} rounded-2xl shadow-md p-8`}>
              <PriceDisplay />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
