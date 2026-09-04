import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { Status } from "@/entrypoints/popup/Status";
import { defaults } from "@/options/defaults";
import type { Status as Value } from "@/status";

const answer = async (status: Value | Error) => {
  const window = await fakeBrowser.windows.create({ focused: true });
  await fakeBrowser.tabs.create({
    active: true,
    url: "https://www.youtube.com/",
    windowId: window?.id,
  });

  vi.spyOn(fakeBrowser.tabs, "sendMessage").mockImplementation(async () => {
    if (status instanceof Error) throw status;

    return status;
  });
};

describe("Status", () => {
  it("says nothing until the page answers", async () => {
    await answer({ filtered: true, hidden: 7, videos: 21 });

    const { container } = render(<Status options={defaults} />);

    expect(container.textContent).toBe("");
    expect(await screen.findByText(/videos hidden/)).toBeDefined();
  });

  it("reports how many videos it hid", async () => {
    await answer({ filtered: true, hidden: 7, videos: 21 });

    render(<Status options={defaults} />);

    expect(
      await screen.findByText("On this page: 7 of 21 videos hidden"),
    ).toBeDefined();
  });

  it("reports that it found no videos", async () => {
    await answer({ filtered: true, hidden: 0, videos: 0 });

    render(<Status options={defaults} />);

    expect(
      await screen.findByText("On this page: 0 of 0 videos hidden"),
    ).toBeDefined();
  });

  it("reports a page it leaves alone", async () => {
    await answer({ filtered: false, hidden: 0, videos: 0 });

    render(<Status options={defaults} />);

    expect(
      await screen.findByText("Short videos are not filtered on this page"),
    ).toBeDefined();
  });

  it("asks for youtube when the page cannot answer", async () => {
    await answer(new Error("no receiver"));

    render(<Status options={defaults} />);

    expect(
      await screen.findByText("Open YouTube to see what is hidden"),
    ).toBeDefined();
  });

  it("asks again once the options change", async () => {
    await answer({ filtered: true, hidden: 7, videos: 21 });
    const { rerender } = render(<Status options={defaults} />);
    await screen.findByText("On this page: 7 of 21 videos hidden");

    rerender(<Status options={{ ...defaults, enabled: false }} />);

    await waitFor(() =>
      expect(fakeBrowser.tabs.sendMessage).toHaveBeenCalledTimes(2),
    );
  });
});
