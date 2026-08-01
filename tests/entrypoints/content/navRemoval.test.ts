import { beforeEach, describe, expect, it } from "vitest";
import { createNavRemoval } from "@/entrypoints/content/navRemoval";

const guide = (title: string) => `
  <div id="sections">
    <ytd-guide-section-renderer>
      <div id="items">
        <ytd-guide-entry-renderer><a><span class="title">Home</span></a></ytd-guide-entry-renderer>
        <ytd-guide-entry-renderer><a><span class="title">${title}</span></a></ytd-guide-entry-renderer>
      </div>
    </ytd-guide-section-renderer>
  </div>
`;

const miniGuide = (title: string) => `
  <ytd-mini-guide-renderer role="navigation">
    <div id="items">
      <ytd-mini-guide-entry-renderer><span class="title">Home</span></ytd-mini-guide-entry-renderer>
      <ytd-mini-guide-entry-renderer><span class="title">${title}</span></ytd-mini-guide-entry-renderer>
    </div>
  </ytd-mini-guide-renderer>
`;

const hidden = () => [...document.querySelectorAll(".sy-hide-nav")];

const entries = (title: string) => {
  document.body.innerHTML = guide(title) + miniGuide(title);
};

describe("createNavRemoval", () => {
  let navRemoval: ReturnType<typeof createNavRemoval>;

  beforeEach(() => {
    navRemoval = createNavRemoval();
  });

  it("hides the shorts entry in the guide and the mini guide", () => {
    entries("Shorts");

    navRemoval.run();

    expect(hidden().map((element) => element.tagName.toLowerCase())).toEqual([
      "ytd-guide-entry-renderer",
      "ytd-mini-guide-entry-renderer",
    ]);
  });

  it("ignores casing and whitespace", () => {
    entries("  SHORTS \n");

    navRemoval.run();

    expect(hidden()).toHaveLength(2);
  });

  it("keeps other entries", () => {
    entries("Subscriptions");

    navRemoval.run();

    expect(hidden()).toHaveLength(0);
  });

  it("survives a missing navigation", () => {
    expect(() => navRemoval.run()).not.toThrow();
  });

  it("hides an entry only once", () => {
    entries("Shorts");

    navRemoval.run();
    navRemoval.run();

    expect(hidden()[0]?.className).toBe("sy-hide-nav");
  });

  it("restores every hidden entry", () => {
    entries("Shorts");
    navRemoval.run();

    navRemoval.unhide();

    expect(hidden()).toHaveLength(0);
  });
});
