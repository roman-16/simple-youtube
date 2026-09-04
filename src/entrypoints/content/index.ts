import { defineContentScript } from "#imports";
import { type Options, optionsStorage } from "@/options/storage";
import { provideStatus } from "@/status";
import { applyCssFlags } from "./applyCssFlags";
import "./clutter.css";
import { setupNavigation } from "./navigation";
import { DomObserver } from "./observer";
import { hideShortVideos, measureShortVideos } from "./shortVideos";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,
  cssInjectionMode: "manifest",
  main() {
    let options: Options | undefined;

    const observer = new DomObserver();
    const navigation = setupNavigation(() => options);

    provideStatus(measureShortVideos);

    const apply = (next: Options) => {
      options = next;
      applyCssFlags(next);
      navigation.update();

      const hide = () => hideShortVideos(next);
      hide();

      observer.set(next.enabled && next.shortVideos.enabled ? [hide] : []);
    };

    optionsStorage.getAll().then(apply);
    optionsStorage.watch(apply);
  },
});
