import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Presets } from "@/entrypoints/popup/Presets";
import { presets } from "@/options/presets";

describe("Presets", () => {
  it("offers every preset", () => {
    render(<Presets update={vi.fn()} />);

    expect(
      screen.getAllByRole("button").map((button) => button.textContent),
    ).toEqual(["Recommended", "All", "None"]);
  });

  it.each(presets)("applies the $name preset", ({ name, options }) => {
    const update = vi.fn();
    render(<Presets update={update} />);

    fireEvent.click(screen.getByRole("button", { name }));

    expect(update).toHaveBeenCalledWith(options);
  });
});
