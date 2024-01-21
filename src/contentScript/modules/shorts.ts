import logger from "@/logger";
import _ from "lodash-es";

const navigation = {
  removeDesktop: () => {
    const navigationMenuItems = document.querySelector(
      "#sections > *:first-child > #items",
    )?.children;

    if (!navigationMenuItems || navigationMenuItems.length < 3) return;

    navigationMenuItems.item(1)?.remove();

    logger.log("Removed shorts tab on desktop");
  },

  removeMobile: () => {
    const navigationMenuItems = document.querySelector(
      'ytd-mini-guide-renderer[role="navigation"] > #items',
    )?.children;

    if (!navigationMenuItems || navigationMenuItems.length < 5) return;

    navigationMenuItems.item(1)?.remove();

    logger.log("Removed shorts tab on mobile");
  },
};

const shorts = {
  removeAccountTab: () => {
    const browseItem = document.querySelector(
      '#tabsContent yt-tab-shape[tab-title="Shorts"]',
    );

    if (!browseItem) return;

    browseItem.remove();

    logger.log("Removed shorts from account tab");
  },

  removeExplore: () => {
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
