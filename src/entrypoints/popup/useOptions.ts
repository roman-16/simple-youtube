import { useEffect, useState } from "react";
import type { DeepPartial } from "@/options/merge";
import { type Options, optionsStorage } from "@/options/storage";

export const useOptions = () => {
  const [options, setOptions] = useState<Options>();

  useEffect(() => {
    optionsStorage.getAll().then(setOptions);
    return optionsStorage.watch(setOptions);
  }, []);

  const update = (patch: DeepPartial<Options>) => optionsStorage.set(patch);

  return [options, update] as const;
};
