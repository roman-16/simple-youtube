import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "@/entrypoints/popup/components";

const checkbox = () => screen.getByRole<HTMLInputElement>("checkbox");

describe("Switch", () => {
  it("reflects the checked state", () => {
    render(<Switch label="Remove posts" checked onCheckedChange={vi.fn()} />);

    expect(checkbox().checked).toBe(true);
  });

  it("reports the next state when clicked", () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        label="Remove posts"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    fireEvent.click(checkbox());

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("shows its label and takes its name from it", () => {
    render(<Switch label="Remove posts" checked onCheckedChange={vi.fn()} />);

    expect(screen.getByText("Remove posts")).toBeDefined();
    expect(screen.getByLabelText("Remove posts")).toBe(checkbox());
  });

  it("takes a name without showing one", () => {
    render(<Switch aria-label="Enabled" checked onCheckedChange={vi.fn()} />);

    expect(screen.getByLabelText("Enabled")).toBe(checkbox());
    expect(screen.queryByText("Enabled")).toBeNull();
  });

  it("cannot be operated while disabled", () => {
    render(
      <Switch
        label="Remove posts"
        checked
        disabled
        onCheckedChange={vi.fn()}
      />,
    );

    expect(checkbox().disabled).toBe(true);
  });
});
