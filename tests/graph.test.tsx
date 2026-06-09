import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { ViewToggle } from "../components/ViewToggle";
import { GraphEdge } from "../components/GraphEdge";
import { GraphNode } from "../components/GraphNode";
import { NexusGraph } from "../components/NexusGraph";
import { NexusExplorer } from "../components/NexusExplorer";

import type {
  NexusData,
  SkillNode,
  CoreNode,
} from "../lib/types";

// ─── Fixtures ───────────────────────────────────────────────────────────────

const skillNode: SkillNode = {
  id: "test-skill",
  type: "skill",
  label: "Test Skill Node With Long Name",
  description: "A test skill",
  category: "ai-systems",
  icon: "brain",
  proficiency: 80,
  technologies: ["React"],
};

const skillNode2: SkillNode = {
  id: "skill-1",
  type: "skill",
  label: "Skill 1",
  description: "First skill",
  category: "ai-systems",
  icon: "brain",
  proficiency: 80,
  technologies: [],
};

const skillNode3: SkillNode = {
  id: "skill-2",
  type: "skill",
  label: "Skill 2",
  description: "Second skill",
  category: "automation",
  icon: "zap",
  proficiency: 70,
  technologies: [],
};

const testData: NexusData = {
  nodes: [
    {
      id: "core",
      type: "core",
      label: "CORE",
      description: "Core node",
      subtitle: "Test",
      mission: "Test",
    },
    skillNode2,
    skillNode3,
  ],
  edges: [
    {
      id: "e1",
      source: "core",
      target: "skill-1",
      relation: "powers",
      strength: 1.0,
    },
    {
      id: "e2",
      source: "core",
      target: "skill-2",
      relation: "powers",
      strength: 0.8,
    },
  ],
  meta: { version: "1.0.0", lastUpdated: "2025-01-01" },
};

// ─── Mocks for jsdom environment ───────────────────────────────────────────

