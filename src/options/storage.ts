import { browser } from "#imports";
import { defaults } from "./defaults";
import { type DeepPartial, deepMerge } from "./merge";
import type { Options } from "./types";

const KEY = "options";

const read = (stored: unknown): Options =>
  deepMerge(defaults, (stored ?? {}) as DeepPartial<Options>);

export const optionsStorage = {
  getAll: async (): Promise<Options> => {
    const result = await browser.storage.sync.get(KEY);
    return read(result[KEY]);
  },

  set: async (patch: DeepPartial<Options>): Promise<void> => {
    const current = await optionsStorage.getAll();
    await browser.storage.sync.set({ [KEY]: deepMerge(current, patch) });
  },

  watch: (callback: (options: Options) => void): (() => void) => {
    const listener = (
      changes: Record<string, { newValue?: unknown }>,
      area: string,
    ) => {
      if (area !== "sync" || !(KEY in changes)) return;
      callback(read(changes[KEY]?.newValue));
    };

    browser.storage.onChanged.addListener(listener);
    return () => browser.storage.onChanged.removeListener(listener);
  },
};

export type { Options };
