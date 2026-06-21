import type { Options } from "@/options/storage";

const toggle = (name: string, on: boolean) => {
  if (on) document.documentElement.setAttribute(`data-sy-${name}`, "");
  else document.documentElement.removeAttribute(`data-sy-${name}`);
};

export const applyCssFlags = (options: Options) => {
  const base = options.enabled;
  const shorts = base && options.shorts.enabled;
  const videos = base && options.videos.enabled;
  const explore = shorts && options.shorts.removeExplore.enabled;

  toggle("community", base && options.removeCommunityPosts);
  toggle("explore-filter", base && options.removeExploreFilter);
  toggle("explore-more", base && options.removeExploreMore);
  toggle("shorts-channel", shorts && options.shorts.removeFromChannel);
  toggle("shorts-explore", explore);
  toggle(
    "shorts-explore-subs",
    explore && options.shorts.removeExplore.removeFromSubscriptions,
  );
  toggle("watch-again", videos && options.videos.removeWatchAgain);
};
