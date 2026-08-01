import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "@/entrypoints/popup/components";

const checkbox = () => screen.getByRole<HTMLInputElement>("checkbox");

describe("Switch", () => {
  it("reflects the checked state", () => {
    render(<Switch label="Remove feed nudge" checked />);

    expect(checkbox().checked).toBe(true);
  });

  it("reports the next state when clicked", () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch label="Remove feed nudge" onCheckedChange={onCheckedChange} />,
    );

    fireEvent.click(checkbox());

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("labels the checkbox", () => {
    render(<Switch label="Remove feed nudge" checked />);

    expect(screen.getByLabelText("Remove feed nudge")).toBe(checkbox());
  });

  it("renders without a label", () => {
    render(<Switch checked={false} />);

    expect(checkbox().checked).toBe(false);
  });
});
