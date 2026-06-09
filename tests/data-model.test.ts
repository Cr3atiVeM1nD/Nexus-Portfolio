import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  NexusNode,
  CoreNode,
  SkillNode,
  ProjectNode,
  ConceptNode,
  Edge,
  ProjectStatus,
  SkillCategory,
  NodeType,
} from "../lib/types";

describe("NexusNode type discrimination", () => {
  it("should discriminate CoreNode by type field", () => {
    const core: CoreNode = {
      id: "test-core",
      type: "core",
      label: "Core",
      description: "Test",
      subtitle: "The Core",
      mission: "Test mission",
    };
    expect(core.type).toBe("core");
    expect(core.subtitle).toBeDefined();
    expect(core.mission).toBeDefined();

    if (core.type === "core") {
      expectTypeOf(core).toEqualTypeOf<CoreNode>();
    }
  });

  it("should discriminate SkillNode by type field", () => {
    const skill: SkillNode = {
      id: "test-skill",
      type: "skill",
      label: "Skill",
      description: "Test",
      category: "ai-systems",
      icon: "brain",
      proficiency: 85,
      technologies: ["TypeScript"],
    };
    expect(skill.type).toBe("skill");
    expect(skill.category).toBeDefined();
    expect(skill.proficiency).toBeDefined();

    if (skill.type === "skill") {
      expectTypeOf(skill).toEqualTypeOf<SkillNode>();
    }
  });

  it("should discriminate ProjectNode by type field", () => {
    const project: ProjectNode = {
      id: "test-proj",
      type: "project",
      label: "Project",
      description: "Test",
      status: "development",
      year: 2025,
      skills: ["test-skill"],
      technologies: ["React"],
      highlights: ["Feature"],
    };
    expect(project.type).toBe("project");
    expect(project.status).toBeDefined();
    expect(project.year).toBeDefined();

    if (project.type === "project") {
      expectTypeOf(project).toEqualTypeOf<ProjectNode>();
    }
  });

  it("should discriminate ConceptNode by type field", () => {
    const concept: ConceptNode = {
      id: "test-concept",
      type: "concept",
      label: "Concept",
      description: "Test",
      status: "concept",
      feasibility: 50,
      relatedSkills: ["test-skill"],
    };
    expect(concept.type).toBe("concept");
    expect(concept.feasibility).toBeDefined();

    if (concept.type === "concept") {
      expectTypeOf(concept).toEqualTypeOf<ConceptNode>();
    }
  });

  it("should reject invalid NodeType values at compile time", () => {
    const validTypes: NodeType[] = ["core", "skill", "project", "concept"];
    expect(validTypes).toHaveLength(4);
    expect(validTypes).toContain("core");
    expect(validTypes).toContain("skill");
    expect(validTypes).toContain("project");
    expect(validTypes).toContain("concept");
  });
});

describe("ProjectStatus", () => {
  it("should allow only valid status values at type level", () => {
    const allStatuses: ProjectStatus[] = [
      "production",
      "development",
      "experiment",
      "concept",
      "archived",
    ];
    expect(allStatuses).toHaveLength(5);
    expect(allStatuses).toContain("production");
    expect(allStatuses).toContain("development");
    expect(allStatuses).toContain("experiment");
    expect(allStatuses).toContain("concept");
    expect(allStatuses).toContain("archived");
  });

  it("should reject invalid ProjectStatus values at runtime", () => {
    const validStatuses: readonly string[] = [
      "production",
      "development",
      "experiment",
      "concept",
      "archived",
    ];
    const invalidValues = ["live", "beta", "done", "alpha", ""];
    for (const val of invalidValues) {
      expect(validStatuses).not.toContain(val);
    }
  });
});

describe("SkillCategory", () => {
  it("should allow only valid category values at type level", () => {
    const allCategories: SkillCategory[] = [
      "ai-systems",
      "automation",
      "research-engines",
      "trading-systems",
      "game-experiments",
      "visual-interfaces",
      "business-tools",
      "future-concepts",
    ];
    expect(allCategories).toHaveLength(8);
    expect(allCategories).toContain("ai-systems");
    expect(allCategories).toContain("future-concepts");
  });

  it("should reject invalid SkillCategory values at runtime", () => {
    const validCategories: readonly string[] = [
      "ai-systems",
      "automation",
      "research-engines",
      "trading-systems",
      "game-experiments",
      "visual-interfaces",
      "business-tools",
      "future-concepts",
    ];
    const invalidValues = ["ai", "systems", "games", "data-science", "ml", ""];
    for (const val of invalidValues) {
      expect(validCategories).not.toContain(val);
    }
  });
});

describe("Edge type validation", () => {
  it("should support all relation types at type level", () => {
    const edges: Edge[] = [
      { id: "e1", source: "a", target: "b", relation: "powers", strength: 0.8 },
      { id: "e2", source: "a", target: "b", relation: "contains", strength: 0.9 },
      { id: "e3", source: "a", target: "b", relation: "related-to", strength: 0.5 },
      { id: "e4", source: "a", target: "b", relation: "evolves-into", strength: 0.6 },
    ];
    expect(edges).toHaveLength(4);
    const relationTypes = edges.map((e) => e.relation);
    expect(relationTypes).toContain("powers");
    expect(relationTypes).toContain("contains");
    expect(relationTypes).toContain("related-to");
    expect(relationTypes).toContain("evolves-into");
  });
});
