"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

export default function SplitHero() {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-[#1A1A1A]" : "text-[#F8F8F8]";
  const textSecondary = theme === "light" ? "text-[#4A4A4A]" : "text-[#D1D5DB]";
  const surfaceColor = theme === "light" ? "bg-white" : "bg-[#1E293B]";
  const accentColor = "bg-[#8B7355]";

  return (
    <section className="min-h-screen flex items-center py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-12 md:gap-16">
          {/* Left Side: Text + Actions */}
          <div className="flex-1 max-w-2xl">
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold ${textColor} mb-6 leading-tight`}
            >
              Discover Your Signature Scent
            </h1>

            <p
              className={`text-lg md:text-xl ${textSecondary} mb-8 leading-relaxed`}
            >
              Handcrafted blends tailored to your essence.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <Link href="/build">
                <button
                  className={`w-full sm:w-auto px-8 py-4 ${accentColor} text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity`}
                >
                  Build Your Perfume
                </button>
              </Link>

              <Link href="/notes">
                <button
                  className={`w-full sm:w-auto px-8 py-4 ${surfaceColor} ${textColor} border-2 ${
                    theme === "light" ? "border-[#1A1A1A]" : "border-[#F8F8F8]"
                  } rounded-lg font-semibold text-lg hover:opacity-80 transition-opacity`}
                >
                  Explore Notes
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Perfume Image */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-full max-w-md md:max-w-lg">
              <Image
                src="/hero/bottles-hero.png"
                alt="Premium Perfume Bottles"
                width={600}
                height={800}
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
                quality={90}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
