import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

beforeEach(() => {
  fakeBrowser.reset();
});

afterEach(() => {
  cleanup();
  document.body.replaceChildren();

  for (const name of document.documentElement.getAttributeNames())
    if (name.startsWith("data-sy-"))
      document.documentElement.removeAttribute(name);
});
