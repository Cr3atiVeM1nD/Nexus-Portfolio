"use client";
import { type ConceptNode, type SkillNode } from "@/lib/types";

interface ConceptCardProps {
  node: ConceptNode;
  skillNodes: SkillNode[];
  isSelected: boolean;
}

export function ConceptCard({ node, skillNodes, isSelected }: ConceptCardProps) {
  return (
    <div
      className={`bg-neutral-900 border border-dashed rounded-xl p-5 transition-all duration-200 hover:border-purple-500/50 ${
        isSelected
          ? "border-purple-400 ring-2 ring-purple-400"
          : "border-purple-500/30"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold">{node.label}</h3>
        <span className="text-xs bg-purple-500/20 text-purple-400 rounded-full px-2 py-0.5 shrink-0">
          Concept
        </span>
      </div>
      <p className="text-sm text-gray-300 line-clamp-2 mb-3">{node.description}</p>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500">Feasibility</span>
        <div className="flex-1 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-purple-500"
            style={{ width: `${node.feasibility}%` }}
          />
        </div>
        <span className="text-xs text-purple-400">{node.feasibility}%</span>
      </div>
      {skillNodes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skillNodes.map((skill) => (
            <span
              key={skill.id}
              className="text-xs bg-neutral-800 text-gray-300 rounded-full px-2 py-0.5"
            >
              {skill.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
