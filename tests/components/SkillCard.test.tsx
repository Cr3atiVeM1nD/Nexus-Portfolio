import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillCard } from "@/components/SkillCard";
import type { SkillNode } from "@/lib/types";

const skillNode: SkillNode = {
  id: "ai-systems",
  type: "skill",
  label: "AI Systems",
  category: "ai-systems",
  proficiency: 92,
  icon: "brain",
  technologies: ["GPT-4", "Claude", "LangChain"],
  description: "Designing and deploying large language model solutions",
};

describe("SkillCard", () => {
  it("renders skill label", () => {
    render(<SkillCard node={skillNode} isSelected={false} />);
    expect(screen.getByText("AI Systems")).toBeInTheDocument();
  });

  it("renders category", () => {
    render(<SkillCard node={skillNode} isSelected={false} />);
    expect(screen.getByText("ai systems")).toBeInTheDocument();
  });

  it("renders proficiency bar with correct width", () => {
    render(<SkillCard node={skillNode} isSelected={false} />);
    const bar = document.querySelector("[style*='width: 92%']");
    expect(bar).toBeInTheDocument();
  });

  it("renders technologies as a list", () => {
    render(<SkillCard node={skillNode} isSelected={false} />);
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("Claude")).toBeInTheDocument();
    expect(screen.getByText("LangChain")).toBeInTheDocument();
  });

  it("adds ring-2 class when isSelected is true", () => {
    const { container } = render(<SkillCard node={skillNode} isSelected={true} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("ring-2");
    expect(card.className).toContain("ring-cyan-400");
  });

  it("renders Lucide icon (svg presence)", () => {
    const { container } = render(<SkillCard node={skillNode} isSelected={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
