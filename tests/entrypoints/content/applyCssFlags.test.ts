import { describe, expect, it } from "vitest";
import { applyCssFlags } from "@/entrypoints/content/applyCssFlags";
import { defaults } from "@/options/defaults";
import { type DeepPartial, deepMerge } from "@/options/merge";
import type { Options } from "@/options/storage";

const apply = (patch: DeepPartial<Options> = {}) =>
  applyCssFlags(deepMerge(defaults, patch));

const flags = () =>
  document.documentElement
    .getAttributeNames()
    .filter((name) => name.startsWith("data-sy-"))
    .map((name) => name.slice("data-sy-".length))
    .sort();

describe("applyCssFlags", () => {
  it("marks the recommended features", () => {
    apply();

    expect(flags()).toEqual([
      "community",
      "explore-filter",
      "explore-more",
      "feed-nudge",
      "shorts-channel",
      "shorts-explore",
      "watch-again",
    ]);
  });

  it.each([
    ["community", { removeCommunityPosts: false }],
    ["explore-filter", { removeExploreFilter: false }],
    ["explore-more", { removeExploreMore: false }],
    ["feed-nudge", { removeFeedNudge: false }],
    ["shorts-channel", { shorts: { removeFromChannel: false } }],
    ["shorts-explore", { shorts: { removeExplore: { enabled: false } } }],
    ["watch-again", { videos: { removeWatchAgain: false } }],
  ])(
    "drops %s when its feature is off",
    (flag, patch: DeepPartial<Options>) => {
      apply(patch);

      expect(flags()).not.toContain(flag);
      expect(flags()).toHaveLength(6);
    },
  );

  it("marks nothing when the extension is off", () => {
    apply({ enabled: false });

    expect(flags()).toEqual([]);
  });

  it("drops only shorts flags when shorts handling is off", () => {
    apply({ shorts: { enabled: false } });

    expect(flags()).toEqual([
      "community",
      "explore-filter",
      "explore-more",
      "feed-nudge",
      "watch-again",
    ]);
  });

  it("drops only video flags when video handling is off", () => {
    apply({ videos: { enabled: false } });

    expect(flags()).toEqual([
      "community",
      "explore-filter",
      "explore-more",
      "feed-nudge",
      "shorts-channel",
      "shorts-explore",
    ]);
  });

  it("extends the shorts shelf removal to subscriptions on request", () => {
    apply({ shorts: { removeExplore: { removeFromSubscriptions: true } } });

    expect(flags()).toContain("shorts-explore-subs");
  });

  it("keeps subscriptions untouched while the shelf removal is off", () => {
    apply({
      shorts: {
        removeExplore: { enabled: false, removeFromSubscriptions: true },
      },
    });

    expect(flags()).not.toContain("shorts-explore-subs");
  });

  it("clears flags that no longer apply", () => {
    apply();
    apply({ enabled: false });

    expect(flags()).toEqual([]);
  });

  it("leaves the current path alone", () => {
    document.documentElement.setAttribute("data-sy-path", "home");

    apply({ enabled: false });

    expect(document.documentElement.getAttribute("data-sy-path")).toBe("home");
  });
});
