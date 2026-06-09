import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/ProjectCard";
import type { ProjectNode, SkillNode } from "@/lib/types";

const projectNode: ProjectNode = {
  id: "proj-nexus",
  type: "project",
  label: "NEXUS Portfolio",
  status: "development",
  year: 2025,
  skills: ["visual-interfaces", "ai-systems"],
  technologies: ["Next.js", "React", "TypeScript"],
  highlights: [
    "Living portfolio with graph visualization",
    "AI-powered content generation",
    "Modular component architecture",
    "Fourth highlight (should not render)",
  ],
  description: "An interactive living portfolio",
};

const skillNodes: SkillNode[] = [
  {
    id: "visual-interfaces",
    type: "skill",
    label: "Visual Interfaces",
    category: "visual-interfaces",
    icon: "eye",
    proficiency: 78,
    technologies: ["Three.js", "D3.js"],
    description: "Crafting immersive data visualizations",
  },
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

describe("ProjectCard", () => {
  it("renders project label", () => {
    render(<ProjectCard node={projectNode} skillNodes={skillNodes} isSelected={false} />);
    expect(screen.getByText("NEXUS Portfolio")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<ProjectCard node={projectNode} skillNodes={skillNodes} isSelected={false} />);
    expect(screen.getByText("development")).toBeInTheDocument();
  });

  it("renders year", () => {
    render(<ProjectCard node={projectNode} skillNodes={skillNodes} isSelected={false} />);
    expect(screen.getByText("2025")).toBeInTheDocument();
  });

  it("renders first 3 highlights", () => {
    render(<ProjectCard node={projectNode} skillNodes={skillNodes} isSelected={false} />);
    expect(screen.getByText("Living portfolio with graph visualization")).toBeInTheDocument();
    expect(screen.getByText("AI-powered content generation")).toBeInTheDocument();
    expect(screen.getByText("Modular component architecture")).toBeInTheDocument();
    expect(screen.queryByText("Fourth highlight (should not render)")).not.toBeInTheDocument();
  });

  it("renders skill pills from skillNodes prop", () => {
    render(<ProjectCard node={projectNode} skillNodes={skillNodes} isSelected={false} />);
    expect(screen.getByText("Visual Interfaces")).toBeInTheDocument();
    expect(screen.getByText("AI Systems")).toBeInTheDocument();
  });

  it("adds ring-2 class when isSelected is true", () => {
    const { container } = render(<ProjectCard node={projectNode} skillNodes={skillNodes} isSelected={true} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("ring-2");
    expect(card.className).toContain("ring-cyan-400");
  });
});
