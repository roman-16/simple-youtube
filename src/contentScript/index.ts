import logger from "./logger";

let intervalId: NodeJS.Timeout;

window.addEventListener("load", () => {
  clearInterval(intervalId);

  intervalId = setInterval(() => {
    const navigationMenuItems = document.querySelector(
      "#sections > *:first-child > #items",
    )?.children;

    if (!navigationMenuItems || navigationMenuItems.length < 3) return;

    navigationMenuItems.item(1)?.remove();

    logger.log("Removed Shorts tab");
  }, 10);
});
