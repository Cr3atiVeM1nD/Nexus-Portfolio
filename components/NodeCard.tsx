import { type NexusNode, type SkillNode } from "@/lib/types";
import { SkillCard } from "./SkillCard";
import { ProjectCard } from "./ProjectCard";
import { ConceptCard } from "./ConceptCard";
import { ContactCard } from "./ContactCard";

interface NodeCardProps {
  node: NexusNode;
  allNodes: NexusNode[];
  selectedNodeId: string | null;
  onClick: (id: string) => void;
}

function resolveSkillNodes(
  node: NexusNode,
  allNodes: NexusNode[]
): SkillNode[] {
  const skillIds: string[] =
    "skills" in node
      ? (node as { skills: string[] }).skills
      : "relatedSkills" in node
        ? (node as { relatedSkills: string[] }).relatedSkills
        : [];

  return allNodes.filter(
    (n): n is SkillNode => n.type === "skill" && skillIds.includes(n.id)
  );
}

export function NodeCard({ node, allNodes, selectedNodeId, onClick }: NodeCardProps) {
  const isSelected = node.id === selectedNodeId;

  if (node.type === "core") {
    return null;
  }

  const wrapped = (children: React.ReactNode) => (
    <button
      onClick={() => onClick(node.id)}
      className="w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-xl"
    >
      {children}
    </button>
  );

  switch (node.type) {
    case "skill":
      return wrapped(
        <SkillCard node={node} isSelected={isSelected} />
      );
    case "project":
      return wrapped(
        <ProjectCard
          node={node}
          skillNodes={resolveSkillNodes(node, allNodes)}
          isSelected={isSelected}
        />
      );
    case "concept":
      return wrapped(
        <ConceptCard
          node={node}
          skillNodes={resolveSkillNodes(node, allNodes)}
          isSelected={isSelected}
        />
      );
    case "contact":
      return wrapped(
        <ContactCard node={node} isSelected={isSelected} />
      );
    default:
      return null;
  }
}
