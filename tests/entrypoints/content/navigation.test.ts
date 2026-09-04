import { describe, expect, it, vi } from "vitest";
import { setupNavigation } from "@/entrypoints/content/navigation";
import { defaults } from "@/options/defaults";
import { type DeepPartial, deepMerge } from "@/options/merge";
import type { Options } from "@/options/storage";

const stubLocation = (pathname: string) => {
  const replace = vi.fn();
  vi.stubGlobal("location", { pathname, replace });
  return replace;
};

const options = (patch: DeepPartial<Options> = {}) =>
  deepMerge(defaults, patch);

const path = () => document.documentElement.getAttribute("data-sy-path");

describe("setupNavigation", () => {
  describe("path kind", () => {
    it.each([
      ["/", "home"],
      ["/feed/subscriptions", "subscriptions"],
      ["/feed/history", "other"],
      ["/shorts/abc", "other"],
      ["/watch", "watch"],
      ["/@handle", "channel"],
      ["/channel/UC123", "channel"],
      ["/c/name", "channel"],
      ["/user/name", "channel"],
      ["/Feed/Subscriptions", "subscriptions"],
      ["/results", "other"],
    ])("marks %s as %s", (pathname, kind) => {
      stubLocation(pathname);

      setupNavigation(() => undefined);

      expect(path()).toBe(kind);
    });

    it("re-reads the location on every update", () => {
      stubLocation("/");
      const navigation = setupNavigation(() => undefined);

      stubLocation("/watch");
      navigation.update();

      expect(path()).toBe("watch");
    });
  });

  describe("shorts redirect", () => {
    it("rewrites a shorts url to the watch page", () => {
      const replace = stubLocation("/shorts/abc123");

      setupNavigation(() => options());

      expect(replace).toHaveBeenCalledWith("/watch?v=abc123");
    });

    it("redirects only once", () => {
      const replace = stubLocation("/shorts/abc123");

      setupNavigation(() => options()).update();

      expect(replace).toHaveBeenCalledTimes(1);
    });

    it("does nothing before the options are loaded", () => {
      const replace = stubLocation("/shorts/abc123");

      setupNavigation(() => undefined);

      expect(replace).not.toHaveBeenCalled();
    });

    it.each([
      ["the extension is disabled", { enabled: false }],
      ["shorts handling is disabled", { shorts: { enabled: false } }],
      ["the redirect is disabled", { shorts: { redirectToVideo: false } }],
    ])("does nothing when %s", (_, patch: DeepPartial<Options>) => {
      const replace = stubLocation("/shorts/abc123");

      setupNavigation(() => options(patch));

      expect(replace).not.toHaveBeenCalled();
    });

    it.each(["/shorts", "/shorts/", "/shortsy/abc", "/watch", "/"])(
      "does nothing on %s",
      (pathname) => {
        const replace = stubLocation(pathname);

        setupNavigation(() => options());

        expect(replace).not.toHaveBeenCalled();
      },
    );
  });

  describe("navigation events", () => {
    it.each(["yt-navigate-finish", "popstate"])("updates on %s", (type) => {
      stubLocation("/");
      setupNavigation(() => undefined);

      stubLocation("/@handle");
      window.dispatchEvent(new Event(type));

      expect(path()).toBe("channel");
    });
  });
});
