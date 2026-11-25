import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Menu } from "@/entrypoints/popup/components";

const mount = () => {
  const reset = vi.fn();
  const clear = vi.fn();

  render(
    <>
      <Menu
        icon="dots-three"
        label="Presets"
        items={[
          {
            icon: "arrow-counter-clockwise",
            label: "Reset to recommended",
            onSelect: reset,
          },
          { icon: "x", label: "Turn everything off", onSelect: clear },
        ]}
      />
      <p>Elsewhere</p>
    </>,
  );

  return { clear, reset };
};

const button = () => screen.getByRole("button", { name: "Presets" });
const items = () => screen.queryAllByRole("menuitem");
const item = (name: string) => screen.getByRole("menuitem", { name });

describe("Menu", () => {
  it("starts out closed", () => {
    mount();

    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(items()).toHaveLength(0);
  });

  it("opens on a click and puts the focus on its first item", () => {
    mount();

    fireEvent.click(button());

    expect(button().getAttribute("aria-expanded")).toBe("true");
    expect(items().map((each) => each.textContent)).toEqual([
      "Reset to recommended",
      "Turn everything off",
    ]);
    expect(document.activeElement).toBe(item("Reset to recommended"));
  });

  it("opens on the down arrow", () => {
    mount();

    fireEvent.keyDown(button(), { key: "ArrowDown" });

    expect(items()).toHaveLength(2);
  });

  it("closes on a second click", () => {
    mount();
    fireEvent.click(button());

    fireEvent.click(button());

    expect(items()).toHaveLength(0);
  });

  it.each([
    ["ArrowDown", "Turn everything off"],
    ["ArrowUp", "Turn everything off"],
    ["End", "Turn everything off"],
    ["Home", "Reset to recommended"],
  ])("moves the focus on %s", (key, expected) => {
    mount();
    fireEvent.click(button());

    fireEvent.keyDown(document.activeElement as Element, { key });

    expect(document.activeElement).toBe(item(expected));
  });

  it("wraps around past the last item", () => {
    mount();
    fireEvent.click(button());
    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowDown" });

    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowDown" });

    expect(document.activeElement).toBe(item("Reset to recommended"));
  });

  it("runs the chosen item, closes and hands the focus back", () => {
    const { clear, reset } = mount();
    fireEvent.click(button());

    fireEvent.click(item("Turn everything off"));

    expect(clear).toHaveBeenCalledTimes(1);
    expect(reset).not.toHaveBeenCalled();
    expect(items()).toHaveLength(0);
    expect(document.activeElement).toBe(button());
  });

  it("closes on escape and hands the focus back", () => {
    mount();
    fireEvent.click(button());

    fireEvent.keyDown(document.activeElement as Element, { key: "Escape" });

    expect(items()).toHaveLength(0);
    expect(document.activeElement).toBe(button());
  });

  it("closes on tab", () => {
    mount();
    fireEvent.click(button());

    fireEvent.keyDown(document.activeElement as Element, { key: "Tab" });

    expect(items()).toHaveLength(0);
  });

  it("closes on a press beside it", () => {
    mount();
    fireEvent.click(button());

    fireEvent.pointerDown(screen.getByText("Elsewhere"));

    expect(items()).toHaveLength(0);
  });

  it("stays open on a press inside it", () => {
    mount();
    fireEvent.click(button());

    fireEvent.pointerDown(item("Turn everything off"));

    expect(items()).toHaveLength(2);
  });
});
