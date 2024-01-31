import logger from "@/contentScript/logger";

const community = {
  removePosts: () => {
    const shortsElements = document.querySelectorAll(
      "ytd-rich-section-renderer:has(ytd-rich-item-renderer[is-post])",
    );

    shortsElements.forEach((element) => {
      element.remove();

      logger.log("Removed community posts");
    });
  },
};

export default community;
