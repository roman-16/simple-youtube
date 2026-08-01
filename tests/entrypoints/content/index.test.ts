import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContentScriptContext } from "wxt/utils/content-script-context";
import content from "@/entrypoints/content";
import type { DeepPartial } from "@/options/merge";
import { type Options, optionsStorage } from "@/options/storage";

const feed = () => {
  document.body.innerHTML = `
    <ytd-rich-item-renderer id="short"><div id="length">0:30</div></ytd-rich-item-renderer>
    <ytd-rich-item-renderer id="long"><div id="length">12:30</div></ytd-rich-item-renderer>
    <ytd-mini-guide-renderer role="navigation">
      <div id="items">
        <ytd-mini-guide-entry-renderer><span class="title">Home</span></ytd-mini-guide-entry-renderer>
        <ytd-mini-guide-entry-renderer id="shorts-entry"><span class="title">Shorts</span></ytd-mini-guide-entry-renderer>
      </div>
    </ytd-mini-guide-renderer>
  `;
};

const element = (id: string) => {
  const found = document.getElementById(id);
  if (!found) throw new Error(`missing ${id}`);

  return found;
};

const hidden = (id: string, className: string) =>
  vi.waitFor(() =>
    expect(element(id).classList.contains(className)).toBe(true),
  );

const visible = (id: string, className: string) =>
  vi.waitFor(() =>
    expect(element(id).classList.contains(className)).toBe(false),
  );

const flag = (name: string) =>
  vi.waitFor(() =>
    expect(document.documentElement.getAttribute(`data-sy-${name}`)).toBe(""),
  );

const start = (options: DeepPartial<Options> = {}) => {
  vi.stubGlobal("location", { pathname: "/", replace: vi.fn() });
  feed();

  return optionsStorage
    .set(options)
    .then(() => content.main(new ContentScriptContext("test")));
};

describe("content script", () => {
  beforeEach(() => {
    vi.stubGlobal("location", { pathname: "/", replace: vi.fn() });
  });

  it("runs on youtube from the start of the document", () => {
    expect(content.matches).toEqual(["*://*.youtube.com/*"]);
    expect(content.runAt).toBe("document_start");
    expect(content.allFrames).toBe(false);
    expect(content.cssInjectionMode).toBe("manifest");
  });

  it("marks the page and its features", async () => {
    await start();

    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute("data-sy-path")).toBe(
        "home",
      ),
    );
    await flag("community");
    await flag("watch-again");
  });

  it("hides short videos and the shorts navigation entry", async () => {
    await start();

    await hidden("short", "sy-hide-video");
    await hidden("shorts-entry", "sy-hide-nav");
    await visible("long", "sy-hide-video");
  });

  it("reveals short videos once the feature is turned off", async () => {
    await start();
    await hidden("short", "sy-hide-video");

    await optionsStorage.set({
      videos: { removeShortVideos: { enabled: false } },
    });

    await visible("short", "sy-hide-video");
  });

  it("restores the navigation once the feature is turned off", async () => {
    await start();
    await hidden("shorts-entry", "sy-hide-nav");

    await optionsStorage.set({ shorts: { removeNavigation: false } });

    await visible("shorts-entry", "sy-hide-nav");
  });

  it("drops every flag once the extension is turned off", async () => {
    await start();
    await flag("community");

    await optionsStorage.set({ enabled: false });

    await vi.waitFor(() =>
      expect(
        document.documentElement
          .getAttributeNames()
          .filter((name) => name.startsWith("data-sy-")),
      ).toEqual(["data-sy-path"]),
    );
  });

  it("does nothing while disabled", async () => {
    await start({ enabled: false });

    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute("data-sy-path")).toBe(
        "home",
      ),
    );
    expect(element("short").classList.contains("sy-hide-video")).toBe(false);
    expect(element("shorts-entry").classList.contains("sy-hide-nav")).toBe(
      false,
    );
  });

  it("redirects a shorts page to the watch page", async () => {
    const replace = vi.fn();
    vi.stubGlobal("location", { pathname: "/shorts/abc123", replace });

    content.main(new ContentScriptContext("test"));

    await vi.waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/watch?v=abc123"),
    );
  });
});
