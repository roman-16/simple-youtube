import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Snackbar } from "@/entrypoints/popup/components";

describe("Snackbar", () => {
  it("says what happened", () => {
    render(
      <Snackbar action="Undo" onAction={vi.fn()}>
        Everything turned off
      </Snackbar>,
    );

    expect(screen.getByText("Everything turned off")).toBeDefined();
  });

  it("offers its action", () => {
    const onAction = vi.fn();
    render(
      <Snackbar action="Undo" onAction={onAction}>
        Everything turned off
      </Snackbar>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
