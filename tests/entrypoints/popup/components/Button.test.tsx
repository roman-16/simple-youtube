import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/entrypoints/popup/components";

describe("Button", () => {
  it("never submits a form", () => {
    render(<Button>All</Button>);

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("reports clicks", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>All</Button>);

    fireEvent.click(screen.getByRole("button", { name: "All" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("passes attributes through", () => {
    render(<Button disabled>All</Button>);

    expect(screen.getByRole<HTMLButtonElement>("button").disabled).toBe(true);
  });
});
