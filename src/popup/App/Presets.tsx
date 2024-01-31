import { Button } from "@/popup/components";
import { useOptionsStorage } from "@/popup/hooks";
import { Options } from "@/shared";
import { DeepPartial } from "utility-types";

const presets: { name: string; options: DeepPartial<Options> }[] = [
  {
    name: "Recommended",
    options: {
      enabled: true,
      removeCommunityPosts: true,
      removeExploreFilter: true,
      shorts: {
        enabled: true,
        redirectToVideo: true,
        removeFromChannel: true,
        removeExplore: {
          enabled: true,
          removeFromSubscriptions: false,
        },
        removeNavigation: true,
      },
      videos: {
        enabled: true,
        removeShortVideos: {
          enabled: true,
          removeFromSubscriptions: false,
        },
        removeWatchAgain: true,
      },
    },
  },
  {
    name: "All",
    options: {
      enabled: true,
      removeCommunityPosts: true,
      removeExploreFilter: true,
      shorts: {
        enabled: true,
        redirectToVideo: true,
        removeFromChannel: true,
        removeExplore: {
          enabled: true,
          removeFromSubscriptions: true,
        },
        removeNavigation: true,
      },
      videos: {
        enabled: true,
        removeShortVideos: {
          enabled: true,
          removeFromSubscriptions: true,
        },
        removeWatchAgain: true,
      },
    },
  },
  {
    name: "None",
    options: {
      enabled: false,
      removeCommunityPosts: false,
      removeExploreFilter: false,
      shorts: {
        enabled: false,
        redirectToVideo: false,
        removeFromChannel: false,
        removeExplore: {
          enabled: false,
          removeFromSubscriptions: false,
        },
        removeNavigation: false,
      },
      videos: {
        enabled: false,
        removeShortVideos: {
          enabled: false,
          removeFromSubscriptions: false,
        },
        removeWatchAgain: false,
      },
    },
  },
];

const Presets = ({ ...props }: React.HTMLAttributes<HTMLElement>) => {
  const [, setOptions] = useOptionsStorage();

  return (
    <div {...props}>
      <div className="mb-1 text-lg">Set configuration to</div>
      <div className="flex gap-2 text-sm">
        {presets.map((preset) => (
          <Button key={preset.name} onClick={() => setOptions(preset.options)}>
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Presets;
