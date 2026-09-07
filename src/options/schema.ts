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
  css?: string,
): SectionNode<C> => ({
  kind: "section",
  label,
  default: def,
  children,
  css,
});

export const schema = section("Enabled", true, {
  homeFeed: section("Home feed", true, {
    removePosts: bool("Remove posts", true, "posts"),
    removeShelves: bool("Remove shelves", true, "shelves"),
    removeSuggestionPrompts: bool("Remove suggestion prompts", true, "prompts"),
    removeTopicChips: bool("Remove topic chips", true, "topic-chips"),
  }),
  shortVideos: section("Short videos", true, {
    maxLength: time("Maximum length", { hours: 0, minutes: 1, seconds: 0 }),
    includeSubscriptions: bool("Include subscriptions", false),
  }),
  shorts: section("Shorts", true, {
    redirectToVideo: bool("Redirect to the video page", true),
    removeFromFeeds: section(
      "Remove from feeds",
      true,
      {
        includeSubscriptions: bool(
          "Include subscriptions",
          false,
          "shorts-feeds-subscriptions",
        ),
      },
      "shorts-feeds",
    ),
    removeFromChannelTabs: bool(
      "Remove from the channel tabs",
      false,
      "shorts-channel-tabs",
    ),
    removeFromSidebar: bool("Remove from the sidebar", true, "shorts-sidebar"),
  }),
});

export type { AnyNode, SectionNode, TimeValue };
