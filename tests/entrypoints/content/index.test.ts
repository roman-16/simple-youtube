import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Browser } from "wxt/browser";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { ContentScriptContext } from "wxt/utils/content-script-context";
import content from "@/entrypoints/content";
import type { DeepPartial } from "@/options/merge";
import { type Options, optionsStorage } from "@/options/storage";
import type { Status } from "@/status";
import { load } from "../../page";

const start = (options: DeepPartial<Options> = {}) => {
  load("home-feed");

  return optionsStorage
    .set(options)
    .then(() => content.main(new ContentScriptContext("test")));
};

const flag = (name: string) =>
  vi.waitFor(() =>
    expect(document.documentElement.getAttribute(`data-sy-${name}`)).toBe(""),
  );

const flags = () =>
  document.documentElement
    .getAttributeNames()
    .filter((name) => name.startsWith("data-sy-"));

const hidden = () => document.querySelectorAll(".sy-hide-video");

const status = async (): Promise<Status> => {
  const respond = vi.fn();
  fakeBrowser.runtime.onMessage.trigger(
    { options: await optionsStorage.getAll(), type: "sy-status" },
    {} as Browser.runtime.MessageSender,
    respond,
  );

  return respond.mock.calls[0]?.[0];
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
    await flag("posts");
    await flag("shelves");
  });

  it("hides the short videos of the feed", async () => {
    await start();

    await vi.waitFor(() => expect(hidden()).toHaveLength(1));
    expect(hidden()[0]?.textContent).toContain("0:28");
  });

  it("hides a video that appears later", async () => {
    await start();
    await vi.waitFor(() => expect(hidden()).toHaveLength(1));

    const item = document.createElement("ytd-rich-item-renderer");
    item.innerHTML = `<yt-thumbnail-bottom-overlay-view-model><div class="ytBadgeShapeText">0:09</div></yt-thumbnail-bottom-overlay-view-model>`;
    document.body.append(item);

    await vi.waitFor(() => expect(hidden()).toHaveLength(2));
  });

  it("reveals the videos once the feature is turned off", async () => {
    await start();
    await vi.waitFor(() => expect(hidden()).toHaveLength(1));

    await optionsStorage.set({ shortVideos: { enabled: false } });

    await vi.waitFor(() => expect(hidden()).toHaveLength(0));
  });

  it("drops every flag once the extension is turned off", async () => {
    await start();
    await flag("posts");

    await optionsStorage.set({ enabled: false });

    await vi.waitFor(() => expect(flags()).toEqual(["data-sy-path"]));
  });

  it("does nothing while disabled", async () => {
    await start({ enabled: false });

    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute("data-sy-path")).toBe(
        "home",
      ),
    );
    expect(hidden()).toHaveLength(0);
  });

  it("reports what it hid", async () => {
    await start();
    await vi.waitFor(() => expect(hidden()).toHaveLength(1));

    expect(await status()).toEqual({ filtered: true, hidden: 1, videos: 4 });
  });

  it("reports nothing for a page it leaves alone", async () => {
    await start();
    await optionsStorage.set({ shortVideos: { enabled: false } });

    expect(await status()).toEqual({ filtered: false, hidden: 0, videos: 0 });
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
