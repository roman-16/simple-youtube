import { describe, expectTypeOf, it } from "vitest";
import type { DeepPartial } from "@/options/merge";
import type { TimeValue } from "@/options/schema";
import type { Options } from "@/options/storage";

describe("Options", () => {
  it("infers booleans for toggles", () => {
    expectTypeOf<Options["enabled"]>().toEqualTypeOf<boolean>();
    expectTypeOf<
      Options["homeFeed"]["removeShelves"]
    >().toEqualTypeOf<boolean>();
    expectTypeOf<
      Options["shorts"]["redirectToVideo"]
    >().toEqualTypeOf<boolean>();
    expectTypeOf<
      Options["shorts"]["removeFromFeeds"]["includeSubscriptions"]
    >().toEqualTypeOf<boolean>();
  });

  it("infers a time value for lengths", () => {
    expectTypeOf<
      Options["shortVideos"]["maxLength"]
    >().toEqualTypeOf<TimeValue>();
  });

  it("gives every section an enabled flag", () => {
    expectTypeOf<Options>().toExtend<{
      enabled: boolean;
      homeFeed: { enabled: boolean };
      shortVideos: { enabled: boolean };
      shorts: { enabled: boolean; removeFromFeeds: { enabled: boolean } };
    }>();
  });

  it("has no unknown members", () => {
    expectTypeOf<Options>().not.toHaveProperty("unknown");
  });
});

describe("DeepPartial<Options>", () => {
  it("makes every level optional", () => {
    expectTypeOf<{
      shorts: { removeFromFeeds: { enabled: boolean } };
    }>().toExtend<DeepPartial<Options>>();
    expectTypeOf<Record<string, never>>().toExtend<DeepPartial<Options>>();
  });
});
