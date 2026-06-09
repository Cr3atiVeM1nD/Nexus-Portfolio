"use client";

import { Scan } from "lucide-react";

export interface ScanModeButtonProps {
  isActive: boolean;
  onToggle: () => void;
  isComplete?: boolean;
}

export function ScanModeButton({ isActive, onToggle, isComplete }: ScanModeButtonProps) {
  const baseClasses = "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200";

  let buttonClasses: string;
  let label: string;

  if (isActive) {
    buttonClasses = `${baseClasses} bg-neutral-700 text-white ring-1 ring-cyan-400/50 animate-pulse-glow`;
    label = "Scanning...";
  } else if (isComplete) {
    buttonClasses = `${baseClasses} bg-green-500/10 text-green-400 ring-1 ring-green-400/50`;
    label = "Scan Complete";
  } else {
    buttonClasses = `${baseClasses} bg-neutral-900 text-gray-400`;
    label = "Scan Mode";
  }

  return (
    <button onClick={onToggle} className={buttonClasses}>
      <Scan className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
