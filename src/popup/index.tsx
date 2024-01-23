import { render } from "react-dom";
import { Switch, TimeInput } from "./components";
import { useOptionsStorage } from "./hooks";

const App = () => {
  const [options, setOptions] = useOptionsStorage();

  if (!options) return null;

  return (
    <div className="h-64 w-64 m-4 flex flex-col gap-2">
      <Switch
        label="Enabled"
        checked={options.enabled}
        onCheckedChange={(checked) => setOptions({ enabled: checked })}
      />
      {options.enabled && (
        <div className="ml-4 flex flex-col gap-2">
          <Switch
            label="Shorts manipulation"
            checked={options.shorts.enabled}
            onCheckedChange={(checked) =>
              setOptions({ shorts: { enabled: checked } })
            }
          />
          {options.shorts.enabled && (
            <div className="ml-4 flex flex-col gap-2">
              <Switch
                label="Remove from account tab"
                checked={options.shorts.removeAccountTab}
                onCheckedChange={(checked) =>
                  setOptions({ shorts: { removeAccountTab: checked } })
                }
              />
              <Switch
                label="Remove from explore"
                checked={options.shorts.removeExplore}
                onCheckedChange={(checked) =>
                  setOptions({ shorts: { removeExplore: checked } })
                }
              />
              <Switch
                label="Remove from navigation"
                checked={options.shorts.removeNavigation}
                onCheckedChange={(checked) =>
                  setOptions({ shorts: { removeNavigation: checked } })
                }
              />
            </div>
          )}

          <Switch
            label="Video manipulation"
            checked={options.videos.enabled}
            onCheckedChange={(checked) =>
              setOptions({ videos: { enabled: checked } })
            }
          />
          {options.videos.enabled && (
            <div className="ml-4 flex flex-col gap-2">
              <Switch
                label="Remove short videos"
                checked={options.videos.removeShortVideos.enabled}
                onCheckedChange={(checked) =>
                  setOptions({
                    videos: { removeShortVideos: { enabled: checked } },
                  })
                }
              />
              {options.videos.removeShortVideos.enabled && (
                <div className="ml-10 flex gap-1 text-base">
                  Max length
                  <TimeInput
                    hours={options.videos.removeShortVideos.hours}
                    minutes={options.videos.removeShortVideos.minutes}
                    seconds={options.videos.removeShortVideos.seconds}
                    onHoursChange={(hours) =>
                      setOptions({ videos: { removeShortVideos: { hours } } })
                    }
                    onMinutesChange={(minutes) =>
                      setOptions({ videos: { removeShortVideos: { minutes } } })
                    }
                    onSecondsChange={(seconds) =>
                      setOptions({ videos: { removeShortVideos: { seconds } } })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

render(<App />, document.getElementById("app"));
