import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/entrypoints/popup/App";
import { optionsStorage } from "@/options/storage";

const loaded = () => screen.findByText("Open YouTube to see what is hidden");

const box = (label: string) => screen.getByLabelText<HTMLInputElement>(label);

describe("App", () => {
  it("renders nothing until the options are loaded", () => {
    const { container } = render(<App />);

    expect(container.firstChild).toBeNull();
  });

  it("shows its name, its switch, the presets and the groups", async () => {
    render(<App />);
    await loaded();

    expect(
      screen.getByRole("heading", { name: "Simple YouTube" }),
    ).toBeDefined();
    expect(box("Enabled").checked).toBe(true);
    expect(screen.getByRole("button", { name: "Presets" })).toBeDefined();
    for (const label of ["Home feed", "Short videos", "Shorts"])
      expect(box(label).checked).toBe(true);
  });

  it("reflects the stored options", async () => {
    await optionsStorage.set({ shorts: { enabled: false } });

    render(<App />);
    await loaded();

    expect(box("Shorts").checked).toBe(false);
    expect(box("Home feed").checked).toBe(true);
  });

  it("persists a toggled row", async () => {
    render(<App />);
    await loaded();
    fireEvent.click(screen.getByRole("button", { name: /^Home feed / }));

    fireEvent.click(box("Remove shelves"));

    await waitFor(async () =>
      expect((await optionsStorage.getAll()).homeFeed.removeShelves).toBe(
        false,
      ),
    );
    await waitFor(() => expect(box("Remove shelves").checked).toBe(false));
  });

  it("persists the extension's switch and locks the groups", async () => {
    render(<App />);
    await loaded();

    fireEvent.click(box("Enabled"));

    await waitFor(async () =>
      expect((await optionsStorage.getAll()).enabled).toBe(false),
    );
    await waitFor(() => expect(box("Shorts").disabled).toBe(true));
  });

  it("persists a preset and takes it back on undo", async () => {
    render(<App />);
    await loaded();
    fireEvent.click(screen.getByRole("button", { name: "Presets" }));

    fireEvent.click(
      screen.getByRole("menuitem", { name: "Turn everything off" }),
    );

    await waitFor(() => expect(box("Enabled").checked).toBe(false));
    expect((await optionsStorage.getAll()).shorts.enabled).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    await waitFor(() => expect(box("Enabled").checked).toBe(true));
    expect((await optionsStorage.getAll()).shorts.enabled).toBe(true);
  });
});
