import { describe, expect, it, vi } from "vitest";
import type { Browser } from "wxt/browser";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { defaults } from "@/options/defaults";
import { provideStatus, requestStatus, type Status } from "@/status";

const status: Status = { filtered: true, hidden: 3, videos: 12 };

const REQUEST = { options: defaults, type: "sy-status" };

const sender = {} as Browser.runtime.MessageSender;

const ask = (message: unknown) => {
  const respond = vi.fn();
  fakeBrowser.runtime.onMessage.trigger(message, sender, respond);

  return respond;
};

describe("provideStatus", () => {
  it("answers with a measurement of the options it was asked about", () => {
    const measure = vi.fn(() => status);
    provideStatus(measure);

    expect(ask(REQUEST)).toHaveBeenCalledWith(status);
    expect(measure).toHaveBeenCalledWith(defaults);
  });

  it("measures on every request", () => {
    const measure = vi.fn(() => status);
    provideStatus(measure);

    ask(REQUEST);
    ask(REQUEST);

    expect(measure).toHaveBeenCalledTimes(2);
  });

  it("ignores other messages", () => {
    const measure = vi.fn(() => status);
    provideStatus(measure);

    expect(ask("something-else")).not.toHaveBeenCalled();
    expect(measure).not.toHaveBeenCalled();
  });
});

const activeTab = async (url: string) => {
  const window = await fakeBrowser.windows.create({ focused: true });

  return fakeBrowser.tabs.create({ active: true, url, windowId: window?.id });
};

describe("requestStatus", () => {
  it("asks the active tab", async () => {
    const tab = await activeTab("https://www.youtube.com/");
    const sendMessage = vi
      .spyOn(fakeBrowser.tabs, "sendMessage")
      .mockImplementation(async () => status);

    expect(await requestStatus(defaults)).toEqual(status);
    expect(sendMessage).toHaveBeenCalledWith(tab.id, REQUEST);
  });

  it("reports nothing when the page cannot answer", async () => {
    await activeTab("https://example.com/");
    vi.spyOn(fakeBrowser.tabs, "sendMessage").mockRejectedValue(
      new Error("no receiver"),
    );

    expect(await requestStatus(defaults)).toBeUndefined();
  });

  it("reports nothing without a tab to ask", async () => {
    await fakeBrowser.windows.create({ focused: true });

    expect(await requestStatus(defaults)).toBeUndefined();
  });
});
