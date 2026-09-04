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
      "Home feed",
      "Remove posts",
      "Remove shelves",
      "Remove suggestion prompts",
      "Remove topic chips",
      "Short videos",
      "Include subscriptions",
      "Shorts",
      "Redirect to the video page",
      "Remove from feeds",
      "Remove from the channel tabs",
      "Remove from the sidebar",
    ])
      expect(screen.getAllByLabelText(label)).not.toHaveLength(0);
  });

  it("reports a toggled feature", () => {
    const update = form();

    toggle("Remove shelves");

    expect(update).toHaveBeenCalledWith({ homeFeed: { removeShelves: false } });
  });

  it("reports a toggled section", () => {
    const update = form();

    toggle("Shorts");

    expect(update).toHaveBeenCalledWith({ shorts: { enabled: false } });
  });

  it("reports a nested toggle", () => {
    const update = form();

    toggle("Include subscriptions", 1);

    expect(update).toHaveBeenCalledWith({
      shorts: { removeFromFeeds: { includeSubscriptions: true } },
    });
  });

  it("keeps the two subscription toggles apart", () => {
    const update = form();

    toggle("Include subscriptions");

    expect(update).toHaveBeenCalledWith({
      shortVideos: { includeSubscriptions: true },
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
    expect(screen.queryByLabelText("Remove posts")).toBeNull();
  });

  it("hides the children of a disabled section", () => {
    form({ shorts: { enabled: false } });

    expect(screen.getByLabelText("Shorts")).toBeDefined();
    expect(screen.queryByLabelText("Redirect to the video page")).toBeNull();
  });

  it("shows the configured maximum length", () => {
    form({ shortVideos: { maxLength: { hours: 1, minutes: 2, seconds: 3 } } });

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
      shortVideos: { maxLength: { [unit]: 5 } },
    });
  });

  it("hides the maximum length while short video removal is off", () => {
    form({ shortVideos: { enabled: false } });

    expect(times()).toHaveLength(0);
  });
});
