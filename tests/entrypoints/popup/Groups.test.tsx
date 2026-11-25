import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Groups } from "@/entrypoints/popup/Groups";
import { defaults } from "@/options/defaults";
import { type DeepPartial, deepMerge } from "@/options/merge";
import type { Options } from "@/options/storage";

const mount = async (patch: DeepPartial<Options> = {}) => {
  const update = vi.fn();
  render(<Groups options={deepMerge(defaults, patch)} update={update} />);
  await screen.findByText("Open YouTube to see what is hidden");

  return update;
};

const name = (label: string) =>
  screen.getByRole("button", { name: new RegExp(`^${label} `) });

const open = (label: string) => fireEvent.click(name(label));

const toggle = (label: string) => fireEvent.click(screen.getByLabelText(label));

const box = (label: string) => screen.getByLabelText<HTMLInputElement>(label);

describe("Groups", () => {
  describe("opening", () => {
    it("starts with every group closed", async () => {
      await mount();

      for (const label of ["Home feed", "Short videos", "Shorts"])
        expect(name(label).getAttribute("aria-expanded")).toBe("false");
      expect(screen.queryByLabelText("Remove posts")).toBeNull();
    });

    it("shows a group's rows after a click on its name", async () => {
      await mount();

      open("Shorts");

      for (const label of [
        "Redirect to the video page",
        "Remove from feeds",
        "Include subscriptions",
        "Remove from the channel tabs",
        "Remove from the sidebar",
      ])
        expect(screen.getByLabelText(label)).toBeDefined();
    });

    it("keeps one group open at a time", async () => {
      await mount();
      open("Home feed");

      open("Shorts");

      expect(name("Home feed").getAttribute("aria-expanded")).toBe("false");
      expect(screen.queryByLabelText("Remove posts")).toBeNull();
      expect(screen.getByLabelText("Remove from the sidebar")).toBeDefined();
    });

    it("closes the open group on a click on its name", async () => {
      await mount();
      open("Home feed");

      open("Home feed");

      expect(screen.queryByLabelText("Remove posts")).toBeNull();
    });
  });

  describe("summaries", () => {
    it("counts the switches that are on", async () => {
      await mount();

      expect(name("Home feed").textContent).toBe("Home feed 4 of 4 on");
      expect(name("Shorts").textContent).toBe("Shorts 3 of 4 on");
    });

    it("follows the switches", async () => {
      await mount({ homeFeed: { removePosts: false, removeShelves: false } });

      expect(name("Home feed").textContent).toBe("Home feed 2 of 4 on");
    });

    it("counts a row with rows of its own once", async () => {
      await mount({
        shorts: { removeFromFeeds: { includeSubscriptions: true } },
      });

      expect(name("Shorts").textContent).toBe("Shorts 3 of 4 on");
    });

    it("gives short videos the page's status", async () => {
      await mount();

      expect(name("Short videos").textContent).toBe(
        "Short videos Open YouTube to see what is hidden",
      );
    });
  });

  describe("changes", () => {
    it("reports a toggled group", async () => {
      const update = await mount();

      toggle("Shorts");

      expect(update).toHaveBeenCalledWith({ shorts: { enabled: false } });
    });

    it("reports a toggled row", async () => {
      const update = await mount();
      open("Home feed");

      toggle("Remove shelves");

      expect(update).toHaveBeenCalledWith({
        homeFeed: { removeShelves: false },
      });
    });

    it("reports a row with rows of its own", async () => {
      const update = await mount();
      open("Shorts");

      toggle("Remove from feeds");

      expect(update).toHaveBeenCalledWith({
        shorts: { removeFromFeeds: { enabled: false } },
      });
    });

    it("reports a nested row", async () => {
      const update = await mount();
      open("Shorts");

      toggle("Include subscriptions");

      expect(update).toHaveBeenCalledWith({
        shorts: { removeFromFeeds: { includeSubscriptions: true } },
      });
    });

    it("keeps the two subscription rows apart", async () => {
      const update = await mount();
      open("Short videos");

      toggle("Include subscriptions");

      expect(update).toHaveBeenCalledWith({
        shortVideos: { includeSubscriptions: true },
      });
    });

    it("reports a new maximum length", async () => {
      const update = await mount();
      open("Short videos");

      fireEvent.change(box("Maximum length"), { target: { value: "5:00" } });

      expect(update).toHaveBeenCalledWith({
        shortVideos: { maxLength: { hours: 0, minutes: 5, seconds: 0 } },
      });
    });

    it("shows the configured maximum length", async () => {
      await mount({
        shortVideos: { maxLength: { hours: 1, minutes: 2, seconds: 3 } },
      });
      open("Short videos");

      expect(box("Maximum length").value).toBe("1:02:03");
    });
  });

  describe("switched off", () => {
    it("keeps the rows of a group that is off, locked", async () => {
      await mount({ shorts: { enabled: false } });
      open("Shorts");

      expect(box("Shorts").disabled).toBe(false);
      for (const label of [
        "Redirect to the video page",
        "Remove from feeds",
        "Include subscriptions",
        "Remove from the channel tabs",
        "Remove from the sidebar",
      ])
        expect(box(label).disabled).toBe(true);
    });

    it("locks the maximum length with its group", async () => {
      await mount({ shortVideos: { enabled: false } });
      open("Short videos");

      expect(box("Maximum length").disabled).toBe(true);
    });

    it("locks only the rows under a row that is off", async () => {
      await mount({ shorts: { removeFromFeeds: { enabled: false } } });
      open("Shorts");

      expect(box("Include subscriptions").disabled).toBe(true);
      expect(box("Remove from feeds").disabled).toBe(false);
      expect(box("Remove from the sidebar").disabled).toBe(false);
    });

    it("locks every switch while the extension is off", async () => {
      await mount({ enabled: false });
      open("Home feed");

      for (const label of ["Home feed", "Short videos", "Shorts"])
        expect(box(label).disabled).toBe(true);
      expect(box("Remove posts").disabled).toBe(true);
    });
  });
});
