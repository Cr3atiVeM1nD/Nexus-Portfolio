import { type NexusNode } from "@/lib/types";

export function searchNodes(query: string, nodes: NexusNode[]): NexusNode[] {
  const trimmed = query.trim();
  if (trimmed === "") return nodes;

  const lowerQuery = trimmed.toLowerCase();

  return nodes.filter((node) => {
    if (node.label.toLowerCase().includes(lowerQuery)) return true;
    if (node.description.toLowerCase().includes(lowerQuery)) return true;
    if (node.type === "skill" || node.type === "project") {
      const techs = node.technologies;
      for (const tech of techs) {
        if (tech.toLowerCase().includes(lowerQuery)) return true;
      }
    }
    return false;
  });
}
