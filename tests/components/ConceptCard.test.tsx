import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConceptCard } from "@/components/ConceptCard";
import type { ConceptNode, SkillNode } from "@/lib/types";

const conceptNode: ConceptNode = {
  id: "conc-swarm-intel",
  type: "concept",
  label: "Swarm Intelligence Platform",
  status: "concept",
  feasibility: 45,
  relatedSkills: ["ai-systems", "future-concepts"],
  description: "A distributed decision-making platform using swarm algorithms",
};

const skillNodes: SkillNode[] = [
  {
    id: "ai-systems",
    type: "skill",
    label: "AI Systems",
    category: "ai-systems",
    icon: "brain",
    proficiency: 92,
    technologies: ["GPT-4"],
    description: "Designing AI solutions",
  },
];

describe("ConceptCard", () => {
  it("renders concept label", () => {
    render(<ConceptCard node={conceptNode} skillNodes={skillNodes} isSelected={false} />);
    expect(screen.getByText("Swarm Intelligence Platform")).toBeInTheDocument();
  });

  it("renders 'Concept' badge", () => {
    render(<ConceptCard node={conceptNode} skillNodes={skillNodes} isSelected={false} />);
    expect(screen.getByText("Concept")).toBeInTheDocument();
  });

  it("renders feasibility bar", () => {
    render(<ConceptCard node={conceptNode} skillNodes={skillNodes} isSelected={false} />);
    expect(screen.getByText("45%")).toBeInTheDocument();
    const bar = document.querySelector("[style*='width: 45%']");
    expect(bar).toBeInTheDocument();
  });

  it("uses dashed border", () => {
    const { container } = render(<ConceptCard node={conceptNode} skillNodes={skillNodes} isSelected={false} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-dashed");
  });

  it("adds ring-2 class when isSelected is true", () => {
    const { container } = render(<ConceptCard node={conceptNode} skillNodes={skillNodes} isSelected={true} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("ring-2");
    expect(card.className).toContain("ring-purple-400");
  });
});
