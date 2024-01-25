import { optionsStorage } from "@@/shared";
import _ from "lodash-es";
import { shorts, videos } from "./modules";

(async () => {
  const options = await optionsStorage.getAll();

  if (!options.enabled) return;

  const run = async () => {
    if (options.shorts.enabled) {
      if (options.shorts.removeAccountTab) shorts.removeAccountTab();
      if (options.shorts.removeExplore) shorts.removeExplore();
      if (options.shorts.removeNavigation) shorts.removeNavigation();
    }

    if (options.videos.enabled) {
      await videos.init();

      if (options.videos.removeShortVideos.enabled) videos.removeShortVideos();
    }
  };

  const body = document.querySelector("body");

  if (!body) return;

  new MutationObserver(_.debounce(() => run(), 100)).observe(body, {
    childList: true,
    subtree: true,
  });

  run();
})();
