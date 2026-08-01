import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "@/entrypoints/popup/Form";
import { defaults } from "@/options/defaults";
import { type DeepPartial, deepMerge } from "@/options/merge";
import type { Options } from "@/options/storage";

const form = (patch: DeepPartial<Options> = {}) => {
  const update = vi.fn();
  render(<Form options={deepMerge(defaults, patch)} update={update} />);

  return update;
};

const toggle = (label: string, index = 0) => {
  const switches = screen.getAllByLabelText(label);
  const target = switches[index];
  if (!target) throw new Error(`missing switch ${label}`);

  fireEvent.click(target);
};

const times = () => screen.queryAllByRole<HTMLInputElement>("textbox");

describe("Form", () => {
  it("renders a switch for every feature", () => {
    form();

    for (const label of [
      "Enabled",
      "Remove community posts",
      "Remove explore filter",
      "Remove explore more",
      "Remove feed nudge",
      "Shorts manipulation",
      "Redirect to video",
      "Remove from channel",
      "Remove from explore",
      "Remove from navigation",
      "Video manipulation",
      "Remove watch again",
      "Remove short videos",
    ])
      expect(screen.getAllByLabelText(label)).not.toHaveLength(0);
  });

  it("reports a toggled feature", () => {
    const update = form();

    toggle("Remove feed nudge");

    expect(update).toHaveBeenCalledWith({ removeFeedNudge: false });
  });

  it("reports a toggled section", () => {
    const update = form();

    toggle("Shorts manipulation");

    expect(update).toHaveBeenCalledWith({ shorts: { enabled: false } });
  });

  it("reports a nested toggle", () => {
    const update = form();

    toggle("Remove from subscriptions");

    expect(update).toHaveBeenCalledWith({
      shorts: { removeExplore: { removeFromSubscriptions: true } },
    });
  });

  it("reports the whole extension being turned off", () => {
    const update = form();

    toggle("Enabled");

    expect(update).toHaveBeenCalledWith({ enabled: false });
  });

  it("hides every feature while the extension is off", () => {
    form({ enabled: false });

    expect(screen.getAllByLabelText("Enabled")).toHaveLength(1);
    expect(screen.queryByLabelText("Remove community posts")).toBeNull();
  });

  it("hides the children of a disabled section", () => {
    form({ shorts: { enabled: false } });

    expect(screen.getByLabelText("Shorts manipulation")).toBeDefined();
    expect(screen.queryByLabelText("Redirect to video")).toBeNull();
  });

  it("shows the configured maximum length", () => {
    form({
      videos: {
        removeShortVideos: { maxLength: { hours: 1, minutes: 2, seconds: 3 } },
      },
    });

    expect(times().map((input) => input.value)).toEqual(["01", "02", "03"]);
  });

  it.each([
    [0, "hours"],
    [1, "minutes"],
    [2, "seconds"],
  ])("reports a new maximum length in %s", (index, unit) => {
    const update = form();
    const input = times()[index];
    if (!input) throw new Error(`missing ${unit} input`);

    fireEvent.change(input, { target: { value: "5" } });

    expect(update).toHaveBeenCalledWith({
      videos: { removeShortVideos: { maxLength: { [unit]: 5 } } },
    });
  });

  it("hides the maximum length while short video removal is off", () => {
    form({ videos: { removeShortVideos: { enabled: false } } });

    expect(times()).toHaveLength(0);
  });
});
