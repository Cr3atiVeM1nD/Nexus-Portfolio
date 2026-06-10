"use client";

import type { ReactNode } from "react";

import type {
  ConceptNode,
  SkillNode,
  RelatedNode,
} from "@/lib/types";
import { Sparkles } from "lucide-react";
import { getRelationBadgeClasses } from "@/lib/style-helpers";
import { GAUGE_RADIUS, GAUGE_CIRCUMFERENCE, ANIMATION_DELAY_STEP } from "@/lib/constants";


interface ConceptDetailProps {
  node: ConceptNode;
  relatedNodes: RelatedNode[];
  skillNodes: SkillNode[];
  onNavigate: (id: string) => void;
}

export function ConceptDetail({
  node,
  relatedNodes,
  skillNodes,
  onNavigate,
}: ConceptDetailProps) {

  const offset = GAUGE_CIRCUMFERENCE * (1 - node.feasibility / 100);

  const relatedProjects = relatedNodes.filter(
    (r) => r.node.type === "project"
  );

  const matchedSkills = skillNodes.filter((s) =>
    node.relatedSkills.includes(s.id)
  );

  const otherNodes = relatedNodes.filter((r) => {
    if (r.node.type === "project") return false;
    if (r.node.type === "skill" && node.relatedSkills.includes(r.node.id))
      return false;
    return true;
  });

  const sections: (ReactNode)[] = [
    /* 0 – Header */
    <div key="header" className="animate-slide-up">
      <h2 className="text-white text-2xl font-bold">{node.label}</h2>
      <span className="text-xs bg-purple-500/20 text-purple-400 rounded-full px-2 py-0.5">
        Concept
      </span>
    </div>,

    /* 1 – Feasibility gauge */
    <div key="gauge" className="animate-slide-up flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-28 h-28">
        <circle
          r={GAUGE_RADIUS}
          cx="50"
          cy="50"
          fill="none"
          stroke="rgb(38 38 38)"
          strokeWidth="8"
        />
        <circle
          r={GAUGE_RADIUS}
          cx="50"
          cy="50"
          fill="none"
          stroke="rgb(192 132 252)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${GAUGE_CIRCUMFERENCE} ${GAUGE_CIRCUMFERENCE}`}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-purple-400 font-bold text-lg"
          fill="currentColor"
        >
          {Math.round(node.feasibility)}%
        </text>
      </svg>
      <span className="text-xs text-gray-400 mt-1">Feasibility</span>
    </div>,

    /* 2 – Description */
    node.description ? (
      <div key="desc" className="animate-slide-up">
        <p className="text-gray-300">{node.description}</p>
      </div>
    ) : null,

    /* 3 – Related skills */
    matchedSkills.length > 0 ? (
      <div key="skills" className="animate-slide-up">
        <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">
          Related Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {matchedSkills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => onNavigate(skill.id)}
              className="text-sm bg-neutral-800 text-gray-300 rounded-full px-3 py-1 hover:bg-neutral-700 transition-colors"
            >
              {skill.label}
            </button>
          ))}
        </div>
      </div>
    ) : null,

    /* 4 – Related projects */
    relatedProjects.length > 0 ? (
      <div key="projects" className="animate-slide-up">
        <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">
          Related Projects
        </h3>
        <div className="space-y-1">
          {relatedProjects.map((rp) => (
            <div key={rp.node.id} className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(rp.node.id)}
                className="text-sm bg-neutral-800 text-gray-300 rounded-full px-3 py-1 hover:bg-neutral-700 transition-colors"
              >
                {rp.node.label}
              </button>
              <span
                className={`text-xs rounded-full px-2 py-0.5 ${getRelationBadgeClasses(
                  rp.relation
                )}`}
              >
                {rp.relation}
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    /* 5 – Other related nodes */
    otherNodes.length > 0 ? (
      <div key="other" className="animate-slide-up">
        <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-2">
          Related Nodes
        </h3>
        <div className="space-y-1">
          {otherNodes.map((rn) => (
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
    ) : null,

    /* 6 – Next Evolution */
    (() => {
      const evolutionNodes = relatedNodes.filter(
        (rn) => rn.relation === "evolves-into" || rn.relation === "evolves-into (incoming)"
      );
      if (evolutionNodes.length === 0) return null;
      return (
        <div key="evolution" className="animate-slide-up">
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
        </div>
      );
    })(),
  ];

  const visibleSections = sections.filter(Boolean) as ReactNode[];

  return (
    <div className="space-y-6">
      {visibleSections.map((section, index) => (
        <div
          key={index}
          style={{ animationDelay: `${index * ANIMATION_DELAY_STEP}ms` }}
        >
          {section}
        </div>
      ))}
    </div>
  );
}
