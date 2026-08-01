import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "@/entrypoints/popup/components";

describe("Section", () => {
  it("indents its children", () => {
    const { container } = render(<Section>Shorts</Section>);

    expect((container.firstChild as HTMLElement).className).toBe(
      "ml-4 flex flex-col gap-2",
    );
    expect(screen.getByText("Shorts")).toBeDefined();
  });

  it("keeps additional classes", () => {
    const { container } = render(<Section className="mt-2" />);

    expect((container.firstChild as HTMLElement).className).toBe(
      "ml-4 flex flex-col gap-2 mt-2",
    );
  });
});
