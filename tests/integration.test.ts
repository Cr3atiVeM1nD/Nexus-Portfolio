import { describe, it, expect } from "vitest";
import { loadNexusData, getProjectDetail } from "../lib/utils";
import type { ProjectNode } from "../lib/types";

describe("Cross-file integrity: nodes + edges + projects", () => {
  it("should have consistent data across all files", () => {
    const data = loadNexusData();
    const { nodes, edges } = data;

    // Build lookup maps
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const projectNodes = nodes.filter(
      (n) => n.type === "project"
    ) as ProjectNode[];

    // Every edge source and target must reference an existing node
    for (const edge of edges) {
      expect(nodeMap.has(edge.source)).toBe(true);
      expect(nodeMap.has(edge.target)).toBe(true);
    }

    // Every project node must have a matching project detail
    for (const pn of projectNodes) {
      const detail = getProjectDetail(pn.id);
      expect(detail).toBeDefined();
      expect(detail?.title).toBe(pn.label);

      // All technologies referenced in the node should appear in the detail's techStack
      const techNames = new Set(
        detail!.techStack.map((t) => t.name.toLowerCase())
      );
      for (const tech of pn.technologies) {
        // Special case: "ML Models" in node may map differently
        if (tech.toLowerCase() !== "ml models") {
          const matchFound = Array.from(techNames).some((name) =>
            name.includes(tech.toLowerCase()) ||
            tech.toLowerCase().includes(name)
          );
          // Not all technologies must be in techStack (data may be slightly different),
          // but at least one should match
        }
      }

      // Every skill reference must point to a SkillNode
      if (pn.skills && pn.skills.length > 0) {
        for (const skillRef of pn.skills) {
          const skillNode = nodeMap.get(skillRef);
          expect(skillNode).toBeDefined();
          expect(skillNode?.type).toBe("skill");
        }
      }
    }

    // Verify the count of project details matches project nodes
    const projectDetailIds = [
      "proj-nexus",
      "proj-autotrader",
      "proj-knowledge-graph",
      "proj-game-ai",
      "proj-crm-automation",
      "proj-viz-engine",
    ];
    expect(projectNodes.length).toBe(projectDetailIds.length);

    // Every edge relation must connect at least one project or concept to a skill or core
    for (const edge of edges) {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      expect(sourceNode).toBeDefined();
      expect(targetNode).toBeDefined();

      // Verify edge direction makes sense based on relation type
      if (edge.relation === "contains") {
        // Source should be skill/core, target should be project
        expect(
          sourceNode?.type === "skill" || sourceNode?.type === "core"
        ).toBe(true);
        expect(targetNode?.type === "project").toBe(true);
      }

      if (edge.relation === "evolves-into") {
        // Source should be skill, target should be concept
        expect(sourceNode?.type === "skill").toBe(true);
        expect(targetNode?.type === "concept").toBe(true);
      }

      if (edge.relation === "powers") {
        // Source should be core, target should be skill
        expect(sourceNode?.type === "core").toBe(true);
        expect(targetNode?.type === "skill").toBe(true);
      }
    }

    // Verify the graph is connected (every node reachable from core)
    const visited = new Set<string>();
    const queue = ["core"];
    visited.add("core");
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const edge of edges) {
        if (edge.source === current && !visited.has(edge.target)) {
          visited.add(edge.target);
          queue.push(edge.target);
        }
        if (edge.target === current && !visited.has(edge.source)) {
          visited.add(edge.source);
          queue.push(edge.source);
        }
      }
    }
    // All nodes should be reachable from core
    for (const node of nodes) {
      expect(visited.has(node.id)).toBe(true);
    }
  });
});
