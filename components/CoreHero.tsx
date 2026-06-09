"use client";

import { type CoreNode } from "@/lib/types";

interface CoreHeroProps {
  node: CoreNode;
  skillCount: number;
  projectCount: number;
  conceptCount: number;
}

export function CoreHero({ node, skillCount, projectCount, conceptCount }: CoreHeroProps) {
  return (
    <section className="relative w-full border-b border-neutral-800 bg-gradient-to-b from-neutral-950 via-neutral-950/90 to-black px-6 py-12 md:py-20">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
        {node.label}
      </h1>
      <p className="text-xl text-cyan-400 mt-2 font-medium animate-typing max-w-fit">{node.subtitle}</p>
      <p className="text-lg text-gray-400 mt-4 max-w-2xl">{node.mission}</p>
      <div className="flex gap-8 mt-8">
        <div className="text-center group">
          <div className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">{skillCount}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Skills</div>
        </div>
        <div className="text-center group">
          <div className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">{projectCount}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Projects</div>
        </div>
        <div className="text-center group">
          <div className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">{conceptCount}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Concepts</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </section>
  );
}
