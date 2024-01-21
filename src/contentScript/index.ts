import { optionsStorage } from "@@/shared";
import _ from "lodash-es";
import { shorts, videos } from "./modules";

window.addEventListener("load", async () => {
  const options = await optionsStorage.getAll();

  if (!options.enabled) return;

  const run = async () => {
    shorts.removeAccountTab();
    shorts.removeExplore();
    shorts.removeNavigation();

    if (options.videos.enabled) {
      await videos.init();

      if (options.videos.disableShortVideos.enabled) {
        videos.removeShortVideos();
      }
    }
  };

  const body = document.querySelector("body");

  if (!body) return;

  new MutationObserver(_.debounce(() => run(), 100)).observe(body, {
    childList: true,
    subtree: true,
  });

  run();
});