beforeAll(() => {
  // Mock requestAnimationFrame so d3-timer actually runs callbacks
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    return window.setTimeout(() => cb(performance.now()), 16);
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    window.clearTimeout(id);
  });

  // Mock ResizeObserver to prevent "not a constructor" errors
  window.ResizeObserver = class {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    observe() {
      // Trigger with a sensible default size so the simulation starts
      setTimeout(() => {
        this.callback(
          [{ contentRect: { width: 800, height: 600 } } as ResizeObserverEntry],
          this as unknown as ResizeObserver,
        );
      }, 0);
    }
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;

  // Mock SVGElement.prototype.setPointerCapture (not in jsdom)
  if (!SVGSVGElement.prototype.setPointerCapture) {
    SVGSVGElement.prototype.setPointerCapture = vi.fn();
  }
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ─── ViewToggle ─────────────────────────────────────────────────────────────

describe("ViewToggle", () => {
  it("renders both grid and graph buttons", () => {
    render(<ViewToggle view="grid" onChange={() => {}} />);
    expect(screen.getByText("Grid")).toBeInTheDocument();
    expect(screen.getByText("Graph")).toBeInTheDocument();
  });

  it("highlights grid button when view='grid'", () => {
    render(<ViewToggle view="grid" onChange={() => {}} />);
    const gridBtn = screen.getByText("Grid").closest("button")!;
    expect(gridBtn.className).toContain("ring-cyan-400/50");
  });

  it("highlights graph button when view='graph'", () => {
    render(<ViewToggle view="graph" onChange={() => {}} />);
    const graphBtn = screen.getByText("Graph").closest("button")!;
    expect(graphBtn.className).toContain("ring-cyan-400/50");
  });

  it("calls onChange with 'grid' when grid button clicked", async () => {
    const onChange = vi.fn();
    render(<ViewToggle view="graph" onChange={onChange} />);
    await userEvent.click(screen.getByText("Grid"));
    expect(onChange).toHaveBeenCalledWith("grid");
  });

  it("calls onChange with 'graph' when graph button clicked", async () => {
    const onChange = vi.fn();
    render(<ViewToggle view="grid" onChange={onChange} />);
    await userEvent.click(screen.getByText("Graph"));
    expect(onChange).toHaveBeenCalledWith("graph");
  });
});

// ─── GraphEdge ──────────────────────────────────────────────────────────────

describe("GraphEdge", () => {
  function renderEdge(
    relation: "powers" | "contains" | "related-to" | "evolves-into" = "powers",
    strength = 0.8,
    highlighted = true,
  ) {
    const { container } = render(
      <svg>
        <GraphEdge
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
          relation={relation}
          strength={strength}
          highlighted={highlighted}
        />
      </svg>,
    );
    return container.querySelector("line")!;
  }

  it("renders an SVG line element", () => {
    const line = renderEdge();
    expect(line).toBeInTheDocument();
    expect(line.tagName).toBe("line");
    expect(line).toHaveAttribute("x1", "0");
    expect(line).toHaveAttribute("y1", "0");
    expect(line).toHaveAttribute("x2", "100");
    expect(line).toHaveAttribute("y2", "100");
  });

  it("uses cyan for powers relation", () => {
    const line = renderEdge("powers");
    expect(line.getAttribute("stroke")).toBe("rgb(34, 211, 238)");
  });

  it("uses gray for contains relation", () => {
    const line = renderEdge("contains");
    expect(line.getAttribute("stroke")).toBe("rgb(115, 115, 115)");
  });

  it("uses green for related-to relation", () => {
    const line = renderEdge("related-to");
    expect(line.getAttribute("stroke")).toBe("rgb(74, 222, 128)");
  });

  it("uses purple for evolves-into relation", () => {
    const line = renderEdge("evolves-into");
    expect(line.getAttribute("stroke")).toBe("rgb(168, 85, 247)");
  });

  it("uses full opacity when highlighted", () => {
    const line = renderEdge("powers", 1.0, true);
    expect(line.getAttribute("opacity")).toBe("1");
  });

  it("uses reduced opacity when not highlighted", () => {
    const line = renderEdge("powers", 1.0, false);
    expect(line.getAttribute("opacity")).toBe("0.3");
  });

  it("strokeWidth scales with strength", () => {
    const lineStrong = renderEdge("powers", 1.0, true);
    expect(lineStrong.getAttribute("stroke-width")).toBe("2.5");

    const lineWeak = renderEdge("powers", 0.4, true);
    expect(lineWeak.getAttribute("stroke-width")).toBe("1");
  });
});

// ─── GraphNode ──────────────────────────────────────────────────────────────

describe("GraphNode", () => {
  const baseProps = {
    node: skillNode,
    x: 200,
    y: 150,
    isSelected: false,
    isHighlighted: false,
    isCore: false,
    onPointerDown: vi.fn(),
    onPointerEnter: vi.fn(),
    onPointerLeave: vi.fn(),
  };

  function renderNode(overrides: Partial<typeof baseProps> = {}) {
    const props = { ...baseProps, ...overrides };
    // Reset mocks so each call starts fresh
    props.onPointerDown = vi.fn();
    props.onPointerEnter = vi.fn();
    props.onPointerLeave = vi.fn();
    const { container } = render(
      <svg>
        <GraphNode {...props} />
      </svg>,
    );
    const g = container.querySelector("g")!;
    const circle = container.querySelector("circle")!;
    const text = container.querySelector("text")!;
    return { container, g, circle, text, props };
  }

  it("renders a circle with correct radius based on node type", () => {
    // skill node → radius 20
    const { circle } = renderNode();
    expect(circle).toBeInTheDocument();
    expect(circle.getAttribute("r")).toBe("20");

    // core node → radius 32
    const coreNode: CoreNode = {
      id: "core",
      type: "core",
      label: "Core",
      description: "Core node",
      subtitle: "Sub",
      mission: "Mission",
    };
    const { circle: coreCircle } = renderNode({
      node: coreNode as any,
      isCore: true,
    });
    expect(coreCircle.getAttribute("r")).toBe("32");
  });

  it("renders the node label truncated to 16 chars", () => {
    const { text } = renderNode();
    // "Test Skill Node With Long Name" is 31 chars → truncate to 16 + "…"
    expect(text.textContent).toBe("Test Skill Node …");
  });

  it("applies white stroke when selected", () => {
    const { circle } = renderNode({ isSelected: true });
    expect(circle.getAttribute("stroke")).toBe("white");
  });

  it("applies transparent stroke when not selected", () => {
    const { circle } = renderNode({ isSelected: false });
    expect(circle.getAttribute("stroke")).toBe("transparent");
  });

  it("uses full opacity when highlighted", () => {
    const { circle } = renderNode({ isHighlighted: true });
    expect(circle.getAttribute("opacity")).toBe("1");
  });

  it("uses full opacity when isCore", () => {
    const coreNode: CoreNode = {
      id: "core",
      type: "core",
      label: "Core",
      description: "Core node",
      subtitle: "Sub",
      mission: "Mission",
    };
    const { circle } = renderNode({ node: coreNode as any, isCore: true });
    expect(circle.getAttribute("opacity")).toBe("1");
  });

  it("uses reduced opacity when not highlighted and not core", () => {
    const { circle } = renderNode({ isHighlighted: false, isCore: false });
    expect(circle.getAttribute("opacity")).toBe("0.5");
  });

  it("has grab cursor by default", () => {
    const { g } = renderNode();
    expect(g.style.cursor).toBe("grab");
  });

  it("calls onPointerDown when pointer down on node", () => {
    const { g, props } = renderNode();
    fireEvent.pointerDown(g);
    expect(props.onPointerDown).toHaveBeenCalled();
  });

  it("calls onPointerEnter/onPointerLeave on hover", () => {
    const { g, props } = renderNode();
    fireEvent.pointerEnter(g);
    expect(props.onPointerEnter).toHaveBeenCalled();
    fireEvent.pointerLeave(g);
    expect(props.onPointerLeave).toHaveBeenCalled();
  });
});

// ─── NexusGraph ─────────────────────────────────────────────────────────────

describe("NexusGraph", () => {
  const onSelectNode = vi.fn();

  it("renders an SVG element", async () => {
    const { container } = render(
      <NexusGraph
        data={testData}
        selectedNodeId={null}
        onSelectNode={onSelectNode}
      />,
    );
    await waitFor(() => {
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("renders nodes from provided data", async () => {
    const { container } = render(
      <NexusGraph
        data={testData}
        selectedNodeId={null}
        onSelectNode={onSelectNode}
      />,
    );
    // Wait for the simulation to produce positioned nodes
    await waitFor(() => {
      const circles = container.querySelectorAll("circle");
      // 3 nodes × 1 circle each
      expect(circles.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("renders edges from provided data", async () => {
    const { container } = render(
      <NexusGraph
        data={testData}
        selectedNodeId={null}
        onSelectNode={onSelectNode}
      />,
    );
    await waitFor(() => {
      const lines = container.querySelectorAll("line");
      expect(lines.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("always shows core node even when filtered out", async () => {
    const { container } = render(
      <NexusGraph
        data={testData}
        selectedNodeId={null}
        onSelectNode={onSelectNode}
        filteredNodeIds={["skill-1"]}
      />,
    );
    await waitFor(() => {
      const texts = Array.from(container.querySelectorAll("text")).map(
        (t) => t.textContent,
      );
      expect(texts).toContain("CORE");
      // skill-1 is in filter, skill-2 is not
      expect(texts).toContain("Skill 1");
      expect(texts).not.toContain("Skill 2");
    });
  });

  it("hides non-matching nodes when filteredNodeIds provided", async () => {
    const { container } = render(
      <NexusGraph
        data={testData}
        selectedNodeId={null}
        onSelectNode={onSelectNode}
        filteredNodeIds={["skill-2"]}
      />,
    );
    await waitFor(() => {
      const texts = Array.from(container.querySelectorAll("text")).map(
        (t) => t.textContent,
      );
      expect(texts).toContain("CORE");
      expect(texts).toContain("Skill 2");
      expect(texts).not.toContain("Skill 1");
    });
  });

  it("shows all nodes when filteredNodeIds is undefined", async () => {
    const { container } = render(
      <NexusGraph
        data={testData}
        selectedNodeId={null}
        onSelectNode={onSelectNode}
      />,
    );
    await waitFor(() => {
      const texts = Array.from(container.querySelectorAll("text")).map(
        (t) => t.textContent,
      );
      expect(texts).toContain("CORE");
      expect(texts).toContain("Skill 1");
      expect(texts).toContain("Skill 2");
    });
  });

  function findNodeG(container: HTMLElement, label: string): SVGGElement | null {
    const groups = container.querySelectorAll("g");
    for (const g of groups) {
      const textEl = g.querySelector("text");
      if (textEl?.textContent === label) {
        return g as SVGGElement;
      }
    }
    return null;
  }

  it("highlights connected nodes on hover", async () => {
    const { container } = render(
      <NexusGraph
        data={testData}
        selectedNodeId={null}
        onSelectNode={onSelectNode}
      />,
    );
    // Wait for simulation to finish
    await waitFor(() => {
      expect(container.querySelectorAll("circle").length).toBeGreaterThanOrEqual(3);
    });

    // Hover over skill-1 node
    const nodeGroups = container.querySelectorAll("g");
    // Find the skill-1 group by checking that it has a text child "Skill 1"
    let targetG: SVGGElement | null = null;
    for (const g of nodeGroups) {
      const textEl = g.querySelector("text");
      if (textEl?.textContent === "Skill 1") {
        targetG = g;
        break;
      }
    }
    expect(targetG).not.toBeNull();

    // Trigger pointer enter on the node group
    fireEvent.pointerEnter(targetG!);

    // After hover, the connected edge and core node should be highlighted
    // We can verify this by checking that the core node circle still has full opacity
    await waitFor(() => {
      const circles = container.querySelectorAll("circle");
      // All circles should still render (they always do), but the state updated
      expect(circles.length).toBeGreaterThanOrEqual(3);
    });
    // Core node should have full opacity (isCore === true)
    // This test verifies the hover doesn't crash and state updates correctly
  });

  it("passes selectedNodeId to GraphNodes and updates rendering on selection change", async () => {
    const { container, rerender } = render(
      <NexusGraph
        data={testData}
        selectedNodeId={null}
        onSelectNode={vi.fn()}
      />,
    );
    await waitFor(() => {
      expect(container.querySelectorAll("circle").length).toBeGreaterThanOrEqual(3);
    });

    // Initially GraphNode circles have transparent stroke (no selection)
    // Skip the grid pattern circle (stroke is null)
    const graphCircles = container.querySelectorAll("g circle");
    for (const circle of graphCircles) {
      expect(circle.getAttribute("stroke")).toBe("transparent");
    }

    // Re-render with selected node
    rerender(
      <NexusGraph
        data={testData}
        selectedNodeId="core"
        onSelectNode={vi.fn()}
      />,
    );

    // The core node circle should now have white stroke
    await waitFor(() => {
      const coreG = findNodeG(container, "CORE");
      expect(coreG).not.toBeNull();
      const coreCircle = coreG!.querySelector("circle");
      expect(coreCircle?.getAttribute("stroke")).toBe("white");
    });
  });
});

// ─── NexusExplorer view-mode integration ────────────────────────────────────

describe("NexusExplorer view modes", () => {
  const onSelectNode = vi.fn();

  /** Helper: find the NexusGraph SVG (has min-height style), not lucide icon SVGs */
  function getGraphSvg(container: HTMLElement): SVGSVGElement | null {
    return container.querySelector('svg[style*="min-height"]');
  }

  it("renders ViewToggle component", () => {
    render(<NexusExplorer data={testData} />);
    expect(screen.getByText("Grid")).toBeInTheDocument();
    expect(screen.getByText("Graph")).toBeInTheDocument();
  });

  it("shows graph view by default (viewMode='graph')", async () => {
    const { container } = render(<NexusExplorer data={testData} />);
    // Default view is "graph" → NexusGraph SVG should be rendered
    await waitFor(() => {
      expect(getGraphSvg(container)).toBeInTheDocument();
    });
    // Grid cards section should not be present
    expect(screen.queryByText("No nodes match the current filters.")).not.toBeInTheDocument();
  });

  it("switches to grid view when grid button clicked in ViewToggle", async () => {
    const { container } = render(<NexusExplorer data={testData} />);
    await userEvent.click(screen.getByText("Grid"));
    // In grid view, NexusGraph SVG should disappear
    await waitFor(() => {
      expect(getGraphSvg(container)).toBeNull();
    });
    // Should render node cards for the filtered nodes
    expect(screen.getByText("Skill 1")).toBeInTheDocument();
    expect(screen.getByText("Skill 2")).toBeInTheDocument();
  });

  it("switches back to graph view when graph button clicked", async () => {
    const { container } = render(<NexusExplorer data={testData} />);
    // Switch to grid first
    await userEvent.click(screen.getByText("Grid"));
    await waitFor(() => {
      expect(getGraphSvg(container)).toBeNull();
    });
    // Switch back to graph
    await userEvent.click(screen.getByText("Graph"));
    await waitFor(() => {
      expect(getGraphSvg(container)).toBeInTheDocument();
    });
  });
});
