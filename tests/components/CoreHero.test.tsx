import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CoreHero } from "@/components/CoreHero";
import type { CoreNode } from "@/lib/types";

const coreNode: CoreNode = {
  id: "core",
  type: "core",
  label: "BUILDER CORE",
  description: "The central nexus",
  subtitle: "The Nexus",
  mission: "Building autonomous systems at the intersection of AI, finance, and human interface",
};

describe("CoreHero", () => {
  it("renders BUILDER CORE as heading", () => {
    render(<CoreHero node={coreNode} skillCount={8} projectCount={6} conceptCount={3} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("BUILDER CORE");
  });

  it("renders mission text", () => {
    render(<CoreHero node={coreNode} skillCount={8} projectCount={6} conceptCount={3} />);
    expect(screen.getByText(/Building autonomous systems/)).toBeInTheDocument();
  });

  it("renders correct stats (X Skills · Y Projects · Z Concepts)", () => {
    render(<CoreHero node={coreNode} skillCount={8} projectCount={6} conceptCount={3} />);
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Concepts")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<CoreHero node={coreNode} skillCount={8} projectCount={6} conceptCount={3} />);
    expect(screen.getByText("The Nexus")).toBeInTheDocument();
  });
});
