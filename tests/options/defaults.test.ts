import { describe, expect, it } from "vitest";
import { defaults } from "@/options/defaults";
import { schema } from "@/options/schema";

describe("defaults", () => {
  it("mirrors the schema defaults", () => {
    expect(defaults).toEqual({
      enabled: true,
      removeCommunityPosts: true,
      removeExploreFilter: true,
      removeExploreMore: true,
      removeFeedNudge: true,
      shorts: {
        enabled: true,
        redirectToVideo: true,
        removeFromChannel: true,
        removeExplore: { enabled: true, removeFromSubscriptions: false },
        removeNavigation: true,
      },
      videos: {
        enabled: true,
        removeWatchAgain: true,
        removeShortVideos: {
          enabled: true,
          maxLength: { hours: 0, minutes: 1, seconds: 0 },
          removeFromSubscriptions: false,
        },
      },
    });
  });

  it("clones time values so the schema stays pristine", () => {
    expect(defaults.videos.removeShortVideos.maxLength).not.toBe(
      schema.children.videos.children.removeShortVideos.children.maxLength
        .default,
    );
  });
});
