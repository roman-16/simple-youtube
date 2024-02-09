import logger from "@/contentScript/logger";
import { Options, optionsStorage } from "@/shared";
import { add, isAfter } from "date-fns";

let isInitialized = false;
let options: Options | undefined = undefined;
let maxLength = new Date(0);

const videos = {
  init: async () => {
    if (isInitialized) return;

    options = await optionsStorage.getAll();

    maxLength = add(new Date(0), {
      hours: options.videos.removeShortVideos.hours,
      minutes: options.videos.removeShortVideos.minutes,
      seconds: options.videos.removeShortVideos.seconds,
    });

    isInitialized = true;
  },

  removeShortVideos: () => {
    const path = window.location.pathname.toLowerCase();

    if (
      (!options?.videos.removeShortVideos.removeFromSubscriptions &&
        path.startsWith("/feed/subscriptions")) ||
      document.querySelectorAll(
        "tp-yt-app-header:not([disabled]):has(#channel-container)",
      ).length >= 1
    )
      return;

    const videoLengths = document.querySelectorAll(
      "#length, #text.ytd-thumbnail-overlay-time-status-renderer",
    );

    videoLengths.forEach((videoLength) => {
      if (videoLength.children.length > 0) return;

      const lengths = videoLength.innerHTML.split(":").map(Number);
      let hours = 0;
      let minutes = 0;
      let seconds = 0;

      if (lengths.length >= 3) {
        hours = lengths[0];
        minutes = lengths[1];
        seconds = lengths[2];
      } else if (lengths.length >= 2) {
        minutes = lengths[0];
        seconds = lengths[1];
      } else {
        seconds = lengths[0];
      }

      const length = add(new Date(0), {
        hours,
        minutes,
        seconds,
      });

      if (isAfter(length, maxLength)) return;

      videoLength.closest("ytd-rich-item-renderer")?.remove();
      videoLength.closest("ytd-compact-video-renderer")?.remove();

      logger.log("Removed short video");
    });
  },

  removeWatchAgain: () => {
    const shortsElements = document.querySelectorAll(
      'ytd-rich-section-renderer:has(a[href^="/feed/history"])',
    );

    shortsElements.forEach((element) => {
      element.remove();

      logger.log("Removed watch again");
    });
  },
};

export default videos;
