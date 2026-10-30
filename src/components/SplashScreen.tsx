"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const FULL_NAME = "</Prasanna>";

export default function SplashScreen() {
  // Splash is visible by default so server-rendered HTML contains the overlay on first paint
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [typedCount, setTypedCount] = useState<number>(0);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(-1);
  const [isTypingDone, setIsTypingDone] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoEnterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const finalizeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const handleDismiss = useCallback(() => {
    // Clear all pending timers to avoid double-triggers
    if (autoEnterTimerRef.current) {
      clearTimeout(autoEnterTimerRef.current);
      autoEnterTimerRef.current = null;
    }
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    if (finalizeTimerRef.current) {
      clearTimeout(finalizeTimerRef.current);
      finalizeTimerRef.current = null;
    }

    setIsVisible(false);
    document.body.style.overflow = "";

    // Move focus to page content after fade-out completes
    setTimeout(() => {
      const target = document.getElementById("home") || document.querySelector("main");
      if (target) {
        target.setAttribute("tabindex", "-1");
        (target as HTMLElement).focus({ preventScroll: true });
      }
    }, 600);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
      e.preventDefault();
      handleDismiss();
    }
  };

  useEffect(() => {
    // Lock page scrolling while splash is visible
    document.body.style.overflow = "hidden";

    // Focus overlay for keyboard accessibility
    containerRef.current?.focus();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReduced = mediaQuery.matches;

    if (prefersReduced) {
      // Reduced motion: skip typing & gradient, show final text immediately
      setTypedCount(FULL_NAME.length);
      setActiveCharIndex(-1);
      setIsTypingDone(true);

      // Auto-enter with shorter wait (1.5 seconds)
      autoEnterTimerRef.current = setTimeout(() => {
        handleDismiss();
      }, 1500);
    } else {
      // Normal motion: type character by character in ~1 second (11 chars * 85ms ≈ 935ms)
      let count = 0;
      const intervalMs = 85;

      typingIntervalRef.current = setInterval(() => {
        count++;
        setTypedCount(count);
        setActiveCharIndex(count - 1);

        if (count >= FULL_NAME.length) {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }

          // Last character keeps gradient for 150ms before settling to white
          finalizeTimerRef.current = setTimeout(() => {
            setActiveCharIndex(-1);
            setIsTypingDone(true);
          }, 150);
        }
      }, intervalMs);

      // Auto-enter after about 3.5 seconds
      autoEnterTimerRef.current = setTimeout(() => {
        handleDismiss();
      }, 3500);
    }

    return () => {
      if (autoEnterTimerRef.current) clearTimeout(autoEnterTimerRef.current);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (finalizeTimerRef.current) clearTimeout(finalizeTimerRef.current);
      document.body.style.overflow = "";
    };
  }, [handleDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          role="button"
          tabIndex={0}
          aria-label="Welcome screen. Click anywhere or press Enter to enter portfolio"
          onClick={handleDismiss}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black cursor-pointer select-none px-4 outline-none focus-visible:ring-1 focus-visible:ring-[#6366F1]/50"
        >
          {/* Centered Name and Tagline */}
          <div className="inline-flex flex-col items-end">
            <div className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight select-none">
              {FULL_NAME.split("").map((char, index) => {
                const isVisibleChar = index < typedCount;
                const isNewlyTyped = index === activeCharIndex;

                return (
                  <span
                    key={index}
                    style={
                      isNewlyTyped
                        ? {
                            backgroundImage:
                              "linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fba76a 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }
                        : undefined
                    }
                    className={`inline-block transition-colors duration-150 ${
                      !isVisibleChar
                        ? "opacity-0"
                        : isNewlyTyped
                        ? "drop-shadow-[0_0_16px_rgba(236,72,153,0.55)]"
                        : "text-white"
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Tagline right-aligned to name */}
            <div className="h-6 sm:h-7 mt-2 sm:mt-3 flex items-center justify-end">
              {isTypingDone && (
                <motion.span
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="font-heading text-xs sm:text-sm tracking-[0.25em] text-[#94A3B8] uppercase"
                >
                  Develop.Deploy.Drive.
                </motion.span>
              )}
            </div>
          </div>

          {/* Bottom pulsing callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.6 }
                : { opacity: [0.3, 0.85, 0.3] }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.5, delay: 0.2 }
                : { repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 0.3 }
            }
            className="absolute bottom-10 sm:bottom-14 text-center pointer-events-none"
          >
            <span className="font-heading text-xs tracking-[0.3em] uppercase text-white/50">
              Click anywhere to enter
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
