import { describe, expect, it } from "vitest";
import { defaults } from "@/options/defaults";
import { presets } from "@/options/presets";

const booleans = (value: unknown): boolean[] => {
  if (typeof value === "boolean") return [value];
  if (typeof value !== "object" || value === null) return [];

  return Object.values(value).flatMap(booleans);
};

const keys = (value: unknown): string[] => {
  if (typeof value !== "object" || value === null) return [];

  return Object.entries(value).flatMap(([key, child]) => [key, ...keys(child)]);
};

const [recommended, all, none] = presets;

describe("presets", () => {
  it("offers recommended, all and none", () => {
    expect(presets.map((preset) => preset.id)).toEqual([
      "recommended",
      "all",
      "none",
    ]);
  });

  it("names each by what it does", () => {
    expect(presets.map((preset) => preset.label)).toEqual([
      "Reset to recommended",
      "Turn everything on",
      "Turn everything off",
    ]);
  });

  it("says what each did", () => {
    expect(presets.map((preset) => preset.receipt)).toEqual([
      "Reset to recommended",
      "Everything turned on",
      "Everything turned off",
    ]);
  });

  it("recommends the defaults", () => {
    expect(recommended.options).toBe(defaults);
  });

  it("turns every feature on", () => {
    expect(booleans(all.options)).not.toHaveLength(0);
    expect(booleans(all.options).every(Boolean)).toBe(true);
  });

  it("turns every feature off", () => {
    expect(booleans(none.options)).not.toHaveLength(0);
    expect(booleans(none.options).some(Boolean)).toBe(false);
  });

  it("covers the same features as the defaults", () => {
    expect(keys(all.options).sort()).toEqual(keys(none.options).sort());
  });

  it("leaves the configured length alone", () => {
    expect(keys(all.options)).not.toContain("maxLength");
    expect(keys(none.options)).not.toContain("maxLength");
  });
});
