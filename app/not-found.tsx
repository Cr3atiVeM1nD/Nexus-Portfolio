import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
      <div className="border border-neutral-800 bg-neutral-950/50 p-8 max-w-md text-center">
        <h1 className="text-cyan-400 text-2xl font-bold mb-4">404</h1>
        <p className="text-neutral-400 text-sm mb-6">
          This node does not exist in the Nexus.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-colors"
        >
          [ Return to Nexus ]
        </Link>
      </div>
    </div>
  );
}
