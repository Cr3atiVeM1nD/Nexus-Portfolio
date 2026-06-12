"use client";
import { type SkillNode } from "@/lib/types";
import { Sparkles } from "lucide-react";
import { ICON_MAP } from "@/lib/icon-map";
import { GAUGE_THRESHOLDS } from "@/lib/constants";

interface SkillCardProps {
  node: SkillNode;
  isSelected: boolean;
}

function getProficiencyColor(proficiency: number): string {
  if (proficiency > GAUGE_THRESHOLDS.high) return "bg-emerald-500";
  if (proficiency > GAUGE_THRESHOLDS.medium) return "bg-amber-500";
  return "bg-red-500";
}

export function SkillCard({ node, isSelected }: SkillCardProps) {
  const Icon = ICON_MAP[node.icon] ?? Sparkles;

  return (
    <div
      className={`bg-neutral-900 border rounded-xl p-5 transition-all duration-200 hover:border-neutral-700 ${
        isSelected
          ? "border-cyan-400 ring-2 ring-cyan-400"
          : "border-neutral-800"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <Icon className="w-8 h-8 text-emerald-400 shrink-0" />
        <div className="min-w-0">
          <h3 className="text-white font-semibold truncate">{node.label}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {node.category.replace(/-/g, " ")}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{node.description}</p>
      <div className="mb-3">
        <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className={`h-full rounded-full ${getProficiencyColor(node.proficiency)}`}
            style={{ width: `${node.proficiency}%` }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {node.technologies.map((tech) => (
          <span
            key={tech}
            className="text-xs bg-neutral-800 text-gray-300 rounded-full px-2 py-0.5"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
