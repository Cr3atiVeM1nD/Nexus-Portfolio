import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactCard } from "@/components/ContactCard";
import type { ContactNode } from "@/lib/types";

const contactNode: ContactNode = {
  id: "contact",
  type: "contact",
  label: "Contact",
  email: "test@example.com",
  github: "testuser",
  linkedin: "testprofile",
  description: "Get in touch",
};

describe("ContactCard", () => {
  it("renders contact label", () => {
    render(<ContactCard node={contactNode} isSelected={false} />);
    expect(
      screen.getByRole("heading", { name: "Contact" })
    ).toBeInTheDocument();
  });

  it("renders 'Contact' badge", () => {
    render(<ContactCard node={contactNode} isSelected={false} />);
    const badges = screen.getAllByText("Contact");
    expect(badges).toHaveLength(2);
    expect(badges[1]).toBeInTheDocument();
  });

  it("renders email", () => {
    render(<ContactCard node={contactNode} isSelected={false} />);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders github", () => {
    render(<ContactCard node={contactNode} isSelected={false} />);
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<ContactCard node={contactNode} isSelected={false} />);
    expect(screen.getByText("Get in touch")).toBeInTheDocument();
  });

  it("shows 'Coming Soon' when fields are missing", () => {
    const minimalNode: ContactNode = {
      id: "contact",
      type: "contact",
      label: "Contact",
      description: "Minimal node",
    };
    render(<ContactCard node={minimalNode} isSelected={false} />);
    expect(screen.getByText("Minimal node")).toBeInTheDocument();
  });
});
