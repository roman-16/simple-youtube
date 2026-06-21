const HIDDEN = "sy-hide-nav";

const hideEntry = (titleSelector: string, ancestor: string) => {
  const title = document.querySelector(titleSelector);
  if (title?.innerHTML.trim().toLowerCase() !== "shorts") return;
  title.closest(ancestor)?.classList.add(HIDDEN);
};

export const createNavRemoval = () => {
  const run = () => {
    hideEntry(
      "#sections > *:first-child > #items > *:nth-child(2) .title",
      "ytd-guide-entry-renderer",
    );
    hideEntry(
      'ytd-mini-guide-renderer[role="navigation"] > #items > *:nth-child(2) .title',
      "ytd-mini-guide-entry-renderer",
    );
  };

  const unhide = () => {
    for (const element of document.querySelectorAll(`.${HIDDEN}`))
      element.classList.remove(HIDDEN);
  };

  return { run, unhide };
};
