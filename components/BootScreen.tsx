"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface BootScreenProps {
  onComplete: () => void;
}

const STEP_MESSAGES: string[] = [
  "NEXUS ONLINE",
  "Initializing Builder System...",
  "Scanning Skill Matrix...",
  "Loading Project Archive...",
  "Establishing Signal Links...",
  "System Ready.",
];

const STEP_TIMINGS: number[] = [
  0,      // step 0: fade in
  800,    // step 1: typewriter
  2000,   // step 2
  3000,   // step 3
  4000,   // step 4
  5000,   // step 5: fade in
  6000,   // step 6: fade out trigger
];

export function BootScreen({ onComplete }: BootScreenProps) {
  const [step, setStep] = useState<number>(0);
  const [fadingOut, setFadingOut] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSkippedRef = useRef<boolean>(false);

  // Cleanup all pending timeouts on unmount
  const clearAllTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    // check sessionStorage
    try {
      if (sessionStorage.getItem("nexus-boot-seen") === "true") {
        onComplete();
        return;
      }
    } catch {
      // ignore
    }

    // schedule steps
    const scheduleSteps = () => {
      STEP_TIMINGS.forEach((delay, index) => {
        const timeout = setTimeout(() => {
          if (isSkippedRef.current) return;
          if (index < STEP_TIMINGS.length - 1) {
            setStep(index + 1);
          } else {
            // step 6: trigger fade-out
            setStep(index);
            setFadingOut(true);
          }
        }, delay);
        // keep reference of the last timeout for cleanup later
        if (index === STEP_TIMINGS.length - 1) {
          timeoutRef.current = timeout;
        }
      });
    };

    scheduleSteps();

    return () => {
      clearAllTimeouts();
    };
  }, [onComplete, clearAllTimeouts]);

  useEffect(() => {
    if (fadingOut) {
      // after 500ms call onComplete and set sessionStorage
      const t = setTimeout(() => {
        if (isSkippedRef.current) return;
        try {
          sessionStorage.setItem("nexus-boot-seen", "true");
        } catch {
          // ignore
        }
        onComplete();
      }, 500);
      timeoutRef.current = t;
    }
    return () => {
      if (timeoutRef.current && fadingOut) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [fadingOut, onComplete]);

  const handleSkip = useCallback(() => {
    if (step < 2) return;
    isSkippedRef.current = true;
    clearAllTimeouts();
    try {
      sessionStorage.setItem("nexus-boot-seen", "true");
    } catch {
      // ignore
    }
    onComplete();
  }, [step, clearAllTimeouts, onComplete]);

  // pad step number display (01/06)
  const stepIndex = Math.min(step, 5); // 0-5 lines
  const stepMax = 6;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-mono ${
        fadingOut ? "animate-boot-fade-out" : ""
      }`}
      onClick={handleSkip}
    >
      {/* Skip button */}
      {step >= 2 && (
        <button
          className="absolute top-4 right-4 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
        >
          Skip
        </button>
      )}

      {/* Main content area */}
      <div className="flex flex-col items-center gap-3">
        {step >= 0 && (
          <div
            className={`text-2xl md:text-3xl font-bold tracking-widest text-cyan-400 animate-boot-fade-in`}
          >
            {STEP_MESSAGES[0]}
          </div>
        )}
        {step >= 1 && (
          <div
            className={`text-base md:text-lg text-amber-400/90 ${
              step === 1
                ? "animate-boot-typewriter animate-boot-blink-cursor"
                : "animate-boot-fade-in"
            }`}
          >
            {STEP_MESSAGES[1]}
          </div>
        )}
        {step >= 2 && (
          <div
            className={`text-base md:text-lg text-amber-400/90 ${
              step === 2
                ? "animate-boot-typewriter animate-boot-blink-cursor"
                : "animate-boot-fade-in"
            }`}
          >
            {STEP_MESSAGES[2]}
          </div>
        )}
        {step >= 3 && (
          <div
            className={`text-base md:text-lg text-amber-400/90 ${
              step === 3
                ? "animate-boot-typewriter animate-boot-blink-cursor"
                : "animate-boot-fade-in"
            }`}
          >
            {STEP_MESSAGES[3]}
          </div>
        )}
        {step >= 4 && (
          <div
            className={`text-base md:text-lg text-amber-400/90 ${
              step === 4
                ? "animate-boot-typewriter animate-boot-blink-cursor"
                : "animate-boot-fade-in"
            }`}
          >
            {STEP_MESSAGES[4]}
          </div>
        )}
        {step >= 5 && (
          <div
            className={`text-xl md:text-2xl font-bold tracking-wider text-cyan-400 ${
              step === 5 ? "animate-boot-fade-in" : "animate-boot-fade-in"
            }`}
            style={{ animationDelay: step === 5 ? "0ms" : "0ms" }}
          >
            {STEP_MESSAGES[5]}
          </div>
        )}
      </div>

      {/* Step counter at bottom */}
      <div className="absolute bottom-6 text-xs text-gray-600">
        [{String(stepIndex + 1).padStart(2, "0")}/{String(stepMax).padStart(2, "0")}]
      </div>
    </div>
  );
}
