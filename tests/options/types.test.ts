import { describe, expectTypeOf, it } from "vitest";
import type { DeepPartial } from "@/options/merge";
import type { TimeValue } from "@/options/schema";
import type { Options } from "@/options/storage";

describe("Options", () => {
  it("infers booleans for toggles", () => {
    expectTypeOf<Options["enabled"]>().toEqualTypeOf<boolean>();
    expectTypeOf<Options["removeCommunityPosts"]>().toEqualTypeOf<boolean>();
    expectTypeOf<
      Options["shorts"]["redirectToVideo"]
    >().toEqualTypeOf<boolean>();
    expectTypeOf<
      Options["shorts"]["removeExplore"]["removeFromSubscriptions"]
    >().toEqualTypeOf<boolean>();
  });

  it("infers a time value for lengths", () => {
    expectTypeOf<
      Options["videos"]["removeShortVideos"]["maxLength"]
    >().toEqualTypeOf<TimeValue>();
  });

  it("gives every section an enabled flag", () => {
    expectTypeOf<Options>().toExtend<{
      enabled: boolean;
      shorts: { enabled: boolean; removeExplore: { enabled: boolean } };
      videos: { enabled: boolean; removeShortVideos: { enabled: boolean } };
    }>();
  });

  it("has no unknown members", () => {
    expectTypeOf<Options>().not.toHaveProperty("unknown");
  });
});

describe("DeepPartial<Options>", () => {
  it("makes every level optional", () => {
    expectTypeOf<{
      shorts: { removeExplore: { enabled: boolean } };
    }>().toExtend<DeepPartial<Options>>();
    expectTypeOf<Record<string, never>>().toExtend<DeepPartial<Options>>();
  });
});
