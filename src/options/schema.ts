type BoolNode = { kind: "bool"; label: string; default: boolean; css?: string };

type TimeValue = { hours: number; minutes: number; seconds: number };

type TimeNode = { kind: "time"; label: string; default: TimeValue };

interface SectionNode<
  C extends Record<string, AnyNode> = Record<string, AnyNode>,
> {
  kind: "section";
  label: string;
  default: boolean;
  css?: string;
  dynamic?: boolean;
  children: C;
}

type AnyNode = BoolNode | TimeNode | SectionNode;

const bool = (label: string, def: boolean, css?: string): BoolNode => ({
  kind: "bool",
  label,
  default: def,
  css,
});

const time = (label: string, def: TimeValue): TimeNode => ({
  kind: "time",
  label,
  default: def,
});

const section = <C extends Record<string, AnyNode>>(
  label: string,
  def: boolean,
  children: C,
  opts: { css?: string; dynamic?: boolean } = {},
): SectionNode<C> => ({
  kind: "section",
  label,
  default: def,
  children,
  css: opts.css,
  dynamic: opts.dynamic,
});

export const schema = section("Enabled", true, {
  removeCommunityPosts: bool("Remove community posts", true, "community"),
  removeExploreFilter: bool("Remove explore filter", true, "explore-filter"),
  removeExploreMore: bool("Remove explore more", true, "explore-more"),
  shorts: section("Shorts manipulation", true, {
    redirectToVideo: bool("Redirect to video", true),
    removeFromChannel: bool("Remove from channel", true, "shorts-channel"),
    removeExplore: section(
      "Remove from explore",
      true,
      {
        removeFromSubscriptions: bool("Remove from subscriptions", false),
      },
      { css: "shorts-explore" },
    ),
    removeNavigation: bool("Remove from navigation", true),
  }),
  videos: section("Video manipulation", true, {
    removeWatchAgain: bool("Remove watch again", true, "watch-again"),
    removeShortVideos: section(
      "Remove short videos",
      true,
      {
        maxLength: time("Max length", { hours: 0, minutes: 1, seconds: 0 }),
        removeFromSubscriptions: bool("Remove from subscriptions", false),
      },
      { dynamic: true },
    ),
  }),
});

export type { AnyNode, SectionNode, TimeValue };
