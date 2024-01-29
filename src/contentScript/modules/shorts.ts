import logger from "@/contentScript/logger";
import { Options, optionsStorage } from "@/shared";

let isInitialized = false;
let options: Options | undefined = undefined;

const navigation = {
  removeDesktop: () => {
    const shortsItem = document.querySelector(
      "#sections > *:first-child > #items > *:nth-child(2) .title",
    );

    if (shortsItem?.innerHTML.trim().toLowerCase() !== "shorts") return;

    shortsItem.closest("ytd-guide-entry-renderer")?.remove();

    logger.log("Removed shorts tab on desktop");
  },

  removeMobile: () => {
    const shortsItem = document.querySelector(
      'ytd-mini-guide-renderer[role="navigation"] > #items > *:nth-child(2) .title',
    );

    if (shortsItem?.innerHTML.trim().toLowerCase() !== "shorts") return;

    shortsItem.closest("ytd-mini-guide-entry-renderer")?.remove();

    logger.log("Removed shorts tab on mobile");
  },
};

const shorts = {
  init: async () => {
    if (isInitialized) return;

    options = await optionsStorage.getAll();

    isInitialized = true;
  },

  redirectToVideo: () => {
    const path = window.location.pathname.split("/");

    if (!path[1]?.toLowerCase().startsWith("shorts")) return;

    window.location.href = `/watch?v=${path[2]}`;

    logger.log("Redirect from shorts to video");
  },

  removeAccountTab: () => {
    const browseItem = document.querySelector(
      '#tabsContent yt-tab-shape[tab-title="Shorts"]',
    );

    if (!browseItem) return;

    browseItem.remove();

    logger.log("Removed shorts from account tab");
  },

  removeExplore: () => {
    const path = window.location.pathname.toLowerCase();

    if (
      !options?.shorts.removeExplore.removeFromSubscriptions &&
      path.startsWith("/feed/subscriptions")
    )
      return;

    const browseItem = document.querySelector(
      "#contents > ytd-rich-section-renderer:has(*[is-slim-media])",
    );

    if (!browseItem) return;

    browseItem.remove();

    logger.log("Removed shorts from explore");
  },

  removeNavigation: () => {
    navigation.removeDesktop();
    navigation.removeMobile();
  },
};

export default shorts;
