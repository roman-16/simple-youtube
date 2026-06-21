import type { Options } from "@/options/storage";

const HIDDEN = "sy-hide-video";
const BADGES = "#length, #text.ytd-thumbnail-overlay-time-status-renderer";
const CONTAINERS = "ytd-rich-item-renderer, ytd-compact-video-renderer";

const parseSeconds = (text: string): number | null => {
  const parts = text.split(":").map(Number);
  if (parts.some(Number.isNaN)) return null;

  while (parts.length < 3) parts.unshift(0);

  const hours = parts[parts.length - 3] ?? 0;
  const minutes = parts[parts.length - 2] ?? 0;
  const seconds = parts[parts.length - 1] ?? 0;

  return hours * 3600 + minutes * 60 + seconds;
};

export const createShortVideoFilter = () => {
  let maxSeconds = 0;
  let removeFromSubscriptions = false;
  let generation = 0;

  const update = (options: Options) => {
    const { maxLength, removeFromSubscriptions: subscriptions } =
      options.videos.removeShortVideos;

    maxSeconds =
      maxLength.hours * 3600 + maxLength.minutes * 60 + maxLength.seconds;
    removeFromSubscriptions = subscriptions;
    generation += 1;
  };

  const unhide = () => {
    for (const element of document.querySelectorAll(`.${HIDDEN}`))
      element.classList.remove(HIDDEN);
  };

  const run = () => {
    const path = document.documentElement.getAttribute("data-sy-path");
    if (path === "channel") return;
    if (path === "subscriptions" && !removeFromSubscriptions) return;

    for (const badge of document.querySelectorAll(BADGES)) {
      if (badge.children.length > 0) continue;

      const text = badge.textContent?.trim();
      if (!text) continue;

      const key = `${generation}:${text}`;
      if (badge.getAttribute("data-sy-dur") === key) continue;
      badge.setAttribute("data-sy-dur", key);

      const seconds = parseSeconds(text);
      badge
        .closest(CONTAINERS)
        ?.classList.toggle(HIDDEN, seconds !== null && seconds <= maxSeconds);
    }
  };

  return { update, unhide, run };
};
