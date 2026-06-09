import { describe, it, expect } from "vitest";
import nodesData from "../data/nodes.json";
import edgesData from "../data/edges.json";
import projectsData from "../data/projects.json";
import type {
  NexusNode,
  CoreNode,
  SkillNode,
  ProjectNode,
  ConceptNode,
  Edge,
  SkillCategory,
  ProjectStatus,
} from "../lib/types";

const nodes = nodesData as unknown as NexusNode[];
const edges = edgesData as unknown as Edge[];
const projects = projectsData as Record<string, unknown>[];

const VALID_NODE_TYPES = ["core", "skill", "project", "concept"] as const;
const VALID_RELATIONS = ["powers", "contains", "related-to", "evolves-into"] as const;
const VALID_STATUSES: ProjectStatus[] = [
  "production",
  "development",
  "experiment",
  "concept",
  "archived",
];
const VALID_CATEGORIES: SkillCategory[] = [
  "ai-systems",
  "automation",
  "research-engines",
  "trading-systems",
  "game-experiments",
  "visual-interfaces",
  "business-tools",
  "future-concepts",
];

describe("nodes.json consistency", () => {
  it("should have no duplicate IDs", () => {
    const ids = nodes.map((n) => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have all required fields for every node", () => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      expect(node.id).toBeDefined();
      expect(typeof node.id).toBe("string");
      expect(node.type).toBeDefined();
      expect(VALID_NODE_TYPES.includes(node.type as any)).toBe(true);
      expect(node.label).toBeDefined();
      expect(typeof node.label).toBe("string");
      expect(node.description).toBeDefined();
      expect(typeof node.description).toBe("string");
    }
  });

  it("should have all required fields for CoreNode", () => {
    const coreNodes = nodes.filter((n) => n.type === "core") as CoreNode[];
    for (const node of coreNodes) {
      expect(node.subtitle).toBeDefined();
      expect(typeof node.subtitle).toBe("string");
      expect(node.mission).toBeDefined();
      expect(typeof node.mission).toBe("string");
    }
  });

  it("should have all required fields for SkillNode", () => {
    const skillNodes = nodes.filter((n) => n.type === "skill") as SkillNode[];
    for (const node of skillNodes) {
      expect(VALID_CATEGORIES.includes(node.category)).toBe(true);
      expect(typeof node.icon).toBe("string");
      expect(typeof node.proficiency).toBe("number");
      expect(Array.isArray(node.technologies)).toBe(true);
    }
  });

  it("should have proficiency between 0 and 100 for SkillNode", () => {
    const skillNodes = nodes.filter((n) => n.type === "skill") as SkillNode[];
    for (const node of skillNodes) {
      expect(node.proficiency).toBeGreaterThanOrEqual(0);
      expect(node.proficiency).toBeLessThanOrEqual(100);
    }
  });

  it("should have all required fields for ProjectNode", () => {
    const projectNodes = nodes.filter(
      (n) => n.type === "project"
    ) as ProjectNode[];
    for (const node of projectNodes) {
      expect(VALID_STATUSES.includes(node.status)).toBe(true);
      expect(typeof node.year).toBe("number");
      expect(Array.isArray(node.skills)).toBe(true);
      expect(Array.isArray(node.technologies)).toBe(true);
      expect(Array.isArray(node.highlights)).toBe(true);
    }
  });

  it("should reference only existing SkillNode IDs in ProjectNode.skills[]", () => {
    const skillNodes = nodes.filter((n) => n.type === "skill");
    const skillIds = new Set(skillNodes.map((n) => n.id));

    const projectNodes = nodes.filter(
      (n) => n.type === "project"
    ) as ProjectNode[];
    const missingSkills: string[] = [];
    for (const proj of projectNodes) {
      for (const skillRef of proj.skills) {
        if (!skillIds.has(skillRef)) {
          missingSkills.push(
            `Project '${proj.id}' references skill '${skillRef}' which does not exist`
          );
        }
      }
    }
    expect(missingSkills).toEqual([]);
  });

  it("should meet minimum node count", () => {
    expect(nodes.length).toBeGreaterThanOrEqual(18);
  });
});

describe("edges.json consistency", () => {
  it("should have no duplicate IDs", () => {
    const ids = edges.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have valid relation types", () => {
    for (const edge of edges) {
      expect(VALID_RELATIONS.includes(edge.relation as any)).toBe(true);
    }
  });

  it("should have strength between 0 and 1", () => {
    for (const edge of edges) {
      expect(edge.strength).toBeGreaterThanOrEqual(0);
      expect(edge.strength).toBeLessThanOrEqual(1);
    }
  });

  it("should reference only existing Node IDs in source and target", () => {
    const nodeIds = new Set(nodes.map((n) => n.id));
    const invalidRefs: string[] = [];
    for (const edge of edges) {
      if (!nodeIds.has(edge.source)) {
        invalidRefs.push(
          `Edge '${edge.id}' references non-existent source '${edge.source}'`
        );
      }
      if (!nodeIds.has(edge.target)) {
        invalidRefs.push(
          `Edge '${edge.id}' references non-existent target '${edge.target}'`
        );
      }
    }
    expect(invalidRefs).toEqual([]);
  });

  it("should have all required fields for every edge", () => {
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      expect(typeof e.id).toBe("string");
      expect(typeof e.source).toBe("string");
      expect(typeof e.target).toBe("string");
      expect(typeof e.relation).toBe("string");
      expect(typeof e.strength).toBe("number");
    }
  });

  it("should meet minimum edge count", () => {
    expect(edges.length).toBeGreaterThanOrEqual(20);
  });
});

describe("projects.json consistency", () => {
  it("should have IDs that match existing ProjectNode IDs", () => {
    const projectNodeIds = new Set(
      nodes.filter((n) => n.type === "project").map((n) => n.id)
    );
    const missingProjects: string[] = [];
    const unknownProjects: string[] = [];

    for (const proj of projects) {
      const p = proj as { id?: string };
      expect(p.id).toBeDefined();
      expect(typeof p.id).toBe("string");

      if (p.id && projectNodeIds.has(p.id)) {
        projectNodeIds.delete(p.id);
      } else if (p.id) {
        unknownProjects.push(
          `Project '${p.id}' in projects.json has no matching ProjectNode`
        );
      }
    }

    for (const remainingId of projectNodeIds) {
      missingProjects.push(
        `ProjectNode '${remainingId}' has no entry in projects.json`
      );
    }

    expect(missingProjects).toEqual([]);
    expect(unknownProjects).toEqual([]);
  });

  it("should have all required fields for every project detail", () => {
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i] as Record<string, unknown>;
      expect(typeof p.id).toBe("string");
      expect(typeof p.title).toBe("string");
      expect(typeof p.tagline).toBe("string");
      expect(typeof p.description).toBe("string");
      expect(typeof p.longDescription).toBe("string");
      expect(Array.isArray(p.features)).toBe(true);
      expect(Array.isArray(p.techStack)).toBe(true);
      expect(Array.isArray(p.links)).toBe(true);
    }
  });
});
