import { describe, expect, it } from "vitest";
import { formatDuration, parseDuration } from "@/entrypoints/popup/duration";

describe("formatDuration", () => {
  it.each([
    [{ hours: 0, minutes: 1, seconds: 0 }, "1:00"],
    [{ hours: 0, minutes: 0, seconds: 30 }, "0:30"],
    [{ hours: 0, minutes: 12, seconds: 5 }, "12:05"],
    [{ hours: 1, minutes: 2, seconds: 3 }, "1:02:03"],
    [{ hours: 100, minutes: 0, seconds: 0 }, "100:00:00"],
  ])("writes %o as %s", (value, text) => {
    expect(formatDuration(value)).toBe(text);
  });
});

describe("parseDuration", () => {
  it.each([
    ["1:00", { hours: 0, minutes: 1, seconds: 0 }],
    ["0:30", { hours: 0, minutes: 0, seconds: 30 }],
    ["01:30", { hours: 0, minutes: 1, seconds: 30 }],
    ["12:30", { hours: 0, minutes: 12, seconds: 30 }],
    ["1:02:03", { hours: 1, minutes: 2, seconds: 3 }],
    ["0:00", { hours: 0, minutes: 0, seconds: 0 }],
    [" 1:00 ", { hours: 0, minutes: 1, seconds: 0 }],
  ])("reads %s", (text, value) => {
    expect(parseDuration(text)).toEqual(value);
  });

  it("carries minutes past the hour", () => {
    expect(parseDuration("90:00")).toEqual({
      hours: 1,
      minutes: 30,
      seconds: 0,
    });
  });

  it.each([
    "",
    "90",
    "1:5",
    "1:75",
    "1:60:00",
    "1:2:03",
    "abc",
    "1:00:",
    "-1:00",
  ])("refuses %s", (text) => {
    expect(parseDuration(text)).toBeNull();
  });

  it("reads back what it writes", () => {
    const value = { hours: 2, minutes: 5, seconds: 9 };

    expect(parseDuration(formatDuration(value))).toEqual(value);
  });
});
