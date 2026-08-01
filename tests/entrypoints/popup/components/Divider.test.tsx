import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "@/entrypoints/popup/components";

describe("Divider", () => {
  it("draws a hairline", () => {
    const { container } = render(<Divider />);

    expect((container.firstChild as HTMLElement).className).toBe(
      "h-px flex-1 bg-gray-400",
    );
  });

  it("keeps additional classes", () => {
    const { container } = render(<Divider className="my-4" />);

    expect((container.firstChild as HTMLElement).className).toBe(
      "h-px flex-1 bg-gray-400 my-4",
    );
  });
});
