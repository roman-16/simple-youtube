import _ from "lodash-es";
import { DeepPartial } from "utility-types";
import OptionsSync from "webext-options-sync";

const defaults = {
  enabled: true,
  shorts: {
    enabled: true,
    removeAccountTab: true,
    removeExplore: true,
    removeNavigation: true,
  },
  videos: {
    enabled: true,
    removeShortVideos: {
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

  set: async (newOptions: DeepPartial<Options>) => {
    const options = await optionsStorage.getAll();

    return optionsSync.set(
      _.mapValues(newOptions, (values, key: keyof Options) =>
        JSON.stringify(
          _.isObject(values) ? _.merge(options[key], values) : values,
        ),
      ),
    );
  },
};

export default optionsStorage;
export { type Options };
