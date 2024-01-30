import { Switch, TimeInput } from "@/popup/components";
import { useOptionsStorage } from "@/popup/hooks";
import Section from "./Section";

const Configuration = ({ ...props }: React.ComponentProps<typeof Section>) => {
  const [options, setOptions] = useOptionsStorage();

  if (!options) return null;

  return (
    <Section className="ml-0" {...props}>
      <Switch
        label="Enabled"
        checked={options.enabled}
        onCheckedChange={(checked) => setOptions({ enabled: checked })}
      />
      {options.enabled && (
        <Section>
          <Switch
            label="Shorts manipulation"
            checked={options.shorts.enabled}
            onCheckedChange={(checked) =>
              setOptions({ shorts: { enabled: checked } })
            }
          />
          {options.shorts.enabled && (
            <Section>
              <Switch
                label="Redirect to video"
                checked={options.shorts.redirectToVideo}
                onCheckedChange={(checked) =>
                  setOptions({ shorts: { redirectToVideo: checked } })
                }
              />
              <Switch
                label="Remove from channel"
                checked={options.shorts.removeFromChannel}
                onCheckedChange={(checked) =>
                  setOptions({ shorts: { removeFromChannel: checked } })
                }
              />
              <Switch
                label="Remove from explore"
                checked={options.shorts.removeExplore.enabled}
                onCheckedChange={(checked) =>
                  setOptions({
                    shorts: { removeExplore: { enabled: checked } },
                  })
                }
              />
              {options.shorts.removeExplore.enabled && (
                <Section>
                  <Switch
                    label="Remove from subscriptions"
                    checked={
                      options.shorts.removeExplore.removeFromSubscriptions
                    }
                    onCheckedChange={(checked) =>
                      setOptions({
                        shorts: {
                          removeExplore: { removeFromSubscriptions: checked },
                        },
                      })
                    }
                  />
                </Section>
              )}
              <Switch
                label="Remove from navigation"
                checked={options.shorts.removeNavigation}
                onCheckedChange={(checked) =>
                  setOptions({ shorts: { removeNavigation: checked } })
                }
              />
            </Section>
          )}

          <Switch
            label="Video manipulation"
            checked={options.videos.enabled}
            onCheckedChange={(checked) =>
              setOptions({ videos: { enabled: checked } })
            }
          />
          {options.videos.enabled && (
            <Section>
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
                <Section>
                  <div className="ml-6 flex gap-1">
                    Max length
                    <TimeInput
                      hours={options.videos.removeShortVideos.hours}
                      minutes={options.videos.removeShortVideos.minutes}
                      seconds={options.videos.removeShortVideos.seconds}
                      onHoursChange={(hours) =>
                        setOptions({ videos: { removeShortVideos: { hours } } })
                      }
                      onMinutesChange={(minutes) =>
                        setOptions({
                          videos: { removeShortVideos: { minutes } },
                        })
                      }
                      onSecondsChange={(seconds) =>
                        setOptions({
                          videos: { removeShortVideos: { seconds } },
                        })
                      }
                    />
                  </div>
                  <Switch
                    label="Remove from subscriptions"
                    checked={
                      options.videos.removeShortVideos.removeFromSubscriptions
                    }
                    onCheckedChange={(checked) =>
                      setOptions({
                        videos: {
                          removeShortVideos: {
                            removeFromSubscriptions: checked,
                          },
                        },
                      })
                    }
                  />
                </Section>
              )}
            </Section>
          )}
        </Section>
      )}
    </Section>
  );
};

export default Configuration;
