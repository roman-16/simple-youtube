import { describe, expect, it } from "vitest";
import { type AnyNode, schema } from "@/options/schema";

const nodes = (node: AnyNode): AnyNode[] =>
  node.kind === "section"
    ? [node, ...Object.values(node.children).flatMap(nodes)]
    : [node];

describe("schema", () => {
  it("is a section enabled by default", () => {
    expect(schema.kind).toBe("section");
    expect(schema.label).toBe("Enabled");
    expect(schema.default).toBe(true);
  });

  it("lists every feature", () => {
    expect(Object.keys(schema.children)).toEqual([
      "homeFeed",
      "shortVideos",
      "shorts",
    ]);
    expect(Object.keys(schema.children.homeFeed.children)).toEqual([
      "removePosts",
      "removeShelves",
      "removeSuggestionPrompts",
      "removeTopicChips",
    ]);
    expect(Object.keys(schema.children.shortVideos.children)).toEqual([
      "maxLength",
      "includeSubscriptions",
    ]);
    expect(Object.keys(schema.children.shorts.children)).toEqual([
      "redirectToVideo",
      "removeFromFeeds",
      "removeFromChannelTabs",
      "removeFromSidebar",
    ]);
  });

  it("labels every node", () => {
    for (const node of nodes(schema)) expect(node.label).not.toBe("");
  });

  it("assigns each css flag to at most one node", () => {
    const flags = nodes(schema)
      .map((node) => (node.kind === "time" ? undefined : node.css))
      .filter((css) => css !== undefined);

    expect(flags).toEqual([...new Set(flags)]);
  });

  it("caps short videos at one minute by default", () => {
    const { maxLength } = schema.children.shortVideos.children;

    expect(maxLength.kind).toBe("time");
    expect(maxLength.default).toEqual({ hours: 0, minutes: 1, seconds: 0 });
  });

  it("keeps subscriptions out of both removals by default", () => {
    expect(
      schema.children.shortVideos.children.includeSubscriptions.default,
    ).toBe(false);
    expect(
      schema.children.shorts.children.removeFromFeeds.children
        .includeSubscriptions.default,
    ).toBe(false);
  });
});
