import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NodeCard } from "@/components/NodeCard";
import type { NexusNode, SkillNode, ProjectNode, ConceptNode } from "@/lib/types";

const allNodes: NexusNode[] = [
  {
    id: "core",
    type: "core",
    label: "BUILDER CORE",
    description: "Central nexus",
    subtitle: "The Nexus",
    mission: "Building systems",
  } as const,
  {
    id: "ai-systems",
    type: "skill",
    label: "AI Systems",
    category: "ai-systems",
    icon: "brain",
    proficiency: 92,
    technologies: ["GPT-4"],
    description: "AI solutions",
  } as SkillNode,
  {
    id: "proj-nexus",
    type: "project",
    label: "NEXUS Portfolio",
    status: "development",
    year: 2025,
    skills: ["ai-systems"],
    technologies: ["Next.js"],
    highlights: ["First highlight"],
    description: "A portfolio",
  } as ProjectNode,
  {
    id: "conc-swarm",
    type: "concept",
    label: "Swarm Intel",
    status: "concept",
    feasibility: 45,
    relatedSkills: ["ai-systems"],
    description: "Swarm platform",
  } as ConceptNode,
];

describe("NodeCard", () => {
  it("returns null for core node", () => {
    const { container } = render(
      <NodeCard
        node={allNodes[0]}
        allNodes={allNodes}
        selectedNodeId={null}
        onClick={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders SkillCard for skill node", () => {
    render(
      <NodeCard
        node={allNodes[1]}
        allNodes={allNodes}
        selectedNodeId={null}
        onClick={() => {}}
      />
    );
    expect(screen.getByText("AI Systems")).toBeInTheDocument();
    expect(screen.getByText("ai systems")).toBeInTheDocument();
  });

  it("renders ProjectCard for project node", () => {
    render(
      <NodeCard
        node={allNodes[2]}
        allNodes={allNodes}
        selectedNodeId={null}
        onClick={() => {}}
      />
    );
    expect(screen.getByText("NEXUS Portfolio")).toBeInTheDocument();
    expect(screen.getByText("development")).toBeInTheDocument();
  });

  it("renders ConceptCard for concept node", () => {
    render(
      <NodeCard
        node={allNodes[3]}
        allNodes={allNodes}
        selectedNodeId={null}
        onClick={() => {}}
      />
    );
    expect(screen.getByText("Swarm Intel")).toBeInTheDocument();
    expect(screen.getByText("Concept")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <NodeCard
        node={allNodes[1]}
        allNodes={allNodes}
        selectedNodeId={null}
        onClick={onClick}
      />
    );
    const button = screen.getByRole("button");
    await user.click(button);
    expect(onClick).toHaveBeenCalledWith("ai-systems");
  });
});
