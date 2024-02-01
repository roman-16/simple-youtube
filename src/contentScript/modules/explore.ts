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
  },
};

export default explore;
