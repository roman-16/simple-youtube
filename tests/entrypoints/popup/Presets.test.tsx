import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Presets } from "@/entrypoints/popup/Presets";
import { defaults } from "@/options/defaults";
import { type DeepPartial, deepMerge } from "@/options/merge";
import { presets } from "@/options/presets";
import type { Options } from "@/options/storage";

const custom = deepMerge(defaults, {
  homeFeed: { removePosts: false },
  shortVideos: { maxLength: { hours: 0, minutes: 5, seconds: 0 } },
});

let stored: Options;

const Popup = ({ initial }: { initial: Options }) => {
  const [options, setOptions] = useState(initial);
  stored = options;
  const update = (patch: DeepPartial<Options>) =>
    setOptions((current) => deepMerge(current, patch));

  return (
    <>
      <Presets options={options} update={update} />
      <button
        type="button"
        onClick={() => update({ shorts: { removeFromSidebar: false } })}
      >
        Change something else
      </button>
    </>
  );
};

const mount = (initial = custom) => render(<Popup initial={initial} />);

const choose = (label: string) => {
  fireEvent.click(screen.getByRole("button", { name: "Presets" }));
  fireEvent.click(screen.getByRole("menuitem", { name: label }));
};

const undo = () => screen.queryByRole("button", { name: "Undo" });

describe("Presets", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("offers every preset in its menu", () => {
    mount();

    fireEvent.click(screen.getByRole("button", { name: "Presets" }));

    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent),
    ).toEqual([
      "Reset to recommended",
      "Turn everything on",
      "Turn everything off",
    ]);
  });

  it.each(presets)("applies $label", ({ label, options }) => {
    mount();

    choose(label);

    expect(stored).toEqual(deepMerge(custom, options));
  });

  it.each(presets)("says $receipt and offers to undo", ({ label, receipt }) => {
    mount();

    choose(label);

    expect(screen.getByRole("status").textContent).toBe(`${receipt}Undo`);
  });

  it("puts every setting back on undo", () => {
    mount();
    choose("Reset to recommended");
    expect(stored).toEqual(defaults);

    fireEvent.click(undo() as HTMLElement);

    expect(stored).toEqual(custom);
    expect(undo()).toBeNull();
  });

  it("says nothing when the preset changes nothing", () => {
    mount(defaults);

    choose("Reset to recommended");

    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("withdraws the offer after eight seconds", () => {
    vi.useFakeTimers();
    mount();
    choose("Turn everything off");

    act(() => {
      vi.advanceTimersByTime(7999);
    });
    expect(undo()).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(undo()).toBeNull();
  });

  it("withdraws the offer once something else changes", () => {
    mount();
    choose("Turn everything on");

    fireEvent.click(
      screen.getByRole("button", { name: "Change something else" }),
    );

    expect(undo()).toBeNull();
    expect(stored.shorts.removeFromSidebar).toBe(false);
  });

  it("undoes only the latest of two presets", () => {
    mount();
    choose("Turn everything on");
    const afterFirst = stored;

    choose("Turn everything off");
    fireEvent.click(undo() as HTMLElement);

    expect(stored).toEqual(afterFirst);
  });
});
