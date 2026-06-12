"use client";

import { type SkillNode, type RelatedNode } from "@/lib/types";
import { getRelationBadgeClasses, getGaugeStrokeColor } from "@/lib/style-helpers";
import { GAUGE_RADIUS, GAUGE_CIRCUMFERENCE, ANIMATION_DELAY_STEP } from "@/lib/constants";
import { Sparkles } from "lucide-react";
import { ICON_MAP } from "@/lib/icon-map";
import NextEvolution from "./NextEvolution";

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

  const offset = GAUGE_CIRCUMFERENCE * (1 - node.proficiency / 100);
  const gaugeStrokeColor = getGaugeStrokeColor(node.proficiency);

  return (
    <div className="p-6">
      {/* Header + icon */}
      <div className="animate-slide-up" style={{ animationDelay: `${0 * ANIMATION_DELAY_STEP}ms` }}>
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
      <div className="animate-slide-up" style={{ animationDelay: `${1 * ANIMATION_DELAY_STEP}ms` }}>
        <div className="flex justify-center mb-4">
          <svg width="112" height="112" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={GAUGE_RADIUS}
              fill="none"
              stroke="rgb(38 38 38)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={GAUGE_RADIUS}
              fill="none"
              stroke={gaugeStrokeColor}
              strokeWidth="8"
              strokeDasharray={GAUGE_CIRCUMFERENCE}
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
      <div className="animate-slide-up" style={{ animationDelay: `${2 * ANIMATION_DELAY_STEP}ms` }}>
        <p className="text-gray-300 mt-4">{node.description}</p>
      </div>

      {/* Technologies */}
      <div className="animate-slide-up" style={{ animationDelay: `${3 * ANIMATION_DELAY_STEP}ms` }}>
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
        <div className="animate-slide-up" style={{ animationDelay: `${4 * ANIMATION_DELAY_STEP}ms` }}>
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
        <div className="animate-slide-up" style={{ animationDelay: `${5 * ANIMATION_DELAY_STEP}ms` }}>
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
        <div className="animate-slide-up" style={{ animationDelay: `${6 * ANIMATION_DELAY_STEP}ms` }}>
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
      <div className="animate-slide-up mt-6" style={{ animationDelay: `${7 * ANIMATION_DELAY_STEP}ms` }}>
        <NextEvolution relatedNodes={relatedNodes} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
