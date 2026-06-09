"use client";

import { type NodeType, type SkillCategory, type ProjectStatus } from "@/lib/types";

interface FilterBarProps {
  activeTypes: NodeType[];
  activeCategory: SkillCategory | null;
  activeStatus: ProjectStatus | null;
  onTypeToggle: (type: NodeType) => void;
  onCategoryChange: (cat: SkillCategory | null) => void;
  onStatusChange: (status: ProjectStatus | null) => void;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  "ai-systems",
  "automation",
  "research-engines",
  "trading-systems",
  "game-experiments",
  "visual-interfaces",
  "business-tools",
  "future-concepts",
];

const PROJECT_STATUSES: ProjectStatus[] = [
  "production",
  "development",
  "experiment",
  "concept",
  "archived",
];

const TYPE_LABELS: { type: NodeType; label: string }[] = [
  { type: "skill", label: "Skills" },
  { type: "project", label: "Projects" },
  { type: "concept", label: "Concepts" },
];

export function FilterBar({
  activeTypes,
  activeCategory,
  activeStatus,
  onTypeToggle,
  onCategoryChange,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-neutral-800 px-6 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {TYPE_LABELS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onTypeToggle(type)}
              className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-200 ${
                activeTypes.includes(type)
                  ? "bg-neutral-700 text-white ring-1 ring-cyan-400/50"
                  : "bg-neutral-900 text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-neutral-700" />

        {activeTypes.includes("skill") && (
          <select
            value={activeCategory ?? ""}
            onChange={(e) =>
              onCategoryChange(
                e.target.value === "" ? null : (e.target.value as SkillCategory)
              )
            }
            className="bg-neutral-900 text-sm text-gray-300 border border-neutral-700 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all duration-200"
          >
            <option value="">All Categories</option>
            {SKILL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/-/g, " ")}
              </option>
            ))}
          </select>
        )}

        {activeTypes.includes("project") && (
          <select
            value={activeStatus ?? ""}
            onChange={(e) =>
              onStatusChange(
                e.target.value === "" ? null : (e.target.value as ProjectStatus)
              )
            }
            className="bg-neutral-900 text-sm text-gray-300 border border-neutral-700 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all duration-200"
          >
            <option value="">All Statuses</option>
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
