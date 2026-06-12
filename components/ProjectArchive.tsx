"use client";

import { useEffect } from "react";
import { X, ExternalLink, Github } from "lucide-react";
import type { ProjectDetail, ProjectNode, SkillNode } from "@/lib/types";
import { STATUS_STYLES } from "@/lib/style-helpers";
import { getProjectDetail } from "@/lib/utils";

interface ProjectArchiveProps {
  projects: ProjectDetail[];
  projectNodes: ProjectNode[];
  skillNodes: SkillNode[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export function ProjectArchive({
  projects,
  projectNodes,
  skillNodes,
  isOpen,
  onClose,
  onNavigate,
}: ProjectArchiveProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSkillLabels = (skillIds: string[]): { id: string; label: string }[] => {
    return skillIds
      .map((id) => skillNodes.find((s) => s.id === id))
      .filter(Boolean)
      .map((s) => ({ id: (s as SkillNode).id, label: (s as SkillNode).label }));
  };

  const handleCardClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto animate-scale-in">
        <div className="min-h-full p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Project Archive
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectNodes.map((projectNode) => {
                const detail = getProjectDetail(projectNode.id);
                const skillLabels = getSkillLabels(projectNode.skills);

                return (
                  <div
                    key={projectNode.id}
                    onClick={() => handleCardClick(projectNode.id)}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 cursor-pointer hover:border-neutral-700 transition-all hover:shadow-lg hover:shadow-cyan-500/5 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors">
                        {detail?.title ?? projectNode.label}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                          STATUS_STYLES[projectNode.status] ?? ""
                        }`}
                      >
                        {projectNode.status}
                      </span>
                    </div>

                    {/* Category from first skill */}
                    {skillLabels.length > 0 && (
                      <span className="text-xs text-gray-500 block mb-2">
                        {skillLabels[0].label}
                      </span>
                    )}

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {detail?.tagline ?? projectNode.description}
                    </p>

                    {/* Demonstrated Skills */}
                    {skillLabels.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500 block mb-1.5">
                          Demonstrated Skills
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {skillLabels.map((s) => (
                            <button
                              key={s.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate(s.id);
                                onClose();
                              }}
                              className="text-xs bg-neutral-800 text-gray-300 rounded-full px-2 py-0.5 hover:bg-neutral-700 transition-colors"
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack */}
                    {detail?.techStack && detail.techStack.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500 block mb-1.5">
                          Tech Stack
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {detail.techStack.slice(0, 4).map((t) => (
                            <span
                              key={t.name}
                              className="text-xs bg-neutral-800/50 text-gray-400 rounded px-1.5 py-0.5"
                            >
                              {t.name}
                            </span>
                          ))}
                          {detail.techStack.length > 4 && (
                            <span className="text-xs text-gray-600">
                              +{detail.techStack.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    {detail?.links && detail.links.length > 0 && (
                      <div className="flex gap-3 pt-3 border-t border-neutral-800">
                        {detail.links.map((link) => {
                          const isExternal =
                            link.label.toLowerCase() === "live demo" ||
                            link.label.toLowerCase() === "website";
                          const isGitHub =
                            link.label.toLowerCase() === "github" ||
                            link.url.includes("github");
                          const isDisabled = link.url === "#" || !link.url;
                          const Icon = isGitHub
                            ? Github
                            : isExternal
                            ? ExternalLink
                            : ExternalLink;

                          return (
                            <a
                              key={link.label}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`text-xs flex items-center gap-1 ${
                                isDisabled
                                  ? "text-gray-600 cursor-not-allowed"
                                  : "text-cyan-400 hover:underline"
                              }`}
                            >
                              <Icon className="w-3 h-3" />
                              {link.label}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {projectNodes.length === 0 && (
              <p className="text-gray-500 text-center py-16">
                No projects found.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
