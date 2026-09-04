import { describe, expect, it } from "vitest";
import { load, targeted } from "../../page";

const CHIPS = 'div#header "All Tesla Gaming"';
const FROSTED = "div#frosted-glass";
const PLAYABLES = 'ytd-rich-section-renderer "YouTube Playables Instan"';
const SHORTS_ITEM = 'ytd-rich-item-renderer "Seeing if my violinist f"';
const SHORTS_SHELF = 'ytd-rich-section-renderer "Shorts Seeing if my viol"';

describe("clutter.css", () => {
  describe("topic chips", () => {
    it("removes the chip bar and shrinks the header behind it", () => {
      load("home-feed", { flags: ["topic-chips"], path: "home" });

      expect(targeted()).toEqual([FROSTED, CHIPS]);
    });

    it("keeps the chips outside the home feed", () => {
      load("home-feed", { flags: ["topic-chips"], path: "watch" });

      expect(targeted()).toEqual([]);
    });
  });

  describe("shelves", () => {
    it("removes every shelf from the home feed", () => {
      load("home-feed", { flags: ["shelves"], path: "home" });

      expect(targeted()).toEqual([SHORTS_SHELF, PLAYABLES]);
    });

    it("keeps the shelves that carry the subscriptions feed", () => {
      load("home-feed", { flags: ["shelves"], path: "subscriptions" });

      expect(targeted()).toEqual([]);
    });
  });

  describe("shorts in feeds", () => {
    it("removes the shelf and its items from the home feed", () => {
      load("home-feed", { flags: ["shorts-feeds"], path: "home" });

      expect(targeted()).toEqual([SHORTS_ITEM, SHORTS_SHELF]);
    });

    it("removes the shelf from search results", () => {
      load("search-results", { flags: ["shorts-feeds"], path: "other" });

      expect(targeted()).toEqual([
        'grid-shelf-view-model "Shorts ISSEI funny video"',
      ]);
    });

    it("leaves channel pages alone", () => {
      load("search-results", { flags: ["shorts-feeds"], path: "channel" });

      expect(targeted()).toEqual([]);
    });

    it("leaves subscriptions alone by default", () => {
      load("home-feed", { flags: ["shorts-feeds"], path: "subscriptions" });

      expect(targeted()).toEqual([]);
    });

    it("reaches subscriptions on request", () => {
      load("home-feed", {
        flags: ["shorts-feeds", "shorts-feeds-subscriptions"],
        path: "subscriptions",
      });

      expect(targeted()).toEqual([SHORTS_ITEM, SHORTS_SHELF]);
    });
  });

  describe("shorts in the sidebar", () => {
    it("removes the entry from the guide", () => {
      load("guide", { flags: ["shorts-sidebar"], path: "home" });

      expect(targeted()).toEqual(['ytd-guide-entry-renderer "Shorts"']);
    });

    it("removes the entry from the mini guide", () => {
      load("mini-guide", { flags: ["shorts-sidebar"], path: "home" });

      expect(targeted()).toEqual(['ytd-mini-guide-entry-renderer "Shorts"']);
    });
  });

  describe("shorts on channels", () => {
    it("removes the channel tab", () => {
      load("channel-tabs", {
        flags: ["shorts-channel-tabs"],
        path: "channel",
      });

      expect(targeted()).toEqual(['yt-tab-shape "Shorts"']);
    });
  });

  describe("videos", () => {
    it("keeps every video in the home feed", () => {
      load("home-feed", {
        flags: [
          "posts",
          "prompts",
          "shelves",
          "shorts-channel-tabs",
          "shorts-feeds",
          "shorts-sidebar",
          "topic-chips",
        ],
        path: "home",
      });

      expect(targeted()).toEqual([
        FROSTED,
        CHIPS,
        SHORTS_ITEM,
        SHORTS_SHELF,
        PLAYABLES,
      ]);
    });

    it("keeps the watch page recommendations", () => {
      load("watch-sidebar", {
        flags: [
          "posts",
          "prompts",
          "shelves",
          "shorts-channel-tabs",
          "shorts-feeds",
          "shorts-sidebar",
          "topic-chips",
        ],
        path: "watch",
      });

      expect(targeted()).toEqual([]);
    });
  });

  describe("without flags", () => {
    it("leaves the page untouched", () => {
      load("home-feed", { path: "home" });

      expect(targeted()).toEqual([]);
    });
  });
});
