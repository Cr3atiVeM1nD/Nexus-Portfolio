"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
      <div className="border border-neutral-800 bg-neutral-950/50 p-8 max-w-md text-center">
        <h1 className="text-cyan-400 text-2xl font-bold mb-4">Something broke.</h1>
        <p className="text-neutral-400 text-sm mb-6">
          An unexpected error occurred. The system has logged this incident.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-colors"
        >
          [Reload]
        </button>
      </div>
    </div>
  );
}
