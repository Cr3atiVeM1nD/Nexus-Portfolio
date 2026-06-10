"use client";

import type { CoreNode, RelatedNode } from "@/lib/types";
import { Sparkles } from "lucide-react";
import { getRelationBadgeClasses } from "@/lib/style-helpers";
import { ANIMATION_DELAY_STEP } from "@/lib/constants";


interface CoreDetailProps {
  node: CoreNode;
  relatedNodes: RelatedNode[];
  onNavigate: (id: string) => void;
  skillCount: number;
  projectCount: number;
  conceptCount: number;
}

export function CoreDetail({
  node,
  relatedNodes,
  onNavigate,
  skillCount,
  projectCount,
  conceptCount,
}: CoreDetailProps) {
  const skillRelated = relatedNodes.filter(
    (rn) => rn.node.type === "skill"
  );
  const otherRelated = relatedNodes.filter(
    (rn) => rn.node.type !== "skill"
  );

  return (
    <div>
      {/* Header */}
      <div className="animate-slide-up" style={{ animationDelay: `${0 * ANIMATION_DELAY_STEP}ms` }}>
        <h2 className="text-white text-2xl font-bold">{node.label}</h2>
        <p className="text-cyan-400 text-lg font-medium">{node.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="animate-slide-up" style={{ animationDelay: `${1 * ANIMATION_DELAY_STEP}ms` }}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-bold text-white">{skillCount}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Skills
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{projectCount}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Projects
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{conceptCount}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Concepts
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="animate-slide-up" style={{ animationDelay: `${2 * ANIMATION_DELAY_STEP}ms` }}>
        <div className="bg-neutral-900/50 border-l-4 border-cyan-400 rounded-r-md p-4">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-1">
            Mission
          </h3>
          <p className="text-gray-300">{node.mission}</p>
        </div>
      </div>

      {/* Connected Skills */}
      {skillRelated.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: `${3 * ANIMATION_DELAY_STEP}ms` }}>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            Connected Skills
          </h3>
          <div className="space-y-1">
            {skillRelated.map((rn) => (
              <div key={rn.node.id} className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate(rn.node.id)}
                  className="text-sm bg-neutral-800 text-gray-300 rounded-full px-3 py-1 hover:bg-neutral-700 transition-colors"
                >
                  {rn.node.label}
                </button>
                <span
                  className={`text-xs rounded-full px-2 py-0.5 ${getRelationBadgeClasses(
                    rn.relation
                  )}`}
                >
                  {rn.relation}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Related Nodes */}
      {otherRelated.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: `${4 * ANIMATION_DELAY_STEP}ms` }}>
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            Related Nodes
          </h3>
          <div className="space-y-1">
            {otherRelated.map((rn) => (
              <div key={rn.node.id} className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate(rn.node.id)}
                  className="text-cyan-400 hover:underline text-sm block"
                >
                  {rn.node.label}
                </button>
                <span
                  className={`text-xs rounded-full px-2 py-0.5 ${getRelationBadgeClasses(
                    rn.relation
                  )}`}
                >
                  {rn.relation}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Evolution */}
      {(() => {
        const evolutionNodes = relatedNodes.filter(
          (rn) => rn.relation === "evolves-into" || rn.relation === "evolves-into (incoming)"
        );
        if (evolutionNodes.length === 0) return null;
        return (
          <div className="animate-slide-up" style={{ animationDelay: `${5 * ANIMATION_DELAY_STEP}ms` }}>
            <div className="mt-4 border border-dashed border-purple-500/30 bg-purple-500/5 rounded-lg p-4">
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
          </div>
        );
      })()}
    </div>
  );
}
