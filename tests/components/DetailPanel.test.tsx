import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { DetailPanel } from "@/components/DetailPanel";
import type { NexusNode, Edge, SkillNode, ProjectNode, ConceptNode } from "@/lib/types";

// Mock requestAnimationFrame to call callback immediately
beforeEach(() => {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
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

const allNodes: NexusNode[] = [skillNode, projectNode];
const allEdges: Edge[] = [
  { id: "e1", source: "ai-systems", target: "proj-nexus", relation: "contains", strength: 0.9 },
];

describe("DetailPanel", () => {
  it("returns null when node is null", () => {
    const { container } = render(
      <DetailPanel
        node={null}
        allNodes={allNodes}
        allEdges={allEdges}
        onClose={() => {}}
        onNavigate={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders SkillDetail for skill node", () => {
    render(
      <DetailPanel
        node={skillNode}
        allNodes={allNodes}
        allEdges={allEdges}
        onClose={() => {}}
        onNavigate={() => {}}
      />
    );
    expect(screen.getByText("AI Systems")).toBeInTheDocument();
    expect(screen.getByText("ai systems")).toBeInTheDocument();
  });

  it("renders ProjectDetail for project node", () => {
    render(
      <DetailPanel
        node={projectNode}
        allNodes={allNodes}
        allEdges={allEdges}
        onClose={() => {}}
        onNavigate={() => {}}
      />
    );
    expect(screen.getByText("NEXUS Portfolio")).toBeInTheDocument();
    expect(screen.getByText("development")).toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    render(
      <DetailPanel
        node={skillNode}
        allNodes={allNodes}
        allEdges={allEdges}
        onClose={onClose}
        onNavigate={() => {}}
      />
    );
    const backdrop = document.querySelector(".fixed.inset-0");
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when X button is clicked", () => {
    const onClose = vi.fn();
    render(
      <DetailPanel
        node={skillNode}
        allNodes={allNodes}
        allEdges={allEdges}
        onClose={onClose}
        onNavigate={() => {}}
      />
    );
    // Find the close button by its class (has lucide X icon)
    const closeButton = document.querySelector(".absolute.top-4.right-4");
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton!);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
