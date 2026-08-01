import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { applyCssFlags } from "@/entrypoints/content/applyCssFlags";
import { defaults } from "@/options/defaults";
import { deepMerge } from "@/options/merge";
import { presets } from "@/options/presets";
import { type AnyNode, schema } from "@/options/schema";
import type { Options } from "@/options/storage";

const css = readFileSync("src/entrypoints/content/clutter.css", "utf8");

const styled = new Set(
  [...css.matchAll(/\[data-sy-([a-z-]+)[=\]]/g)]
    .map(([, flag]) => flag)
    .filter((flag) => flag !== "path"),
);

const applied = () => {
  const all = presets.find((preset) => preset.name === "All")?.options ?? {};
  applyCssFlags(deepMerge(defaults, all) as Options);

  return new Set(
    document.documentElement
      .getAttributeNames()
      .filter((name) => name.startsWith("data-sy-"))
      .map((name) => name.slice("data-sy-".length)),
  );
};

const cssFlags = (node: AnyNode): string[] =>
  node.kind === "time"
    ? []
    : [
        ...(node.css ? [node.css] : []),
        ...(node.kind === "section"
          ? Object.values(node.children).flatMap(cssFlags)
          : []),
      ];

describe("clutter.css", () => {
  it("styles every flag the content script sets", () => {
    expect([...applied()].sort()).toEqual([...styled].sort());
  });

  it("styles every flag the schema declares", () => {
    for (const flag of cssFlags(schema)) expect(styled).toContain(flag);
  });

  it("hides the elements the content script marks", () => {
    expect(css).toContain(".sy-hide-video");
    expect(css).toContain(".sy-hide-nav");
  });
});
