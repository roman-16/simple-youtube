import { optionsStorage } from "@/shared";
import _ from "lodash-es";
import { community, explore, shorts, videos } from "./modules";

(async () => {
  const options = await optionsStorage.getAll();

  if (!options.enabled) return;

  const run = async () => {
    if (options.removeCommunityPosts) community.removePosts();
    if (options.removeExploreFilter) explore.removeFilter();
    if (options.removeExploreMore) explore.removeExploreMore();

    if (options.shorts.enabled) {
      await shorts.init();

      if (options.shorts.redirectToVideo) shorts.redirectToVideo();
      if (options.shorts.removeFromChannel) shorts.removeFromChannel();
      if (options.shorts.removeExplore.enabled) shorts.removeExplore();
      if (options.shorts.removeNavigation) shorts.removeNavigation();
    }

    if (options.videos.enabled) {
      await videos.init();

      if (options.videos.removeShortVideos.enabled) videos.removeShortVideos();
      if (options.videos.removeWatchAgain) videos.removeWatchAgain();
    }
  };

  const body = document.querySelector("body");

  if (!body) return;

  new MutationObserver(run).observe(body, {
    childList: true,
    subtree: true,
  });

  run();
})();
