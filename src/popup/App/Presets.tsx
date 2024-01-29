import { Button } from "@/popup/components";
import { useOptionsStorage } from "@/popup/hooks";
import { Options } from "@/shared";

const presets: { name: string; options: Options }[] = [
  {
    name: "Recommended",
    options: {
      enabled: true,
      shorts: {
        enabled: true,
        redirectToVideo: true,
        removeAccountTab: true,
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
          hours: 0,
          minutes: 1,
          seconds: 0,
          removeFromSubscriptions: false,
        },
      },
    },
  },
  {
    name: "All",
    options: {
      enabled: true,
      shorts: {
        enabled: true,
        redirectToVideo: true,
        removeAccountTab: true,
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
          hours: 0,
          minutes: 1,
          seconds: 0,
          removeFromSubscriptions: true,
        },
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
