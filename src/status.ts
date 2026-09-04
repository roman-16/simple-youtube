import { browser } from "#imports";
import type { Options } from "@/options/storage";

export type Status = { filtered: boolean; hidden: number; videos: number };

type Request = { options: Options; type: "sy-status" };

const request = (options: Options): Request => ({
  options,
  type: "sy-status",
});

const isRequest = (message: unknown): message is Request =>
  (message as Request | undefined)?.type === "sy-status";

export const provideStatus = (measure: (options: Options) => Status) => {
  browser.runtime.onMessage.addListener((message, _sender, respond) => {
    if (!isRequest(message)) return;

    respond(measure(message.options));
  });
};

export const requestStatus = async (
  options: Options,
): Promise<Status | undefined> => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab?.id === undefined) return undefined;

  try {
    return await browser.tabs.sendMessage(tab.id, request(options));
  } catch {
    return undefined;
  }
};
