"use client";

export default function GlobalError() {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
        <div className="border border-neutral-800 bg-neutral-950/50 p-8 max-w-md text-center">
          <h1 className="text-cyan-400 text-2xl font-bold mb-4">Something broke.</h1>
          <p className="text-neutral-400 text-sm mb-6">
            A critical error occurred. Please reload the application.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-colors"
          >
            [Reload]
          </button>
        </div>
      </body>
    </html>
  );
}
