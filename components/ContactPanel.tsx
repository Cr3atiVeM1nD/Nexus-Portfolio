"use client";

import { useEffect } from "react";
import { X, Mail, Github, Linkedin } from "lucide-react";

export interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactPanel({ isOpen, onClose }: ContactPanelProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-neutral-950 border border-neutral-800 rounded-xl p-8 max-w-md w-full mx-4 animate-scale-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Headline */}
        <h2 className="text-white text-3xl font-bold mb-2">
          Let&apos;s Build Something.
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Open for freelance and contract opportunities
        </p>

        {/* Divider */}
        <div className="border-t border-neutral-800 mb-6" />

        {/* Contact methods */}
        <div className="mb-6">
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-3">
            Connect
          </div>
          <div className="space-y-0">
            {/* Email */}
            <div className="flex items-center gap-3 py-3 border-b border-neutral-800/50 last:border-b-0">
              <Mail className="w-5 h-5 text-cyan-400/70" />
              <span className="text-gray-400 text-sm w-20">Email</span>
              <a
                href="mailto:290733125+Cr3atiVeM1nD@users.noreply.github.com"
                className="text-cyan-400 text-sm hover:underline"
              >
                290733125+Cr3atiVeM1nD@users.noreply.github.com
              </a>
            </div>
            {/* GitHub */}
            <div className="flex items-center gap-3 py-3 border-b border-neutral-800/50 last:border-b-0">
              <Github className="w-5 h-5 text-cyan-400/70" />
              <span className="text-gray-400 text-sm w-20">GitHub</span>
              <a
                href="https://github.com/Cr3atiVeM1nD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 text-sm hover:underline"
              >
                github.com/Cr3atiVeM1nD
              </a>
            </div>
            {/* LinkedIn */}
            <div className="flex items-center gap-3 py-3 border-b border-neutral-800/50 last:border-b-0">
              <Linkedin className="w-5 h-5 text-cyan-400/70" />
              <span className="text-gray-400 text-sm w-20">LinkedIn</span>
              <span className="text-gray-500 text-sm">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <button
            className="w-full py-2 px-4 rounded-lg border border-neutral-700 text-gray-400 text-sm cursor-not-allowed"
            disabled
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
