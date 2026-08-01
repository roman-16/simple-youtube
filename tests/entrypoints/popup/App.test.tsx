import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/entrypoints/popup/App";
import { optionsStorage } from "@/options/storage";

describe("App", () => {
  it("renders nothing until the options are loaded", () => {
    const { container } = render(<App />);

    expect(container.firstChild).toBeNull();
  });

  it("shows the presets and the feature tree", async () => {
    render(<App />);

    expect(
      await screen.findByRole("button", { name: "Recommended" }),
    ).toBeDefined();
    expect(screen.getByLabelText("Remove community posts")).toBeDefined();
  });

  it("reflects the stored options", async () => {
    await optionsStorage.set({ shorts: { enabled: false } });

    render(<App />);

    expect(await screen.findByLabelText("Shorts manipulation")).toBeDefined();
    expect(screen.queryByLabelText("Redirect to video")).toBeNull();
  });

  it("persists a toggled feature", async () => {
    render(<App />);

    fireEvent.click(await screen.findByLabelText("Remove feed nudge"));

    await waitFor(async () =>
      expect((await optionsStorage.getAll()).removeFeedNudge).toBe(false),
    );
  });

  it("persists a preset", async () => {
    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: "None" }));

    await waitFor(async () =>
      expect((await optionsStorage.getAll()).enabled).toBe(false),
    );
  });
});
