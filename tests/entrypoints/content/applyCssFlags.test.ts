import { describe, expect, it } from "vitest";
import { applyCssFlags } from "@/entrypoints/content/applyCssFlags";
import { defaults } from "@/options/defaults";
import { type DeepPartial, deepMerge } from "@/options/merge";
import { presets } from "@/options/presets";
import { type AnyNode, schema } from "@/options/schema";
import type { Options } from "@/options/storage";

const apply = (patch: DeepPartial<Options> = {}) =>
  applyCssFlags(deepMerge(defaults, patch));

const flags = () =>
  document.documentElement
    .getAttributeNames()
    .filter((name) => name.startsWith("data-sy-") && name !== "data-sy-path")
    .map((name) => name.slice("data-sy-".length))
    .sort();

const declared = (node: AnyNode): string[] =>
  node.kind === "time"
    ? []
    : [
        ...(node.css ? [node.css] : []),
        ...(node.kind === "section"
          ? Object.values(node.children).flatMap(declared)
          : []),
      ];

const RECOMMENDED = [
  "posts",
  "prompts",
  "shelves",
  "shorts-channel-tabs",
  "shorts-feeds",
  "shorts-sidebar",
  "topic-chips",
];

describe("applyCssFlags", () => {
  it("marks the recommended features", () => {
    apply();

    expect(flags()).toEqual(RECOMMENDED);
  });

  it("marks every flag the schema declares once everything is on", () => {
    const all = presets.find((preset) => preset.name === "All")?.options ?? {};

    apply(all);

    expect(flags()).toEqual(declared(schema).sort());
  });

  it.each([
    ["posts", { homeFeed: { removePosts: false } }],
    ["prompts", { homeFeed: { removeSuggestionPrompts: false } }],
    ["shelves", { homeFeed: { removeShelves: false } }],
    ["shorts-channel-tabs", { shorts: { removeFromChannelTabs: false } }],
    ["shorts-feeds", { shorts: { removeFromFeeds: { enabled: false } } }],
    ["shorts-sidebar", { shorts: { removeFromSidebar: false } }],
    ["topic-chips", { homeFeed: { removeTopicChips: false } }],
  ])(
    "drops %s when its feature is off",
    (flag, patch: DeepPartial<Options>) => {
      apply(patch);

      expect(flags()).toEqual(RECOMMENDED.filter((other) => other !== flag));
    },
  );

  it("marks nothing while the extension is off", () => {
    apply({ enabled: false });

    expect(flags()).toEqual([]);
  });

  it("drops the home feed flags when the section is off", () => {
    apply({ homeFeed: { enabled: false } });

    expect(flags()).toEqual([
      "shorts-channel-tabs",
      "shorts-feeds",
      "shorts-sidebar",
    ]);
  });

  it("drops the shorts flags when the section is off", () => {
    apply({ shorts: { enabled: false } });

    expect(flags()).toEqual(["posts", "prompts", "shelves", "topic-chips"]);
  });

  it("extends the shorts removal to subscriptions on request", () => {
    apply({ shorts: { removeFromFeeds: { includeSubscriptions: true } } });

    expect(flags()).toContain("shorts-feeds-subscriptions");
  });

  it("keeps subscriptions untouched while the removal is off", () => {
    apply({
      shorts: {
        removeFromFeeds: { enabled: false, includeSubscriptions: true },
      },
    });

    expect(flags()).not.toContain("shorts-feeds-subscriptions");
  });

  it("marks no flag for the short video length", () => {
    apply();

    expect(flags()).not.toContain("short-videos");
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
