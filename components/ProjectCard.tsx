import { type ProjectNode, type SkillNode } from "@/lib/types";
import { STATUS_STYLES } from "@/lib/style-helpers";

interface ProjectCardProps {
  node: ProjectNode;
  skillNodes: SkillNode[];
  isSelected: boolean;
}


export function ProjectCard({ node, skillNodes, isSelected }: ProjectCardProps) {
  return (
    <div
      className={`bg-neutral-900 border rounded-xl p-5 transition-all duration-200 hover:border-neutral-700 ${
        isSelected
          ? "border-cyan-400 ring-2 ring-cyan-400"
          : "border-neutral-800"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-white font-semibold">{node.label}</h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
            STATUS_STYLES[node.status] ?? ""
          }`}
        >
          {node.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-2">{node.year}</p>
      <p className="text-sm text-gray-300 line-clamp-2 mb-3">{node.description}</p>
      {node.highlights.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-400 space-y-0.5 mb-3">
          {node.highlights.slice(0, 3).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
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
