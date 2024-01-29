import { Options, optionsStorage } from "@/shared";
import { useCallback, useEffect, useState } from "react";

const useOptionsStorage = () => {
  const [options, setStateOptions] = useState<Options | undefined>(undefined);
  const setOptions = useCallback(
    async (newOptions: Parameters<typeof optionsStorage.set>[0]) => {
      await optionsStorage.set(newOptions);

      setStateOptions(await optionsStorage.getAll());
    },
    [],
  );

  useEffect(() => {
    optionsStorage.getAll().then(setStateOptions);
  }, []);

  const result: [typeof options, typeof setOptions] = [options, setOptions];

  return result;
};

export default useOptionsStorage;
