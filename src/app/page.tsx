"use client";

import SplitHero from "@/components/hero/SplitHero";
import BottlesSection from "@/components/sections/BottlesSection";
import Footer from "@/components/ui/Footer";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-gray-900" : "text-white";
  const textSecondary = theme === "light" ? "text-gray-600" : "text-gray-300";
  const bgOverlay = theme === "light" ? "bg-gray-200/80" : "bg-gray-800/80";

  return (
    <main className="min-h-screen w-full">
      {/* Hero section */}
      <SplitHero />

      {/* Bottles Section with Scroll Animations */}
      <BottlesSection />

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold ${textColor} mb-4 px-4 py-2 ${bgOverlay} rounded-lg backdrop-blur-sm block`}
            >
              Why Choose Rawaj
            </h2>
            <p
              className={`text-lg ${textSecondary} max-w-2xl mx-auto px-4 py-2 ${bgOverlay} rounded-lg backdrop-blur-sm mt-4 block`}
            >
              Experience the art of perfumery with our bespoke fragrance
              creation process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div
                className={`w-16 h-16 ${
                  theme === "light" ? "bg-gray-100" : "bg-gray-800"
                } rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <svg
                  className={`w-8 h-8 ${textColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3
                className={`text-xl font-semibold ${textColor} mb-2 px-3 py-1 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Custom Blends
              </h3>
              <p
                className={`${textSecondary} px-3 py-2 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Create a fragrance that is uniquely yours with our custom
                blending process.
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className={`w-16 h-16 ${
                  theme === "light" ? "bg-gray-100" : "bg-gray-800"
                } rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <svg
                  className={`w-8 h-8 ${textColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3
                className={`text-xl font-semibold ${textColor} mb-2 px-3 py-1 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Premium Ingredients
              </h3>
              <p
                className={`${textSecondary} px-3 py-2 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Sourced from around the world, using only the finest essential
                oils and extracts.
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className={`w-16 h-16 ${
                  theme === "light" ? "bg-gray-100" : "bg-gray-800"
                } rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <svg
                  className={`w-8 h-8 ${textColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3
                className={`text-xl font-semibold ${textColor} mb-2 px-3 py-1 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Expert Guidance
              </h3>
              <p
                className={`${textSecondary} px-3 py-2 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Our perfumers guide you through every step to find your perfect
                scent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold ${textColor} mb-4 px-4 py-2 ${bgOverlay} rounded-lg backdrop-blur-sm block`}
            >
              How It Works
            </h2>
            <p
              className={`text-lg ${textSecondary} max-w-2xl mx-auto px-4 py-2 ${bgOverlay} rounded-lg backdrop-blur-sm mt-4 block`}
            >
              Simple steps to create your perfect fragrance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3
                className={`text-xl font-semibold ${textColor} mb-2 px-3 py-1 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Choose Your Notes
              </h3>
              <p
                className={`${textSecondary} px-3 py-2 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Select from our curated collection of top, middle, and base
                notes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3
                className={`text-xl font-semibold ${textColor} mb-2 px-3 py-1 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Customize Your Blend
              </h3>
              <p
                className={`${textSecondary} px-3 py-2 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Work with our experts to perfect the proportions and create your
                signature scent.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3
                className={`text-xl font-semibold ${textColor} mb-2 px-3 py-1 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Receive Your Creation
              </h3>
              <p
                className={`${textSecondary} px-3 py-2 ${bgOverlay} rounded backdrop-blur-sm block`}
              >
                Your custom perfume is handcrafted and delivered in elegant
                packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2
            className={`text-3xl md:text-4xl font-bold ${textColor} mb-4 px-4 py-2 ${bgOverlay} rounded-lg backdrop-blur-sm block`}
          >
            Ready to Create Your Signature Scent?
          </h2>
          <p
            className={`text-lg ${textSecondary} mb-8 max-w-2xl mx-auto px-4 py-2 ${bgOverlay} rounded-lg backdrop-blur-sm mt-4 block`}
          >
            Start your journey with Rawaj and discover a fragrance that truly
            represents you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/build"
              className="px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:bg-gray-800 transition-all"
            >
              Start Building
            </a>
            <a
              href="/notes"
              className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              Explore Notes
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
