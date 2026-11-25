import { describe, expect, it } from "vitest";
import { deepEqual, deepMerge } from "@/options/merge";

describe("deepEqual", () => {
  it("tells equal values", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual("a", "a")).toBe(true);
  });

  it("tells different values", () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual(1, "1")).toBe(false);
  });

  it("compares nested objects by their content", () => {
    expect(
      deepEqual(
        { enabled: true, shorts: { redirect: true } },
        { enabled: true, shorts: { redirect: true } },
      ),
    ).toBe(true);
  });

  it("ignores the order of the keys", () => {
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it("tells a nested difference", () => {
    expect(
      deepEqual(
        { shorts: { redirect: true } },
        { shorts: { redirect: false } },
      ),
    ).toBe(false);
  });

  it("tells a missing key from an undefined one", () => {
    expect(deepEqual({ a: undefined }, { b: undefined })).toBe(false);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("tells an object from a primitive", () => {
    expect(deepEqual({ a: 1 }, 1)).toBe(false);
  });
});

describe("deepMerge", () => {
  it("keeps base keys the patch omits", () => {
    expect(deepMerge({ a: 1, b: 2 }, { b: 3 })).toEqual({ a: 1, b: 3 });
  });

  it("merges nested objects instead of replacing them", () => {
    const base = { shorts: { enabled: true, redirect: true } };

    expect(deepMerge(base, { shorts: { redirect: false } })).toEqual({
      shorts: { enabled: true, redirect: false },
    });
  });

  it("replaces arrays", () => {
    expect(deepMerge({ items: [1, 2, 3] }, { items: [4] })).toEqual({
      items: [4],
    });
  });

  it("replaces an object with a primitive", () => {
    expect(deepMerge({ a: { b: 1 } }, { a: 2 as never })).toEqual({ a: 2 });
  });

  it("writes null and undefined patch values", () => {
    expect(
      deepMerge({ a: 1, b: 2 }, { a: null as never, b: undefined }),
    ).toEqual({ a: null, b: undefined });
  });

  it("returns the base when the patch is not an object", () => {
    expect(deepMerge({ a: 1 }, null as never)).toEqual({ a: 1 });
  });

  it("returns the base when the base is not an object", () => {
    expect(deepMerge<number>(1, 2)).toBe(1);
  });

  it("leaves the base untouched", () => {
    const base = { shorts: { enabled: true } };

    const merged = deepMerge(base, { shorts: { enabled: false } });

    expect(base).toEqual({ shorts: { enabled: true } });
    expect(merged.shorts).not.toBe(base.shorts);
  });
});
