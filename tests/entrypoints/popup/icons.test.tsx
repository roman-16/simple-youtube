import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "@/entrypoints/popup/icons";

describe("Icon", () => {
  it("draws the named icon as the design system's svg", () => {
    const { container } = render(<Icon name="caret-right" />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("class")).toBe("icon");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 256 256");
    expect(svg?.querySelector("path")?.getAttribute("d")).toMatch(/^M/);
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<Icon name="x" />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("draws each icon differently", () => {
    const { container } = render(
      <>
        <Icon name="checks" />
        <Icon name="dots-three" />
      </>,
    );
    const [first, second] = [...container.querySelectorAll("path")];

    expect(first?.getAttribute("d")).not.toBe(second?.getAttribute("d"));
  });
});
