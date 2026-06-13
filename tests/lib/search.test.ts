import { describe, it, expect } from "vitest";
import { searchNodes } from "@/lib/search";
import { type NexusNode } from "@/lib/types";

const testNodes: NexusNode[] = [
  {
    id: "react",
    type: "skill",
    label: "React",
    description: "Frontend framework for building user interfaces",
    category: "visual-interfaces",
    icon: "⚛️",
    proficiency: 90,
    technologies: ["JavaScript", "TypeScript", "JSX", "React Native"],
  },
  {
    id: "python",
    type: "skill",
    label: "Python",
    description: "General purpose programming language",
    category: "ai-systems",
    icon: "🐍",
    proficiency: 85,
    technologies: ["Python", "Django", "Flask", "PyTorch"],
  },
  {
    id: "nexus-core",
    type: "concept",
    label: "Nexus Core",
    description: "Central integration system for the portfolio ecosystem",
    status: "concept",
    feasibility: 70,
    relatedSkills: ["react", "python", "typescript"],
  },
  {
    id: "react-native-app",
    type: "project",
    label: "React Native App",
    description: "Mobile application built with React Native",
    status: "development",
    year: 2024,
    skills: ["react", "typescript"],
    technologies: ["React Native", "TypeScript", "Expo"],
    highlights: [],
  },
];

describe("searchNodes", () => {
  it("returns all nodes when query is empty", () => {
    const result = searchNodes("", testNodes);
    expect(result).toHaveLength(4);
    expect(result).toEqual(testNodes);
  });

  it("finds exact match by label", () => {
    const result = searchNodes("React", testNodes);
    expect(result).toHaveLength(2);
    const labels = result.map((n) => n.label);
    expect(labels).toContain("React");
    expect(labels).toContain("React Native App");
  });

  it("finds fragment match", () => {
    const result = searchNodes("pyt", testNodes);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Python");
  });

  it("returns empty array for no match", () => {
    const result = searchNodes("xyz123", testNodes);
    expect(result).toHaveLength(0);
  });

  it("is case-insensitive", () => {
    const result = searchNodes("PYTHON", testNodes);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Python");
  });

  it("finds match in technologies array", () => {
    const result = searchNodes("TypeScript", testNodes);
    expect(result).toHaveLength(2);
    const labels = result.map((n) => n.label);
    expect(labels).toContain("React");
    expect(labels).toContain("React Native App");
  });

  it("finds match in description", () => {
    const result = searchNodes("mobile application", testNodes);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("React Native App");
  });

  it("whitespace-only query returns all nodes", () => {
    const result = searchNodes("   ", testNodes);
    expect(result).toHaveLength(4);
    expect(result).toEqual(testNodes);
  });
});
