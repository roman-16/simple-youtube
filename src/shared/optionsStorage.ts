import _ from "lodash-es";
import OptionsSync from "webext-options-sync";

const defaults = {
  enabled: true,
  videos: {
    enabled: true,
    disableShortVideos: {
      enabled: true,
      hours: 0,
      minutes: 1,
      seconds: 0,
    },
  },
};

type Options = typeof defaults;

const optionsSync = new OptionsSync({
  defaults: _.mapValues(defaults, (values) => JSON.stringify(values)),
});

const optionsStorage = {
  ...optionsSync,

  getAll: async () => {
    const options = await optionsSync.getAll();

    return _.mapValues(options, (values) => JSON.parse(values)) as Options;
  },
};

export default optionsStorage;
