"use client";

import { type ProjectNode, type ProjectDetail as ProjectDetailType, type SkillNode, type RelatedNode } from "@/lib/types";
import { getRelationBadgeClasses, STATUS_STYLES } from "@/lib/style-helpers";
import { ANIMATION_DELAY_STEP } from "@/lib/constants";
import { Check, Code2 } from "lucide-react";
import NextEvolution from "./NextEvolution";

interface ProjectDetailProps {
  node: ProjectNode;
  detail: ProjectDetailType | undefined;
  skillNodes: SkillNode[];
  relatedNodes: RelatedNode[];
  onNavigate: (id: string) => void;
}



export function ProjectDetail({ node, detail, skillNodes, relatedNodes, onNavigate }: ProjectDetailProps) {
  return (
    <div className="p-6">
      {/* Header + Status */}
      <div className="animate-slide-up" style={{ animationDelay: `${0 * ANIMATION_DELAY_STEP}ms` }}>
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-2xl font-bold text-white">{node.label}</h2>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
              STATUS_STYLES[node.status] ?? ""
            }`}
          >
            {node.status}
          </span>
        </div>
        <p className="text-sm text-gray-500">{node.year}</p>
        <p className="text-gray-400 italic mt-1">
          {detail?.tagline ?? node.description}
        </p>
      </div>

      {/* Timeline */}
      {detail?.timeline && (
        <div className="animate-slide-up" style={{ animationDelay: `${1 * ANIMATION_DELAY_STEP}ms` }}>
          <div className="mt-2">
            <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 w-2/3" />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{detail.timeline.start}</span>
              <span>{detail.timeline.end ?? "Present"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="animate-slide-up" style={{ animationDelay: `${2 * ANIMATION_DELAY_STEP}ms` }}>
        <p className="text-gray-300 mt-6">
          {detail?.longDescription ?? node.description}
        </p>
      </div>

      {/* Features */}
      {detail?.features && detail.features.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: `${3 * ANIMATION_DELAY_STEP}ms` }}>
          <div className="mt-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
              Features
            </h3>
            <div className="space-y-2">
              {detail.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {detail?.techStack && detail.techStack.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: `${4 * ANIMATION_DELAY_STEP}ms` }}>
          <div className="mt-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
              Tech Stack
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {detail.techStack.map((t) => (
                <div key={t.name}>
                  <p className="text-white text-sm">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400 inline mr-1.5" />
                    {t.name}
                  </p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Screenshots */}
      {(detail?.screenshots && detail.screenshots.length > 0) ? (
        <div className="animate-slide-up" style={{ animationDelay: `${5 * ANIMATION_DELAY_STEP}ms` }}>
          <div className="mt-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Screenshots</h3>
            <div className="grid grid-cols-2 gap-2">
              {detail.screenshots.map((src, i) => (
                <div key={i} className="aspect-video bg-neutral-800 rounded-md flex items-center justify-center text-gray-500 text-xs">
                  {src}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-slide-up" style={{ animationDelay: `${5 * ANIMATION_DELAY_STEP}ms` }}>
          <div className="bg-neutral-900 rounded-md p-8 text-center text-gray-500 text-sm mt-6">
            Screenshots coming soon
          </div>
        </div>
      )}

      {/* Links */}
      {detail?.links && detail.links.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: `${(5 * ANIMATION_DELAY_STEP) + 40}ms` }}>
          <div className="mt-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
              Links
            </h3>
            <div className="flex gap-3">
              {detail.links.map((link) => {
                const isDisabled = link.url === "#" || !link.url;
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm ${
                      isDisabled
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-cyan-400 hover:underline"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Skill nodes */}
      {skillNodes.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: `${6 * ANIMATION_DELAY_STEP}ms` }}>
          <div className="mt-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
              Skills
            </h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {skillNodes.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => onNavigate(skill.id)}
                  className="text-xs bg-neutral-800 text-gray-300 rounded-full px-2 py-0.5 hover:bg-neutral-700 transition-colors"
                >
                  {skill.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Nodes */}
      {relatedNodes.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: `${7 * ANIMATION_DELAY_STEP}ms` }}>
          <div className="mt-6">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
              Related Nodes
            </h3>
            <div className="space-y-1">
              {relatedNodes.map((rn) => (
                <button
                  key={rn.node.id}
                  onClick={() => onNavigate(rn.node.id)}
                  className="text-cyan-400 hover:underline text-sm block text-left"
                >
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRelationBadgeClasses(rn.relation)} mr-2`}>
                    {rn.relation}
                  </span>
                  {rn.node.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Next Evolution */}
      <div className="animate-slide-up mt-6" style={{ animationDelay: `${8 * ANIMATION_DELAY_STEP}ms` }}>
        <NextEvolution relatedNodes={relatedNodes} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
