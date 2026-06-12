"use client";

import { type RelatedNode } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface NextEvolutionProps {
  relatedNodes: RelatedNode[];
  onNavigate: (id: string) => void;
}

export default function NextEvolution({ relatedNodes, onNavigate }: NextEvolutionProps) {
  const evolutionNodes = relatedNodes.filter(
    (rn) => rn.relation === "evolves-into" || rn.relation === "evolves-into (incoming)"
  );
  if (evolutionNodes.length === 0) return null;

  return (
    <div className="border border-dashed border-purple-500/30 bg-purple-500/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm uppercase tracking-wider text-purple-400 font-medium">
          Next Evolution
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {evolutionNodes.map((rn) => (
          <button
            key={rn.node.id}
            onClick={() => onNavigate(rn.node.id)}
            className="text-sm bg-purple-500/10 text-purple-300 rounded-full px-3 py-1 hover:bg-purple-500/20 transition-colors border border-purple-500/20"
          >
            {rn.node.label}
          </button>
        ))}
      </div>
    </div>
  );
}
