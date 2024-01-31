import logger from "@/contentScript/logger";

const explore = {
  removeFilter: () => {
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
