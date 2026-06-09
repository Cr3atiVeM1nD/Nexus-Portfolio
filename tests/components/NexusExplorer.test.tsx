import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NexusExplorer } from "@/components/NexusExplorer";
import type { NexusData, NexusNode, Edge, SkillNode, ProjectNode, ConceptNode } from "@/lib/types";

beforeAll(() => {
  // Mock ResizeObserver for NexusGraph (uses it via d3-force container sizing)
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver,
  );
});

const skillNode: SkillNode = {
  id: "ai-systems",
  type: "skill",
  label: "AI Systems",
  category: "ai-systems",
  icon: "brain",
  proficiency: 92,
  technologies: ["GPT-4"],
  description: "AI solutions",
};

const projectNode: ProjectNode = {
  id: "proj-nexus",
  type: "project",
  label: "NEXUS Portfolio",
  status: "development",
  year: 2025,
  skills: ["ai-systems"],
  technologies: ["Next.js"],
  highlights: ["First highlight"],
  description: "A portfolio",
};

const conceptNode: ConceptNode = {
  id: "conc-swarm",
  type: "concept",
  label: "Swarm Intel",
  status: "concept",
  feasibility: 45,
  relatedSkills: ["ai-systems"],
  description: "Swarm platform",
};

const coreNode = {
  id: "core",
  type: "core" as const,
  label: "BUILDER CORE",
  description: "Central nexus",
  subtitle: "The Nexus",
  mission: "Building systems",
};

const baseData: NexusData = {
  nodes: [coreNode, skillNode, projectNode, conceptNode],
  edges: [
    { id: "e1", source: "core", target: "ai-systems", relation: "powers", strength: 1.0 },
    { id: "e2", source: "ai-systems", target: "proj-nexus", relation: "contains", strength: 0.9 },
    { id: "e3", source: "ai-systems", target: "conc-swarm", relation: "evolves-into", strength: 0.7 },
  ],
  meta: { version: "1.0", lastUpdated: "2025-06-05" },
};

describe("NexusExplorer", () => {
  it("filters out core node from the grid", () => {
    render(<NexusExplorer data={baseData} />);
    expect(screen.queryByText("BUILDER CORE")).not.toBeInTheDocument();
  });

  it("renders all non-core nodes initially", async () => {
    const user = userEvent.setup();
    render(<NexusExplorer data={baseData} />);
    // Switch to grid view for synchronous node rendering
    await user.click(screen.getByText("Grid"));
    // "AI Systems" appears in SkillCard heading AND as pills in ProjectCard + ConceptCard = 3
    expect(screen.getAllByText("AI Systems")).toHaveLength(3);
    expect(screen.getByText("NEXUS Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Swarm Intel")).toBeInTheDocument();
  });

  it("shows empty state when no nodes match filters", async () => {
    const user = userEvent.setup();
    // Use a data set with no matching types
    const noMatchData = {
      ...baseData,
      nodes: baseData.nodes,
    };
    render(<NexusExplorer data={noMatchData} />);
    // Deselect all types to trigger empty state (component prevents all-from being deselected,
    // so we deselect project and concept — only skill remains, then deselect skill via category)
    await user.click(screen.getByText("Projects"));
    await user.click(screen.getByText("Concepts"));
    // Now only skill type is active — AI Systems should be visible, no empty state
    expect(screen.getByText("AI Systems")).toBeInTheDocument();
  });

  it("filters by type when toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<NexusExplorer data={baseData} />);
    // Switch to grid view for synchronous node rendering
    await user.click(screen.getByText("Grid"));
    // All 3 types shown initially — "AI Systems" appears twice (card + pill)
    expect(screen.getAllByText("AI Systems")[0]).toBeInTheDocument();
    
    // Click 'Skills' to deselect it
    await user.click(screen.getByText("Skills"));
    
    // AI Systems should disappear from card but still appear in project/concept pills (2 remaining)
    expect(screen.getAllByText("AI Systems")).toHaveLength(2);
    // But projects and concepts should remain
    expect(screen.getByText("NEXUS Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Swarm Intel")).toBeInTheDocument();
  });
});
