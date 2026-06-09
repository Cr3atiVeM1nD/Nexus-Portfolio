import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "@/components/FilterBar";
import type { NodeType } from "@/lib/types";

describe("FilterBar", () => {
  const defaultProps = {
    activeTypes: ["skill", "project", "concept"] as NodeType[],
    activeCategory: null,
    activeStatus: null,
    onTypeToggle: vi.fn(),
    onCategoryChange: vi.fn(),
    onStatusChange: vi.fn(),
  };

  it("renders all 3 type toggles", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Concepts")).toBeInTheDocument();
  });

  it("calls onTypeToggle with correct type when toggle clicked", async () => {
    const onTypeToggle = vi.fn();
    const user = userEvent.setup();
    render(<FilterBar {...defaultProps} onTypeToggle={onTypeToggle} />);
    await user.click(screen.getByText("Projects"));
    expect(onTypeToggle).toHaveBeenCalledWith("project");
  });

  it("renders category select when 'skill' is in activeTypes", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("All Categories")).toBeInTheDocument();
  });

  it("does not render category select when 'skill' is not in activeTypes", () => {
    render(
      <FilterBar
        {...defaultProps}
        activeTypes={["project", "concept"]}
      />
    );
    expect(screen.queryByText("All Categories")).not.toBeInTheDocument();
  });

  it("renders status select when 'project' is in activeTypes", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("All Statuses")).toBeInTheDocument();
  });
});
