import logger from "@/contentScript/logger";

const explore = {
  removeFilter: () => {
    if (window.location.pathname !== "/") return;

    const shortsElements = document.querySelectorAll(
      "#header:has(iron-selector)",
    );

    shortsElements.forEach((element) => {
      element.remove();

      logger.log("Removed explore filter");
    });

    const header = document.querySelector("#frosted-glass") as HTMLDivElement | undefined;

    if (header) {
      header.style.height = "unset"
    }
  },

  removeExploreMore: () => {
    if (window.location.pathname !== "/") return;

    const exploreMoreElements = document.querySelectorAll(
      "ytd-rich-section-renderer:has(ytd-button-renderer[button-next])",
    );

    exploreMoreElements.forEach((element) => {
      element.remove();

      logger.log("Removed explore more section");
    });
  },
};

export default explore;
