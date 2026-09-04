import { describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { defaults } from "@/options/defaults";
import { optionsStorage } from "@/options/storage";

const stored = () =>
  fakeBrowser.storage.sync.get("options").then((result) => result.options);

describe("optionsStorage", () => {
  describe("getAll", () => {
    it("returns the defaults when nothing is stored", async () => {
      expect(await optionsStorage.getAll()).toEqual(defaults);
    });

    it("merges stored values over the defaults", async () => {
      await fakeBrowser.storage.sync.set({
        options: { shorts: { redirectToVideo: false } },
      });

      const options = await optionsStorage.getAll();

      expect(options.shorts.redirectToVideo).toBe(false);
      expect(options.shorts.removeFromChannelTabs).toBe(true);
      expect(options.homeFeed).toEqual(defaults.homeFeed);
    });

    it("falls back to the defaults for a non-object value", async () => {
      await fakeBrowser.storage.sync.set({ options: "corrupted" });

      expect(await optionsStorage.getAll()).toEqual(defaults);
    });
  });

  describe("set", () => {
    it("writes the patch merged into the defaults", async () => {
      await optionsStorage.set({ enabled: false });

      expect(await stored()).toEqual({ ...defaults, enabled: false });
    });

    it("accumulates successive patches", async () => {
      await optionsStorage.set({ homeFeed: { removeShelves: false } });
      await optionsStorage.set({ shortVideos: { maxLength: { minutes: 5 } } });

      const options = await optionsStorage.getAll();

      expect(options.homeFeed.removeShelves).toBe(false);
      expect(options.shortVideos.maxLength).toEqual({
        hours: 0,
        minutes: 5,
        seconds: 0,
      });
    });
  });

  describe("watch", () => {
    it("reports the merged options on every sync write", async () => {
      const listener = vi.fn();
      optionsStorage.watch(listener);

      await optionsStorage.set({ homeFeed: { removePosts: false } });

      expect(listener).toHaveBeenCalledWith({
        ...defaults,
        homeFeed: { ...defaults.homeFeed, removePosts: false },
      });
    });

    it("ignores writes to other storage areas", async () => {
      const listener = vi.fn();
      optionsStorage.watch(listener);

      await fakeBrowser.storage.local.set({ options: { enabled: false } });

      expect(listener).not.toHaveBeenCalled();
    });

    it("ignores writes to other keys", async () => {
      const listener = vi.fn();
      optionsStorage.watch(listener);

      await fakeBrowser.storage.sync.set({ other: true });

      expect(listener).not.toHaveBeenCalled();
    });

    it("stops reporting once disposed", async () => {
      const listener = vi.fn();
      const dispose = optionsStorage.watch(listener);

      dispose();
      await optionsStorage.set({ enabled: false });

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
