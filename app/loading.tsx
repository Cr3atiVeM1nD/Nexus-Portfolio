export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      {/* Pulsar animation */}
      <div className="relative w-24 h-24">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-pulsar-ring" />
        {/* Middle ring */}
        <div className="absolute inset-2 rounded-full border border-cyan-400/50 animate-pulsar-ring-delayed" />
        {/* Inner ring */}
        <div className="absolute inset-4 rounded-full border border-cyan-400/70 animate-pulsar-ring-delayed-2" />
        {/* Core dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulsar-core" />
        </div>
      </div>
      <p className="mt-8 text-cyan-400/70 font-mono text-sm tracking-widest uppercase animate-pulse">
        Loading Nexus
      </p>
    </div>
  );
}
