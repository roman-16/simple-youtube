import { describe, expect, it } from "vitest";
import { cn } from "@/entrypoints/popup/cn";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("h-px", "bg-gray-400")).toBe("h-px bg-gray-400");
  });

  it("drops absent class names", () => {
    expect(cn("h-px", false, undefined, "bg-gray-400")).toBe(
      "h-px bg-gray-400",
    );
  });

  it("returns nothing without class names", () => {
    expect(cn()).toBe("");
  });
});
