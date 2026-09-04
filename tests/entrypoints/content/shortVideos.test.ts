import { describe, expect, it } from "vitest";
import {
  hideShortVideos,
  measureShortVideos,
} from "@/entrypoints/content/shortVideos";
import { defaults } from "@/options/defaults";
import { type DeepPartial, deepMerge } from "@/options/merge";
import type { Options } from "@/options/storage";
import { load, targeted } from "../../page";

const options = (patch: DeepPartial<Options> = {}) =>
  deepMerge(defaults, patch);

const maxLength = (minutes: number, seconds = 0) =>
  options({ shortVideos: { maxLength: { minutes, seconds } } });

const durations = (selector: string) =>
  [...document.querySelectorAll(selector)]
    .map((element) =>
      element
        .querySelector(
          "yt-thumbnail-bottom-overlay-view-model .ytBadgeShapeText, ytd-thumbnail-overlay-time-status-renderer #text",
        )
        ?.textContent?.trim(),
    )
    .filter(Boolean);

const hidden = () => durations(".sy-hide-video");

describe("short videos", () => {
  describe("the home feed", () => {
    it("hides the videos below the maximum length", () => {
      load("home-feed", { path: "home" });

      expect(hideShortVideos(options())).toEqual({
        filtered: true,
        hidden: 1,
        videos: 4,
      });
      expect(hidden()).toEqual(["0:28"]);
    });

    it("counts only the items that carry a duration", () => {
      load("home-feed", { path: "home" });

      expect(document.querySelectorAll("ytd-rich-item-renderer")).toHaveLength(
        7,
      );
      expect(measureShortVideos(options())).toEqual({
        filtered: true,
        hidden: 1,
        videos: 4,
      });
    });

    it("follows a longer maximum length", () => {
      load("home-feed", { path: "home" });

      hideShortVideos(maxLength(20));

      expect(hidden()).toEqual(["18:36", "0:28", "1:03"]);
    });

    it("follows a shorter maximum length", () => {
      load("home-feed", { path: "home" });

      hideShortVideos(maxLength(0, 10));

      expect(hidden()).toEqual([]);
    });

    it("hides the grid cell so the row closes up", () => {
      load("home-feed", { path: "home" });

      hideShortVideos(options());

      expect(
        document.querySelector(".sy-hide-video")?.tagName.toLowerCase(),
      ).toBe("ytd-rich-item-renderer");
    });

    it("marks the videos with a rule that hides them", () => {
      load("home-feed", { path: "home" });

      hideShortVideos(options());

      expect(targeted()).toEqual([
        'ytd-rich-item-renderer "0:28 Stealth Grey | Tesl"',
      ]);
    });

    it("reveals the videos once the feature is off", () => {
      load("home-feed", { path: "home" });
      hideShortVideos(options());

      expect(
        hideShortVideos(options({ shortVideos: { enabled: false } })),
      ).toEqual({ filtered: false, hidden: 0, videos: 0 });
      expect(hidden()).toEqual([]);
    });

    it("reveals the videos once the extension is off", () => {
      load("home-feed", { path: "home" });
      hideShortVideos(options());

      hideShortVideos(options({ enabled: false }));

      expect(hidden()).toEqual([]);
    });

    it("settles on the same result when it runs again", () => {
      load("home-feed", { path: "home" });

      hideShortVideos(options());
      hideShortVideos(options());

      expect(hidden()).toEqual(["0:28"]);
    });
  });

  describe("the watch page", () => {
    it("hides a recommendation without a grid cell around it", () => {
      load("watch-sidebar", { path: "watch" });

      hideShortVideos(maxLength(10));

      expect(
        document.querySelector(".sy-hide-video")?.tagName.toLowerCase(),
      ).toBe("yt-lockup-view-model");
    });

    it("keeps the longer recommendations", () => {
      load("watch-sidebar", { path: "watch" });

      expect(hideShortVideos(options())).toEqual({
        filtered: true,
        hidden: 0,
        videos: 1,
      });
    });
  });

  describe("search results", () => {
    it("reads the duration but leaves the results in place", () => {
      load("search-results", { path: "other" });

      expect(hideShortVideos(maxLength(60))).toEqual({
        filtered: false,
        hidden: 0,
        videos: 0,
      });
      expect(hidden()).toEqual([]);
    });
  });

  describe("subscriptions", () => {
    it("stays out of the way by default", () => {
      load("home-feed", { path: "subscriptions" });

      expect(hideShortVideos(options()).filtered).toBe(false);
      expect(hidden()).toEqual([]);
    });

    it("filters on request", () => {
      load("home-feed", { path: "subscriptions" });

      hideShortVideos(options({ shortVideos: { includeSubscriptions: true } }));

      expect(hidden()).toEqual(["0:28"]);
    });
  });

  describe("channel pages", () => {
    it("stays out of the way", () => {
      load("home-feed", { path: "channel" });

      expect(hideShortVideos(options()).filtered).toBe(false);
      expect(hidden()).toEqual([]);
    });
  });

  describe("durations", () => {
    const badge = (text: string) => {
      document.body.innerHTML = `
        <ytd-rich-item-renderer>
          <yt-thumbnail-bottom-overlay-view-model>
            <div class="ytBadgeShapeText">${text}</div>
          </yt-thumbnail-bottom-overlay-view-model>
        </ytd-rich-item-renderer>`;
      document.documentElement.setAttribute("data-sy-path", "home");

      return hideShortVideos(options());
    };

    it.each([
      ["0:59", 1],
      ["1:00", 1],
      ["1:01", 0],
      ["1:02:03", 0],
    ])("reads %s", (text, expected) => {
      expect(badge(text).hidden).toBe(expected);
    });

    it.each(["LIVE", "Mix", "New", "", "12", "1:2:3"])(
      "ignores the badge %s",
      (text) => {
        expect(badge(text)).toEqual({
          filtered: true,
          hidden: 0,
          videos: 0,
        });
      },
    );

    it("reads long durations", () => {
      expect(badge("100:00:00").videos).toBe(1);
    });
  });
});
