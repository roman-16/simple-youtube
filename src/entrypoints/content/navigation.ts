import type { Options } from "@/options/storage";

const pathKind = (pathname: string): string => {
  const path = pathname.toLowerCase();

  if (path === "/") return "home";
  if (path.startsWith("/feed/subscriptions")) return "subscriptions";
  if (path.startsWith("/shorts")) return "shorts";
  if (path.startsWith("/watch")) return "watch";
  if (
    path.startsWith("/@") ||
    path.startsWith("/channel") ||
    path.startsWith("/c/") ||
    path.startsWith("/user")
  )
    return "channel";

  return "other";
};

export const setupNavigation = (getOptions: () => Options | undefined) => {
  let redirected = false;

  const update = () => {
    const { pathname } = window.location;
    document.documentElement.setAttribute("data-sy-path", pathKind(pathname));

    const options = getOptions();
    if (
      !options?.enabled ||
      !options.shorts.enabled ||
      !options.shorts.redirectToVideo
    )
      return;

    const parts = pathname.split("/");
    const id = parts[2];

    if (parts[1]?.toLowerCase().startsWith("shorts") && id && !redirected) {
      redirected = true;
      window.location.replace(`/watch?v=${id}`);
    }
  };

  window.addEventListener("yt-navigate-finish", update);
  window.addEventListener("popstate", update);
  update();

  return { update };
};
