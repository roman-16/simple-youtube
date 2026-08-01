import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { useOptions } from "@/entrypoints/popup/useOptions";
import { defaults } from "@/options/defaults";
import { optionsStorage } from "@/options/storage";

describe("useOptions", () => {
  it("starts out empty", () => {
    const { result } = renderHook(() => useOptions());

    expect(result.current[0]).toBeUndefined();
  });

  it("loads the stored options", async () => {
    await optionsStorage.set({ enabled: false });

    const { result } = renderHook(() => useOptions());

    await waitFor(() => expect(result.current[0]?.enabled).toBe(false));
  });

  it("follows changes made elsewhere", async () => {
    const { result } = renderHook(() => useOptions());
    await waitFor(() => expect(result.current[0]).toEqual(defaults));

    await act(() => optionsStorage.set({ removeFeedNudge: false }));

    expect(result.current[0]?.removeFeedNudge).toBe(false);
  });

  it("persists updates", async () => {
    const { result } = renderHook(() => useOptions());
    await waitFor(() => expect(result.current[0]).toBeDefined());

    await act(() => result.current[1]({ shorts: { removeNavigation: false } }));

    expect((await optionsStorage.getAll()).shorts.removeNavigation).toBe(false);
  });

  it("stops following changes once unmounted", async () => {
    const addListener = vi.spyOn(fakeBrowser.storage.onChanged, "addListener");
    const removeListener = vi.spyOn(
      fakeBrowser.storage.onChanged,
      "removeListener",
    );
    const { result, unmount } = renderHook(() => useOptions());
    await waitFor(() => expect(result.current[0]).toBeDefined());

    unmount();

    expect(addListener).toHaveBeenCalledTimes(1);
    expect(removeListener).toHaveBeenCalledWith(addListener.mock.calls[0]?.[0]);
  });
});
