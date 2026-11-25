import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Group } from "@/entrypoints/popup/components";

const group = (props: Partial<React.ComponentProps<typeof Group>> = {}) => {
  const onCheckedChange = vi.fn();
  const onToggle = vi.fn();

  render(
    <Group
      label="Shorts"
      checked
      disabled={false}
      open={false}
      summary="3 of 4 on"
      onCheckedChange={onCheckedChange}
      onToggle={onToggle}
      {...props}
    >
      <li>Remove from the sidebar</li>
    </Group>,
  );

  return { onCheckedChange, onToggle };
};

const name = () => screen.getByRole("button", { name: /Shorts/ });

describe("Group", () => {
  it("shows its name and summary while closed", () => {
    group();

    expect(name().getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByText("3 of 4 on")).toBeDefined();
    expect(screen.queryByText("Remove from the sidebar")).toBeNull();
  });

  it("shows its rows while open", () => {
    group({ open: true });

    expect(name().getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Remove from the sidebar")).toBeDefined();
  });

  it("asks to be opened or closed when its name is clicked", () => {
    const { onToggle } = group();

    fireEvent.click(name());

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("reports its switch", () => {
    const { onCheckedChange, onToggle } = group();

    fireEvent.click(screen.getByLabelText("Shorts"));

    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("dims its summary while off", () => {
    group({ checked: false });

    expect(screen.getByText("3 of 4 on").className).toBe("inactive");
  });

  it("dims its summary and locks its switch while disabled", () => {
    group({ disabled: true });

    expect(screen.getByText("3 of 4 on").className).toBe("inactive");
    expect(screen.getByLabelText<HTMLInputElement>("Shorts").disabled).toBe(
      true,
    );
  });

  it("still opens while disabled", () => {
    const { onToggle } = group({ disabled: true });

    fireEvent.click(name());

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
