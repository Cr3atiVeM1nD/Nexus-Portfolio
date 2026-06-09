import { describe, it, expect } from "vitest";
import {
  loadNexusData,
  getNodeById,
  getRelatedNodes,
  getProjectDetail,
  validateNexusData,
} from "../lib/utils";
import type { NexusData, NexusNode } from "../lib/types";

describe("loadNexusData", () => {
  it("should return valid NexusData with nodes and edges", () => {
    const data = loadNexusData();
    expect(data).toBeDefined();
    expect(Array.isArray(data.nodes)).toBe(true);
    expect(Array.isArray(data.edges)).toBe(true);
    expect(data.meta).toBeDefined();
    expect(typeof data.meta.version).toBe("string");
    expect(typeof data.meta.lastUpdated).toBe("string");
  });

  it("should contain the core node", () => {
    const data = loadNexusData();
    const coreNode = data.nodes.find((n) => n.id === "core");
    expect(coreNode).toBeDefined();
    expect(coreNode?.type).toBe("core");
  });

  it("should have at least 17 nodes and 20 edges", () => {
    const data = loadNexusData();
    expect(data.nodes.length).toBeGreaterThanOrEqual(18);
    expect(data.edges.length).toBeGreaterThanOrEqual(20);
  });
});

describe("getNodeById", () => {
  it("should find an existing node by ID", () => {
    const data = loadNexusData();
    const node = getNodeById("core", data.nodes);
    expect(node).toBeDefined();
    expect(node?.id).toBe("core");
    expect(node?.type).toBe("core");
  });

  it("should find a skill node by ID", () => {
    const data = loadNexusData();
    const node = getNodeById("ai-systems", data.nodes);
    expect(node).toBeDefined();
    expect(node?.type).toBe("skill");
  });

  it("should return undefined for a non-existent ID", () => {
    const data = loadNexusData();
    const node = getNodeById("non-existent-id", data.nodes);
    expect(node).toBeUndefined();
  });

  it("should return undefined for an empty string ID", () => {
    const data = loadNexusData();
    const node = getNodeById("", data.nodes);
    expect(node).toBeUndefined();
  });
});

describe("getRelatedNodes", () => {
  it("should return related nodes for core", () => {
    const data = loadNexusData();
    const related = getRelatedNodes("core", data.edges, data.nodes);
    expect(related.length).toBeGreaterThan(0);
    const skillIds = related.map((n) => n.id);
    expect(skillIds).toContain("ai-systems");
    expect(skillIds).toContain("automation");
    expect(skillIds).toContain("trading-systems");
  });

  it("should return empty array for isolated node ID", () => {
    const data = loadNexusData();
    const related = getRelatedNodes("non-existent-id", data.edges, data.nodes);
    expect(related).toEqual([]);
  });

  it("should not include the source node in its own related nodes", () => {
    const data = loadNexusData();
    const related = getRelatedNodes("core", data.edges, data.nodes);
    const coreIncluded = related.some((n) => n.id === "core");
    expect(coreIncluded).toBe(false);
  });
});

describe("getProjectDetail", () => {
  it("should find an existing project by ID", () => {
    const project = getProjectDetail("proj-nexus");
    expect(project).toBeDefined();
    expect(project?.id).toBe("proj-nexus");
    expect(project?.title).toBe("NEXUS Portfolio");
  });

  it("should return undefined for a non-existent project ID", () => {
    const project = getProjectDetail("non-existent-project");
    expect(project).toBeUndefined();
  });

  it("should have a valid timeline for every project", () => {
    const projectIds = [
      "proj-nexus",
      "proj-autotrader",
      "proj-knowledge-graph",
      "proj-game-ai",
      "proj-crm-automation",
      "proj-viz-engine",
    ];
    for (const id of projectIds) {
      const project = getProjectDetail(id);
      expect(project).toBeDefined();
      expect(project?.timeline).toBeDefined();
      expect(typeof project?.timeline.start).toBe("string");
    }
  });
});

describe("validateNexusData", () => {
  it("should throw for non-object input", () => {
    expect(() => validateNexusData(null)).toThrow();
    expect(() => validateNexusData(undefined)).toThrow();
    expect(() => validateNexusData("string")).toThrow();
    expect(() => validateNexusData(42)).toThrow();
  });

  it("should throw for missing required properties", () => {
    expect(() => validateNexusData({})).toThrow("nodes");
    expect(() => validateNexusData({ nodes: [] })).toThrow("edges");
    expect(() =>
      validateNexusData({ nodes: [], edges: [] })
    ).toThrow("meta");
  });

  it("should throw for invalid nodes structure", () => {
    const invalid = {
      nodes: "not-an-array",
      edges: [],
      meta: { version: "1.0", lastUpdated: "2025-01-01" },
    };
    expect(() => validateNexusData(invalid)).toThrow("nodes");
  });

  it("should throw for invalid meta structure", () => {
    const invalid = {
      nodes: [],
      edges: [],
      meta: "not-an-object",
    };
    expect(() => validateNexusData(invalid)).toThrow("meta");
  });

  it("should accept valid minimal NexusData", () => {
    const valid = {
      nodes: [
        {
          id: "n1",
          type: "skill" as const,
          label: "Test",
          description: "Test node",
          category: "ai-systems" as const,
          icon: "brain",
          proficiency: 80,
          technologies: [],
        },
      ],
      edges: [
        {
          id: "e1",
          source: "n1",
          target: "n1",
          relation: "related-to" as const,
          strength: 0.5,
        },
      ],
      meta: { version: "1.0", lastUpdated: "2025-01-01" },
    };
    const result = validateNexusData(valid);
    expect(result.nodes).toHaveLength(1);
    expect(result.edges).toHaveLength(1);
    expect(result.meta.version).toBe("1.0");
  });
});
