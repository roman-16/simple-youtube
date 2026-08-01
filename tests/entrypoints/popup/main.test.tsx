import { act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mount = () =>
  act(async () => {
    await import("@/entrypoints/popup/main");
  });

describe("popup entrypoint", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("renders the popup into the app container", async () => {
    document.body.innerHTML = '<div id="app"></div>';

    await mount();

    await waitFor(() =>
      expect(document.getElementById("app")?.childElementCount).toBeGreaterThan(
        0,
      ),
    );
  });

  it("does nothing without an app container", async () => {
    await mount();

    expect(document.body.innerHTML).toBe("");
  });
});
