import { beforeEach, describe, expect, it } from "vitest";
import { createShortVideoFilter } from "@/entrypoints/content/shortVideos";
import { defaults } from "@/options/defaults";
import { type DeepPartial, deepMerge } from "@/options/merge";
import type { Options } from "@/options/storage";

const options = (patch: DeepPartial<Options> = {}) =>
  deepMerge(defaults, patch);

const maxLength = (minutes: number, seconds = 0) =>
  options({
    videos: { removeShortVideos: { maxLength: { minutes, seconds } } },
  });

const video = (badge: string, tag = "ytd-rich-item-renderer") => {
  const container = document.createElement(tag);
  container.innerHTML = `<div id="length">${badge}</div>`;
  document.body.append(container);

  return container;
};

const overlayVideo = (badge: string) => {
  const container = document.createElement("ytd-compact-video-renderer");
  container.innerHTML = `<span id="text" class="ytd-thumbnail-overlay-time-status-renderer">${badge}</span>`;
  document.body.append(container);

  return container;
};

const isHidden = (element: Element) =>
  element.classList.contains("sy-hide-video");

describe("createShortVideoFilter", () => {
  let filter: ReturnType<typeof createShortVideoFilter>;

  beforeEach(() => {
    document.documentElement.setAttribute("data-sy-path", "home");
    filter = createShortVideoFilter();
    filter.update(options());
  });

  describe("durations", () => {
    it.each([
      ["0:30", true],
      ["1:00", true],
      ["1:01", false],
      ["10:00", false],
      ["1:02:03", false],
    ])("hides %s below a minute: %s", (badge, expected) => {
      const container = video(badge);

      filter.run();

      expect(isHidden(container)).toBe(expected);
    });

    it("keeps videos without a numeric duration", () => {
      const container = video("LIVE");

      filter.run();

      expect(isHidden(container)).toBe(false);
    });

    it("keeps badges that wrap other elements", () => {
      const container = video("<span>0:30</span>");

      filter.run();

      expect(isHidden(container)).toBe(false);
    });

    it("reads the thumbnail overlay badge", () => {
      const container = overlayVideo("0:45");

      filter.run();

      expect(isHidden(container)).toBe(true);
    });
  });

  describe("scope", () => {
    it("leaves channel pages alone", () => {
      document.documentElement.setAttribute("data-sy-path", "channel");
      const container = video("0:30");

      filter.run();

      expect(isHidden(container)).toBe(false);
    });

    it("leaves subscriptions alone by default", () => {
      document.documentElement.setAttribute("data-sy-path", "subscriptions");
      const container = video("0:30");

      filter.run();

      expect(isHidden(container)).toBe(false);
    });

    it("filters subscriptions on request", () => {
      document.documentElement.setAttribute("data-sy-path", "subscriptions");
      filter.update(
        options({
          videos: { removeShortVideos: { removeFromSubscriptions: true } },
        }),
      );
      const container = video("0:30");

      filter.run();

      expect(isHidden(container)).toBe(true);
    });
  });

  describe("updates", () => {
    it("skips badges it already measured", () => {
      const container = video("0:30");
      filter.run();

      container.classList.remove("sy-hide-video");
      filter.run();

      expect(isHidden(container)).toBe(false);
    });

    it("re-measures every badge after a new maximum length", () => {
      const container = video("2:00");
      filter.run();

      filter.update(maxLength(5));
      filter.run();

      expect(isHidden(container)).toBe(true);
    });

    it("reveals videos that are no longer too short", () => {
      const container = video("0:30");
      filter.run();

      filter.update(maxLength(0, 10));
      filter.run();

      expect(isHidden(container)).toBe(false);
    });

    it("restores every hidden video", () => {
      const container = video("0:30");
      filter.run();

      filter.unhide();

      expect(isHidden(container)).toBe(false);
    });
  });
});
