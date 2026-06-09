"use client";

import { type SkillNode, type RelatedNode } from "@/lib/types";
import { getRelationBadgeClasses, getGaugeStrokeColor } from "@/lib/style-helpers";
import {
  Brain,
  Zap,
  Search,
  TrendingUp,
  Gamepad2,
  Eye,
  Briefcase,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  brain: Brain,
  zap: Zap,
  search: Search,
  "trending-up": TrendingUp,
  "gamepad-2": Gamepad2,
  eye: Eye,
  briefcase: Briefcase,
  sparkles: Sparkles,
};

interface SkillDetailProps {
  node: SkillNode;
  relatedNodes: RelatedNode[];
  onNavigate: (id: string) => void;
}



export function SkillDetail({ node, relatedNodes, onNavigate }: SkillDetailProps) {
  const Icon = ICON_MAP[node.icon] ?? Sparkles;
  const projects = relatedNodes.filter((rn) => rn.node.type === "project");
  const concepts = relatedNodes.filter((rn) => rn.node.type === "concept");
  const relatedSkills = relatedNodes.filter((rn) => rn.node.type === "skill");

  const circumference = 2 * Math.PI * 40;
  const offset = circumference * (1 - node.proficiency / 100);
  const gaugeStrokeColor = getGaugeStrokeColor(node.proficiency);

  return (
    <div className="p-6">
      {/* Header + icon */}
      <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-10 h-10 text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 rounded-full px-2 py-0.5 inline-block mb-1">
              {node.category.replace(/-/g, " ")}
            </span>
            <h2 className="text-2xl font-bold text-white">{node.label}</h2>
          </div>
        </div>
      </div>

      {/* Circular gauge */}
      <div className="animate-slide-up" style={{ animationDelay: '80ms' }}>
        <div className="flex justify-center mb-4">
          <svg width="112" height="112" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgb(38 38 38)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={gaugeStrokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-white text-lg font-semibold"
            >
              {node.proficiency}%
            </text>
          </svg>
        </div>
      </div>

      {/* Description */}
      <div className="animate-slide-up" style={{ animationDelay: '160ms' }}>
        <p className="text-gray-300 mt-4">{node.description}</p>
      </div>

      {/* Technologies */}
      <div className="animate-slide-up" style={{ animationDelay: '240ms' }}>
        <div className="flex flex-wrap gap-2 mt-4">
          {node.technologies.map((tech) => (
            <span
              key={tech}
              className="text-sm bg-neutral-800 text-gray-300 rounded-full px-3 py-1"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '320ms' }}>
          <div className="mt-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Projects</h3>
            <div className="space-y-1">
              {projects.map((p) => {
                const relation = p.relation ?? "";
                return (
                  <button key={p.node.id} onClick={() => onNavigate(p.node.id)} className="text-cyan-400 hover:underline text-sm block">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRelationBadgeClasses(relation)} mr-2`}>{relation}</span>
                    {p.node.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Concepts */}
      {concepts.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="mt-4">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Concepts</h3>
            <div className="space-y-1">
              {concepts.map((c) => {
                const relation = c.relation ?? "";
                return (
                  <button key={c.node.id} onClick={() => onNavigate(c.node.id)} className="text-cyan-400 hover:underline text-sm block">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRelationBadgeClasses(relation)} mr-2`}>{relation}</span>
                    {c.node.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Related Skills */}
      {relatedSkills.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '480ms' }}>
          <div className="mt-4">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Related Skills</h3>
            <div className="flex flex-wrap gap-2">
              {relatedSkills.map((s) => {
                const relation = s.relation ?? "";
                return (
                  <button
                    key={s.node.id}
                    onClick={() => onNavigate(s.node.id)}
                    className="text-sm bg-neutral-800 text-gray-300 rounded-full px-3 py-1 text-left hover:bg-neutral-700 transition-colors"
                  >
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRelationBadgeClasses(relation)} mr-2`}>{relation}</span>
                    {s.node.label}
                  </button>
                );
              })}
            </div>
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
          <div className="animate-slide-up" style={{ animationDelay: '560ms' }}>
            <div className="mt-6 border border-dashed border-purple-500/30 bg-purple-500/5 rounded-lg p-4">
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
