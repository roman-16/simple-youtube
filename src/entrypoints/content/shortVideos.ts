import type { Options } from "@/options/storage";
import type { Status } from "@/status";

const HIDDEN = "sy-hide-video";

const BADGES = [
  "yt-thumbnail-bottom-overlay-view-model .ytBadgeShapeText",
  "ytd-thumbnail-overlay-time-status-renderer #text",
].join(", ");

const CELL = "ytd-rich-item-renderer";

const ITEM = [
  "yt-lockup-view-model",
  "ytd-compact-video-renderer",
  "ytd-grid-video-renderer",
  "ytd-video-renderer",
].join(", ");

const DURATION = /^(?:(\d+):)?(\d{1,2}):(\d{2})$/;

const FILTERED_PATHS = new Set(["home", "watch"]);

type Found = { filtered: boolean; hidden: Set<Element>; videos: number };

const toSeconds = (text: string): number | null => {
  const match = DURATION.exec(text);
  if (!match) return null;

  const [, hours = "0", minutes = "0", seconds = "0"] = match;

  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
};

const limit = (options: Options): number => {
  const { hours, minutes, seconds } = options.shortVideos.maxLength;

  return hours * 3600 + minutes * 60 + seconds;
};

const filters = (options: Options): boolean => {
  if (!options.enabled || !options.shortVideos.enabled) return false;

  const path = document.documentElement.getAttribute("data-sy-path");
  if (path === "subscriptions") return options.shortVideos.includeSubscriptions;

  return FILTERED_PATHS.has(path ?? "");
};

const find = (options: Options): Found => {
  const hidden = new Set<Element>();
  if (!filters(options)) return { filtered: false, hidden, videos: 0 };

  const max = limit(options);
  let videos = 0;

  for (const badge of document.querySelectorAll(BADGES)) {
    const length = toSeconds(badge.textContent?.trim() ?? "");
    if (length === null) continue;

    const container = badge.closest(CELL) ?? badge.closest(ITEM);
    if (!container) continue;

    videos += 1;
    if (length <= max) hidden.add(container);
  }

  return { filtered: true, hidden, videos };
};

const count = ({ filtered, hidden, videos }: Found): Status => ({
  filtered,
  hidden: hidden.size,
  videos,
});

export const measureShortVideos = (options: Options): Status =>
  count(find(options));

export const hideShortVideos = (options: Options): Status => {
  const found = find(options);

  for (const element of document.querySelectorAll(`.${HIDDEN}`))
    if (!found.hidden.has(element)) element.classList.remove(HIDDEN);

  for (const element of found.hidden) element.classList.add(HIDDEN);

  return count(found);
};
