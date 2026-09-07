import { describe, expect, it } from "vitest";
import { defaults } from "@/options/defaults";
import { schema } from "@/options/schema";

describe("defaults", () => {
  it("mirrors the schema defaults", () => {
    expect(defaults).toEqual({
      enabled: true,
      homeFeed: {
        enabled: true,
        removePosts: true,
        removeShelves: true,
        removeSuggestionPrompts: true,
        removeTopicChips: true,
      },
      shortVideos: {
        enabled: true,
        includeSubscriptions: false,
        maxLength: { hours: 0, minutes: 1, seconds: 0 },
      },
      shorts: {
        enabled: true,
        redirectToVideo: true,
        removeFromChannelTabs: false,
        removeFromFeeds: { enabled: true, includeSubscriptions: false },
        removeFromSidebar: true,
      },
    });
  });

  it("clones time values so the schema stays pristine", () => {
    expect(defaults.shortVideos.maxLength).not.toBe(
      schema.children.shortVideos.children.maxLength.default,
    );
  });
});
