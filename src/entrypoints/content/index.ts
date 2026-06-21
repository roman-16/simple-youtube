import { defineContentScript } from "#imports";
import { type Options, optionsStorage } from "@/options/storage";
import { applyCssFlags } from "./applyCssFlags";
import "./clutter.css";
import { setupNavigation } from "./navigation";
import { createNavRemoval } from "./navRemoval";
import { DomObserver } from "./observer";
import { createShortVideoFilter } from "./shortVideos";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,
  cssInjectionMode: "manifest",
  main() {
    let options: Options | undefined;

    const observer = new DomObserver();
    const shortVideos = createShortVideoFilter();
    const navRemoval = createNavRemoval();
    const navigation = setupNavigation(() => options);

    const apply = (next: Options) => {
      options = next;
      applyCssFlags(options);
      navigation.update();

      const filterShorts =
        options.enabled &&
        options.videos.enabled &&
        options.videos.removeShortVideos.enabled;
      const removeNavigation =
        options.enabled &&
        options.shorts.enabled &&
        options.shorts.removeNavigation;

      if (filterShorts) shortVideos.update(options);
      else shortVideos.unhide();

      if (!removeNavigation) navRemoval.unhide();

      observer.set([
        ...(filterShorts ? [shortVideos.run] : []),
        ...(removeNavigation ? [navRemoval.run] : []),
      ]);
    };

    optionsStorage.getAll().then(apply);
    optionsStorage.watch(apply);
  },
});
